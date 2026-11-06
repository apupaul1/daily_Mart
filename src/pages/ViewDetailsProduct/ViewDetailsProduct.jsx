import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  BadgeCheck,
  Box,
  CalendarDays,
  CircleDollarSign,
  Heart,
  ImageOff,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  Minus,
  PackageX,
  RotateCcw,
  ShieldCheck,
  ShoppingCart,
  Star,
  Store,
  Tag,
  TrendingDown,
  TrendingUp,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import UseUserRole from "../../hooks/UseUserRole";
import DashboardAvatar from "../../Shared/DashboardComponent/DashboardAvatar";
import { StatusPill } from "../../Shared/DashboardComponent/DataTable";
import { toast } from "sonner";

const API_BASE = "https://daily-mart-server.vercel.app";

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

const formatDate = (value) => {
  const date = value instanceof Date ? value : parseDate(value);

  if (!date) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatPrice = (value) => {
  if (value === null || value === undefined || value === "") return "—";

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

const buildSeries = (prices) => {
  const entries = Array.isArray(prices) ? prices : [];
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
      axisLabel: date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }),
      fullDate: formatDate(date),
    });
  });

  return [...byDay.values()].sort((a, b) => a.timestamp - b.timestamp);
};

const ProductImage = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-linear-to-br from-base-200 via-base-100 to-citron/20">
        <div className="text-center">
          <ImageOff
            className="mx-auto size-8 text-primary/30"
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <p className="mt-2 text-[11px] font-semibold text-ink-soft/60">
            Image unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="eager"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
};

const DetailItem = ({ icon, label, value }) => {
  const Icon = icon;

  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-citron/30 text-primary">
        <Icon className="size-3.5" strokeWidth={2} aria-hidden="true" />
      </span>

      <div className="min-w-0">
        <dt className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-ink-soft/50">
          {label}
        </dt>
        <dd className="mt-0.5 break-words text-[12.5px] font-semibold text-base-content">
          {value || "—"}
        </dd>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, title, children }) => {
  const Icon = icon;

  return (
    <div className="rounded-[1.5rem] border border-base-300/70 bg-base-100 p-5 shadow-[0_1px_2px_rgba(18,35,28,0.04)] md:p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-citron/35 text-primary">
          <Icon className="size-4" strokeWidth={2} aria-hidden="true" />
        </span>
        <h2 className=" text-lg font-semibold tracking-[-0.02em] text-base-content md:text-xl">
          {title}
        </h2>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
        {children}
      </p>
    </div>
  );
};

const PriceStat = ({
  label,
  value,
  hint,
  tone = "default",
  className = "",
}) => (
  <div
    className={[
      "rounded-2xl border border-base-300/60 bg-base-200/30 p-3 md:p-4",
      className,
    ].join(" ")}
  >
    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-ink-soft/50 md:text-[9.5px]">
      {label}
    </p>
    <p
      className={[
        "mt-1.5  text-lg font-semibold tracking-[-0.02em] md:text-xl",
        tone === "positive"
          ? "text-primary"
          : tone === "negative"
            ? "text-error"
            : "text-base-content",
      ].join(" ")}
    >
      {value}
    </p>
    <p className="mt-0.5 text-[10px] text-ink-soft">{hint}</p>
  </div>
);

const StarRating = ({ value = 0, size = "size-4" }) => {
  const rounded = Math.round(Number(value) || 0);

  return (
    <span
      role="img"
      aria-label={`${(Number(value) || 0).toFixed(1)} out of 5 stars`}
      className="inline-flex items-center gap-0.5"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={[
            size,
            star <= rounded ? "text-accent" : "text-base-300",
          ].join(" ")}
          fill={star <= rounded ? "currentColor" : "none"}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ))}
    </span>
  );
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
      <p className="mt-1  text-lg font-semibold text-primary">
        {formatPrice(point.price)}
      </p>
      <p className="mt-0.5 text-[10.5px] text-ink-soft">Recorded price</p>
    </div>
  );
};

const ProductSkeleton = () => (
  <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12 lg:py-14">
    <div className="h-8 w-40 animate-pulse rounded-full bg-base-200" />

    <div className="mt-5 overflow-hidden rounded-[1.75rem] border border-base-300/70 bg-base-100 md:mt-6">
      <div className="grid md:grid-cols-2">
        <div className="aspect-[4/3] animate-pulse bg-base-200 md:aspect-auto md:min-h-[28rem]" />

        <div className="space-y-4 p-5 md:p-6 lg:p-8">
          <div className="h-3 w-28 animate-pulse rounded-full bg-base-200" />
          <div className="h-9 w-3/4 animate-pulse rounded-full bg-base-200" />
          <div className="flex gap-2">
            <div className="h-7 w-28 animate-pulse rounded-full bg-base-200" />
            <div className="h-7 w-32 animate-pulse rounded-full bg-base-200" />
          </div>
          <div className="mt-6 h-28 animate-pulse rounded-2xl bg-base-200" />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="h-12 animate-pulse rounded-xl bg-base-200" />
            <div className="h-12 animate-pulse rounded-xl bg-base-200" />
            <div className="h-12 animate-pulse rounded-xl bg-base-200" />
          </div>
          <div className="h-12 animate-pulse rounded-full bg-base-200" />
        </div>
      </div>
    </div>
  </div>
);

const ProductState = ({ icon, title, description, action }) => {
  const Icon = icon;

  return (
    <div className="mx-auto grid min-h-[55vh] max-w-lg place-items-center px-5 py-16 text-center">
      <div>
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-citron/40 text-primary">
          <Icon className="size-7" strokeWidth={1.8} aria-hidden="true" />
        </span>

        <h1 className="mt-5  text-2xl font-semibold tracking-[-0.02em] text-base-content md:text-3xl">
          {title}
        </h1>

        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">
          {description}
        </p>

        {action && <div className="mt-6">{action}</div>}
      </div>
    </div>
  );
};

const ViewDetailsProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { role } = UseUserRole();

  const [selectedDateKey, setSelectedDateKey] = useState("");
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [watchlistPending, setWatchlistPending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const {
    data,
    isLoading,
    isError,
    error: productError,
    refetch: refetchProduct,
  } = useQuery({
    queryKey: ["productDetails", id],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE}/product/${id}`);
      return res.data;
    },
    retry: false,
  });

  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
    refetch: refetchReviews,
  } = useQuery({
    queryKey: ["productReviews", id],
    queryFn: async () => {
      const token = await user.getIdToken();
      const res = await axios.get(`${API_BASE}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(id && user),
    retry: false,
  });

  const product = data?.product;
  const series = useMemo(() => buildSeries(product?.prices), [product?.prices]);

  useEffect(() => {
    setSelectedDateKey("");
    setIsWatchlisted(false);
  }, [id]);

  const firstPoint = series[0] ?? null;
  const latestPoint = series[series.length - 1] ?? null;

  const rawLatestPrice = Number(product?.latestPrice);
  const latestPrice =
    Number.isFinite(rawLatestPrice) && rawLatestPrice > 0
      ? rawLatestPrice
      : (latestPoint?.price ?? null);

  const selectedPoint =
    series.find((point) => point.key === selectedDateKey) ?? null;

  const compareDates = series.slice(0, -1).reverse();

  const overallPercent =
    series.length >= 2 && firstPoint.price > 0
      ? ((latestPoint.price - firstPoint.price) / firstPoint.price) * 100
      : null;

  const overallTrend =
    overallPercent === null
      ? null
      : overallPercent > 0
        ? {
            icon: TrendingUp,
            badge: "border-primary/20 bg-primary/10 text-primary",
          }
        : overallPercent < 0
          ? {
              icon: TrendingDown,
              badge: "border-error/20 bg-error/10 text-error",
            }
          : {
              icon: Minus,
              badge: "border-base-300 bg-base-200 text-ink-soft",
            };

  const OverallTrendIcon = overallTrend?.icon;

  const priceDifference =
    selectedPoint && latestPrice !== null
      ? latestPrice - selectedPoint.price
      : null;

  const differenceStyles =
    priceDifference === null
      ? null
      : priceDifference > 0
        ? {
            icon: TrendingUp,
            tone: "border-error/20 bg-error/5 text-error",
            message: `Price increased by ${formatPrice(priceDifference)} since ${selectedPoint.fullDate}.`,
          }
        : priceDifference < 0
          ? {
              icon: TrendingDown,
              tone: "border-primary/20 bg-primary/5 text-primary",
              message: `Price decreased by ${formatPrice(Math.abs(priceDifference))} since ${selectedPoint.fullDate}.`,
            }
          : {
              icon: Minus,
              tone: "border-base-300 bg-base-200/50 text-ink-soft",
              message: `Price has not changed since ${selectedPoint.fullDate}.`,
            };

  const DifferenceIcon = differenceStyles?.icon;

  const averageRating =
    reviews.length > 0
      ? reviews.reduce(
          (total, review) => total + (Number(review.rating) || 0),
          0,
        ) / reviews.length
      : 0;

  const ratingValue = Number(watch("rating")) || 0;

  const onSubmitReview = async (formData) => {
    const reviewPayload = {
      productId: id,
      userName: user?.displayName || "Anonymous",
      userEmail: user?.email,
      rating: Number(formData.rating),
      comment: formData.comment.trim(),
      date: new Date().toISOString(),
    };

    try {
      const token = await user.getIdToken();
      const res = await axios.post(`${API_BASE}/reviews`, reviewPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.insertedId) {
        toast.success("Review submitted!");
        queryClient.setQueryData(["productReviews", id], (currentReviews) =>
          Array.isArray(currentReviews)
            ? [reviewPayload, ...currentReviews]
            : [reviewPayload],
        );
        reset();
      } else {
        toast.error("Failed to submit review.");
      }
    } catch {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  const handleAddWatchlist = async () => {
    if (!product || watchlistPending || isWatchlisted) return;

    setWatchlistPending(true);

    const watchList = {
      productId: product._id,
      productName: product.itemName,
      marketName: product.marketName,
      vendorName: product.vendorName,
      date: new Date().toISOString(),
      userEmail: user?.email,
      previousPrice: product.prices || [],
    };

    try {
      const res = await axiosSecure.post("/watchlist", watchList);

      if (res.data.insertedId) {
        toast.success("Added to watchlist!");
        setIsWatchlisted(true);
      } else {
        toast.error("Failed to add to watchlist.");
      }
    } catch {
      toast.error("An error occurred while adding to watchlist.");
    } finally {
      setWatchlistPending(false);
    }
  };

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (isError) {
    return (
      <ProductState
        icon={TriangleAlert}
        title="We couldn't load this product"
        description={
          productError?.message || "Please check your connection and try again."
        }
        action={
          <button
            type="button"
            onClick={() => refetchProduct()}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-content transition-colors duration-300 hover:bg-forest-soft"
          >
            <RotateCcw className="size-4" strokeWidth={2} aria-hidden="true" />
            Try again
          </button>
        }
      />
    );
  }

  if (!product) {
    return (
      <ProductState
        icon={PackageX}
        title="Product not found"
        description="This listing may have been removed or is no longer available."
        action={
          <button
            type="button"
            onClick={() => navigate("/allproducts")}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-content transition-colors duration-300 hover:bg-forest-soft"
          >
            <ShoppingCart
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
            Browse products
          </button>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-12 lg:py-14">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-[12px] font-semibold text-ink-soft transition-colors duration-300 hover:text-primary"
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden="true" />
        Back to products
      </button>

      <article className="mt-5 overflow-hidden rounded-[1.75rem] border border-base-300/70 bg-base-100 shadow-card md:mt-6">
        <div className="grid md:grid-cols-2">
          <div className="group aspect-[4/3] overflow-hidden bg-white md:aspect-auto md:h-full md:min-h-[28rem] md:p-20">
            <ProductImage
              src={product.imageUrl}
              alt={product.itemName || "Market product"}
            />
          </div>

          <div className="flex flex-col p-5 md:p-6 lg:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h1 className="mt-3 break-words  text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-base-content md:text-4xl ">
                {product.itemName || "Untitled product"}
              </h1>

              <StatusPill status={product.status || "pending"} />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
                <Store
                  className="size-3.5 text-primary/70"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
                {product.marketName || "Unknown market"}
              </span>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-2.5 py-1 text-[10.5px] font-semibold text-ink-soft">
                <UserRound
                  className="size-3.5 text-primary/70"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
                {product.vendorName || "Verified vendor"}
              </span>
            </div>

            <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/[0.04] p-4 md:p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-primary/60">
                    Latest price
                  </p>
                  <p className="mt-1  text-3xl font-semibold tracking-[-0.03em] text-primary md:text-4xl">
                    {formatPrice(latestPrice)}
                  </p>
                  <p className="mt-1 text-[11px] text-ink-soft">
                    per unit
                    {product.pricePerUnit
                      ? ` · base ${formatPrice(product.pricePerUnit)}`
                      : ""}
                  </p>
                </div>

                {overallTrend && OverallTrendIcon && (
                  <span
                    className={[
                      "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold",
                      overallTrend.badge,
                    ].join(" ")}
                  >
                    <OverallTrendIcon
                      className="size-3.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    {overallPercent > 0 ? "+" : ""}
                    {overallPercent.toFixed(1)}%
                  </span>
                )}
              </div>
            </div>

            <dl className="mt-4 grid gap-2.5 md:grid-cols-2">
              <DetailItem
                icon={Mail}
                label="Vendor email"
                value={
                  product.vendorEmail ? (
                    <a
                      href={`mailto:${product.vendorEmail}`}
                      className="break-all transition-colors duration-300 hover:text-primary hover:underline"
                    >
                      {product.vendorEmail}
                    </a>
                  ) : (
                    "—"
                  )
                }
              />

              <DetailItem
                icon={CalendarDays}
                label="Listed on"
                value={formatDate(product.date)}
              />

              <DetailItem
                icon={Tag}
                label="Price per unit"
                value={product.pricePerUnit}
              />

              <DetailItem
                icon={Box}
                label="Last price update"
                value={
                  latestPoint ? latestPoint.fullDate : formatDate(product.date)
                }
              />
            </dl>

            <div className="mt-5 flex flex-col gap-2 md:mt-auto md:flex-row md:pt-5">
              <button
                type="button"
                onClick={() => navigate(`/dashboard/payment/${product._id}`)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-[13px] font-semibold text-primary-content transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-soft md:flex-1"
              >
                <ShoppingCart
                  className="size-4"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Buy now
              </button>

              {role === "user" && (
                <button
                  type="button"
                  onClick={handleAddWatchlist}
                  disabled={isWatchlisted || watchlistPending}
                  className={[
                    "inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-[13px] font-semibold transition-colors duration-300 disabled:pointer-events-none disabled:opacity-60 md:w-auto",
                    isWatchlisted
                      ? "border-citron/60 bg-citron/30 text-forest"
                      : "border-base-300 bg-base-100 text-ink-soft hover:border-primary/25 hover:text-primary",
                  ].join(" ")}
                >
                  <Heart
                    className="size-4"
                    strokeWidth={2}
                    fill={isWatchlisted ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                  {isWatchlisted
                    ? "In your watchlist"
                    : watchlistPending
                      ? "Adding…"
                      : "Add to watchlist"}
                </button>
              )}
            </div>

            <p className="mt-3 inline-flex items-center gap-1.5 text-[10.5px] text-ink-soft">
              <ShieldCheck
                className="size-3.5 text-primary/60"
                strokeWidth={2}
                aria-hidden="true"
              />
              Secure checkout powered by Stripe
            </p>
          </div>
        </div>
      </article>

      <section className="mt-5 grid gap-4 md:mt-6 md:grid-cols-2 md:gap-5">
        <InfoCard icon={Info} title="Product description">
          {product.itemDescription ||
            "No description has been provided for this item."}
        </InfoCard>

        <InfoCard icon={MapPin} title="About the market">
          {product.marketDescription || "No market description is available."}
        </InfoCard>
      </section>

      <section className="mt-5 overflow-hidden rounded-[1.75rem] border border-base-300/70 bg-base-100 shadow-[0_1px_2px_rgba(18,35,28,0.04)] md:mt-6">
        <div className="border-b border-base-300/60 p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink-soft/50">
                Price intelligence
              </p>
              <h2 className="mt-2  text-xl font-semibold tracking-[-0.02em] text-base-content md:text-2xl">
                Price comparison over time
              </h2>
              <p className="mt-1.5 max-w-lg text-[12.5px] leading-relaxed text-ink-soft">
                Compare the latest price with earlier recorded updates to choose
                the best time to buy.
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-primary/15 bg-primary/[0.04] px-3 py-1.5 text-[11px] font-semibold text-primary">
              <CircleDollarSign
                className="size-3.5"
                strokeWidth={2}
                aria-hidden="true"
              />
              {formatPrice(latestPrice)} latest
            </span>
          </div>
        </div>

        <div className="p-5 md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="grid flex-1 grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
              <PriceStat
                label="Latest"
                value={formatPrice(latestPrice)}
                hint={latestPoint ? latestPoint.fullDate : "No readings"}
                tone="positive"
              />

              <PriceStat
                label="Selected"
                value={selectedPoint ? formatPrice(selectedPoint.price) : "—"}
                hint={selectedPoint ? selectedPoint.fullDate : "Choose a date"}
              />

              <PriceStat
                label="Difference"
                value={
                  priceDifference === null
                    ? "—"
                    : formatSignedPrice(priceDifference)
                }
                hint={
                  selectedPoint ? "Since selected date" : "Needs a selection"
                }
                tone={
                  priceDifference === null || priceDifference === 0
                    ? "default"
                    : priceDifference > 0
                      ? "negative"
                      : "positive"
                }
                className="col-span-2 md:col-span-1"
              />
            </div>

            <div className="md:w-56">
              <label
                htmlFor="compare-date"
                className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft/55"
              >
                Compare with
              </label>

              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 transition-colors duration-300 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15">
                <CalendarDays
                  className="size-4 shrink-0 text-ink-soft/45"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
                <select
                  id="compare-date"
                  value={selectedDateKey}
                  onChange={(event) => setSelectedDateKey(event.target.value)}
                  disabled={compareDates.length === 0}
                  className="w-full cursor-pointer bg-transparent py-2.5 text-[12.5px] text-base-content focus:outline-none disabled:cursor-not-allowed disabled:text-ink-soft/50"
                >
                  <option value="">
                    {compareDates.length === 0
                      ? "No earlier dates"
                      : "Choose a date"}
                  </option>
                  {compareDates.map((point) => (
                    <option key={point.key} value={point.key}>
                      {point.fullDate}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink-soft/50">
                Price history
              </p>
              <p className="mt-1 text-[12px] text-ink-soft">
                {series.length >= 2
                  ? `${firstPoint.fullDate} – ${latestPoint.fullDate}`
                  : "Not enough recorded prices"}
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-ink-soft">
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-primary"
              />
              Price per unit
            </span>
          </div>

          <div
            role="group"
            aria-label={`Price comparison chart for ${product.itemName || "selected product"}`}
            className="mt-4 h-64 w-full md:h-72 lg:h-80"
          >
            {series.length >= 2 ? (
              <ResponsiveContainer width="100%" height="100%">
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
                      id="productPriceFill"
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
                      `৳${Number(value).toLocaleString("en-US", {
                        maximumFractionDigits: 0,
                      })}`
                    }
                    width={52}
                    domain={[
                      (dataMin) => Math.max(0, Math.floor(dataMin * 0.92)),
                      (dataMax) => Math.ceil(dataMax * 1.08),
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
                    fill="url(#productPriceFill)"
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

                  {selectedPoint && (
                    <ReferenceLine
                      x={selectedPoint.axisLabel}
                      stroke="#b8863b"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="grid h-full place-items-center rounded-2xl border border-dashed border-base-300 bg-base-200/30 px-5 text-center">
                <div>
                  <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-citron/35 text-primary">
                    <CircleDollarSign
                      className="size-5"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>
                  <p className="mt-3  text-lg font-semibold text-base-content">
                    Not enough price data
                  </p>
                  <p className="mx-auto mt-1.5 max-w-xs text-[12px] leading-relaxed text-ink-soft">
                    At least two recorded prices are needed to draw a
                    comparison.
                  </p>
                </div>
              </div>
            )}
          </div>

          {differenceStyles && DifferenceIcon ? (
            <div
              className={[
                "mt-4 flex items-start gap-2 rounded-xl border px-3.5 py-2.5",
                differenceStyles.tone,
              ].join(" ")}
            >
              <DifferenceIcon
                className="mt-0.5 size-4 shrink-0"
                strokeWidth={2}
                aria-hidden="true"
              />
              <p className="text-[12px] font-semibold leading-relaxed">
                {differenceStyles.message}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-[12px] leading-relaxed text-ink-soft">
              Choose a previous date above to compare it with the latest
              recorded price.
            </p>
          )}
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:mt-6 md:gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:items-start">
        <form
          onSubmit={handleSubmit(onSubmitReview)}
          className="rounded-[1.75rem] border border-base-300/70 bg-base-100 p-5 shadow-[0_1px_2px_rgba(18,35,28,0.04)] md:p-6 lg:sticky lg:top-24 lg:self-start"
        >
          <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink-soft/50">
            Share your experience
          </p>
          <h2 className="mt-2  text-xl font-semibold tracking-[-0.02em] text-base-content md:text-2xl">
            Write a review
          </h2>

          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-base-200/50 p-3">
            <DashboardAvatar
              user={user}
              tone="light"
              className="size-9"
              textClassName="text-[10px]"
            />
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-base-content">
                {user?.displayName ||
                  user?.email?.split("@")[0] ||
                  "DailyMart shopper"}
              </p>
              <p className="truncate text-[10.5px] text-ink-soft">
                Signed in and ready to review
              </p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft/55">
              Your rating
            </p>

            <div
              role="radiogroup"
              aria-label="Your rating"
              className="mt-1.5 flex items-center gap-1"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={ratingValue === star}
                  aria-label={`${star} star${star === 1 ? "" : "s"}`}
                  onClick={() =>
                    setValue("rating", star, {
                      shouldValidate: true,
                    })
                  }
                  className="rounded-full p-0.5 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <Star
                    className={[
                      "size-6",
                      star <= ratingValue ? "text-accent" : "text-base-300",
                    ].join(" ")}
                    fill={star <= ratingValue ? "currentColor" : "none"}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>

            <input
              type="hidden"
              {...register("rating", {
                required: "Please select a rating.",
                min: {
                  value: 1,
                  message: "Please select a rating.",
                },
                max: {
                  value: 5,
                  message: "Rating must be 1–5 stars.",
                },
              })}
            />

            {errors.rating && (
              <p className="mt-1.5 text-[11px] font-semibold text-error">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label
              htmlFor="review-comment"
              className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft/55"
            >
              Your comment
            </label>
            <textarea
              id="review-comment"
              {...register("comment", {
                required: "Please write a short comment.",
                validate: (value) =>
                  value.trim().length > 0 || "Please write a short comment.",
              })}
              rows={4}
              placeholder="Share what you think about the price, quality, and vendor…"
              className="mt-1.5 w-full resize-y rounded-xl border border-base-300 bg-base-100 px-3.5 py-3 text-sm text-base-content placeholder:text-ink-soft/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
            {errors.comment && (
              <p className="mt-1.5 text-[11px] font-semibold text-error">
                {errors.comment.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-content transition-colors duration-300 hover:bg-forest-soft disabled:pointer-events-none disabled:opacity-50"
          >
            <MessageSquare
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
            {isSubmitting ? "Submitting…" : "Submit review"}
          </button>
        </form>

        <div className="rounded-[1.75rem] border border-base-300/70 bg-base-100 p-5 shadow-[0_1px_2px_rgba(18,35,28,0.04)] md:p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink-soft/50">
                Community feedback
              </p>
              <h2 className="mt-2  text-xl font-semibold tracking-[-0.02em] text-base-content md:text-2xl">
                Reviews &amp; comments
              </h2>
            </div>

            <div className="inline-flex items-center gap-3 self-start rounded-2xl border border-base-300/70 bg-base-200/30 px-3.5 py-2 md:self-auto">
              <span className=" text-2xl font-semibold tracking-[-0.02em] text-accent">
                {reviews.length > 0 ? averageRating.toFixed(1) : "—"}
              </span>
              <div>
                <StarRating value={averageRating} />
                <p className="mt-0.5 text-[10px] font-semibold text-ink-soft">
                  {reviews.length} review
                  {reviews.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {reviewsLoading ? (
              Array.from({ length: 2 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-base-300/60 bg-base-200/20 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="size-9 animate-pulse rounded-full bg-base-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 animate-pulse rounded-full bg-base-200" />
                      <div className="h-2.5 w-24 animate-pulse rounded-full bg-base-200" />
                    </div>
                  </div>
                  <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-base-200" />
                  <div className="mt-2 h-3 w-2/3 animate-pulse rounded-full bg-base-200" />
                </div>
              ))
            ) : reviewsError && reviews.length === 0 ? (
              <div className="grid place-items-center rounded-2xl border border-dashed border-base-300 bg-base-200/30 px-5 py-10 text-center">
                <div>
                  <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-citron/35 text-primary">
                    <TriangleAlert
                      className="size-5"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>
                  <p className="mt-3  text-lg font-semibold text-base-content">
                    Reviews couldn&apos;t be loaded
                  </p>
                  <p className="mx-auto mt-1.5 max-w-xs text-[12px] leading-relaxed text-ink-soft">
                    You can still submit a review using the form.
                  </p>
                  <button
                    type="button"
                    onClick={() => refetchReviews()}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.04] px-4 py-2 text-[12px] font-semibold text-primary transition-colors duration-300 hover:bg-primary/10"
                  >
                    <RotateCcw
                      className="size-3.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    Try again
                  </button>
                </div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="grid place-items-center rounded-2xl border border-dashed border-base-300 bg-base-200/30 px-5 py-10 text-center">
                <div>
                  <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-citron/35 text-primary">
                    <MessageSquare
                      className="size-5"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </span>
                  <p className="mt-3  text-lg font-semibold text-base-content">
                    No reviews yet
                  </p>
                  <p className="mx-auto mt-1.5 max-w-xs text-[12px] leading-relaxed text-ink-soft">
                    Be the first shopper to share an experience with this
                    product.
                  </p>
                </div>
              </div>
            ) : (
              reviews.map((review, index) => (
                <article
                  key={
                    review._id || `${review.userEmail}-${review.date}-${index}`
                  }
                  className="rounded-2xl border border-base-300/60 bg-base-200/20 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <DashboardAvatar
                        user={{
                          displayName: review.userName,
                          email: review.userEmail,
                        }}
                        tone="light"
                        className="size-9"
                        textClassName="text-[10px]"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[12.5px] font-semibold text-base-content">
                          {review.userName || "Anonymous shopper"}
                        </p>
                        <p className="truncate text-[10.5px] text-ink-soft">
                          {review.userEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <StarRating value={review.rating} size="size-3.5" />
                      <span className="text-[10.5px] text-ink-soft/70">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 whitespace-pre-line text-[12.5px] leading-relaxed text-ink-soft">
                    {review.comment}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewDetailsProduct;
