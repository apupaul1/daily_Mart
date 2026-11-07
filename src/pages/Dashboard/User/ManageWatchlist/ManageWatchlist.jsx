import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { Heart, ShoppingBasket, Trash2 } from "lucide-react";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { Spinner } from "../../../../Shared/Loading/Loading";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  TableAction,
  TableEmpty,
  TableLink,
  TablePageHeader,
  TableShell,
  TableSkeleton,
} from "../../../../Shared/DashboardComponent/DataTable";
import { toast } from "sonner";

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

const ManageWatchlist = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [removingId, setRemovingId] = useState(null);

  const {
    data: watchlists = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-watchlist", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/watchlist?email=${user.email}`);
      return res.data;
    },
  });

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, remove it!",
    });

    if (confirm.isConfirmed) {
      setRemovingId(id);

      try {
        const res = await axiosSecure.delete(`/watchlist/${id}`);

        if (res.data.deletedCount) {
          toast.success("Product has been removed from your watchlist.");
        }

        refetch();
      } catch (error) {
        toast.error(
          "Error!",
          error.message || "Failed to remove the product.",
          "error",
        );
      } finally {
        setRemovingId(null);
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <TablePageHeader
        eyebrow="Shopping"
        icon={Heart}
        title="My watchlist"
        description="Keep an eye on the products you care about and return to them whenever prices change."
      >
        <TableLink to="/allproducts" icon={ShoppingBasket} tone="primary">
          Add more items
        </TableLink>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[11px] font-semibold text-ink-soft">
          <Heart
            className="size-4 text-primary"
            strokeWidth={2}
            aria-hidden="true"
          />
          {isLoading
            ? "Loading watchlist…"
            : `${watchlists.length} item${watchlists.length === 1 ? "" : "s"}`}
        </span>
      </TablePageHeader>

      {isLoading ? (
        <TableSkeleton rows={4} columns={4} />
      ) : watchlists.length === 0 ? (
        <TableEmpty
          icon={Heart}
          title="Your watchlist is empty"
          description="Browse the marketplace and save products you want to track."
          action={
            <TableLink to="/allproducts" icon={ShoppingBasket} tone="primary">
              Browse products
            </TableLink>
          }
        />
      ) : (
        <TableShell>
          <DataTable label="My watchlist" minWidthClass="md:min-w-[44rem]">
            <DataTableHead>
              <DataTableHeader>Product</DataTableHeader>
              <DataTableHeader>Market</DataTableHeader>
              <DataTableHeader>Date added</DataTableHeader>
              <DataTableHeader className="text-right">Actions</DataTableHeader>
            </DataTableHead>

            <DataTableBody>
              {watchlists.map((item) => (
                <DataTableRow key={item._id}>
                  <DataTableCell label="Product" emphasis>
                    {item.productName || "Unnamed product"}
                  </DataTableCell>

                  <DataTableCell label="Market">
                    {item.marketName || "—"}
                  </DataTableCell>

                  <DataTableCell label="Date added">
                    {formatDate(item.date)}
                  </DataTableCell>

                  <DataTableCell label="Actions" align="end">
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <TableLink
                        to="/allproducts"
                        icon={ShoppingBasket}
                        tone="neutral"
                      >
                        Add more
                      </TableLink>

                      <TableAction
                        icon={removingId === item._id ? undefined : Trash2}
                        tone="danger"
                        disabled={removingId === item._id}
                        onClick={() => handleDelete(item._id)}
                      >
                        {removingId === item._id ? (
                          <>
                            <Spinner size="xs" />
                            Removing…
                          </>
                        ) : (
                          "Remove"
                        )}
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

export default ManageWatchlist;
