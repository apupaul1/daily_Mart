import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import {
    Check,
    Megaphone,
    Trash2,
    X,
} from "lucide-react";
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
    TableShell,
    TableSkeleton,
} from "../../../Shared/DashboardComponent/DataTable";

const AllAds = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const { data: ads = [], isLoading, refetch } = useQuery({
        queryKey: ["all-ads"],
        queryFn: async () => {
            const res = await axiosSecure.get("/ads");
            return res.data;
        },
    });

    const updateStatus = useMutation({
        mutationFn: async ({ id, status }) => {
            return await axiosSecure.patch(`/ads/status/${id}`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["all-ads"] });
            toast.success("Ad status updated!");
        },
        onError: () => toast.error("Failed to update ad status"),
    });

    const deleteAd = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This ad will be permanently deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/ads/${id}`);

                if (res.data.deletedCount) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Advertisement has been deleted.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }

                refetch();
            } catch (error) {
                console.error(error);
                Swal.fire(
                    "Error!",
                    error.message || "Failed to delete the advertisement.",
                    "error",
                );
            }
        }
    };

    const isRowUpdating = (id) =>
        updateStatus.isPending && updateStatus.variables?.id === id;

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                eyebrow="Marketing"
                icon={Megaphone}
                title="All advertisements"
                description="Moderate vendor campaigns, approve live promotions, and remove anything that breaks marketplace guidelines."
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[11px] font-semibold text-ink-soft">
                    <Megaphone
                        className="size-4 text-primary"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    {isLoading
                        ? "Loading campaigns…"
                        : `${ads.length} campaign${ads.length === 1 ? "" : "s"}`}
                </span>
            </TablePageHeader>

            {isLoading ? (
                <TableSkeleton rows={5} columns={5} />
            ) : ads.length === 0 ? (
                <TableEmpty
                    icon={Megaphone}
                    title="No advertisements yet"
                    description="Submitted vendor campaigns will appear here for review."
                />
            ) : (
                <TableShell>
                    <DataTable
                        label="All advertisements"
                        minWidthClass="md:min-w-[48rem]"
                    >
                        <DataTableHead>
                            <DataTableHeader>Campaign</DataTableHeader>
                            <DataTableHeader>Advertiser</DataTableHeader>
                            <DataTableHeader>Email</DataTableHeader>
                            <DataTableHeader>Status</DataTableHeader>
                            <DataTableHeader className="text-right">
                                Actions
                            </DataTableHeader>
                        </DataTableHead>

                        <DataTableBody>
                            {ads.map((ad) => (
                                <DataTableRow key={ad._id}>
                                    <DataTableCell label="Campaign" emphasis>
                                        {ad.title || "Untitled campaign"}
                                    </DataTableCell>

                                    <DataTableCell label="Advertiser">
                                        {ad.name || "—"}
                                    </DataTableCell>

                                    <DataTableCell label="Email">
                                        <span className="break-all">
                                            {ad.email || "—"}
                                        </span>
                                    </DataTableCell>

                                    <DataTableCell label="Status">
                                        <StatusPill
                                            status={ad.status || "pending"}
                                        />
                                    </DataTableCell>

                                    <DataTableCell label="Actions" align="end">
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            {ad.status !== "approved" && (
                                                <TableAction
                                                    icon={Check}
                                                    tone="success"
                                                    disabled={isRowUpdating(
                                                        ad._id,
                                                    )}
                                                    onClick={() =>
                                                        updateStatus.mutate({
                                                            id: ad._id,
                                                            status: "approved",
                                                        })
                                                    }
                                                >
                                                    Approve
                                                </TableAction>
                                            )}

                                            {ad.status !== "rejected" && (
                                                <TableAction
                                                    icon={X}
                                                    tone="warning"
                                                    disabled={isRowUpdating(
                                                        ad._id,
                                                    )}
                                                    onClick={() =>
                                                        updateStatus.mutate({
                                                            id: ad._id,
                                                            status: "rejected",
                                                        })
                                                    }
                                                >
                                                    Reject
                                                </TableAction>
                                            )}

                                            <TableAction
                                                icon={Trash2}
                                                tone="danger"
                                                onClick={() => deleteAd(ad._id)}
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

export default AllAds;
