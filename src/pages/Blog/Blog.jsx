import { useState } from "react";
import { Link } from "react-router";
import { motion as Motion, useReducedMotion } from "framer-motion";
import {
  Apple,
  ArrowRight,
  ArrowUpRight,
  ChefHat,
  Clock3,
  Heart,
  ImageOff,
  Leaf,
  ShoppingBasket,
  Sparkles,
  Store,
} from "lucide-react";

const blogs = [
  {
    title: "Top 10 Grocery Tips for Busy People",
    excerpt:
      "Learn how to save time and money while shopping for your daily groceries, from planning a smarter list to picking the right market days.",
    image:
      "https://i.ibb.co/39HTJg3c/grunge-black-concrete-textured-background.jpg",
    icon: ShoppingBasket,
    category: "Smart shopping",
    readTime: "4 min read",
    link: "#",
  },
  {
    title: "How to Find Fresh Produce in Local Markets",
    excerpt:
      "Discover the best ways to select fresh fruits and vegetables in your area — what to look for, what to skip, and when to buy.",
    image:
      "https://i.ibb.co/hQqXHPJ/abstract-blur-beautiful-luxury-shopping-mall-center.jpg",
    icon: Leaf,
    category: "Market guide",
    readTime: "5 min read",
    link: "#",
  },
  {
    title: "Healthy Eating on a Budget",
    excerpt:
      "Simple strategies to eat healthy without breaking the bank — affordable staples, smart swaps, and weekly planning that works.",
    image: "https://i.ibb.co/qL5QMCNF/Cooking.jpg",
    icon: Heart,
    category: "Budget meals",
    readTime: "6 min read",
    link: "#",
  },
  {
    title: "Seasonal Fruits You Should Try",
    excerpt:
      "Explore the seasonal fruits available in your local markets and their benefits — flavour, value, and the best months to buy.",
    image: "https://i.ibb.co/dJjL6Swn/ella-olsson-KPDb-Ry-FOTn-E-unsplash.jpg",
    icon: Apple,
    category: "Seasonal",
    readTime: "4 min read",
    link: "#",
  },
  {
    title: "5 Easy Recipes for Busy Weeknights",
    excerpt:
      "Quick, healthy, and delicious recipes you can cook in under 30 minutes using everyday market ingredients.",
    image: "https://i.ibb.co/93mSnJrH/vintage-old-rustic-cutlery-dark.jpg",
    icon: ChefHat,
    category: "Recipes",
    readTime: "7 min read",
    link: "#",
  },
  {
    title: "Why Local Markets Are Better Than Superstores",
    excerpt:
      "Discover the unique benefits of buying fresh from your neighborhood markets — better prices, fresher produce, and real community.",
    image: "https://i.ibb.co/nNGLksbK/jed-owen-OGZon8f-Mkp0-unsplash.jpg",
    icon: Store,
    category: "Local love",
    readTime: "5 min read",
    link: "#",
  },
];

const BlogImage = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="grid h-full w-full place-items-center bg-linear-to-br from-base-200 via-base-100 to-citron/20">
        <ImageOff
          className="size-7 text-primary/30"
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
    />
  );
};

const Blog = () => {
  const shouldReduceMotion = useReducedMotion();

  const [featured, ...rest] = blogs;
  const FeaturedIcon = featured.icon;

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:px-8">
      {/* Page header */}
      <header className="grid gap-6 md:gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
        <div className="max-w-2xl">
          <h1 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-base-content md:text-4xl lg:text-[2.75rem]">
            Stories from the <em className="italic text-primary">market.</em>
          </h1>

          <p className="mt-3 max-w-lg text-sm leading-relaxed text-ink-soft md:text-[15px]">
            Practical guides, seasonal picks, and everyday recipes for people
            who like their groceries fresh and their budgets intact.
          </p>

          <div className="mt-6">
            <Link
              to="/allproducts"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-content transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-soft"
            >
              Explore products
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Featured story */}
      <Motion.article
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-8 md:mt-10"
      >
        <a
          href={featured.link}
          aria-label={`Read: ${featured.title}`}
          className="group grid overflow-hidden rounded-[1.75rem] border border-base-300/70 bg-base-100 transition-[border-color,box-shadow] duration-300 hover:border-primary/25 hover:shadow-card lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]"
        >
          <div className="aspect-[16/10] overflow-hidden bg-base-200 lg:aspect-auto lg:h-full lg:min-h-[22rem]">
            <BlogImage src={featured.image} alt={featured.title} />
          </div>

          <div className="flex flex-col p-5 md:p-7 lg:p-9">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-citron/35 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-forest">
                <FeaturedIcon
                  className="size-3.5"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {featured.category}
              </span>

              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-soft/60">
                <Clock3
                  className="size-3.5"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
                {featured.readTime}
              </span>
            </div>

            <h2 className="mt-4  text-2xl font-semibold leading-[1.15] tracking-[-0.02em] text-base-content md:text-3xl lg:text-[2rem]">
              {featured.title}
            </h2>

            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-soft md:text-[15px]">
              {featured.excerpt}
            </p>

            <div className="mt-auto pt-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/[0.07] px-4 py-2.5 text-[13px] font-semibold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-content">
                Read the story
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={2.2}
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>
        </a>
      </Motion.article>

      {/* Story grid */}
      <div className="mt-10 flex items-end justify-between gap-3 md:mt-12">
        <div>
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-base-content md:text-2xl">
            More from the journal
          </h2>
          <p className="mt-1 text-[12px] text-ink-soft md:text-sm">
            Fresh reads on shopping, cooking, and local markets.
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:mt-5 md:grid-cols-2 md:gap-5 lg:grid-cols-3 lg:gap-6">
        {rest.map((blog, index) => {
          const Icon = blog.icon;

          return (
            <Motion.article
              key={blog.title}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.45,
                delay: Math.min(index * 0.05, 0.25),
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-full"
            >
              <a
                href={blog.link}
                aria-label={`Read: ${blog.title}`}
                className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-card"
              >
                <div className="aspect-[16/10] overflow-hidden bg-base-200">
                  <BlogImage src={blog.image} alt={blog.title} />
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex min-w-0 items-center gap-1.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-primary/70">
                      <Icon
                        className="size-3.5 shrink-0"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                      <span className="truncate">{blog.category}</span>
                    </span>

                    <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-ink-soft/60">
                      <Clock3
                        className="size-3.5"
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                      {blog.readTime}
                    </span>
                  </div>

                  <h3 className="mt-2.5 line-clamp-2 text-lg font-semibold leading-tight tracking-[-0.02em] text-base-content md:text-xl">
                    {blog.title}
                  </h3>

                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
                    {blog.excerpt}
                  </p>

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12.5px] font-semibold text-primary">
                    Read more
                    <ArrowUpRight
                      className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </a>
            </Motion.article>
          );
        })}
      </div>

      {/* Bottom call to action */}
      <section className="mt-10 rounded-[1.75rem] bg-linear-to-br from-forest via-forest-soft to-forest p-6 md:mt-12 md:p-10 lg:flex lg:items-center lg:justify-between lg:gap-10">
        <div className="max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-citron/80">
            Keep exploring
          </p>

          <h2 className="mt-2  text-2xl font-semibold leading-tight tracking-[-0.02em] text-primary-content md:text-3xl">
            Fresh prices, every day.
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-primary-content/60">
            Compare live listings from verified local markets and put these
            stories to work in your next basket.
          </p>
        </div>

        <Link
          to="/allproducts"
          className="group mt-6 inline-flex items-center gap-2 rounded-full bg-citron px-6 py-3 text-sm font-bold text-forest transition-all duration-300 hover:-translate-y-0.5 hover:bg-citron/90 lg:mt-0"
        >
          Browse all products
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            strokeWidth={2}
            aria-hidden="true"
          />
        </Link>
      </section>
    </div>
  );
};

export default Blog;
