import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import {
  ArrowRight,
  BadgePercent,
  ImageOff,
  RotateCcw,
  ShoppingBasket,
  Sparkles,
  Store,
  Tag,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";
import { ProductGridSkeleton } from "../../Shared/Loading/Skeletons";

const DISCOUNT_PERCENT = 20;

const priceLabel = (value) => {
  const text = String(value ?? "").trim();
  if (!text) return "Price on request";
  return /[৳$€£]/.test(text) ? text : `৳${text}`;
};

const resolvePrices = (product) => {
  const amount = Number(product?.latestPrice);

  if (Number.isFinite(amount) && amount > 0) {
    return {
      oldPrice: amount,
      newPrice: Math.round(amount * (1 - DISCOUNT_PERCENT / 100)),
    };
  }

  return { oldPrice: null, newPrice: null };
};

const DiscountImage = ({ src, alt }) => {
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
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
    />
  );
};

const AllDiscountsPage = () => {
  const axios = useAxios();
  const { user } = useAuth();
  const navigate = useNavigate();

  const {
    data: products = [],
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axios.get("/all-products");
      const payload = res.data?.data;
      return Array.isArray(payload) ? payload : [];
    },
    placeholderData: keepPreviousData,
  });

  const handleDetails = (productId) => {
    if (!user?.email) {
      navigate("/login");
    } else {
      navigate(`/details/${productId}`);
    }
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:px-8">
      {/* Page header */}
      <header className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div className="max-w-2xl">
          <h1 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-base-content md:text-4xl lg:text-[2.75rem]">
            Every basket, <em className="italic text-primary">20% lighter.</em>
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft md:text-[15px]">
            A rotating selection of fresh market staples at a flat discount —
            sourced from verified local vendors and updated with live prices.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <Link
              to="/allproducts"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-content transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-soft"
            >
              Browse all products
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[12px] font-semibold text-ink-soft">
              <Tag
                className="size-3.5 text-primary/70"
                strokeWidth={1.9}
                aria-hidden="true"
              />
              {isLoading
                ? "Loading deals…"
                : `${products.length} deal${
                    products.length === 1 ? "" : "s"
                  } live`}
            </span>
          </div>
        </div>
      </header>

      {/* Results heading */}
      <div className="mt-8 flex items-end justify-between gap-3 md:mt-10">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-base-content md:text-2xl">
            Discounted listings
          </h2>
          <p
            aria-live="polite"
            className="mt-1 text-[12px] text-ink-soft md:text-sm"
          >
            {isLoading
              ? "Loading products…"
              : `Live prices for ${products.length} product${
                  products.length === 1 ? "" : "s"
                }`}
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
          count={8}
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

            <p className="mt-4 text-xl font-semibold text-base-content">
              We couldn&apos;t load discounts
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
      ) : products.length === 0 ? (
        <div className="mt-4 grid place-items-center rounded-[1.5rem] border border-dashed border-base-300 bg-base-200/40 px-6 py-14 text-center md:mt-5 md:py-20">
          <div>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-citron/40 text-primary">
              <ShoppingBasket
                className="size-6"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p className="mt-4 text-xl font-semibold text-base-content">
              No discounts are live right now
            </p>

            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
              Vendors are restocking their best offers — check back soon, or
              browse the full marketplace in the meantime.
            </p>

            <Link
              to="/allproducts"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.04] px-5 py-2.5 text-[13px] font-semibold text-primary transition-colors duration-300 hover:bg-primary/10"
            >
              Browse all products
              <ArrowRight
                className="size-3.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => {
            const { oldPrice, newPrice } = resolvePrices(product);
            const hasStock =
              product.stock !== undefined &&
              product.stock !== null &&
              product.stock !== "";
            const isOutOfStock = hasStock && Number(product.stock) <= 0;

            return (
              <article
                key={product._id ?? index}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card"
              >
                <div className="aspect-[16/10] overflow-hidden bg-base-200">
                  <DiscountImage
                    src={product.imageUrl}
                    alt={product.itemName || "Discounted market product"}
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

                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-citron/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-forest">
                      <BadgePercent
                        className="size-3"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                      {DISCOUNT_PERCENT}% off
                    </span>
                  </div>

                  <h3 className="mt-2.5 line-clamp-2 text-lg font-semibold leading-tight tracking-[-0.02em] text-base-content md:text-xl">
                    {product.itemName || "Fresh produce"}
                  </h3>

                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-ink-soft">
                    <UserRound
                      className="size-3.5 shrink-0 text-primary/55"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                    <span className="truncate">
                      {product.vendorName || "Verified vendor"}
                    </span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-end gap-2">
                    {newPrice ? (
                      <>
                        <span className=" text-2xl font-semibold leading-none tracking-[-0.02em] text-primary">
                          ৳{newPrice}
                        </span>

                        <span className="text-sm font-medium text-ink-soft/60 line-through">
                          ৳{oldPrice}
                        </span>

                        <span className="rounded-full bg-primary/[0.07] px-2 py-0.5 text-[14px] font-bold text-primary">
                          Save ৳{oldPrice - newPrice}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-ink-soft">
                        {priceLabel(product.pricePerUnit)}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <button
                      type="button"
                      onClick={() => handleDetails(product._id)}
                      disabled={isOutOfStock}
                      title={
                        isOutOfStock
                          ? "This product is out of stock"
                          : undefined
                      }
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-[13px] font-semibold text-primary-content transition-colors duration-300 hover:bg-forest-soft disabled:pointer-events-none disabled:opacity-50"
                    >
                      {isOutOfStock ? "Out of stock" : "Buy now"}
                      <ArrowRight
                        className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllDiscountsPage;
