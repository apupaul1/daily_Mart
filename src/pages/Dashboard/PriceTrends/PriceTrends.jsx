import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    CalendarDays,
    CircleDollarSign,
    Heart,
    Minus,
    RotateCcw,
    ShoppingBasket,
    Store,
    TrendingDown,
    TrendingUp,
    TriangleAlert,
    UserRound,
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
    TableAction,
    TableEmpty,
    TableLink,
    TablePageHeader,
} from "../../../Shared/DashboardComponent/DataTable";

const DAY_MS = 24 * 60 * 60 * 1000;

const RANGE_OPTIONS = [
    { id: "7d", label: "7D", days: 7, description: "Last 7 days" },
    { id: "30d", label: "30D", days: 30, description: "Last 30 days" },
    { id: "all", label: "All", days: null, description: "All recorded prices" },
];

const parseDate = (value) => {
    if (!value) return null;

    if (typeof value === "string") {
        const dateOnly = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

        if (dateOnly) {
            const [, year, month, day] = dateOnly;
            return new Date(Number(year), Number(month) - 1, Number(day));
        }
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? null : date;
};

const formatPrice = (value) => {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) return "—";

    return `৳${numeric.toLocaleString("en-US", {
        maximumFractionDigits: 2,
    })}`;
};

const formatSignedPrice = (value) => {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) return "—";

    const sign = numeric > 0 ? "+" : numeric < 0 ? "−" : "";

    return `${sign}৳${Math.abs(numeric).toLocaleString("en-US", {
        maximumFractionDigits: 2,
    })}`;
};

const formatDateShort = (value) => {
    const date = value instanceof Date ? value : parseDate(value);

    if (!date) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
    });
};

const formatDateFull = (value) => {
    const date = value instanceof Date ? value : parseDate(value);

    if (!date) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const buildSeries = (item) => {
    const entries = Array.isArray(item?.previousPrice)
        ? item.previousPrice
        : [];
    const byDay = new Map();

    entries.forEach((entry) => {
        const date = parseDate(entry?.date);
        const price = Number(entry?.price);

        if (!date || !Number.isFinite(price)) return;

        const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

        byDay.set(key, {
            key,
            timestamp: date.getTime(),
            price,
            axisLabel: formatDateShort(date),
            fullDate: formatDateFull(date),
        });
    });

    return [...byDay.values()].sort((a, b) => a.timestamp - b.timestamp);
};

const PriceTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const point = payload[0]?.payload;

    if (!point) return null;

    return (
        <div className="rounded-xl border border-base-300/80 bg-base-100/95 px-3.5 py-2.5 shadow-card backdrop-blur">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft/50">
                {point.fullDate}
            </p>
            <p className="mt-1 text-lg font-semibold text-primary">
                {formatPrice(point.price)}
            </p>
            <p className="mt-0.5 text-[10.5px] text-ink-soft">
                Recorded price
            </p>
        </div>
    );
};

const StatTile = ({ icon, label, value, hint, tone = "default" }) => {
    const Icon = icon;

    return (
        <div className="rounded-2xl border border-base-300/60 bg-base-200/30 p-3.5 md:p-4">
            <span className="inline-flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft/50">
                <Icon
                    className="size-3.5"
                    strokeWidth={2}
                    aria-hidden="true"
                />
                {label}
            </span>

            <p
                className={[
                    "mt-2 text-xl font-semibold tracking-[-0.02em] md:text-2xl",
                    tone === "positive"
                        ? "text-primary"
                        : tone === "negative"
                          ? "text-error"
                          : "text-base-content",
                ].join(" ")}
            >
                {value}
            </p>

            <p className="mt-0.5 text-[10.5px] text-ink-soft">{hint}</p>
        </div>
    );
};

const PriceTrends = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const [selectedId, setSelectedId] = useState(null);
    const [activeRangeId, setActiveRangeId] = useState("all");

    const {
        data: watchlist = [],
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["my-watchlist", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/watchlist?email=${user.email}`,
            );
            return res.data;
        },
    });

    const activeItem =
        watchlist.find((item) => item._id === selectedId) ??
        watchlist[0] ??
        null;

    const fullSeries = useMemo(() => buildSeries(activeItem), [activeItem]);

    const rangeOption =
        RANGE_OPTIONS.find((option) => option.id === activeRangeId) ??
        RANGE_OPTIONS[2];

    const series = useMemo(() => {
        if (!rangeOption.days || fullSeries.length === 0) return fullSeries;

        const latestTimestamp = fullSeries[fullSeries.length - 1].timestamp;
        const cutoff = latestTimestamp - rangeOption.days * DAY_MS;

        return fullSeries.filter((point) => point.timestamp >= cutoff);
    }, [fullSeries, rangeOption]);

    const firstPoint = series[0] ?? null;
    const lastPoint = series[series.length - 1] ?? null;
    const currentPrice = lastPoint?.price ?? null;

    const change =
        series.length >= 2 && firstPoint && lastPoint
            ? lastPoint.price - firstPoint.price
            : null;

    const percent =
        change !== null && firstPoint.price !== 0
            ? (change / firstPoint.price) * 100
            : null;

    const { high, low } = series.reduce(
        (result, point) => ({
            high:
                result.high === null
                    ? point.price
                    : Math.max(result.high, point.price),
            low:
                result.low === null
                    ? point.price
                    : Math.min(result.low, point.price),
        }),
        { high: null, low: null },
    );

    const trendStyles =
        percent === null
            ? {
                  icon: Activity,
                  badge: "border-base-300 bg-base-200 text-ink-soft",
                  value: "text-ink-soft",
                  direction: "No trend yet",
              }
            : percent > 0
              ? {
                    icon: TrendingUp,
                    badge: "border-primary/20 bg-primary/10 text-primary",
                    value: "text-primary",
                    direction: "Trending up",
                }
              : percent < 0
                ? {
                      icon: TrendingDown,
                      badge: "border-error/20 bg-error/10 text-error",
                      value: "text-error",
                      direction: "Trending down",
                  }
                : {
                      icon: Minus,
                      badge: "border-base-300 bg-base-200 text-ink-soft",
                      value: "text-ink-soft",
                      direction: "Holding steady",
                  };

    const TrendIcon = trendStyles.icon;
    const addedDate = parseDate(activeItem?.date);
    const hasChart = series.length >= 2;

    const rangeLabel =
        series.length === 0
            ? "No recorded prices"
            : series.length === 1
              ? `One reading · ${firstPoint.fullDate}`
              : `${firstPoint.axisLabel} – ${lastPoint.axisLabel}`;

    const summary = (() => {
        if (series.length === 0) {
            return "No price history has been recorded for this item yet.";
        }

        if (series.length === 1) {
            return "Only one price reading is available for this period. Add more price updates to reveal a trend.";
        }

        const direction =
            percent > 0 ? "rose" : percent < 0 ? "fell" : "held steady";
        const movement =
            percent === null || percent === 0
                ? ""
                : ` by ${Math.abs(percent).toFixed(1)}%`;

        return `Prices ${direction}${movement} across ${series.length} recorded prices between ${firstPoint.fullDate} and ${lastPoint.fullDate}.`;
    })();

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                eyebrow="Insights"
                icon={TrendingUp}
                title={
                    <>
                        Price <em className="italic text-primary">trends.</em>
                    </>
                }
                description="Follow the price movement of every product you track and spot the best time to buy."
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[11px] font-semibold text-ink-soft">
                    <Heart
                        className="size-4 text-primary"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    {isLoading
                        ? "Loading watchlist…"
                        : `${watchlist.length} tracked item${watchlist.length === 1 ? "" : "s"}`}
                </span>
            </TablePageHeader>

            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-[17rem_minmax(0,1fr)] md:gap-5 lg:grid-cols-[19rem_minmax(0,1fr)]">
                    <div className="h-24 animate-pulse rounded-[1.5rem] bg-base-200 md:h-80" />

                    <div className="rounded-[1.5rem] border border-base-300/70 bg-base-100 p-5 md:p-6">
                        <div className="h-2.5 w-24 animate-pulse rounded-full bg-base-200" />
                        <div className="mt-3 h-7 w-2/3 animate-pulse rounded-full bg-base-200" />
                        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-20 animate-pulse rounded-2xl bg-base-200"
                                />
                            ))}
                        </div>
                        <div className="mt-6 h-56 animate-pulse rounded-2xl bg-base-200 md:h-72" />
                    </div>
                </div>
            ) : isError ? (
                <TableEmpty
                    icon={TriangleAlert}
                    title="We couldn't load your watchlist"
                    description={
                        error?.message ||
                        "Please check your connection and try again."
                    }
                    action={
                        <TableAction
                            icon={RotateCcw}
                            tone="primary"
                            onClick={() => refetch()}
                        >
                            Try again
                        </TableAction>
                    }
                />
            ) : watchlist.length === 0 ? (
                <TableEmpty
                    icon={Heart}
                    title="No tracked items yet"
                    description="Add products to your watchlist to unlock price history, trends, and buying insights."
                    action={
                        <TableLink
                            to="/allproducts"
                            icon={ShoppingBasket}
                            tone="primary"
                        >
                            Browse products
                        </TableLink>
                    }
                />
            ) : (
                <div className="grid gap-4 md:grid-cols-[17rem_minmax(0,1fr)] md:gap-5 lg:grid-cols-[19rem_minmax(0,1fr)]">
                    <section
                        aria-label="Tracked items"
                        className="rounded-[1.5rem] border border-base-300/70 bg-base-100 p-4 shadow-[0_1px_2px_rgba(18,35,28,0.04)] md:self-start lg:sticky lg:top-24"
                    >
                        <div className="flex items-center justify-between gap-3 px-1">
                            <div>
                                <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink-soft/50">
                                    Tracked items
                                </p>
                                <p className="mt-1 text-[13px] font-semibold text-base-content">
                                    {watchlist.length} product
                                    {watchlist.length === 1 ? "" : "s"}
                                </p>
                            </div>

                            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-citron/35 text-primary">
                                <Heart
                                    className="size-4"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </span>
                        </div>

                        <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1 [scrollbar-width:thin] md:max-h-[calc(100dvh_-_13rem)] md:flex-col md:overflow-y-auto md:pb-0">
                            {watchlist.map((item) => {
                                const itemSeries = buildSeries(item);
                                const itemPrice = itemSeries.length
                                    ? itemSeries[itemSeries.length - 1].price
                                    : null;
                                const isActive =
                                    activeItem?._id === item._id;

                                return (
                                    <button
                                        key={item._id}
                                        type="button"
                                        onClick={() => setSelectedId(item._id)}
                                        aria-pressed={isActive}
                                        className={[
                                            "group flex min-w-[13.5rem] shrink-0 snap-start items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors duration-200 md:w-full md:min-w-0",
                                            isActive
                                                ? "border-primary/30 bg-primary/[0.06]"
                                                : "border-base-300/70 bg-base-100 hover:border-primary/25 hover:bg-base-200/40",
                                        ].join(" ")}
                                    >
                                        <span
                                            className={[
                                                "grid size-9 shrink-0 place-items-center rounded-xl transition-colors duration-200",
                                                isActive
                                                    ? "bg-primary text-primary-content"
                                                    : "bg-citron/35 text-primary",
                                            ].join(" ")}
                                        >
                                            <ShoppingBasket
                                                className="size-4"
                                                strokeWidth={1.9}
                                                aria-hidden="true"
                                            />
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block truncate text-[12.5px] font-semibold text-base-content">
                                                {item.productName ||
                                                    "Untitled product"}
                                            </span>
                                            <span className="mt-0.5 block truncate text-[10.5px] text-ink-soft">
                                                {item.marketName ||
                                                    "Unknown market"}
                                            </span>
                                        </span>

                                        <span className="shrink-0 text-right">
                                            <span className="block text-[13px] font-semibold text-primary">
                                                {itemPrice === null
                                                    ? "—"
                                                    : formatPrice(itemPrice)}
                                            </span>
                                            <span className="block text-[9px] font-semibold uppercase tracking-[0.1em] text-ink-soft/45">
                                                {itemSeries.length} read
                                                {itemSeries.length === 1
                                                    ? ""
                                                    : "s"}
                                            </span>
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100 shadow-[0_1px_2px_rgba(18,35,28,0.04)]">
                        <div className="border-b border-base-300/60 p-5 md:p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                <div className="min-w-0">
                                    <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink-soft/50">
                                        Selected item
                                    </p>

                                    <h3 className="mt-2 break-words text-2xl font-semibold leading-tight tracking-[-0.02em] text-base-content md:text-3xl">
                                        {activeItem.productName ||
                                            "Untitled product"}
                                    </h3>

                                    <div className="mt-2.5 flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
                                            <Store
                                                className="size-3.5 text-primary/70"
                                                strokeWidth={1.9}
                                                aria-hidden="true"
                                            />
                                            {activeItem.marketName ||
                                                "Unknown market"}
                                        </span>

                                        {activeItem.vendorName && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
                                                <UserRound
                                                    className="size-3.5 text-primary/70"
                                                    strokeWidth={1.9}
                                                    aria-hidden="true"
                                                />
                                                {activeItem.vendorName}
                                            </span>
                                        )}

                                        {addedDate && (
                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
                                                <CalendarDays
                                                    className="size-3.5 text-primary/70"
                                                    strokeWidth={1.9}
                                                    aria-hidden="true"
                                                />
                                                Tracked{" "}
                                                {formatDateFull(addedDate)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <span
                                    className={[
                                        "inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border px-3 py-1.5 text-[11px] font-bold",
                                        trendStyles.badge,
                                    ].join(" ")}
                                >
                                    <TrendIcon
                                        className="size-3.5"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                    {percent === null
                                        ? trendStyles.direction
                                        : `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 md:p-6">
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                                <StatTile
                                    icon={CircleDollarSign}
                                    label="Current price"
                                    value={
                                        currentPrice === null
                                            ? "—"
                                            : formatPrice(currentPrice)
                                    }
                                    hint={
                                        lastPoint
                                            ? `Latest · ${lastPoint.axisLabel}`
                                            : "No readings"
                                    }
                                />

                                <StatTile
                                    icon={TrendIcon}
                                    label="Period change"
                                    value={
                                        percent === null
                                            ? "—"
                                            : `${percent > 0 ? "+" : ""}${percent.toFixed(1)}%`
                                    }
                                    hint={
                                        change === null
                                            ? "Needs 2+ readings"
                                            : formatSignedPrice(change)
                                    }
                                    tone={
                                        percent > 0
                                            ? "positive"
                                            : percent < 0
                                              ? "negative"
                                              : "default"
                                    }
                                />

                                <StatTile
                                    icon={ArrowUpRight}
                                    label="Range high"
                                    value={
                                        high === null ? "—" : formatPrice(high)
                                    }
                                    hint="Highest reading"
                                />

                                <StatTile
                                    icon={ArrowDownRight}
                                    label="Range low"
                                    value={
                                        low === null ? "—" : formatPrice(low)
                                    }
                                    hint="Lowest reading"
                                />
                            </div>

                            <div className="mt-5 md:mt-6">
                                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                                    <div>
                                        <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink-soft/50">
                                            Price history
                                        </p>
                                        <p className="mt-1 text-[12px] text-ink-soft">
                                            {rangeLabel}
                                        </p>
                                    </div>

                                    <div
                                        role="group"
                                        aria-label="Price history range"
                                        className="inline-flex self-start rounded-full border border-base-300 bg-base-200/50 p-1 md:self-auto"
                                    >
                                        {RANGE_OPTIONS.map((option) => {
                                            const isSelected =
                                                activeRangeId === option.id;

                                            return (
                                                <button
                                                    key={option.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setActiveRangeId(
                                                            option.id,
                                                        )
                                                    }
                                                    aria-label={
                                                        option.description
                                                    }
                                                    aria-pressed={isSelected}
                                                    className={[
                                                        "rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors duration-200",
                                                        isSelected
                                                            ? "bg-primary text-primary-content"
                                                            : "text-ink-soft hover:text-primary",
                                                    ].join(" ")}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div
                                    role="group"
                                    aria-label={`Price trend chart for ${activeItem.productName || "selected product"}`}
                                    className="mt-4 h-60 w-full md:h-72 lg:h-80"
                                >
                                    {hasChart ? (
                                        <ResponsiveContainer
                                            width="100%"
                                            height="100%"
                                        >
                                            <AreaChart
                                                data={series}
                                                margin={{
                                                    top: 10,
                                                    right: 12,
                                                    left: 0,
                                                    bottom: 0,
                                                }}
                                                accessibilityLayer
                                            >
                                                <defs>
                                                    <linearGradient
                                                        id="priceTrendFill"
                                                        x1="0"
                                                        y1="0"
                                                        x2="0"
                                                        y2="1"
                                                    >
                                                        <stop
                                                            offset="0%"
                                                            stopColor="#0b3d2e"
                                                            stopOpacity={0.18}
                                                        />
                                                        <stop
                                                            offset="100%"
                                                            stopColor="#d9e45f"
                                                            stopOpacity={0.04}
                                                        />
                                                    </linearGradient>
                                                </defs>

                                                <CartesianGrid
                                                    stroke="#e6e3d6"
                                                    strokeDasharray="4 6"
                                                    vertical={false}
                                                />

                                                <XAxis
                                                    dataKey="axisLabel"
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{
                                                        fill: "#55655e",
                                                        fontSize: 11,
                                                    }}
                                                    minTickGap={24}
                                                    interval="preserveStartEnd"
                                                    dy={10}
                                                />

                                                <YAxis
                                                    tickLine={false}
                                                    axisLine={false}
                                                    tick={{
                                                        fill: "#55655e",
                                                        fontSize: 11,
                                                    }}
                                                    tickFormatter={(value) =>
                                                        `৳${Number(
                                                            value,
                                                        ).toLocaleString(
                                                            "en-US",
                                                            {
                                                                maximumFractionDigits: 0,
                                                            },
                                                        )}`
                                                    }
                                                    width={52}
                                                    domain={[
                                                        (dataMin) =>
                                                            Math.max(
                                                                0,
                                                                Math.floor(
                                                                    dataMin *
                                                                        0.92,
                                                                ),
                                                            ),
                                                        (dataMax) =>
                                                            Math.ceil(
                                                                dataMax * 1.08,
                                                            ),
                                                    ]}
                                                />

                                                <Tooltip
                                                    content={<PriceTooltip />}
                                                    cursor={{
                                                        stroke: "#0b3d2e",
                                                        strokeOpacity: 0.16,
                                                        strokeWidth: 1,
                                                    }}
                                                />

                                                <Area
                                                    type="monotone"
                                                    dataKey="price"
                                                    stroke="#0b3d2e"
                                                    strokeWidth={2.5}
                                                    fill="url(#priceTrendFill)"
                                                    baseValue="dataMin"
                                                    animationDuration={700}
                                                    dot={
                                                        series.length <= 14
                                                            ? {
                                                                  r: 2.5,
                                                                  fill: "#0b3d2e",
                                                                  strokeWidth: 0,
                                                              }
                                                            : false
                                                    }
                                                    activeDot={{
                                                        r: 5,
                                                        fill: "#0b3d2e",
                                                        stroke: "#fbfaf6",
                                                        strokeWidth: 2,
                                                    }}
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="grid h-full place-items-center rounded-2xl border border-dashed border-base-300 bg-base-200/30 px-5 text-center">
                                            <div>
                                                <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-citron/35 text-primary">
                                                    <Activity
                                                        className="size-5"
                                                        strokeWidth={1.9}
                                                        aria-hidden="true"
                                                    />
                                                </span>

                                                <p className="mt-3 text-lg font-semibold text-base-content">
                                                    {fullSeries.length
                                                        ? "Not enough data for this range"
                                                        : "No price history yet"}
                                                </p>

                                                <p className="mx-auto mt-1.5 max-w-xs text-[12px] leading-relaxed text-ink-soft">
                                                    {fullSeries.length
                                                        ? "This item has only one recorded price in the selected range."
                                                        : "Price updates for this item will appear here once a vendor records them."}
                                                </p>

                                                {fullSeries.length >= 2 &&
                                                    activeRangeId !==
                                                        "all" && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setActiveRangeId(
                                                                    "all",
                                                                )
                                                            }
                                                            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.04] px-4 py-2 text-[12px] font-semibold text-primary transition-colors duration-300 hover:bg-primary/10"
                                                        >
                                                            <RotateCcw
                                                                className="size-3.5"
                                                                strokeWidth={2}
                                                                aria-hidden="true"
                                                            />
                                                            Show all history
                                                        </button>
                                                    )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-4 flex items-start gap-2 rounded-xl bg-base-200/50 px-3.5 py-2.5">
                                    <TrendIcon
                                        className={[
                                            "mt-0.5 size-4 shrink-0",
                                            trendStyles.value,
                                        ].join(" ")}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                    <p className="text-[12px] leading-relaxed text-ink-soft">
                                        {summary}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default PriceTrends;
