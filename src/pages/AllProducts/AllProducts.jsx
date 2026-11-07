import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  ArrowUpDown,
  BadgeCheck,
  Boxes,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ImageOff,
  RotateCcw,
  ShoppingBasket,
  SlidersHorizontal,
  Sparkles,
  Store,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxios from "../../hooks/useAxios";
import { ProductGridSkeleton } from "../../Shared/Loading/Skeletons";

const limit = 8;

const formatDate = (value) => {
  if (!value) return "Recently added";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const buildPageItems = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const items = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) items.push("start-ellipsis");
  for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
    items.push(pageNumber);
  }
  if (end < total - 1) items.push("end-ellipsis");
  items.push(total);

  return items;
};

const ProductImage = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-linear-to-br from-base-200 via-base-100 to-citron/20">
        <ImageOff
          className="size-7 text-primary/30"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
    />
  );
};

const AllProducts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxios();

  const [sortOrder, setSortOrder] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [appliedSort, setAppliedSort] = useState("");
  const [appliedStart, setAppliedStart] = useState(null);
  const [appliedEnd, setAppliedEnd] = useState(null);
  const [page, setPage] = useState(1);

  const {
    data: products = {},
    isLoading,
    isError,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allProducts", appliedSort, appliedStart, appliedEnd, page],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-products", {
        params: {
          sort: appliedSort || undefined,
          start: appliedStart ? appliedStart.toISOString() : undefined,
          end: appliedEnd ? appliedEnd.toISOString() : undefined,
          page,
          limit,
        },
      });
      return res.data;
    },
    placeholderData: keepPreviousData,
  });

  const items = Array.isArray(products.data) ? products.data : [];
  const totalPages = Number(products.pages) || 0;
  const hasAppliedFilters = Boolean(appliedSort || appliedStart || appliedEnd);

  // const handleDetails = (id) => {
  //   if (!user?.email) {
  //     navigate("/login");
  //   } else {
  //     navigate(`/details/${id}`);
  //   }
  // };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyFilters = () => {
    setPage(1);
    setAppliedSort(sortOrder);
    setAppliedStart(startDate);
    setAppliedEnd(endDate);
  };

  const resetFilters = () => {
    setSortOrder("");
    setStartDate(null);
    setEndDate(null);
    setPage(1);
    setAppliedSort("");
    setAppliedStart(null);
    setAppliedEnd(null);
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:px-8 md:py-14 lg:py-16">
      {/* Page header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8">
        <div className="max-w-2xl">
          <h1 className="mt-4  text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-base-content md:text-4xl ">
            All market <em className="italic text-primary">products.</em>
          </h1>

          <p className="max-w-lg text-sm leading-relaxed text-ink-soft md:text-[15px]">
            Compare live prices from verified local vendors, filter by date, and
            find the best value for your everyday basket.
          </p>
        </div>
      </header>

      {/* Filters */}
      <section
        aria-label="Filter products"
        className="mt-8 rounded-3xl border border-base-300/70 bg-base-100 p-4 shadow-sm md:mt-10 md:p-5"
      >
        <div className="flex items-center justify-between gap-3">
          {hasAppliedFilters && (
            <span className="rounded-full bg-primary/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
              Active
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-3 lg:grid-cols-4 lg:items-end">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="start-date"
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft/55"
            >
              From
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 transition-colors duration-300 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15">
              <CalendarDays
                className="size-4 shrink-0 text-ink-soft/45"
                strokeWidth={1.9}
                aria-hidden="true"
              />
              <DatePicker
                id="start-date"
                selected={startDate}
                onChange={setStartDate}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                maxDate={endDate || undefined}
                placeholderText="Start date"
                dateFormat="dd MMM yyyy"
                isClearable
                wrapperClassName="block w-full"
                popperClassName="z-[60]"
                className="w-full bg-transparent py-2.5 text-sm text-base-content placeholder:text-ink-soft/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="end-date"
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft/55"
            >
              To
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 transition-colors duration-300 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15">
              <CalendarDays
                className="size-4 shrink-0 text-ink-soft/45"
                strokeWidth={1.9}
                aria-hidden="true"
              />
              <DatePicker
                id="end-date"
                selected={endDate}
                onChange={setEndDate}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || undefined}
                placeholderText="End date"
                dateFormat="dd MMM yyyy"
                isClearable
                wrapperClassName="block w-full"
                popperClassName="z-[60]"
                className="w-full bg-transparent py-2.5 text-sm text-base-content placeholder:text-ink-soft/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sort-order"
              className="text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft/55"
            >
              Sort by price
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3 transition-colors duration-300 focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/15">
              <ArrowUpDown
                className="size-4 shrink-0 text-ink-soft/45"
                strokeWidth={1.9}
                aria-hidden="true"
              />
              <select
                id="sort-order"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
                className="w-full cursor-pointer bg-transparent py-2.5 text-sm text-base-content focus:outline-none"
              >
                <option value="">Any order</option>
                <option value="asc">Low to high</option>
                <option value="desc">High to low</option>
              </select>
              <ChevronDown
                className="size-4 shrink-0 text-ink-soft/45"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </div>
          </div>

          <div className="flex gap-2 md:col-span-3 md:justify-end lg:col-span-1">
            <button
              type="button"
              onClick={applyFilters}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-content transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-soft md:flex-none"
            >
              <SlidersHorizontal
                className="size-4"
                strokeWidth={2}
                aria-hidden="true"
              />
              Apply filters
            </button>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-base-300 bg-base-100 px-4 py-2.5 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:border-primary/25 hover:text-primary"
            >
              <RotateCcw
                className="size-4"
                strokeWidth={2}
                aria-hidden="true"
              />
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Results heading */}
      <div className="mt-8 flex items-end justify-between gap-3 md:mt-10">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-base-content md:text-2xl">
            Market listings
          </h2>
          <p
            aria-live="polite"
            className="mt-1 text-[12px] text-ink-soft md:text-sm"
          >
            {isLoading
              ? "Loading products…"
              : `${items.length} product${
                  items.length === 1 ? "" : "s"
                } on this page`}
          </p>
        </div>

        {isFetching && !isLoading && (
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/[0.06] px-2.5 py-1 text-[10px] font-semibold text-primary">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Updating
          </span>
        )}
      </div>

      {/* Products */}
      {isLoading ? (
        <ProductGridSkeleton
          count={limit}
          className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6"
        />
      ) : isError ? (
        <div className="mt-4 grid place-items-center rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 px-6 py-14 text-center md:mt-5 md:py-20">
          <div>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-citron/40 text-primary">
              <TriangleAlert
                className="size-6"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>
            <p className="mt-4  text-xl font-semibold text-base-content">
              We couldn&apos;t load products
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
              {error?.message || "Please check your connection and try again."}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.04] px-5 py-2.5 text-[13px] font-semibold text-primary transition-colors duration-300 hover:bg-primary/10"
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
      ) : items.length === 0 ? (
        <div className="mt-4 grid place-items-center rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 px-6 py-14 text-center md:mt-5 md:py-20">
          <div>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-citron/40 text-primary">
              <ShoppingBasket
                className="size-6"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>
            <p className="mt-4  text-xl font-semibold text-base-content">
              {hasAppliedFilters
                ? "No products match these filters"
                : "No products available yet"}
            </p>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
              {hasAppliedFilters
                ? "Try widening the date range or clearing the filters to see more listings."
                : "Local vendors are restocking — check back soon for fresh market prices."}
            </p>
            {hasAppliedFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.04] px-5 py-2.5 text-[13px] font-semibold text-primary transition-colors duration-300 hover:bg-primary/10"
              >
                <RotateCcw
                  className="size-3.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Clear filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {items.map((product) => (
            <article
              key={product._id}
              className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card"
            >
              <div className="aspect-[16/10] overflow-hidden bg-base-200">
                <ProductImage
                  src={product.imageUrl}
                  alt={product.itemName || "Market product"}
                />
              </div>

              <div className="flex flex-1 flex-col p-4 md:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex min-w-0 items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-ink-soft/55">
                    <Store
                      className="size-3.5 shrink-0 text-primary/70"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {product.marketName || "Local market"}
                    </span>
                  </span>

                  <span className="shrink-0 rounded-full bg-citron/35 px-2.5 py-1 font-semibold text-forest">
                    ৳{product.latestPrice ?? "—"}
                  </span>
                </div>

                <h3 className="mt-2.5 line-clamp-2 text-lg font-semibold leading-tight tracking-[-0.02em] text-base-content md:text-xl">
                  {product.itemName || "Fresh produce"}
                </h3>

                <dl className="mt-3 grid gap-1.5 text-[12px] text-ink-soft">
                  <div className="flex items-center gap-2">
                    <UserRound
                      className="size-3.5 shrink-0 text-primary/55"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                    <dt className="sr-only">Vendor</dt>
                    <dd className="truncate">
                      {product.vendorName || "Verified vendor"}
                    </dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays
                      className="size-3.5 shrink-0 text-primary/55"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                    <dt className="sr-only">Listed on</dt>
                    <dd>{formatDate(product.date)}</dd>
                  </div>

                  <div className="flex items-center gap-2">
                    <Boxes
                      className="size-3.5 shrink-0 text-primary/55"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                    <dt className="sr-only">Stock</dt>
                    <dd
                      className={
                        product.stock !== undefined &&
                        product.stock !== null &&
                        product.stock !== "" &&
                        Number(product.stock) <= 0
                          ? "font-semibold text-error"
                          : undefined
                      }
                    >
                      {product.stock === undefined ||
                      product.stock === null ||
                      product.stock === ""
                        ? "Stock not set"
                        : Number(product.stock) <= 0
                          ? "Out of stock"
                          : `${product.stock} in stock`}
                    </dd>
                  </div>
                </dl>

                <div className="mt-auto pt-4">
                  <Link
                    to={`/details/${product._id}`}
                    type="button"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-[13px] font-semibold text-primary-content transition-colors duration-300 hover:bg-forest-soft"
                  >
                    View details
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !isError && totalPages > 1 && (
        <nav
          aria-label="Product pagination"
          className="mt-10 flex items-center justify-center gap-2 md:mt-12"
        >
          <button
            type="button"
            onClick={() => goToPage(Math.max(page - 1, 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-3.5 py-2 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:border-primary/25 hover:text-primary disabled:pointer-events-none disabled:opacity-40 md:px-4"
          >
            <ChevronLeft
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
            Prev
          </button>

          <div className="hidden items-center gap-1 md:flex">
            {buildPageItems(page, totalPages).map((item) =>
              typeof item === "number" ? (
                <button
                  key={item}
                  type="button"
                  onClick={() => goToPage(item)}
                  aria-label={`Page ${item}`}
                  aria-current={item === page ? "page" : undefined}
                  className={[
                    "grid size-9 place-items-center rounded-full border text-[13px] font-semibold transition-colors duration-300 md:size-10",
                    item === page
                      ? "border-primary bg-primary text-primary-content"
                      : "border-base-300 bg-base-100 text-ink-soft hover:border-primary/25 hover:text-primary",
                  ].join(" ")}
                >
                  {item}
                </button>
              ) : (
                <span
                  key={item}
                  aria-hidden="true"
                  className="grid size-9 place-items-center text-ink-soft/40"
                >
                  …
                </span>
              ),
            )}
          </div>

          <span className="px-1 text-[12px] font-semibold text-ink-soft md:hidden">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => goToPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-3.5 py-2 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:border-primary/25 hover:text-primary disabled:pointer-events-none disabled:opacity-40 md:px-4"
          >
            Next
            <ChevronRight
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        </nav>
      )}
    </div>
  );
};

export default AllProducts;
