const controlBase =
    "w-full rounded-xl border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm text-base-content shadow-[0_1px_1px_rgba(18,35,28,0.02)] transition-colors duration-200 placeholder:text-ink-soft/45 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-base-200/60 disabled:text-ink-soft";

export const fieldClass = controlBase;

export const textareaClass = `${controlBase} min-h-24 resize-y`;

export const readOnlyClass = `${controlBase} cursor-not-allowed bg-base-200/50 text-ink-soft focus:border-base-300 focus:ring-0`;

export const fieldErrorClass =
    "border-error/40 focus:border-error/60 focus:ring-error/15";

export const withFieldError = (base, hasError) =>
    [base, hasError ? fieldErrorClass : ""].join(" ").trim();
