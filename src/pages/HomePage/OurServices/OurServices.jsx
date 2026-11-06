import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";
import {
  ClipboardList,
  CreditCard,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  TrendingUp,
} from "lucide-react";
import ServiceCard from "../../../Shared/Cards/ServiceCard";

const services = [
  {
    icon: Store,
    title: "Live Market Data",
    description:
      "Access daily updates from vendors across multiple local markets in real-time.",
  },
  {
    icon: TrendingUp,
    title: "Price Trend Analytics",
    description:
      "Visualize product price changes using interactive graphs for smarter buying.",
  },
  {
    icon: CreditCard,
    title: "Secure Checkout",
    description:
      "Enjoy a smooth, encrypted buying experience powered by Stripe.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    description:
      "Vendor, admin, or user—each role gets personalized access and controls.",
  },
  {
    icon: Tag,
    title: "Offers & Promotions",
    description:
      "Browse latest discounts and promotional deals posted by admins and vendors.",
  },
  {
    icon: ClipboardList,
    title: "Watchlist & Orders",
    description:
      "Track your favorite products and review past orders from your dashboard.",
  },
];

const OurServices = () => {
  return (
    <section
      aria-labelledby="services-heading"
      className="border-y border-base-300/60 bg-base-200 py-16"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.04] px-3 py-1 text-[13px] font-bold uppercase tracking-[0.22em] text-primary/70">
              <Sparkles
                className="size-3"
                strokeWidth={2.2}
                aria-hidden="true"
              />
              What we offer
            </span>

            <h2
              id="services-heading"
              className="mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-base-content sm:text-4xl lg:text-[2.75rem]"
            >
              Our core services,{" "}
              <em className="italic text-primary">made effortless.</em>
            </h2>
            <p className="text-sm text-ink-soft">
              We offer a seamless experience for tracking, analyzing, and
              purchasing local market products — with transparency, convenience,
              and smart decisions for every shopper and vendor.
            </p>
          </div>
        </div>

        {/* Service cards */}
        <ul className="mt-10 grid gap-3.5 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              index={index}
            ></ServiceCard>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default OurServices;
