import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ShoppingBasket } from "lucide-react";
import useAxios from "../../../hooks/useAxios";
import ProductCard from "./ProductCard";

const ProductSkeleton = () => (
  <div className="overflow-hidden rounded-[1.75rem] border border-base-300/60 bg-base-100">
    <div className="aspect-[4/3] animate-pulse bg-base-200" />
    <div className="space-y-3 p-5">
      <div className="h-2.5 w-24 animate-pulse rounded-full bg-base-200" />
      <div className="h-4 w-3/4 animate-pulse rounded-full bg-base-200" />
      <div className="mt-5 h-2.5 w-20 animate-pulse rounded-full bg-base-200" />
    </div>
  </div>
);

const ProductSection = () => {
  const axios = useAxios();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ["cards"],
    queryFn: async () => {
      const res = await axios.get("/marketcards");
      return res.data;
    },
  });

  return (
    <section className="relative overflow-hidden bg-base-100 py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="mt-3 max-w-2xl font-sans text-3xl font-semibold lg:text-4xl ">
              Fresh picks from local vendors
            </h2>
            <p className="mt-3 max-w-xl text-sm text-ink-soft">
              Handpicked essentials with live prices from trusted neighbourhood
              markets.
            </p>
          </div>

          <Link
            to="/allproducts"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-primary/20 px-5 py-2.5 text-[13px] font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-base-200/70 sm:self-auto"
          >
            Browse all products
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={2}
            />
          </Link>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : cards.length <= 0 ? (
          <div className="mt-10 flex flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-base-300 bg-base-200/40 px-6 py-16 text-center">
            <span className="grid size-12 place-items-center rounded-2xl bg-citron/40 text-primary">
              <ShoppingBasket className="size-6" strokeWidth={1.6} />
            </span>
            <p className="mt-4 font-display text-xl font-semibold text-base-content">
              No fresh picks yet
            </p>
            <p className="mt-1.5 max-w-sm text-sm text-ink-soft">
              Local vendors are restocking — check back soon for today&apos;s
              market.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {cards.map((card, index) => (
              <ProductCard key={card._id} card={card} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
