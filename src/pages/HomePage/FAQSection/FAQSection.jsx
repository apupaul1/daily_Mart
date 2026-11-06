import React, { useState } from "react";
import { Link } from "react-router";
import {
  AnimatePresence,
  motion as Motion,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, Plus, Sparkles } from "lucide-react";
import FAQ1 from "../../../assets/FAQ1.jpg";
import FAQ2 from "../../../assets/FAQ2.jpg";

const faqs = [
  {
    question: "How does Daily Price Tracker collect market prices?",
    answer:
      "Local vendors submit prices daily through their dashboards. Admins review and approve the data before it's shown publicly.",
  },
  {
    question: "Do I need to create an account to view product prices?",
    answer:
      "You can view basic info publicly, but you'll need to log in to see full product details, write reviews, and add items to your watchlist.",
  },
  {
    question: "Is the pricing data real-time and reliable?",
    answer:
      "Yes. Prices are updated daily by verified vendors and approved by platform admins to ensure accuracy.",
  },
  {
    question: "Can I buy products directly from the website?",
    answer:
      "Yes! You can purchase selected products via Stripe after logging in.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const toggleFAQ = (index) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  return (
    <section aria-labelledby="faq-heading" className="bg-base-100 py-9">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Section header */}
        <div className="max-w-2xl">
          <h2
            id="faq-heading"
            className="mt-4 text-3xl font-semibold leading-[1.1] tracking-[-0.03em] text-base-content md:text-4xl lg:text-[2.75rem]"
          >
            Frequently asked <em className="italic text-primary">questions.</em>
          </h2>

          <p className="text-sm leading-relaxed text-ink-soft">
            Everything you need to know about prices, vendors, and ordering —
            answered in one place.
          </p>
        </div>

        <div className="mt-8 md:mt-10 lg:mt-12 lg:grid lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch lg:gap-14 xl:gap-16">
          {/* Visual — stretches to the accordion height */}
          <div className="flex-1 flex flex-col lg:flex-row gap-3 lg:relative items-center mt-12">
            <img
              data-aos="zoom-in-up"
              className="w-[200px] md:w-[300px] lg:w-[300px] flex-1 rounded-[40px] lg:absolute lg:-top-10 lg:left-16"
              src={FAQ1}
              alt=""
            />

            <img
              data-aos="zoom-in-up"
              className="hidden md:w-[300px] lg:flex lg:w-[300px] flex-1 rounded-[40px] border-t-8 border-t-white border-l-white border-l-8 lg:absolute lg:right-32 lg:top-8"
              src={FAQ2}
              alt=""
            />
          </div>

          {/* Accordion */}
          <div className="space-y-3 mt-12 md:mt-0">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              const panelId = `faq-panel-${index}`;
              const triggerId = `faq-trigger-${index}`;

              return (
                <div
                  key={faq.question}
                  className={[
                    "overflow-hidden rounded-[1.25rem] border transition-[border-color,background-color,box-shadow] duration-300",
                    isOpen
                      ? "border-primary/25 bg-base-100 shadow-card"
                      : "border-base-300/70 bg-base-200/50",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    id={triggerId}
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={isOpen ? panelId : undefined}
                    className="group flex w-full items-center gap-3 px-4 py-4 text-left md:gap-4 md:px-6 md:py-5"
                  >
                    <span className="text-xs font-semibold tracking-[0.14em] text-ink-soft/40 md:text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={[
                        "flex-1 text-[15px] font-bold leading-snug tracking-[-0.01em] transition-colors duration-300 md:text-base",
                        isOpen ? "text-primary" : "text-base-content",
                      ].join(" ")}
                    >
                      {faq.question}
                    </span>

                    <span
                      className={[
                        "grid size-8 shrink-0 place-items-center rounded-full border transition-all duration-300 md:size-9",
                        isOpen
                          ? "border-primary bg-primary text-citron"
                          : "border-base-300 bg-base-100 text-ink-soft group-hover:border-primary/30 group-hover:text-primary",
                      ].join(" ")}
                    >
                      <Plus
                        className={[
                          "size-4 transition-transform duration-300",
                          isOpen ? "rotate-45" : "",
                        ].join(" ")}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <Motion.div
                        key={panelId}
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        initial={
                          shouldReduceMotion
                            ? false
                            : {
                                height: 0,
                                opacity: 0,
                              }
                        }
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: shouldReduceMotion ? 0 : 0.3,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 pl-10 pr-4 text-[13px] leading-relaxed text-ink-soft md:pb-5 md:pl-14 md:pr-6 md:text-sm">
                          {faq.answer}
                        </p>
                      </Motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
