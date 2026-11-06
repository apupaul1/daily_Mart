import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, ShieldCheck, Store, Users } from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import DashboardAvatar from "../../../Shared/DashboardComponent/DashboardAvatar";
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
import { toast } from "sonner";

const AllUsers = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState("");

    const { data: users = [], isLoading } = useQuery({
        queryKey: ["all-users", search],
        queryFn: async () => {
            const res = await axiosSecure.get(`/users?search=${search}`);
            return res.data;
        },
    });

    const mutation = useMutation({
        mutationFn: async ({ id, role }) => {
            return await axiosSecure.patch(`/users/${id}`, { role });
        },
        onSuccess: () => {
            toast.success("User role updated!");
            queryClient.invalidateQueries({ queryKey: ["all-users"] });
        },
        onError: () => {
            toast.error("Failed to update role.");
        },
    });

    const handleRoleChange = (id, newRole) => {
        mutation.mutate({ id, role: newRole });
    };

    const isRowUpdating = (id) =>
        mutation.isPending && mutation.variables?.id === id;

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                eyebrow="Administration"
                icon={Users}
                title="All users"
                description="Review every registered account and promote trusted members to vendors or administrators."
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[11px] font-semibold text-ink-soft">
                    <Users
                        className="size-4 text-primary"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    {users.length} account{users.length === 1 ? "" : "s"}
                </span>
            </TablePageHeader>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <label className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3.5 transition-colors duration-300 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15 md:max-w-md md:flex-1">
                    <Search
                        className="size-4 shrink-0 text-ink-soft/45"
                        strokeWidth={1.9}
                        aria-hidden="true"
                    />
                    <span className="sr-only">Search users</span>
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by name or email…"
                        className="w-full bg-transparent py-2.5 text-sm text-base-content placeholder:text-ink-soft/50 focus:outline-none"
                    />
                </label>

                <p className="text-[12px] text-ink-soft">
                    {isLoading
                        ? "Loading accounts…"
                        : `Showing ${users.length} account${
                              users.length === 1 ? "" : "s"
                          }`}
                </p>
            </div>

            {isLoading ? (
                <TableSkeleton rows={5} columns={4} />
            ) : users.length === 0 ? (
                <TableEmpty
                    icon={Users}
                    title={search ? "No matching accounts" : "No users yet"}
                    description={
                        search
                            ? "Try a different name or email address to find the account you need."
                            : "New accounts will appear here as soon as people register."
                    }
                    action={
                        search ? (
                            <TableAction
                                icon={Search}
                                tone="primary"
                                onClick={() => setSearch("")}
                            >
                                Clear search
                            </TableAction>
                        ) : null
                    }
                />
            ) : (
                <TableShell>
                    <DataTable label="All users" minWidthClass="md:min-w-[44rem]">
                        <DataTableHead>
                            <DataTableHeader>User</DataTableHeader>
                            <DataTableHeader>Email</DataTableHeader>
                            <DataTableHeader>Role</DataTableHeader>
                            <DataTableHeader className="text-right">
                                Actions
                            </DataTableHeader>
                        </DataTableHead>

                        <DataTableBody>
                            {users.map((user) => (
                                <DataTableRow key={user._id}>
                                    <DataTableCell label="User" emphasis>
                                        <span className="flex items-center gap-2.5">
                                            <DashboardAvatar
                                                user={{
                                                    displayName: user.name,
                                                    email: user.email,
                                                    photoURL: user.photoURL,
                                                }}
                                                tone="light"
                                                className="size-8"
                                                textClassName="text-[9.5px]"
                                            />
                                            <span className="min-w-0">
                                                <span className="block truncate">
                                                    {user.name || "Unnamed user"}
                                                </span>
                                                <span className="block truncate text-[11px] font-normal text-ink-soft md:hidden">
                                                    {user.email}
                                                </span>
                                            </span>
                                        </span>
                                    </DataTableCell>

                                    <DataTableCell label="Email">
                                        <span className="break-all">
                                            {user.email || "—"}
                                        </span>
                                    </DataTableCell>

                                    <DataTableCell label="Role">
                                        <StatusPill
                                            status={user.role || "user"}
                                            label={user.role || "user"}
                                        />
                                    </DataTableCell>

                                    <DataTableCell label="Actions" align="end">
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            {user.role !== "admin" && (
                                                <TableAction
                                                    icon={ShieldCheck}
                                                    tone="primary"
                                                    onClick={() =>
                                                        handleRoleChange(
                                                            user._id,
                                                            "admin",
                                                        )
                                                    }
                                                    disabled={isRowUpdating(
                                                        user._id,
                                                    )}
                                                >
                                                    Make admin
                                                </TableAction>
                                            )}

                                            {user.role !== "vendor" && (
                                                <TableAction
                                                    icon={Store}
                                                    tone="warning"
                                                    onClick={() =>
                                                        handleRoleChange(
                                                            user._id,
                                                            "vendor",
                                                        )
                                                    }
                                                    disabled={isRowUpdating(
                                                        user._id,
                                                    )}
                                                >
                                                    Make vendor
                                                </TableAction>
                                            )}
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

export default AllUsers;
