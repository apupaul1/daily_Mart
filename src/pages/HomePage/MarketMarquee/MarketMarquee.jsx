import React from "react";
import Marquee from "react-fast-marquee";
import { motion as Motion, useReducedMotion } from "framer-motion";
import {
    BadgeCheck,
    Building2,
    Clock,
    MapPin,
    ShoppingBasket,
    ShoppingCart,
    Store,
    Warehouse,
} from "lucide-react";

const markets = [
    { name: "New Market", icon: Store },
    { name: "Bashundhara Supermarket", icon: ShoppingCart },
    { name: "Kawran Bazar", icon: Warehouse },
    { name: "Jamuna Future Park", icon: Building2 },
    { name: "Banani Market", icon: ShoppingBasket },
    { name: "Gulshan Market", icon: Store },
    { name: "Mouchak Market", icon: ShoppingBasket },
    { name: "Motijheel Market", icon: ShoppingCart },
    { name: "Farmgate Market", icon: Warehouse },
    { name: "Dhanmondi Supermarket", icon: Building2 },
];

const highlights = [
    { label: "Verified vendors", icon: BadgeCheck },
    { label: "Updated daily", icon: Clock },
    { label: `${markets.length} markets tracked`, icon: Store },
];

const MarketMarquee = () => {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section
            aria-labelledby="markets-heading"
            className="overflow-hidden bg-linear-to-br from-forest via-forest-soft to-forest py-12 sm:py-14 lg:py-16"
        >
            {/* Section intro */}
            <Motion.div
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto flex max-w-3xl flex-col items-center px-5 text-center sm:px-8"
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-citron/25 bg-citron/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-citron">
                    <MapPin className="size-3" strokeWidth={2.2} aria-hidden="true" />
                    Near you
                </span>

                <h2
                    id="markets-heading"
                    className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.02em] text-primary-content sm:text-3xl lg:text-[2.5rem]"
                >
                    Popular markets near you
                </h2>

                <p className="mt-2.5 max-w-md text-[13px] leading-relaxed text-primary-content/55 sm:text-sm">
                    Fresh prices, updated daily by verified vendors across the
                    city.
                </p>
            </Motion.div>

            {/* Marquee rail */}
            <div className="mt-8 sm:mt-9 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <Marquee
                    speed={42}
                    play={!shouldReduceMotion}
                    pauseOnHover
                    gradient={false}
                    autoFill
                >
                    {markets.map((market) => {
                        const Icon = market.icon;

                        return (
                            <div
                                key={market.name}
                                className="mx-1.5 flex items-center gap-2.5 rounded-full border border-primary-content/10 bg-primary-content/[0.06] py-2 pl-2 pr-4 transition-colors duration-300 hover:border-citron/35 hover:bg-primary-content/10 sm:mx-2 sm:gap-3 sm:py-2.5 sm:pl-2.5 sm:pr-5"
                            >
                                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-citron text-forest sm:size-9">
                                    <Icon
                                        className="size-4 sm:size-[18px]"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </span>
                                <span className="whitespace-nowrap text-[13px] font-semibold text-primary-content sm:text-sm">
                                    {market.name}
                                </span>
                            </div>
                        );
                    })}
                </Marquee>
            </div>

            {/* Trust row */}
            <div className="mx-auto mt-7 flex max-w-3xl flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 text-[11px] font-semibold text-primary-content/55 sm:mt-8 sm:gap-x-7 sm:text-xs">
                {highlights.map((item, index) => {
                    const Icon = item.icon;

                    return (
                        <React.Fragment key={item.label}>
                            {index > 0 && (
                                <span
                                    aria-hidden="true"
                                    className="hidden h-3 w-px bg-primary-content/15 sm:block"
                                />
                            )}
                            <span className="inline-flex items-center gap-1.5">
                                <Icon
                                    className="size-3.5 text-citron"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                                {item.label}
                            </span>
                        </React.Fragment>
                    );
                })}
            </div>
        </section>
    );
};

export default MarketMarquee;
