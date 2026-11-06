import React from "react";
import { motion as Motion, useReducedMotion } from "framer-motion";

const ServiceCard = ({ service, index }) => {
  const Icon = service.icon;

  const shouldReduceMotion = useReducedMotion();

  const reveal = (index) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: {
            duration: 0.5,
            delay: Math.min(index * 0.07, 0.35),
            ease: [0.22, 1, 0.36, 1],
          },
        };

  return (
    <Motion.li key={service.title} {...reveal(index)} className="h-full">
      <div className="group flex h-full gap-4 rounded-[1.4rem] border border-base-300/70 bg-base-100 p-4 shadow-[0_1px_2px_rgba(18,35,28,0.04)] transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card sm:flex-col sm:gap-5 sm:p-6 lg:p-7">
        <div className="flex shrink-0 items-start justify-between sm:w-full">
          <span className="grid size-11 place-items-center rounded-2xl bg-primary text-citron transition-colors duration-300 group-hover:bg-citron group-hover:text-primary sm:size-12">
            <Icon
              className="size-5 sm:size-6"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </span>

          <span
            aria-hidden="true"
            className="hidden text-sm font-semibold tracking-[0.2em] text-ink-soft/35 sm:block"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="text-[15px] font-bold leading-snug tracking-[-0.01em] text-base-content sm:text-lg">
            {service.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft sm:mt-2 sm:text-sm">
            {service.description}
          </p>
        </div>
      </div>
    </Motion.li>
  );
};

export default ServiceCard;
