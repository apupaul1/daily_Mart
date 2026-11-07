/**
 * Shared shimmer skeletons.
 * A single source of truth keeps every loading placeholder on-brand.
 */

export const Skeleton = ({ className = "", rounded = "rounded-lg" }) => (
  <span
    className={[
      "relative block overflow-hidden bg-base-200/85",
      rounded,
      className,
    ].join(" ")}
  >
    <span className="absolute inset-0 -translate-x-full animate-[dm-shimmer_1.7s_ease-in-out_infinite] bg-linear-to-r from-transparent via-white/55 to-transparent motion-reduce:hidden" />
  </span>
);

export const SkeletonCircle = ({ className = "" }) => (
  <Skeleton rounded="rounded-full" className={className} />
);

export const ProductCardSkeleton = ({
  aspect = "aspect-[16/10]",
  className = "",
}) => (
  <div
    className={[
      "overflow-hidden rounded-[1.5rem] border border-base-300/60 bg-base-100",
      className,
    ].join(" ")}
  >
    <Skeleton rounded="rounded-none" className={["w-full", aspect].join(" ")} />

    <div className="space-y-3 p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <Skeleton className="h-2.5 w-24 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>

      <Skeleton className="h-4 w-3/4 rounded-full" />

      <div className="space-y-2 pt-1">
        <Skeleton className="h-2.5 w-28 rounded-full" />
        <Skeleton className="h-2.5 w-20 rounded-full" />
      </div>

      <Skeleton className="mt-4 h-9 w-full rounded-full" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({
  count = 8,
  aspect,
  className = "grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-4 lg:gap-6",
}) => (
  <div role="status" aria-busy="true" className={className}>
    <span className="sr-only">Loading products</span>

    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} aspect={aspect} />
    ))}
  </div>
);

export const FormSkeleton = ({ fields = 6, className = "" }) => (
  <div
    role="status"
    aria-busy="true"
    className={["space-y-6", className].join(" ")}
  >
    <span className="sr-only">Loading form</span>

    <div className="space-y-2">
      <Skeleton className="h-7 w-52 rounded-full" />
      <Skeleton className="h-3 w-72 max-w-full rounded-full" />
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: fields }).map((_, index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-2.5 w-20 rounded-full" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      ))}
    </div>

    <Skeleton className="h-11 w-44 rounded-full" />
  </div>
);
