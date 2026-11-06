import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
    ArrowUpRight,
    Flag,
    Megaphone,
    Package,
    ShieldCheck,
    Users,
} from "lucide-react";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { TablePageHeader } from "../../../Shared/DashboardComponent/DataTable";
import {
    ChartTooltip,
    DashboardError,
    DashboardSkeleton,
    EmptyState,
    Panel,
    StatCard,
} from "../../../Shared/DashboardComponent/DashboardUI";
import {
    chartColors,
    formatNumber,
} from "../../../Shared/DashboardComponent/dashboardUtils";

const roleMeta = {
    admin: { label: "Administrators", color: chartColors.forest },
    vendor: { label: "Vendors", color: chartColors.brass },
    user: { label: "Shoppers", color: chartColors.olive },
};

const fallbackColors = [
    chartColors.forestSoft,
    chartColors.tick,
    chartColors.citron,
];

const capitalize = (value) =>
    String(value).charAt(0).toUpperCase() + String(value).slice(1);

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();

    const { data, isPending, isError, error, refetch } = useQuery({
        queryKey: ["adminDashboard"],
        queryFn: async () => {
            const res = await axiosSecure.get("/dashboard/admin/stats");
            return res.data;
        },
    });

    if (isPending) return <DashboardSkeleton />;

    if (isError) {
        return (
            <DashboardError
                description={
                    error?.message ||
                    "We couldn't load the platform statistics."
                }
                onRetry={refetch}
            />
        );
    }

    const pendingAdsCount = Number(data?.pendingAdsCount) || 0;
    const totalProducts = Number(data?.totalProducts) || 0;
    const totalReports = Number(data?.totalReports) || 0;

    const roles = (data?.userRoles ?? [])
        .map((entry, index) => {
            const id = entry?._id ?? "unknown";
            const meta = roleMeta[id];

            return {
                id,
                name: meta?.label ?? capitalize(id),
                count: Number(entry?.count) || 0,
                color:
                    meta?.color ??
                    fallbackColors[index % fallbackColors.length],
            };
        })
        .sort((a, b) => b.count - a.count);

    const totalUsers = roles.reduce((sum, role) => sum + role.count, 0);

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                eyebrow="Control center"
                icon={ShieldCheck}
                title={
                    <>
                        Platform at a{" "}
                        <em className="italic text-primary">glance.</em>
                    </>
                }
                description="Monitor the marketplace, keep an eye on accounts, and stay on top of pending reviews."
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.04] px-3.5 py-2 text-xs font-semibold text-primary/80">
                    <ShieldCheck
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    Admin access
                </span>

                <Link
                    to="/dashboard/all-users"
                    className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-content transition-colors duration-200 hover:bg-forest-soft"
                >
                    <Users
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    Manage users
                    <ArrowUpRight
                        className="size-3.5 opacity-70"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </Link>
            </TablePageHeader>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
                <StatCard
                    icon={Megaphone}
                    label="Pending ads"
                    value={formatNumber(pendingAdsCount)}
                    hint="Waiting for approval"
                    tone="citron"
                    to="/dashboard/all-ads"
                />
                <StatCard
                    icon={Package}
                    label="Total products"
                    value={formatNumber(totalProducts)}
                    hint="Listed on the marketplace"
                    tone="primary"
                    to="/dashboard/all-products"
                />
                <StatCard
                    icon={Flag}
                    label="Total reports"
                    value={formatNumber(totalReports)}
                    hint="Reviews submitted"
                    tone="danger"
                />
                <StatCard
                    icon={Users}
                    label="Total users"
                    value={formatNumber(totalUsers)}
                    hint="Registered accounts"
                    tone="accent"
                    to="/dashboard/all-users"
                />
            </div>

            <Panel
                icon={Users}
                title="User role distribution"
                description="Who makes up the DailyMart community right now."
                action={
                    <Link
                        to="/dashboard/all-users"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                        View users
                        <ArrowUpRight
                            className="size-3.5"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </Link>
                }
            >
                {totalUsers ? (
                    <div className="grid items-center gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                        <div className="relative h-60 w-full md:h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roles}
                                        dataKey="count"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="62%"
                                        outerRadius="92%"
                                        paddingAngle={3}
                                        cornerRadius={6}
                                        stroke={chartColors.cream}
                                        strokeWidth={3}
                                    >
                                        {roles.map((role) => (
                                            <Cell
                                                key={role.id}
                                                fill={role.color}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        content={
                                            <ChartTooltip
                                                valueFormatter={(value) =>
                                                    `${formatNumber(value)} users`
                                                }
                                            />
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
                                <div>
                                    <p className="text-2xl font-semibold tracking-[-0.03em] text-base-content md:text-3xl">
                                        {formatNumber(totalUsers)}
                                    </p>
                                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/60">
                                        Accounts
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {roles.map((role) => {
                                const percent = totalUsers
                                    ? Math.round(
                                          (role.count / totalUsers) * 100,
                                      )
                                    : 0;

                                return (
                                    <div key={role.id}>
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="flex items-center gap-2 text-sm font-medium text-base-content">
                                                <span
                                                    className="size-2.5 shrink-0 rounded-full"
                                                    style={{
                                                        backgroundColor:
                                                            role.color,
                                                    }}
                                                />
                                                {role.name}
                                            </span>

                                            <span className="text-sm font-semibold text-base-content">
                                                {formatNumber(role.count)}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex items-center gap-3">
                                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-base-200">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${percent}%`,
                                                        backgroundColor:
                                                            role.color,
                                                    }}
                                                />
                                            </div>

                                            <span className="w-9 text-right text-xs font-semibold text-ink-soft">
                                                {percent}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <EmptyState
                        icon={Users}
                        title="No accounts yet"
                        description="Registered users will be grouped here by role."
                    />
                )}
            </Panel>

            <Link
                to="/dashboard/all-ads"
                className="flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] border border-citron/60 bg-citron/25 px-5 py-4 transition-colors duration-200 hover:bg-citron/35"
            >
                <div className="flex items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-citron/60 text-forest">
                        <Megaphone
                            className="size-5"
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    </span>

                    <div>
                        <p className="text-sm font-semibold text-forest">
                            {pendingAdsCount > 0
                                ? `${pendingAdsCount} ad${
                                      pendingAdsCount === 1 ? "" : "s"
                                  } awaiting review`
                                : "No ads awaiting review"}
                        </p>
                        <p className="mt-0.5 text-xs text-ink-soft">
                            {pendingAdsCount > 0
                                ? "Approve or reject submissions to keep the marketplace moving."
                                : "Every submitted advertisement has been processed."}
                        </p>
                    </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-forest">
                    Open ads
                    <ArrowUpRight
                        className="size-3.5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </span>
            </Link>
        </div>
    );
};

export default AdminDashboard;
