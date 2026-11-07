import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { Check, Package, Pencil, Trash2, X } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  StatusPill,
  TableAction,
  TableEmpty,
  TablePageHeader,
  TablePagination,
  TableShell,
  TableSkeleton,
} from "../../../Shared/DashboardComponent/DataTable";
import { toast } from "sonner";

const limit = 10;

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  const numeric = Number(value);

  return Number.isNaN(numeric)
    ? String(value)
    : `৳${numeric.toLocaleString("en-US")}`;
};

const AllProducts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);

  const {
    data = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["all-products", page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/admin/products?page=${page}&limit=${limit}`,
      );
      return res.data;
    },
  });

  const products = data.products || [];
  const total = data.total || 0;
  const totalPages = Math.ceil(total / limit);

  const approveProduct = async (id) => {
    try {
      await axiosSecure.patch(`/products/${id}`, { status: "approved" });
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      toast.success("Approved!", "Product has been approved.", "success");
    } catch {
      toast.error("Error!", "Failed to approve product.", "error");
    }
  };

  const rejectProduct = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Reject Product",
      input: "text",
      inputLabel: "Reason for rejection",
      inputPlaceholder: "Enter rejection reason",
      showCancelButton: true,
    });

    if (reason) {
      try {
        await axiosSecure.patch(`/products/${id}`, {
          status: "rejected",
          rejectionReason: reason,
        });
        queryClient.invalidateQueries({ queryKey: ["all-products"] });
        toast.success("Rejected!", "Product has been rejected.", "error");
      } catch {
        toast.error("Error!", "Failed to reject product.", "error");
      }
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the product!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      await axiosSecure.delete(`/products/${id}`);
      queryClient.invalidateQueries({ queryKey: ["all-products"] });
      toast.success("Deleted!", "Product has been deleted.", "success");
      refetch();
    }
  };

  const handleEdit = (product) => {
    navigate(`/dashboard/update-product/${product._id}`, {
      state: { product },
    });
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <TablePageHeader
        eyebrow="Catalog"
        icon={Package}
        title="All products"
        description="Approve fresh listings, reject unsuitable items, and keep the marketplace catalog accurate."
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[11px] font-semibold text-ink-soft">
          <Package
            className="size-4 text-primary"
            strokeWidth={2}
            aria-hidden="true"
          />
          {isLoading
            ? "Loading catalog…"
            : `${total} product${total === 1 ? "" : "s"}`}
        </span>
      </TablePageHeader>

      {isLoading ? (
        <TableSkeleton rows={6} columns={8} />
      ) : products.length === 0 ? (
        <TableEmpty
          icon={Package}
          title="No products found"
          description="Vendor listings will appear here as soon as they are submitted."
        />
      ) : (
        <TableShell>
          <DataTable label="All products" minWidthClass="md:min-w-[54rem]">
            <DataTableHead>
              <DataTableHeader>#</DataTableHeader>
              <DataTableHeader>Vendor</DataTableHeader>
              <DataTableHeader>Email</DataTableHeader>
              <DataTableHeader>Market</DataTableHeader>
              <DataTableHeader>Price</DataTableHeader>
              <DataTableHeader>Stock</DataTableHeader>
              <DataTableHeader>Status</DataTableHeader>
              <DataTableHeader className="text-right">Actions</DataTableHeader>
            </DataTableHead>

            <DataTableBody>
              {products.map((product, index) => (
                <DataTableRow key={product._id}>
                  <DataTableCell label="No.">
                    <span className="font-mono text-[12px] text-ink-soft/60">
                      {(page - 1) * limit + index + 1}
                    </span>
                  </DataTableCell>

                  <DataTableCell label="Vendor" emphasis>
                    {product.vendorName || "Unnamed vendor"}
                  </DataTableCell>

                  <DataTableCell label="Email">
                    <span className="break-all">
                      {product.vendorEmail || "—"}
                    </span>
                  </DataTableCell>

                  <DataTableCell label="Market">
                    {product.marketName || "—"}
                  </DataTableCell>

                  <DataTableCell label="Price">
                    <span className=" text-[13px] font-semibold text-primary">
                      {formatPrice(product.pricePerUnit)}
                    </span>
                  </DataTableCell>

                  <DataTableCell label="Stock">
                    {product.stock === undefined ||
                    product.stock === null ||
                    product.stock === "" ? (
                      <span className="text-[11px] text-ink-soft/60">—</span>
                    ) : Number(product.stock) <= 0 ? (
                      <span className="inline-flex items-center rounded-full bg-error/10 px-2.5 py-1 text-[11px] font-bold text-error">
                        Out of stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-primary/[0.07] px-2.5 py-1 text-[10px] font-bold text-primary">
                        {product.stock} in stock
                      </span>
                    )}
                  </DataTableCell>

                  <DataTableCell label="Status">
                    <StatusPill status={product.status || "pending"} />
                  </DataTableCell>

                  <DataTableCell label="Actions" align="end">
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      {product.status === "pending" && (
                        <>
                          <TableAction
                            icon={Check}
                            tone="success"
                            onClick={() => approveProduct(product._id)}
                          >
                            Approve
                          </TableAction>

                          <TableAction
                            icon={X}
                            tone="danger"
                            onClick={() => rejectProduct(product._id)}
                          >
                            Reject
                          </TableAction>
                        </>
                      )}

                      <TableAction
                        icon={Pencil}
                        tone="warning"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </TableAction>

                      <TableAction
                        icon={Trash2}
                        tone="neutral"
                        onClick={() => deleteProduct(product._id)}
                      >
                        Delete
                      </TableAction>
                    </div>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        </TableShell>
      )}

      {!isLoading && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
        />
      )}
    </div>
  );
};

export default AllProducts;
