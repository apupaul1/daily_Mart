import React from "react";
import { Link } from "react-router";
import { ArrowRight, Gift, Mail } from "lucide-react";

const NewsLetter = () => {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="bg-base-100 pt-8 pb-16 md:pb-20 lg:pb-24"
    >
      <div>
        <div className="overflow-hidden bg-linear-to-br from-forest via-forest-soft to-forest p-6 shadow-soft md:p-10 lg:p-14 ">
          <div className="flex flex-col gap-8 md:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-14 max-w-6xl mx-auto">
            {/* Copy + form */}
            <div className="max-w-2xl">
              <h2
                id="newsletter-heading"
                className="mt-4  text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-primary-content md:text-4xl lg:text-5xl"
              >
                Get <em className="italic text-citron">20% off</em> your first
                order.
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-relaxed text-primary-content/60 md:text-[15px]">
                Daily market insights, exclusive deals, and fresh updates —
                delivered to your inbox. Join our community of savvy shoppers.
              </p>

              <form
                onSubmit={(event) => event.preventDefault()}
                className="mt-6 flex flex-col gap-2.5 md:mt-8 md:flex-row"
              >
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>

                <div className="flex flex-1 items-center gap-2.5 rounded-full border border-primary-content/15 bg-primary-content/[0.07] px-4 py-1.5 transition-colors duration-300 focus-within:border-citron/60 focus-within:bg-primary-content/10 md:px-5">
                  <Mail
                    className="size-4 shrink-0 text-primary-content/45"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  <input
                    id="newsletter-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="Enter your email address"
                    className="w-full bg-transparent py-2.5 text-sm text-primary-content placeholder:text-primary-content/45 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-citron px-6 py-3.5 text-sm font-bold text-forest transition-all duration-300 hover:-translate-y-0.5 hover:bg-citron/90 md:px-7"
                >
                  Subscribe now
                  <ArrowRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </button>
              </form>

              <p className="mt-4 text-[11px] leading-relaxed text-primary-content/55 md:text-xs">
                By subscribing, you agree to our{" "}
                <Link
                  to="/TermsandConditions"
                  className="text-primary-content/75 underline decoration-primary-content/25 underline-offset-2 transition-colors duration-300 hover:text-citron"
                >
                  terms of service
                </Link>
                . We never share your email with third parties.
              </p>
            </div>

            {/* Coupon ticket */}
            <div className="flex shrink-0 justify-center lg:justify-end">
              <div className="grid w-full max-w-[17rem] gap-3 rounded-[1.5rem] border border-dashed border-citron/40 bg-citron/[0.08] p-5 text-center md:max-w-xs md:gap-4 md:p-6 lg:w-64">
                <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-citron text-forest">
                  <Gift
                    className="size-5"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p className="text-4xl font-semibold leading-none tracking-[-0.02em] text-citron md:text-5xl">
                    20%
                  </p>
                  <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-primary-content/60">
                    off first order
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="mx-auto h-px w-16 bg-citron/25"
                />

                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-content/55">
                  DailyMart members
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
