import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  Activity,
  ArrowUpRight,
  Boxes,
  Gauge,
  Package,
  PackageCheck,
  Plus,
  Store,
  TriangleAlert,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAuth from "../../../hooks/useAuth";
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
  formatCurrency,
  formatNumber,
  truncate,
} from "../../../Shared/DashboardComponent/dashboardUtils";

const VendorDashboard = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["vendorDashboard", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/vendor/${user.email}`);
      return res.data;
    },
  });


  const isLoading = loading || isPending;

  if (isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <DashboardError
        description={
          error?.message || "We couldn't load your product and inventory data."
        }
        onRetry={refetch}
      />
    );
  }

  const totalProducts = Number(data?.totalProducts) || 0;
  const outOfStock = Number(data?.outOfStock) || 0;
  const inStock = Math.max(totalProducts - outOfStock, 0);
  const stockHealth = totalProducts
    ? Math.round((inStock / totalProducts) * 100)
    : 0;
  const recentProducts = data?.recentProducts ?? [];

  const firstName = (
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    "there"
  ).split(" ")[0];

  const chartData = recentProducts.map((product, index) => {
    const name = product.productName?.trim() || `Product ${index + 1}`;

    return {
      id: product._id ?? index,
      label: truncate(name, 12),
      fullLabel: name,
      stock: Number(product.stock) || 0,
    };
  });

  return (
    <div className="space-y-6 md:space-y-8">
      <TablePageHeader
        eyebrow="Vendor studio"
        icon={Store}
        title={
          <>
            Welcome back, <em className="italic text-primary">{firstName}.</em>
          </>
        }
        description="Keep an eye on your catalogue, stock levels, and the products you added most recently."
      >
        <Link
          to="/dashboard/my-products"
          className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-xs font-semibold text-ink-soft transition-colors duration-200 hover:border-primary/25 hover:text-primary"
        >
          Manage products
          <ArrowUpRight
            className="size-3.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Link>

        <Link
          to="/dashboard/addproduct"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-content transition-colors duration-200 hover:bg-forest-soft"
        >
          <Plus className="size-4" strokeWidth={2.2} aria-hidden="true" />
          Add product
        </Link>
      </TablePageHeader>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        <StatCard
          icon={Boxes}
          label="Total products"
          value={formatNumber(totalProducts)}
          hint="In your catalogue"
        />
        <StatCard
          icon={TriangleAlert}
          label="Out of stock"
          value={formatNumber(outOfStock)}
          hint={outOfStock ? "Needs restocking" : "Everything is available"}
          tone="danger"
          to="/dashboard/my-products"
        />
        <StatCard
          icon={PackageCheck}
          label="In stock"
          value={formatNumber(inStock)}
          hint="Ready to sell"
          tone="citron"
        />
        <StatCard
          icon={Gauge}
          label="Stock health"
          value={`${stockHealth}%`}
          hint="Products available"
          tone="accent"
        />
      </div>

      <div className="grid gap-4 md:gap-5 lg:grid-cols-3">
        <Panel
          icon={Activity}
          title="Stock snapshot"
          description="Units on hand for your three most recent products."
          action={
            <span className="rounded-full border border-base-300/70 bg-base-200/40 px-3 py-1.5 text-xs font-semibold text-ink-soft">
              {inStock} in stock
            </span>
          }
          className="lg:col-span-2"
        >
          <div className="h-64 w-full md:h-72 lg:h-80">
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 8,
                    right: 8,
                    left: 0,
                    bottom: 0,
                  }}
                  accessibilityLayer
                >
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
                    interval={0}
                    dy={10}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: chartColors.tick,
                      fontSize: 11,
                    }}
                    tickFormatter={(value) => formatNumber(value)}
                    allowDecimals={false}
                    width={32}
                  />

                  <Tooltip
                    content={
                      <ChartTooltip
                        valueFormatter={(value) =>
                          `${formatNumber(value)} units`
                        }
                        titleFormatter={(point, label) =>
                          point?.fullLabel ?? label
                        }
                      />
                    }
                    cursor={{
                      fill: "rgba(11, 61, 46, 0.05)",
                    }}
                  />

                  <Bar
                    dataKey="stock"
                    name="In stock"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={48}
                    minPointSize={2}
                  >
                    {chartData.map((item) => (
                      <Cell
                        key={item.id}
                        fill={
                          item.stock > 0
                            ? chartColors.forest
                            : chartColors.error
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState
                icon={Activity}
                title="No products to chart"
                description="Add a product and its stock level will appear here."
              />
            )}
          </div>
        </Panel>

        <Panel
          icon={Package}
          title="Recent products"
          description="The latest additions to your store."
          action={
            <Link
              to="/dashboard/my-products"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all
            </Link>
          }
          bodyClassName="p-4 md:p-5"
        >
          {recentProducts.length ? (
            <ul className="space-y-2.5">
              {recentProducts.map((product, index) => {
                const stock = Number(product.stock) || 0;

                return (
                  <li
                    key={product._id ?? index}
                    className="flex items-center gap-3 rounded-2xl border border-base-300/60 bg-base-200/20 px-3.5 py-3"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-citron/35 text-primary">
                      <Package
                        className="size-4"
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-base-content">
                        {product.productName || "Untitled product"}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-ink-soft">
                        {product.marketName || "Unassigned market"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-primary">
                        {formatCurrency(product.price)}
                      </p>
                      <p
                        className={[
                          "mt-0.5 text-xs font-semibold",
                          stock > 0 ? "text-ink-soft" : "text-error",
                        ].join(" ")}
                      >
                        {stock > 0
                          ? `${formatNumber(stock)} in stock`
                          : "Out of stock"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <EmptyState
              icon={Package}
              title="No products yet"
              description="Your newest products will appear here once you add them."
            />
          )}
        </Panel>
      </div>
    </div>
  );
};

export default VendorDashboard;
