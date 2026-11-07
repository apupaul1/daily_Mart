import { Link } from "react-router";
import { ArrowUpRight, Inbox, RotateCcw } from "lucide-react";
import { Skeleton } from "../Loading/Skeletons";
import { chartColors } from "./dashboardUtils";

const statTones = {
    primary: "bg-primary/10 text-primary",
    citron: "bg-citron/40 text-forest",
    accent: "bg-accent/10 text-accent",
    danger: "bg-error/10 text-error",
};

export const StatCard = ({
    icon,
    label,
    value,
    hint,
    tone = "primary",
    to,
}) => {
    const Icon = icon;

    const className =
        "group relative block overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100 p-4 shadow-[0_1px_2px_rgba(18,35,28,0.04)] transition-colors duration-300 md:p-5";

    const content = (
        <>
            <div className="flex items-start justify-between gap-3">
                <span
                    className={[
                        "grid size-10 place-items-center rounded-xl",
                        statTones[tone] ?? statTones.primary,
                    ].join(" ")}
                >
                    <Icon
                        className="size-5"
                        strokeWidth={1.9}
                        aria-hidden="true"
                    />
                </span>

                {to && (
                    <ArrowUpRight
                        className="size-4 text-ink-soft/40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                )}
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-ink-soft/60">
                {label}
            </p>

            <p className="mt-1.5 text-2xl font-semibold tracking-[-0.03em] text-base-content md:text-3xl">
                {value}
            </p>

            {hint && <p className="mt-1 text-xs text-ink-soft">{hint}</p>}
        </>
    );

    if (!to) {
        return <div className={className}>{content}</div>;
    }

    return (
        <Link to={to} className={`${className} hover:border-primary/25`}>
            {content}
        </Link>
    );
};

export const Panel = ({
    icon: Icon,
    title,
    description,
    action,
    children,
    className = "",
    bodyClassName = "p-5 md:p-6",
}) => (
    <section
        className={[
            "overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100 shadow-[0_1px_2px_rgba(18,35,28,0.04)]",
            className,
        ].join(" ")}
    >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-base-300/60 p-5 md:p-6">
            <div className="flex min-w-0 items-start gap-3">
                {Icon && (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/[0.06] text-primary">
                        <Icon
                            className="size-4"
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    </span>
                )}

                <div className="min-w-0">
                    <h3 className="text-base font-semibold tracking-[-0.01em] text-base-content">
                        {title}
                    </h3>

                    {description && (
                        <p className="mt-1 text-xs leading-relaxed text-ink-soft md:text-sm">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {action}
        </div>

        <div className={bodyClassName}>{children}</div>
    </section>
);

export const EmptyState = ({
    icon = Inbox,
    title,
    description,
    action,
    className = "",
}) => {
    const Icon = icon;

    return (
        <div
            className={[
                "grid place-items-center rounded-2xl border border-dashed border-base-300 bg-base-200/30 px-5 py-10 text-center",
                className,
            ].join(" ")}
        >
            <div>
                <span className="mx-auto grid size-11 place-items-center rounded-2xl bg-citron/35 text-primary">
                    <Icon
                        className="size-5"
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </span>

                <p className="mt-3 text-base font-semibold text-base-content">
                    {title}
                </p>

                {description && (
                    <p className="mx-auto mt-1 max-w-xs text-sm leading-relaxed text-ink-soft">
                        {description}
                    </p>
                )}

                {action && <div className="mt-4">{action}</div>}
            </div>
        </div>
    );
};

export const ChartTooltip = ({
    active,
    payload,
    label,
    valueFormatter,
    titleFormatter,
}) => {
    if (!active || !payload?.length) return null;

    const point = payload[0]?.payload ?? {};
    const title = titleFormatter ? titleFormatter(point, label) : label;

    return (
        <div className="min-w-36 rounded-xl border border-base-300/80 bg-base-100/95 px-3.5 py-2.5 shadow-card backdrop-blur">
            {title && (
                <p className="text-xs font-semibold text-base-content">
                    {title}
                </p>
            )}

            <div className="mt-1.5 space-y-1">
                {payload.map((entry) => (
                    <p
                        key={entry.dataKey ?? entry.name}
                        className="flex items-center gap-2 text-xs text-ink-soft"
                    >
                        <span
                            className="size-2 shrink-0 rounded-full"
                            style={{
                                backgroundColor:
                                    entry.color ??
                                    entry.payload?.color ??
                                    entry.payload?.fill ??
                                    chartColors.forest,
                            }}
                        />

                        <span>{entry.name}</span>

                        <span className="ml-auto font-semibold text-base-content">
                            {valueFormatter
                                ? valueFormatter(entry.value)
                                : entry.value}
                        </span>
                    </p>
                ))}
            </div>
        </div>
    );
};

export const DashboardSkeleton = () => (
    <div className="space-y-6 md:space-y-8" role="status" aria-busy="true">
        <span className="sr-only">Loading dashboard</span>

        <div className="space-y-2">
            <Skeleton rounded="rounded-full" className="h-4 w-24" />
            <Skeleton rounded="rounded-full" className="h-8 w-64 max-w-full" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                    key={index}
                    rounded="rounded-[1.5rem]"
                    className="h-32"
                />
            ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
            <Skeleton
                rounded="rounded-[1.5rem]"
                className="h-72 lg:col-span-2"
            />
            <Skeleton rounded="rounded-[1.5rem]" className="h-72" />
        </div>
    </div>
);

export const DashboardError = ({
    title = "We couldn't load this dashboard",
    description = "Please check your connection and try again.",
    onRetry,
}) => (
    <div className="grid place-items-center rounded-[1.5rem] border border-dashed border-error/25 bg-error/[0.03] px-6 py-16 text-center">
        <div>
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-error/10 text-error">
                <RotateCcw
                    className="size-6"
                    strokeWidth={1.8}
                    aria-hidden="true"
                />
            </span>

            <p className="mt-4 text-xl font-semibold text-base-content">
                {title}
            </p>

            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
                {description}
            </p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-2 text-xs font-semibold text-primary transition-colors duration-200 hover:bg-primary/10"
                >
                    <RotateCcw
                        className="size-3.5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    Try again
                </button>
            )}
        </div>
    </div>
);
