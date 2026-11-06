import { CircleAlert } from "lucide-react";

export const FormField = ({
    label,
    icon,
    required = false,
    error,
    hint,
    htmlFor,
    children,
    className = "",
}) => {
    const Icon = icon;

    return (
        <div className={className}>
            <label
                htmlFor={htmlFor}
                className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft"
            >
                {Icon && (
                    <Icon
                        className="size-3.5 shrink-0 text-primary/70"
                        strokeWidth={1.9}
                        aria-hidden="true"
                    />
                )}

                <span>{label}</span>

                {required && (
                    <span className="text-error" aria-hidden="true">
                        *
                    </span>
                )}
            </label>

            <div className="mt-2">{children}</div>

            {error ? (
                <p className="mt-1.5 flex items-start gap-1 text-xs font-medium text-error">
                    <CircleAlert
                        className="mt-0.5 size-3 shrink-0"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    {error}
                </p>
            ) : (
                hint && <p className="mt-1.5 text-xs text-ink-soft/70">{hint}</p>
            )}
        </div>
    );
};

export const FormSection = ({
    icon,
    title,
    description,
    children,
    className = "",
}) => {
    const Icon = icon;

    return (
        <section
            className={[
                "rounded-[1.5rem] border border-base-300/70 bg-base-100 p-5 shadow-[0_1px_2px_rgba(18,35,28,0.04)] md:p-6",
                className,
            ].join(" ")}
        >
            <div className="flex items-start gap-3 border-b border-base-300/60 pb-4">
                {Icon && (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-citron/35 text-primary">
                        <Icon
                            className="size-4"
                            strokeWidth={1.9}
                            aria-hidden="true"
                        />
                    </span>
                )}

                <div className="min-w-0">
                    <h2 className="text-base font-semibold tracking-[-0.01em] text-base-content">
                        {title}
                    </h2>

                    {description && (
                        <p className="mt-1 text-xs leading-relaxed text-ink-soft md:text-sm">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            <div className="mt-5">{children}</div>
        </section>
    );
};
