import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  ArrowUpRight,
  Eye,
  Heart,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  TableLink,
  TablePageHeader,
} from "../../../Shared/DashboardComponent/DataTable";
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
  formatCurrency,
  formatDate,
  formatNumber,
  truncate,
} from "../../../Shared/DashboardComponent/dashboardUtils";

const UserDashboard = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["userDashboard", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/user/${user.email}`);
      return res.data;
    },
  });

  const isLoading = loading || isPending;

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <DashboardError
        description={
          error?.message || "We couldn't load your orders and watchlist."
        }
        onRetry={refetch}
      />
    );
  }

  const recentOrders = data?.recentOrders ?? [];
  const watchlist = data?.watchlist ?? [];

  const firstName = (
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "there"
  ).split(" ")[0];

  const totalSpend = recentOrders.reduce((sum, order) => {
    const amount = Number(
      order.totalAmount ?? Number(order.price) * Number(order.quantity ?? 1),
    );

    return Number.isFinite(amount) ? sum + amount : sum;
  }, 0);

  const averageOrder = recentOrders.length
    ? totalSpend / recentOrders.length
    : 0;

  const chartData = [...recentOrders].reverse().map((order, index) => {
    const amount = Number(
      order.totalAmount ?? Number(order.price) * Number(order.quantity ?? 1),
    );
    const name = order.productName?.trim() || `Order ${index + 1}`;

    return {
      id: index,
      label: truncate(name, 13),
      fullLabel: name,
      amount: Number.isFinite(amount) ? amount : 0,
    };
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <TablePageHeader
        eyebrow="Shopper overview"
        icon={Sparkles}
        title={
          <>
            Welcome back, <em className="italic text-primary">{firstName}.</em>
          </>
        }
        description="A quick view of your latest purchases, saved products, and what they cost."
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-xs font-semibold text-ink-soft">
          <Heart
            className="size-4 text-primary"
            strokeWidth={2}
            aria-hidden="true"
          />
          {watchlist.length} tracked
        </span>

        <Link
          to="/allproducts"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-content transition-colors duration-200 hover:bg-forest-soft"
        >
          <ShoppingBag className="size-4" strokeWidth={2} aria-hidden="true" />
          Browse products
          <ArrowUpRight
            className="size-3.5 opacity-70"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Link>
      </TablePageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        <StatCard
          icon={ReceiptText}
          label="Recent orders"
          value={formatNumber(recentOrders.length)}
          hint="Your latest purchases"
        />
        <StatCard
          icon={Eye}
          label="Watchlist"
          value={formatNumber(watchlist.length)}
          hint="Products you track"
          tone="citron"
          to="/dashboard/watchlist"
        />
        <StatCard
          icon={Wallet}
          label="Recent spend"
          value={formatCurrency(totalSpend)}
          hint="Across shown orders"
          tone="accent"
        />
        <StatCard
          icon={TrendingUp}
          label="Average order"
          value={formatCurrency(averageOrder)}
          hint="Per recent order"
          tone="primary"
        />
      </div>

      <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
        <Panel
          icon={TrendingUp}
          title="Order value trend"
          description="How much each of your latest orders was worth."
          action={
            <span className="rounded-full border border-base-300/70 bg-base-200/40 px-3 py-1.5 text-xs font-semibold text-ink-soft">
              {formatCurrency(totalSpend)} total
            </span>
          }
          className="lg:col-span-2"
        >
          <div className="h-64 w-full md:h-72 lg:h-80">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{
                    top: 8,
                    right: 8,
                    left: 0,
                    bottom: 0,
                  }}
                  accessibilityLayer
                >
                  <defs>
                    <linearGradient
                      id="userOrderFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={chartColors.forest}
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor={chartColors.citron}
                        stopOpacity={0.03}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke={chartColors.grid}
                    strokeDasharray="4 6"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: chartColors.tick,
                      fontSize: 11,
                    }}
                    interval="preserveStartEnd"
                    minTickGap={16}
                    dy={10}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: chartColors.tick,
                      fontSize: 11,
                    }}
                    tickFormatter={(value) => formatCurrency(value)}
                    width={58}
                  />

                  <Tooltip
                    content={
                      <ChartTooltip
                        valueFormatter={formatCurrency}
                        titleFormatter={(point, label) =>
                          point?.fullLabel ?? label
                        }
                      />
                    }
                    cursor={{
                      stroke: chartColors.forest,
                      strokeOpacity: 0.16,
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    name="Order value"
                    stroke={chartColors.forest}
                    strokeWidth={2.5}
                    fill="url(#userOrderFill)"
                    dot={{
                      r: 2.5,
                      fill: chartColors.forest,
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 5,
                      fill: chartColors.forest,
                      stroke: chartColors.cream,
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="No orders yet"
                description="Your order value trend will appear after your first purchase."
              />
            )}
          </div>
        </Panel>

        <Panel
          icon={Eye}
          title="Watchlist"
          description="Prices for the products you're keeping an eye on."
          action={
            <Link
              to="/dashboard/watchlist"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Manage
            </Link>
          }
          bodyClassName="p-4 md:p-5"
        >
          {watchlist.length ? (
            <ul className="space-y-2.5">
              {watchlist.map((item, index) => (
                <li
                  key={`${item.productName}-${index}`}
                  className="flex items-center gap-3 rounded-2xl border border-base-300/60 bg-base-200/20 px-3.5 py-3"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-citron/35 text-primary">
                    <Heart
                      className="size-4"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-base-content">
                      {item.productName || "Untitled product"}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-ink-soft">
                      {item.marketName || "Unknown market"}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-primary">
                    {formatCurrency(item.currentPrice)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              icon={Heart}
              title="Nothing tracked yet"
              description="Save products to compare prices and spot better deals."
              action={
                <TableLink to="/allproducts" tone="primary" icon={ShoppingBag}>
                  Browse products
                </TableLink>
              }
            />
          )}
        </Panel>
      </div>

      <Panel
        icon={ReceiptText}
        title="Recent orders"
        description="Your five most recent completed purchases."
        action={
          <Link
            to="/dashboard/myorder"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            View all
            <ArrowUpRight
              className="size-3.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        }
        bodyClassName="p-4 md:p-5"
      >
        {recentOrders.length ? (
          <ul className="divide-y divide-base-300/60">
            {recentOrders.map((order, index) => (
              <li
                key={`${order.productName}-${index}`}
                className="flex flex-wrap items-center gap-3 py-3 first:pt-0 last:pb-0 md:flex-nowrap"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-citron/30 text-primary">
                  <ShoppingBag
                    className="size-4"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-base-content">
                    {order.productName || "Product"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-ink-soft">
                    {order.marketName || "DailyMart"}
                    {order.paid_at ? ` · ${formatDate(order.paid_at)}` : ""}
                  </p>
                </div>

                <div className="flex items-center gap-6 pl-13 md:pl-0">
                  <div className="text-right">
                    <p className="text-xs text-ink-soft">Qty</p>
                    <p className="text-sm font-semibold text-base-content">
                      {order.quantity ?? 1}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs text-ink-soft">Total</p>
                    <p className="text-sm font-semibold text-primary">
                      {formatCurrency(
                        order.totalAmount ??
                          Number(order.price) * Number(order.quantity ?? 1),
                      )}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            icon={ReceiptText}
            title="No recent orders"
            description="Once you complete a purchase, it will show up here."
            action={
              <TableLink to="/allproducts" tone="primary" icon={ShoppingBag}>
                Start shopping
              </TableLink>
            }
          />
        )}
      </Panel>
    </div>
  );
};

export default UserDashboard;
