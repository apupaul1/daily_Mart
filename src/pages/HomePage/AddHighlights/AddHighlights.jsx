import React, { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Megaphone,
  Pause,
  Play,
  RefreshCw,
} from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import fallbackImage from "../../../assets/background.jpg";

const AddHighlights = () => {
  const axios = useAxios();
  const shouldReduceMotion = useReducedMotion();

  const [active, setActive] = useState(0);

  const {
    data: ads = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["highlight-ads", { status: "approved" }],
    queryFn: async () => {
      const res = await axios.get("/ads", {
        params: { status: "approved" },
      });
      return res.data;
    },
  });

  const count = ads.length;
  const current = ads[active];

  useEffect(() => {
    setActive((index) => (count === 0 ? 0 : index % count));
  }, [count]);

  useEffect(() => {
    if (count <= 1 || shouldReduceMotion) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActive((index) => (index + 1) % count);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [active, count, shouldReduceMotion]);

  const goTo = (index) => {
    if (count === 0) return;
    setActive(((index % count) + count) % count);
  };

  return (
    <section
      aria-labelledby="highlights-heading"
      className="border-y border-primary-content/10 bg-primary py-16 "
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="max-w-2xl">
            <h2
              id="highlights-heading"
              className="mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-primary-content sm:text-4xl lg:text-[2.75rem]"
            >
              Advertisement <em className="italic text-citron">highlights.</em>
            </h2>

            <p className="text-sm leading-relaxed text-primary-content/55">
              Fresh campaigns and offers from approved vendors and partners
              across the city.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="mt-8 aspect-[4/3] animate-pulse rounded-[1.5rem] border border-primary-content/10 bg-primary-content/[0.06] sm:mt-10 sm:aspect-[2/1] sm:rounded-[2rem] lg:aspect-[21/9]" />
        ) : isError ? (
          <div className="mt-8 grid min-h-56 place-items-center rounded-[1.5rem] border border-dashed border-primary-content/15 bg-primary-content/[0.03] px-6 py-14 text-center sm:mt-10 sm:rounded-[2rem]">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-citron/10 text-citron">
                <RefreshCw
                  className="size-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>
              <p className="mt-4 font-display text-xl font-semibold text-primary-content">
                Promotions couldn&apos;t load
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-primary-content/55">
                {error?.message ||
                  "Something interrupted the request. Please try again."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-citron/30 bg-citron/10 px-5 py-2.5 text-[13px] font-semibold text-citron transition-colors duration-300 hover:bg-citron/20"
              >
                <RefreshCw
                  className="size-3.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Try again
              </button>
            </div>
          </div>
        ) : count === 0 ? (
          <div className="mt-8 grid min-h-56 place-items-center rounded-[1.5rem] border border-dashed border-primary-content/15 bg-primary-content/[0.03] px-6 py-14 text-center sm:mt-10 sm:rounded-[2rem]">
            <div>
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-citron/10 text-citron">
                <Megaphone
                  className="size-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>
              <p className="mt-4 font-display text-xl font-semibold text-primary-content">
                No approved ads right now
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-primary-content/55">
                New vendor promotions will appear here as soon as they&apos;re
                approved.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div
              role="region"
              aria-roledescription="carousel"
              aria-label="Advertisement highlights"
              tabIndex={0}
              className="mt-8 grid aspect-[4/3] overflow-hidden sm:aspect-[2/1] lg:aspect-[21/9]"
            >
              <AnimatePresence initial={false}>
                {current && (
                  <Motion.div
                    key={current._id || active}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${active + 1} of ${count}`}
                    initial={shouldReduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      duration: shouldReduceMotion ? 0 : 0.55,
                      ease: "easeInOut",
                    }}
                    className="col-start-1 row-start-1 grid"
                  >
                    <img
                      src={current.banner || fallbackImage}
                      alt={current.title || `Advertisement ${active + 1}`}
                      loading={active === 0 ? "eager" : "lazy"}
                      onError={(event) => {
                        event.currentTarget.src = fallbackImage;
                      }}
                      className="col-start-1 row-start-1 h-128 rounded-2xl w-full object-cover border"
                    />

                    <div className="col-start-1 row-start-1 flex flex-col justify-end gap-1.5 bg-linear-to-t from-forest/95 via-forest/35 to-transparent p-4 pt-16 sm:gap-2 sm:p-7 sm:pt-24 lg:p-9">
                      {current.title && (
                        <h3 className="max-w-2xl font-display text-lg font-semibold leading-tight tracking-[-0.02em] text-primary-content sm:text-2xl lg:text-3xl">
                          {current.title}
                        </h3>
                      )}
                      {current.description && (
                        <p className="line-clamp-2 max-w-xl text-[12px] leading-relaxed text-primary-content/70 sm:text-sm">
                          {current.description}
                        </p>
                      )}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Controls */}
            {count > 1 && (
              <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {ads.map((ad, index) => (
                    <button
                      key={ad._id || index}
                      type="button"
                      onClick={() => goTo(index)}
                      aria-label={`Show advertisement ${index + 1}`}
                      aria-current={index === active ? "true" : undefined}
                      className={[
                        "h-1.5 rounded-full transition-all duration-300",
                        index === active
                          ? "w-8 bg-citron"
                          : "w-1.5 bg-primary-content/25 hover:bg-primary-content/45",
                      ].join(" ")}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default AddHighlights;
