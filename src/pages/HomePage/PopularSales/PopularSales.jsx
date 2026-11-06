import { Link } from "react-router";
import { ArrowRight, BadgePercent } from "lucide-react";

const products = [
  {
    id: 1,
    name: "Fresh Red Tomatoes",
    oldPrice: 18.99,
    newPrice: 6.99,
    img: "https://img.icons8.com/color/96/000000/tomato.png",
  },
  {
    id: 2,
    name: "Fresh Cauliflower",
    oldPrice: 12.99,
    newPrice: 7.99,
    img: "https://img.icons8.com/color/96/000000/cauliflower.png",
  },
  {
    id: 3,
    name: "Fresh Grapes",
    oldPrice: 12.99,
    newPrice: 4.99,
    img: "https://img.icons8.com/color/96/000000/grapes.png",
  },
  {
    id: 4,
    name: "Fresh Bananas",
    oldPrice: 12.99,
    newPrice: 8.99,
    img: "https://img.icons8.com/color/96/000000/banana.png",
  },
  {
    id: 5,
    name: "Fresh Apples",
    oldPrice: 12.99,
    newPrice: 9.99,
    img: "https://img.icons8.com/color/96/000000/apple.png",
  },
  {
    id: 6,
    name: "Fresh Carrots",
    oldPrice: 12.99,
    newPrice: 6.99,
    img: "https://img.icons8.com/color/96/000000/carrot.png",
  },
  {
    id: 7,
    name: "Fresh Potatoes",
    oldPrice: 12.99,
    newPrice: 6.99,
    img: "https://img.icons8.com/color/96/000000/potato.png",
  },
  {
    id: 8,
    name: "Fresh Mangoes",
    oldPrice: 12.99,
    newPrice: 6.99,
    img: "https://img.icons8.com/color/96/000000/mango.png",
  },
  {
    id: 9,
    name: "Fresh Oranges",
    oldPrice: 12.99,
    newPrice: 6.99,
    img: "https://img.icons8.com/color/96/000000/orange.png",
  },
];

const formatPrice = (value) => `$${value.toFixed(2)}`;

const getDiscount = (oldPrice, newPrice) =>
  Math.round((1 - newPrice / oldPrice) * 100);

export default function PopularSales() {
  return (
    <section
      aria-labelledby="popular-sales-heading"
      className="bg-base-100 py-16 "
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Section header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="max-w-2xl">
            <h2
              id="popular-sales-heading"
              className="mt-4 text-3xl md:text-4xl font-semibold leading-[1.1] tracking-[-0.03em] text-base-content"
            >
              Popular <em className="italic text-primary">sales</em>
            </h2>

            <p className=" max-w-xl text-sm leading-relaxed text-ink-soft sm:text-[15px]">
              Everyday essentials at their lowest market price — restocked daily
              by local vendors.
            </p>
          </div>

          <Link
            to="/discount-product"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-primary/20 px-5 py-2.5 text-[13px] font-semibold text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-base-200/70 sm:self-auto"
          >
            View all deals
            <ArrowRight
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </Link>
        </div>

        {/* Deal cards */}
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 lg:grid-cols-5 lg:gap-6">
          {products.map((item) => (
            <li key={item.id} className="h-full">
              <article className="group flex h-full flex-col rounded-[1.5rem] border border-base-300/70 bg-base-100 p-2.5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card sm:p-3 relative">

                <div className="grid aspect-square place-items-center overflow-hidden rounded-[1.1rem] bg-linear-to-br from-base-200 to-base-300/60 p-3 sm:p-5 ">
                  <img
                    src={item.img}
                    alt={item.name}
                    loading="lazy"
                    className="size-20 object-contain transition-transform duration-500 ease-out group-hover:scale-110 sm:size-24 lg:size-28"
                  />

                  <span className="absolute top-3 -left-2 shrink-0 rounded-full bg-citron/40 px-1.5 py-0.5 text-[13px] font-bold text-forest sm:px-2">
                    {getDiscount(item.oldPrice, item.newPrice)}% off
                  </span>
                </div>

                <div className="flex flex-1 flex-col px-1 pb-1 pt-3 sm:pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-[13px] font-bold leading-snug tracking-[-0.01em] text-base-content sm:text-[15px]">
                      {item.name}
                    </h3>
                  </div>

                  <div className="mt-auto flex items-baseline gap-1.5 pt-3">
                    <span className=" text-lg font-semibold leading-none text-primary sm:text-xl">
                      {formatPrice(item.newPrice)}
                    </span>
                    <span className="text-[11px] font-medium text-ink-soft/60 line-through sm:text-xs">
                      {formatPrice(item.oldPrice)}
                    </span>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
