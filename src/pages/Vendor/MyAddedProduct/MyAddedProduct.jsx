import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { PackagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
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
  TableLink,
  TablePageHeader,
  TableShell,
  TableSkeleton,
} from "../../../Shared/DashboardComponent/DataTable";
import { toast } from "sonner";

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "—";

  const numeric = Number(value);

  return Number.isNaN(numeric)
    ? String(value)
    : `৳${numeric.toLocaleString("en-US")}`;
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const MyAddedProduct = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const {
    data: products = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-products", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products?email=${user.email}`);
      return res.data;
    },
  });

  const handleUpdate = (id) => {
    navigate(`/dashboard/update-product/${id}`);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/products/${id}`);

        if (res.data.deletedCount) {
          toast.success("Product has been deleted.");
        }

        refetch();
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to delete the product.");
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <TablePageHeader
        eyebrow="Vendor catalog"
        icon={PackagePlus}
        title="My products"
        description="Manage the produce you have listed, update pricing, and keep every listing current."
      >
        <TableLink to="/dashboard/addproduct" icon={Plus} tone="primary">
          Add product
        </TableLink>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[11px] font-semibold text-ink-soft">
          {isLoading
            ? "Loading products…"
            : `${products.length} product${products.length === 1 ? "" : "s"}`}
        </span>
      </TablePageHeader>

      {isLoading ? (
        <TableSkeleton rows={5} columns={7} />
      ) : products.length === 0 ? (
        <TableEmpty
          icon={PackagePlus}
          title="No products yet"
          description="Add your first listing so shoppers can discover your fresh produce."
          action={
            <TableLink to="/dashboard/addproduct" icon={Plus} tone="primary">
              Add your first product
            </TableLink>
          }
        />
      ) : (
        <TableShell>
          <DataTable label="My products" minWidthClass="md:min-w-[56rem]">
            <DataTableHead>
              <DataTableHeader>#</DataTableHeader>
              <DataTableHeader>Item</DataTableHeader>
              <DataTableHeader>Price / unit</DataTableHeader>
              <DataTableHeader>Market</DataTableHeader>
              <DataTableHeader>Added</DataTableHeader>
              <DataTableHeader>Status</DataTableHeader>
              <DataTableHeader className="text-right">Actions</DataTableHeader>
            </DataTableHead>

            <DataTableBody>
              {products.map((product, index) => (
                <DataTableRow key={product._id}>
                  <DataTableCell label="No.">
                    <span className="font-mono text-[12px] text-ink-soft/60">
                      {index + 1}
                    </span>
                  </DataTableCell>

                  <DataTableCell label="Item" emphasis>
                    {product.itemName || "Unnamed item"}
                  </DataTableCell>

                  <DataTableCell label="Price / unit">
                    <span className="text-[15px] font-semibold text-primary">
                      {formatPrice(product.pricePerUnit)}
                    </span>
                  </DataTableCell>

                  <DataTableCell label="Market">
                    {product.marketName || "—"}
                  </DataTableCell>

                  <DataTableCell label="Added">
                    {formatDate(product.date)}
                  </DataTableCell>

                  <DataTableCell label="Status">
                    <StatusPill
                      status={product.status || "pending"}
                      title={
                        product.status === "rejected" && product.rejectionReason
                          ? product.rejectionReason
                          : undefined
                      }
                    />
                  </DataTableCell>

                  <DataTableCell label="Actions" align="end">
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <TableAction
                        icon={Pencil}
                        tone="warning"
                        onClick={() => handleUpdate(product._id)}
                      >
                        Update
                      </TableAction>

                      <TableAction
                        icon={Trash2}
                        tone="danger"
                        onClick={() => handleDelete(product._id)}
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
    </div>
  );
};

export default MyAddedProduct;
