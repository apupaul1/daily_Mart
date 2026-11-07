import { ShoppingBasket } from "lucide-react";

const sizeTokens = {
  sm: {
    frame: "size-10",
    logo: "size-7",
    orbitDot: "size-1.5",
    title: "text-[13px]",
    description: "text-[11px]",
    stack: "mt-4",
    bar: "mt-4 h-0.5 w-28",
  },
  md: {
    frame: "size-14",
    logo: "size-10",
    orbitDot: "size-2",
    title: "text-base",
    description: "text-xs",
    stack: "mt-5",
    bar: "mt-5 h-1 w-36",
  },
  lg: {
    frame: "size-20",
    logo: "size-14",
    orbitDot: "size-2.5",
    title: "text-xl",
    description: "text-[13px]",
    stack: "mt-6",
    bar: "mt-6 h-1 w-44",
  },
};

const toneTokens = {
  light: {
    label: "text-primary/40",
    title: "text-base-content",
    description: "text-ink-soft",
    ring: "border-primary/10",
    glow: "bg-citron/30",
    dot: "bg-primary/25",
    track: "bg-base-300/70",
  },
  dark: {
    label: "text-primary-content/40",
    title: "text-primary-content",
    description: "text-primary-content/55",
    ring: "border-primary-content/15",
    glow: "bg-citron/20",
    dot: "bg-primary-content/30",
    track: "bg-primary-content/15",
  },
};

const resolveSize = (size, fallback) => sizeTokens[size] ?? sizeTokens[fallback];

const LoaderMark = ({ size = "md", tone = "light" }) => {
  const s = resolveSize(size, "md");
  const t = toneTokens[tone] ?? toneTokens.light;

  return (
    <span
      className={["relative grid shrink-0 place-items-center", s.frame].join(
        " ",
      )}
      aria-hidden="true"
    >
      <span
        className={[
          "absolute inset-0 rounded-full blur-lg motion-reduce:hidden",
          t.glow,
        ].join(" ")}
      />

      <span
        className={["absolute inset-0 rounded-full border", t.ring].join(" ")}
      />

      <span className="absolute inset-0 animate-[dm-orbit_1.9s_linear_infinite] motion-reduce:animate-none">
        <span className="absolute inset-0 rounded-full border-2 border-transparent border-r-citron/50 border-t-citron" />
        <span
          className={[
            "absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-citron shadow-[0_0_12px_2px_rgba(217,228,95,0.55)]",
            s.orbitDot,
          ].join(" ")}
        />
      </span>

      <span
        className={[
          "relative grid place-items-center overflow-hidden rounded-full text-citron shadow-[inset_0_1px_0_rgba(251,250,246,0.16)] ring-1",
          tone === "dark"
            ? "bg-forest-soft ring-primary-content/25"
            : "bg-primary ring-primary/15",
          s.logo,
        ].join(" ")}
      >
        <ShoppingBasket
          className="size-[52%]"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </span>
    </span>
  );
};

const LoadingDots = ({ tone = "light", className = "" }) => {
  const t = toneTokens[tone] ?? toneTokens.light;

  return (
    <span
      className={["flex items-center gap-1.5", className].join(" ")}
      aria-hidden="true"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          style={{ animationDelay: `${index * 140}ms` }}
          className={[
            "size-1.5 rounded-full animate-[dm-dot_1.1s_ease-in-out_infinite] motion-reduce:animate-none",
            t.dot,
          ].join(" ")}
        />
      ))}
    </span>
  );
};

export const Spinner = ({ size = "sm", className = "" }) => {
  const dimensions =
    {
      xs: "size-3",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
    }[size] ?? "size-4";

  return (
    <span
      aria-hidden="true"
      className={[
        "relative inline-grid shrink-0 place-items-center",
        dimensions,
        className,
      ].join(" ")}
    >
      <span className="absolute inset-0 rounded-full border-2 border-current opacity-20" />
      <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-current motion-reduce:animate-none" />
    </span>
  );
};

const LoadingContent = ({
  size,
  tone,
  message,
  description,
  dots = true,
}) => {
  const s = resolveSize(size, "md");
  const t = toneTokens[tone] ?? toneTokens.light;

  return (
    <div className="flex flex-col items-center text-center">
      <LoaderMark size={size} tone={tone} />

      <p
        className={[
          "font-semibold tracking-[-0.01em]",
          s.title,
          s.stack,
          t.title,
        ].join(" ")}
      >
        {message}
      </p>

      {description && (
        <p
          className={[
            "mx-auto mt-1.5 max-w-xs leading-relaxed",
            s.description,
            t.description,
          ].join(" ")}
        >
          {description}
        </p>
      )}

      {dots && <LoadingDots tone={tone} className="mt-3" />}
    </div>
  );
};

/**
 * Branded loading indicator.
 *
 * variant:
 *  - page    → full viewport (auth boot, guarded routes)
 *  - section → inside a page/dashboard panel
 *  - overlay → absolute layer over existing content (refetch)
 *  - inline  → tiny spinner + label (buttons, badges)
 */
const Loading = ({
  variant = "page",
  size,
  message = "Loading…",
  description = "Preparing today's market for you.",
  tone = "light",
  className = "",
}) => {
  const t = toneTokens[tone] ?? toneTokens.light;

  if (variant === "inline") {
    return (
      <span
        role="status"
        aria-live="polite"
        className={["inline-flex items-center gap-2", className].join(" ")}
      >
        <Spinner size={size === "xs" ? "xs" : "sm"} />
        <span className={["text-[12px] font-semibold", t.title].join(" ")}>
          {message}
        </span>
      </span>
    );
  }

  if (variant === "overlay") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={[
          "absolute inset-0 z-20 grid place-items-center rounded-[inherit] bg-base-100/70 px-6 backdrop-blur-[2px]",
          className,
        ].join(" ")}
      >
        <LoadingContent
          size={size ?? "sm"}
          tone={tone}
          message={message}
          description={description}
        />
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className={[
          tone === "dark" ? "dm-loader-dark-surface" : "",
          "grid w-full place-items-center px-6 py-14",
          className,
        ].join(" ")}
      >
        <LoadingContent
          size={size ?? "md"}
          tone={tone}
          message={message}
          description={description}
        />
      </div>
    );
  }

  const s = resolveSize(size, "lg");

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={[
        "dm-loader-surface relative grid min-h-dvh place-items-center overflow-hidden bg-base-100 px-6 py-16",
        className,
      ].join(" ")}
    >
      <div className="relative flex flex-col items-center text-center">
        <span
          className={[
            "text-[9px] font-bold uppercase tracking-[0.34em]",
            t.label,
          ].join(" ")}
        >
          DailyMart
        </span>

        <div className="mt-6">
          <LoaderMark size={size ?? "lg"} tone={tone} />
        </div>

        <p
          className={[
            "mt-6 font-display text-2xl font-semibold tracking-[-0.02em] md:text-[26px]",
            t.title,
          ].join(" ")}
        >
          {message}
        </p>

        {description && (
          <p
            className={[
              "mt-2 max-w-xs text-[12.5px] leading-relaxed",
              t.description,
            ].join(" ")}
          >
            {description}
          </p>
        )}

        <div
          className={[
            "overflow-hidden rounded-full",
            s.bar,
            t.track,
          ].join(" ")}
        >
          <span className="block h-full w-1/2 rounded-full bg-linear-to-r from-primary via-citron to-primary animate-[dm-progress_1.8s_ease-in-out_infinite] motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
};

export { LoadingDots, LoaderMark };
export default Loading;
