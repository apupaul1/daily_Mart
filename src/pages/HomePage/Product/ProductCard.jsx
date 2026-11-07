import React, { useState } from "react";
import { Link } from "react-router";
import { motion as Motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Boxes, CalendarDays, ImageOff, MapPin } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const formatPrice = (value) => {
  const price = String(value ?? "").trim();
  if (!price) return "Price on request";
  return /[৳$€£]/.test(price) ? price : `৳${price}`;
};

const formatDate = (value) => {
  if (!value) return "Recently added";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 10);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ProductCard = ({ card, index = 0 }) => {
  const { loading, user } = useAuth();
  const shouldReduceMotion = useReducedMotion();
  const [imageFailed, setImageFailed] = useState(false);

  const priceLabel = formatPrice(card?.pricePerUnit);
  const [rawPriceAmount = "", ...priceUnitParts] = priceLabel.split("/");
  const priceAmount = rawPriceAmount.trim();
  const priceUnit = priceUnitParts.join("/").trim();
  const detailsPath = user?.email ? `/details/${card._id}` : "/login";
  const hasStock =
    card?.stock !== undefined && card?.stock !== null && card?.stock !== "";
  const stock = Number(card?.stock);
  const isOutOfStock = hasStock && stock <= 0;

  return (
    <Motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.06, 0.3),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Link
        to={detailsPath}
        onClick={(event) => {
          if (loading) event.preventDefault();
        }}
        aria-disabled={loading}
        className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-base-300/70 bg-base-100 transition-all duration-500 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-card"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-base-200">
          {imageFailed || !card?.imageUrl ? (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-base-200 via-base-100 to-citron/20">
              <ImageOff className="size-7 text-primary/30" strokeWidth={1.5} />
            </div>
          ) : (
            <img
              src={card.imageUrl}
              alt={card.itemName || "Market product"}
              loading="lazy"
              onError={() => setImageFailed(true)}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          )}

          <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/60 bg-base-100/90 px-3 py-1.5 text-[16px] font-bold text-primary shadow-sm backdrop-blur-md">
            {priceAmount}
            {priceUnit && (
              <span className="ml-0.5 text-[9.5px] font-bold text-base-content/45">
                /{priceUnit}
              </span>
            )}
          </span>

          {hasStock && (
            <span
              className={[
                "absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] shadow-sm backdrop-blur-md",
                isOutOfStock
                  ? "border-error/25 bg-error/10 text-error"
                  : "border-primary/20 bg-base-100/90 text-primary",
              ].join(" ")}
            >
              <Boxes className="size-3" strokeWidth={2.2} aria-hidden="true" />
              {isOutOfStock ? "Out of stock" : `${stock} in stock`}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <p className="flex items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-base-content/45">
            <MapPin
              className="size-3.5 shrink-0 text-primary/70"
              strokeWidth={1.9}
            />
            <span className="truncate">
              {card.marketName || "Local market"}
            </span>
          </p>

          <h3 className="mt-2.5 font-sans text-[1.25rem] font-semibold leading-[1.2] tracking-[-0.01em] text-base-content">
            {card.itemName || "Fresh produce"}
          </h3>

          <div className="mt-auto pt-5">
            <div className="flex  items-center justify-between gap-3 border-t border-base-300/60 pt-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-base-content/45">
                <CalendarDays className="size-3.5 shrink-0" strokeWidth={1.9} />
                {formatDate(card.date)}
              </span>

              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/[0.07] px-3 py-2 text-[11.5px] font-bold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content">
                View details
                <ArrowUpRight
                  className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2.2}
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </Motion.div>
  );
};

export default ProductCard;
