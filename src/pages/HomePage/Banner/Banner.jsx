import React, { useState } from "react";
import { Link } from "react-router";
import { motion as Motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Leaf,
  Tag,
  TrendingDown,
  Truck,
} from "lucide-react";
import bannerFallback from "../../../assets/FAQ2.jpg";

const Banner = () => {
  const shouldReduceMotion = useReducedMotion();
  const imageSrc = "https://i.ibb.co/wZW5PJys/Banner1.webp";

  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section className="relative overflow-hidden bg-linear-to-r from-[#d9e45f30] via-base-100 to-[#d9e45f30]">
      <div className="mx-auto grid max-w-7xl items-center lg:gap-14 pb-12 lg:grid-cols-2 px-8 ">
        {/* Copy */}
        <div className="flex flex-col items-start order-2 md:order-1">
          <Motion.h1
            {...reveal(0.08)}
            className="mt-6 max-w-xl font-display text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.03em] text-base-content sm:text-[3.4rem] lg:text-[3.9rem] xl:text-[4.2rem]"
          >
            The daily market,
            <span className="mt-1 block">
              made <em className="italic text-primary">effortless.</em>
            </span>
          </Motion.h1>

          <Motion.p
            {...reveal(0.16)}
            className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-soft sm:text-base"
          >
            Shop trusted neighbourhood vendors, compare live market prices, and
            get everyday essentials — all in one place.
          </Motion.p>

          <Motion.div
            {...reveal(0.24)}
            className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <Link
              to="/allproducts"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-content shadow-[0_20px_40px_-24px_rgba(11,61,46,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-soft sm:w-auto"
            >
              Shop the market
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
              />
            </Link>
            <Link
              to="/discount-product"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/20 bg-base-100/70 px-7 py-3.5 text-sm font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-base-200/70 sm:w-auto"
            >
              <Tag
                className="size-4 transition-transform duration-300 group-hover:-rotate-6"
                strokeWidth={1.9}
              />
              Today&apos;s discounts
            </Link>
          </Motion.div>

          <Motion.div
            {...reveal(0.32)}
            className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] font-semibold text-base-content/60"
          >
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="size-4 text-primary" strokeWidth={1.9} />
              Verified vendors
            </span>
            <span className="hidden h-4 w-px bg-base-300 sm:block" />
            <span className="flex items-center gap-1.5">
              <TrendingDown className="size-4 text-primary" strokeWidth={1.9} />
              Live market prices
            </span>
            <span className="hidden h-4 w-px bg-base-300 sm:block" />
            <span className="flex items-center gap-1.5">
              <Truck className="size-4 text-primary" strokeWidth={1.9} />
              Cash on delivery
            </span>
          </Motion.div>
        </div>

        {/* Visual */}
        <Motion.div
          initial={
            shouldReduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }
          }
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:max-w-[34rem] order-1 md:order-2"
        >
          <div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle_at_65%_25%,rgba(217,228,95,0.4),transparent_62%)] blur-2xl" />

          <div className="relative rounded-[2.25rem] sm:p-3">
            <div className="relative aspect-square overflow-hidden rounded-[1.75rem]">
              {/* bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,#f6f7ee_55%,#eef1d9_100%)] */}
              <img
                src={imageSrc}
                alt="A basket of fresh groceries and local produce"
                loading="eager"
                fetchPriority="high"
                className="relative z-10 h-full w-full object-contain px-6 py-10 drop-shadow-[0_28px_35px_rgba(11,61,46,0.22)] sm:px-8"
              />

              {/* Live price card */}
              <Motion.div
                animate={shouldReduceMotion ? undefined : { y: [0, -7, 0] }}
                transition={{
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute bottom-4 left-4 z-20 w-[13.5rem] rounded-2xl border border-base-300/60 bg-base-100/95 p-3.5 shadow-[0_18px_40px_-24px_rgba(11,61,46,0.65)] backdrop-blur sm:left-5 sm:bottom-5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-base-content/45">
                      Live market price
                    </p>
                    <p className="mt-1 text-sm font-bold text-base-content">
                      Tomato
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-3xl font-semibold leading-none text-primary">
                    ৳45
                    <span className="ml-0.5 font-sans text-[10px] font-semibold text-base-content/45">
                      /kg
                    </span>
                  </p>

                  <span className="inline-flex items-center justify-center gap-0.5 rounded-full bg-success/10 w-20 px-2 py-1 text-xl font-bold text-success">
                    <TrendingDown className="size-3" strokeWidth={2.2} />
                    8%
                  </span>
                </div>
              </Motion.div>
            </div>
          </div>
        </Motion.div>
      </div>
    </section>
  );
};

export default Banner;
