import { useFieldArray, useForm } from "react-hook-form";
import { Link } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    ArrowUpRight,
    Boxes,
    CalendarDays,
    Check,
    CircleDollarSign,
    FileText,
    History,
    Image,
    Leaf,
    Loader2,
    Mail,
    PackagePlus,
    Plus,
    ShieldCheck,
    Store,
    Trash2,
    UserRound,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "sonner";
import { TablePageHeader } from "../../Shared/DashboardComponent/DataTable";
import { FormField, FormSection } from "../../Shared/FormComponent/FormUI";
import {
    fieldClass,
    readOnlyClass,
    textareaClass,
    withFieldError,
} from "../../Shared/FormComponent/formStyles";

const toDateOnly = (value) => {
    if (!value) return "";

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const getDefaultValues = (user) => ({
    vendorEmail: user?.email || "",
    vendorName: user?.displayName || "",
    marketName: "",
    date: new Date(),
    marketDescription: "",
    itemName: "",
    status: "pending",
    imageUrl: "",
    pricePerUnit: "",
    stock: "",
    prices: [{ date: toDateOnly(new Date()), price: "" }],
    itemDescription: "",
});

const AddProduct = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: getDefaultValues(user),
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "prices",
    });

    const selectedDate = watch("date");

    const onSubmit = async (data) => {
        try {
            const payload = {
                ...data,
                date: toDateOnly(data.date),
                prices: data.prices.map(({ date, price }) => ({
                    date: toDateOnly(date),
                    price,
                })),
            };

            const res = await axiosSecure.post("/products", payload);

            if (res.data.insertedId) {
                toast.success("Product added successfully!");
                reset(getDefaultValues(user));
            } else {
                toast.error("Submission failed. Please try again.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error(
                err.response?.data?.message ||
                    "Something went wrong while submitting.",
            );
        }
    };

    const handleReset = () => reset(getDefaultValues(user));

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                eyebrow="Vendor catalogue"
                icon={PackagePlus}
                title={
                    <>
                        Add a{" "}
                        <em className="italic text-primary">product.</em>
                    </>
                }
                description="Create a listing with market details, unit pricing, and a full price history so shoppers can compare."
            >
                <Link
                    to="/dashboard/my-products"
                    className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-xs font-semibold text-ink-soft transition-colors duration-200 hover:border-primary/25 hover:text-primary"
                >
                    View my products
                    <ArrowUpRight
                        className="size-3.5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </Link>
            </TablePageHeader>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
            >
                <div className="space-y-4 md:space-y-5">
                    <FormSection
                        icon={Leaf}
                        title="Item details"
                        description="The product shoppers will see in the marketplace."
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                label="Item name"
                                icon={Leaf}
                                required
                                htmlFor="itemName"
                                error={errors.itemName?.message}
                            >
                                <input
                                    id="itemName"
                                    type="text"
                                    placeholder="e.g. Fresh tomatoes"
                                    {...register("itemName", {
                                        required: "Item name is required.",
                                    })}
                                    className={withFieldError(
                                        fieldClass,
                                        errors.itemName,
                                    )}
                                />
                            </FormField>

                            <FormField
                                label="Price per unit"
                                icon={CircleDollarSign}
                                htmlFor="pricePerUnit"
                                hint="A display price such as ৳30/kg."
                            >
                                <input
                                    id="pricePerUnit"
                                    type="text"
                                    placeholder="e.g. ৳30/kg"
                                    {...register("pricePerUnit")}
                                    className={fieldClass}
                                />
                            </FormField>

                            <FormField
                                label="Stock quantity"
                                icon={Boxes}
                                required
                                htmlFor="stock"
                                hint="Units available for purchase. Set to 0 to mark the item out of stock."
                                error={errors.stock?.message}
                            >
                                <input
                                    id="stock"
                                    type="number"
                                    min="0"
                                    step="1"
                                    placeholder="e.g. 25"
                                    {...register("stock", {
                                        required: "Stock quantity is required.",
                                        setValueAs: (value) =>
                                            value === "" ? "" : Number(value),
                                        min: {
                                            value: 0,
                                            message:
                                                "Stock cannot be negative.",
                                        },
                                        validate: (value) =>
                                            value === "" ||
                                            Number.isInteger(value) ||
                                            "Stock must be a whole number.",
                                    })}
                                    className={withFieldError(
                                        fieldClass,
                                        errors.stock,
                                    )}
                                />
                            </FormField>

                            <FormField
                                label="Product image URL"
                                icon={Image}
                                htmlFor="imageUrl"
                                className="md:col-span-2"
                                hint="Paste a direct link to a clear product photo."
                            >
                                <input
                                    id="imageUrl"
                                    type="text"
                                    inputMode="url"
                                    placeholder="https://…"
                                    {...register("imageUrl")}
                                    className={fieldClass}
                                />
                            </FormField>

                            <FormField
                                label="Item description"
                                icon={FileText}
                                htmlFor="itemDescription"
                                className="md:col-span-2"
                            >
                                <textarea
                                    id="itemDescription"
                                    rows={4}
                                    placeholder="Describe the product, its quality, and what makes it worth buying."
                                    {...register("itemDescription")}
                                    className={textareaClass}
                                />
                            </FormField>
                        </div>
                    </FormSection>

                    <FormSection
                        icon={Store}
                        title="Market details"
                        description="Where this product comes from and when it was listed."
                    >
                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField
                                label="Market name"
                                icon={Store}
                                required
                                htmlFor="marketName"
                                error={errors.marketName?.message}
                            >
                                <input
                                    id="marketName"
                                    type="text"
                                    placeholder="e.g. Karwan Bazar"
                                    {...register("marketName", {
                                        required: "Market name is required.",
                                    })}
                                    className={withFieldError(
                                        fieldClass,
                                        errors.marketName,
                                    )}
                                />
                            </FormField>

                            <FormField
                                label="Listing date"
                                icon={CalendarDays}
                                htmlFor="marketDate"
                            >
                                <DatePicker
                                    id="marketDate"
                                    selected={selectedDate}
                                    onChange={(date) => {
                                        if (date) {
                                            setValue("date", date, {
                                                shouldDirty: true,
                                            });
                                        }
                                    }}
                                    dateFormat="dd MMM yyyy"
                                    placeholderText="Select a date"
                                    wrapperClassName="w-full"
                                    className={fieldClass}
                                    aria-label="Listing date"
                                />
                            </FormField>

                            <FormField
                                label="Market description"
                                icon={FileText}
                                htmlFor="marketDescription"
                                className="md:col-span-2"
                            >
                                <textarea
                                    id="marketDescription"
                                    rows={3}
                                    placeholder="Tell shoppers about the market, its location, and what it is known for."
                                    {...register("marketDescription")}
                                    className={textareaClass}
                                />
                            </FormField>
                        </div>
                    </FormSection>

                    <FormSection
                        icon={History}
                        title="Price history"
                        description="Add a dated price point so shoppers can track how the price changes."
                    >
                        <div className="space-y-3">
                            {fields.map((field, index) => {
                                const priceError =
                                    errors.prices?.[index]?.price?.message;
                                const dateError =
                                    errors.prices?.[index]?.date?.message;

                                return (
                                    <div
                                        key={field.id}
                                        className="rounded-2xl border border-base-300/60 bg-base-200/20 p-3.5 md:p-4"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ink-soft/60">
                                                Entry {index + 1}
                                            </p>

                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                disabled={fields.length === 1}
                                                className="inline-flex items-center gap-1 rounded-full border border-error/20 bg-error/[0.04] px-2.5 py-1.5 text-xs font-semibold text-error transition-colors duration-200 hover:bg-error/10 disabled:pointer-events-none disabled:opacity-40"
                                            >
                                                <Trash2
                                                    className="size-3.5"
                                                    strokeWidth={2}
                                                    aria-hidden="true"
                                                />
                                                <span className="hidden md:inline">
                                                    Remove
                                                </span>
                                            </button>
                                        </div>

                                        <div className="mt-3 grid gap-3 md:grid-cols-2">
                                            <FormField
                                                label="Date"
                                                icon={CalendarDays}
                                                htmlFor={`price-date-${index}`}
                                                error={dateError}
                                            >
                                                <input
                                                    id={`price-date-${index}`}
                                                    type="date"
                                                    {...register(
                                                        `prices.${index}.date`,
                                                        {
                                                            required:
                                                                "Date is required.",
                                                        },
                                                    )}
                                                    className={withFieldError(
                                                        fieldClass,
                                                        dateError,
                                                    )}
                                                />
                                            </FormField>

                                            <FormField
                                                label="Price"
                                                icon={CircleDollarSign}
                                                htmlFor={`price-value-${index}`}
                                                error={priceError}
                                            >
                                                <div className="relative">
                                                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-ink-soft/60">
                                                        ৳
                                                    </span>

                                                    <input
                                                        id={`price-value-${index}`}
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        placeholder="0.00"
                                                        {...register(
                                                            `prices.${index}.price`,
                                                            {
                                                                required:
                                                                    "Price is required.",
                                                                min: {
                                                                    value: 0,
                                                                    message:
                                                                        "Price cannot be negative.",
                                                                },
                                                            },
                                                        )}
                                                        className={withFieldError(
                                                            `${fieldClass} pl-8`,
                                                            priceError,
                                                        )}
                                                    />
                                                </div>
                                            </FormField>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                append({
                                    date: toDateOnly(new Date()),
                                    price: "",
                                })
                            }
                            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-primary/20 bg-primary/[0.04] px-4 py-2.5 text-sm font-semibold text-primary transition-colors duration-200 hover:bg-primary/10 md:w-auto"
                        >
                            <Plus
                                className="size-4"
                                strokeWidth={2.2}
                                aria-hidden="true"
                            />
                            Add price entry
                        </button>
                    </FormSection>
                </div>

                <aside className="space-y-4 md:space-y-5 lg:sticky lg:top-24">
                    <FormSection
                        icon={UserRound}
                        title="Vendor details"
                        description="This is how your store is identified on the listing."
                    >
                        <div className="space-y-4">
                            <FormField
                                label="Vendor name"
                                icon={UserRound}
                                htmlFor="vendorName"
                            >
                                <input
                                    id="vendorName"
                                    type="text"
                                    placeholder="Your store name"
                                    {...register("vendorName")}
                                    className={fieldClass}
                                />
                            </FormField>

                            <FormField
                                label="Vendor email"
                                icon={Mail}
                                htmlFor="vendorEmail"
                                hint="Locked to the account you are signed in with."
                            >
                                <input
                                    id="vendorEmail"
                                    type="email"
                                    readOnly
                                    {...register("vendorEmail")}
                                    className={readOnlyClass}
                                />
                            </FormField>
                        </div>
                    </FormSection>

                    <section className="rounded-[1.5rem] border border-base-300/70 bg-base-100 p-5 shadow-[0_1px_2px_rgba(18,35,28,0.04)] md:p-6">
                        <div className="flex items-start gap-3">
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-citron/40 text-forest">
                                <ShieldCheck
                                    className="size-5"
                                    strokeWidth={1.9}
                                    aria-hidden="true"
                                />
                            </span>

                            <div>
                                <p className="text-sm font-semibold text-base-content">
                                    Ready for review
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                                    New listings stay pending until an admin
                                    approves them.
                                </p>
                            </div>
                        </div>

                        <input type="hidden" {...register("status")} />

                        <div className="mt-5 space-y-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content transition-colors duration-200 hover:bg-forest-soft disabled:pointer-events-none disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <Loader2
                                        className="size-4 animate-spin"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <Check
                                        className="size-4"
                                        strokeWidth={2.2}
                                        aria-hidden="true"
                                    />
                                )}
                                {isSubmitting
                                    ? "Submitting…"
                                    : "Submit product"}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isSubmitting}
                                className="inline-flex w-full items-center justify-center rounded-full border border-base-300 bg-base-100 px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:border-primary/25 hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                            >
                                Reset form
                            </button>
                        </div>
                    </section>
                </aside>
            </form>
        </div>
    );
};

export default AddProduct;
