import { Link } from "react-router";
import {
    ChevronLeft,
    ChevronRight,
    Inbox,
    Sparkles,
} from "lucide-react";

const shellClass =
    "overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100 shadow-[0_1px_2px_rgba(18,35,28,0.04)]";

const actionTones = {
    primary:
        "border-primary/20 bg-primary/[0.06] text-primary hover:bg-primary/10",
    success:
        "border-primary/20 bg-primary/[0.06] text-primary hover:bg-primary/10",
    warning:
        "border-citron/60 bg-citron/30 text-forest hover:bg-citron/45",
    danger: "border-error/20 bg-error/[0.06] text-error hover:bg-error/10",
    neutral:
        "border-base-300 bg-base-100 text-ink-soft hover:border-primary/25 hover:text-primary",
};

const statusTones = {
    approved: "border-primary/20 bg-primary/10 text-primary",
    active: "border-primary/20 bg-primary/10 text-primary",
    pending: "border-citron/60 bg-citron/40 text-forest",
    rejected: "border-error/20 bg-error/10 text-error",
    admin: "border-primary/20 bg-primary/10 text-primary",
    vendor: "border-accent/25 bg-accent/10 text-accent",
    user: "border-base-300 bg-base-200 text-ink-soft",
};

const actionClass = (tone, className) =>
    [
        "inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition-colors duration-200 disabled:pointer-events-none disabled:opacity-40",
        actionTones[tone] ?? actionTones.neutral,
        className,
    ].join(" ");

export const TablePageHeader = ({
    eyebrow = "Dashboard",
    title,
    description,
    icon = Sparkles,
    children,
    className = "",
}) => {
    const Icon = icon;

    return (
        <header
            className={[
                "flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-8",
                className,
            ].join(" ")}
        >
            <div className="max-w-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-primary/70">
                    <Icon
                        className="size-3"
                        strokeWidth={2.2}
                        aria-hidden="true"
                    />
                    {eyebrow}
                </span>

                <h2 className="mt-4 font-display text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-base-content md:text-3xl lg:text-4xl">
                    {title}
                </h2>

                {description && (
                    <p className="mt-2.5 max-w-lg text-sm leading-relaxed text-ink-soft md:text-[15px]">
                        {description}
                    </p>
                )}
            </div>

            {children && (
                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    {children}
                </div>
            )}
        </header>
    );
};

export const TableShell = ({ children, className = "" }) => (
    <div className={[shellClass, className].join(" ")}>{children}</div>
);

export const DataTable = ({
    children,
    label,
    minWidthClass = "md:min-w-[46rem]",
    className = "",
}) => (
    <div className="overflow-x-auto p-3 md:p-0">
        <table
            aria-label={label}
            className={[
                "w-full border-collapse text-left text-[13px] text-base-content md:text-sm",
                minWidthClass,
                className,
            ].join(" ")}
        >
            {children}
        </table>
    </div>
);

export const DataTableHead = ({ children, className = "" }) => (
    <thead className="hidden md:table-header-group">
        <tr
            className={[
                "border-b border-base-300/70 bg-base-200/50",
                className,
            ].join(" ")}
        >
            {children}
        </tr>
    </thead>
);

export const DataTableHeader = ({ children, className = "" }) => (
    <th
        scope="col"
        className={[
            "whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ink-soft/60 first:pl-5 last:pr-5",
            className,
        ].join(" ")}
    >
        {children}
    </th>
);

export const DataTableBody = ({ children }) => (
    <tbody className="block md:table-row-group">{children}</tbody>
);

export const DataTableRow = ({ children, className = "" }) => (
    <tr
        className={[
            "mb-3 grid gap-2 rounded-2xl border border-base-300/70 bg-base-100 p-4 last:mb-0 md:mb-0 md:table-row md:rounded-none md:border-0 md:border-b md:border-base-300/60 md:p-0 md:transition-colors md:duration-200 md:last:border-0 md:hover:bg-base-200/40",
            className,
        ].join(" ")}
    >
        {children}
    </tr>
);

export const DataTableCell = ({
    label,
    children,
    emphasis = false,
    align = "start",
    className = "",
}) => (
    <td
        className={[
            "block border-0 px-0 py-1.5 align-middle md:table-cell md:px-4 md:py-3.5 md:first:pl-5 md:last:pr-5",
            className,
        ].join(" ")}
    >
        {label && (
            <span className="block text-[9.5px] font-bold uppercase tracking-[0.14em] text-ink-soft/45 md:hidden">
                {label}
            </span>
        )}

        <div
            className={[
                "mt-0.5 min-w-0 md:mt-0",
                emphasis ? "font-semibold text-base-content" : "text-ink-soft",
                align === "center"
                    ? "md:text-center"
                    : align === "end"
                      ? "md:text-right"
                      : "md:text-left",
            ].join(" ")}
        >
            {children}
        </div>
    </td>
);

export const StatusPill = ({ status, label, title, className = "" }) => {
    const value = String(status ?? "").toLowerCase();

    return (
        <span
            title={title}
            className={[
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold capitalize tracking-[0.08em]",
                statusTones[value] ?? statusTones.user,
                className,
            ].join(" ")}
        >
            <span
                aria-hidden="true"
                className="size-1.5 rounded-full bg-current"
            />
            {label ?? (status || "Unknown")}
        </span>
    );
};

export const TableAction = ({
    children,
    icon,
    tone = "neutral",
    className = "",
    type = "button",
    ...props
}) => {
    const Icon = icon;

    return (
        <button
            type={type}
            className={actionClass(tone, className)}
            {...props}
        >
            {Icon && (
                <Icon
                    className="size-3.5 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                />
            )}
            {children && <span>{children}</span>}
        </button>
    );
};

export const TableLink = ({
    to,
    children,
    icon,
    tone = "primary",
    className = "",
}) => {
    const Icon = icon;

    return (
        <Link to={to} className={actionClass(tone, className)}>
            {Icon && (
                <Icon
                    className="size-3.5 shrink-0"
                    strokeWidth={2}
                    aria-hidden="true"
                />
            )}
            {children && <span>{children}</span>}
        </Link>
    );
};

export const TableEmpty = ({
    icon = Inbox,
    title = "Nothing here yet",
    description,
    action,
    className = "",
}) => {
    const Icon = icon;

    return (
        <TableShell
            className={[
                "border-dashed bg-base-200/40 shadow-none",
                className,
            ].join(" ")}
        >
            <div className="grid place-items-center px-6 py-12 text-center md:py-16">
                <div>
                    <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-citron/40 text-primary">
                        <Icon
                            className="size-6"
                            strokeWidth={1.8}
                            aria-hidden="true"
                        />
                    </span>

                    <p className="mt-4 font-display text-xl font-semibold text-base-content">
                        {title}
                    </p>

                    {description && (
                        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
                            {description}
                        </p>
                    )}

                    {action && (
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                            {action}
                        </div>
                    )}
                </div>
            </div>
        </TableShell>
    );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
    <TableShell>
        <div role="status" aria-busy="true" className="p-3 md:p-0">
            <span className="sr-only">Loading table data</span>

            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div
                    key={rowIndex}
                    className="mb-3 rounded-2xl border border-base-300/60 p-4 last:mb-0 md:mb-0 md:flex md:items-center md:gap-4 md:rounded-none md:border-0 md:border-b md:border-base-300/50 md:px-5 md:py-4"
                >
                    {Array.from({ length: columns }).map((__, columnIndex) => (
                        <span
                            key={columnIndex}
                            className={[
                                "mb-2 block h-3 animate-pulse rounded-full bg-base-200 md:mb-0",
                                columnIndex === 0
                                    ? "w-2/3 md:w-1/4"
                                    : "w-1/2 md:flex-1",
                                columnIndex === columns - 1
                                    ? "last:mb-0"
                                    : "",
                            ].join(" ")}
                        />
                    ))}
                </div>
            ))}
        </div>
    </TableShell>
);

export const TablePagination = ({
    page,
    totalPages,
    onChange,
    className = "",
}) => {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <nav
            aria-label="Table pagination"
            className={[
                "mt-5 flex items-center justify-center gap-2 md:mt-6",
                className,
            ].join(" ")}
        >
            <button
                type="button"
                onClick={() => onChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-3.5 py-2 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:border-primary/25 hover:text-primary disabled:pointer-events-none disabled:opacity-40 md:px-4"
            >
                <ChevronLeft
                    className="size-4"
                    strokeWidth={2}
                    aria-hidden="true"
                />
                Prev
            </button>

            <span className="px-1 text-[12px] font-semibold text-ink-soft">
                Page {page} of {totalPages}
            </span>

            <button
                type="button"
                onClick={() => onChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-3.5 py-2 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:border-primary/25 hover:text-primary disabled:pointer-events-none disabled:opacity-40 md:px-4"
            >
                Next
                <ChevronRight
                    className="size-4"
                    strokeWidth={2}
                    aria-hidden="true"
                />
            </button>
        </nav>
    );
};
