import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useQuery } from "@tanstack/react-query";
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
    Mail,
    PackageX,
    Plus,
    RotateCcw,
    ShieldCheck,
    Store,
    Trash2,
    UserRound,
} from "lucide-react";
import { toast } from "sonner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading, { Spinner } from "../../../Shared/Loading/Loading";
import {
    StatusPill,
    TablePageHeader,
} from "../../../Shared/DashboardComponent/DataTable";
import { FormField, FormSection } from "../../../Shared/FormComponent/FormUI";
import {
    fieldClass,
    readOnlyClass,
    textareaClass,
    withFieldError,
} from "../../../Shared/FormComponent/formStyles";

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

const toDateObject = (value) => {
    if (value instanceof Date) return value;

    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? new Date() : date;
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

const getProductValues = (product, user) => {
    const entries = Array.isArray(product.prices) ? product.prices : [];

    return {
        vendorEmail: product.vendorEmail || user?.email || "",
        vendorName: product.vendorName || user?.displayName || "",
        marketName: product.marketName || "",
        date: toDateObject(product.date),
        marketDescription: product.marketDescription || "",
        itemName: product.itemName || "",
        status: product.status || "pending",
        imageUrl: product.imageUrl || "",
        pricePerUnit: product.pricePerUnit || "",
        stock: product.stock ?? "",
        prices:
            entries.length > 0
                ? entries.map(({ date, price }) => ({
                      date: toDateOnly(date),
                      price: price ?? "",
                  }))
                : [{ date: toDateOnly(new Date()), price: "" }],
        itemDescription: product.itemDescription || "",
    };
};

const UpdateProduct = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const navigate = useNavigate();

    const vendorEmail = user?.email || "";
    const vendorName = user?.displayName || "";

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

    const {
        data: productData,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ["product", id],
        enabled: Boolean(id),
        refetchOnWindowFocus: false,
        queryFn: async () => {
            const res = await axiosSecure.get(`/product/${id}`);
            return res.data;
        },
    });

    const product = productData?.product;

    useEffect(() => {
        if (product) {
            reset(
                getProductValues(product, {
                    email: vendorEmail,
                    displayName: vendorName,
                }),
            );
        }
    }, [product, reset, vendorEmail, vendorName]);

    const status = watch("status") || "pending";
    const itemName = watch("itemName");
    const marketName = watch("marketName");
    const imageUrl = watch("imageUrl");
    const pricePerUnit = watch("pricePerUnit");
    const stock = watch("stock");
    const selectedDate = watch("date");

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            date: toDateOnly(data.date),
            prices: data.prices.map(({ date, price }) => ({
                date: toDateOnly(date),
                price,
            })),
        };

        try {
            const res = await axiosSecure.put(`/products/${id}`, payload);

            if (res.data.success) {
                toast.success("Product updated successfully!");
                navigate("/dashboard/my-products");
            } else {
                toast.info(
                    "Product found, but no changes were applied (or identical data submitted).",
                );
            }
        } catch (err) {
            console.error("Error updating product:", err);
            toast.error(
                err.response?.data?.error ||
                    "Something went wrong while updating.",
            );
        }
    };

    const handleReset = () => {
        reset(
            product
                ? getProductValues(product, {
                      email: vendorEmail,
                      displayName: vendorName,
                  })
                : getDefaultValues(user),
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6 md:space-y-8">
                <TablePageHeader
                    title="Update product"
                    description="Refine the listing details, keep pricing current, and publish the changes shoppers will see."
                />

                <Loading
                    variant="section"
                    size="md"
                    message="Loading product details"
                    description="Fetching the latest listing information."
                    className="min-h-[22rem] rounded-[1.5rem] border border-base-300/60 bg-base-100"
                />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6 md:space-y-8">
                <TablePageHeader
                    title="Update product"
                    description="Refine the listing details, keep pricing current, and publish the changes shoppers will see."
                />

                <div className="grid place-items-center rounded-[1.5rem] border border-dashed border-base-300 bg-base-100 px-6 py-16 text-center">
                    <div>
                        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-error/10 text-error">
                            <PackageX
                                className="size-6"
                                strokeWidth={1.8}
                                aria-hidden="true"
                            />
                        </span>

                        <p className="mt-4 text-xl font-semibold tracking-[-0.01em] text-base-content">
                            We couldn&apos;t load this listing
                        </p>

                        <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
                            The product may have been removed, or the
                            connection dropped. Try again, or head back to your
                            products.
                        </p>

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() => refetch()}
                                disabled={isFetching}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content transition-colors duration-200 hover:bg-forest-soft disabled:pointer-events-none disabled:opacity-60"
                            >
                                {isFetching ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <RotateCcw
                                        className="size-4"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                )}
                                Try again
                            </button>

                            <Link
                                to="/dashboard/my-products"
                                className="inline-flex items-center justify-center rounded-full border border-base-300 bg-base-100 px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:border-primary/25 hover:text-primary"
                            >
                                Back to my products
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                title={
                    <>
                        Update{" "}
                        <em className="italic text-primary">product.</em>
                    </>
                }
                description="Refine the listing details, keep pricing current, and publish the changes shoppers will see."
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-citron/60 bg-citron/25 px-3.5 py-2 text-xs font-semibold capitalize text-forest">
                    <ShieldCheck
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    {status}
                </span>

                <Link
                    to="/dashboard/my-products"
                    className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-xs font-semibold text-ink-soft transition-colors duration-200 hover:border-primary/25 hover:text-primary"
                >
                    My products
                    <ArrowUpRight
                        className="size-3.5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                </Link>
            </TablePageHeader>

            <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
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
                                hint="Shown on the listing — e.g. ৳30/kg."
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
                                htmlFor="listingDate"
                            >
                                <DatePicker
                                    id="listingDate"
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
                        description="Keep a dated price point so shoppers can track how the price changes."
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
                                                label="Price (৳)"
                                                icon={CircleDollarSign}
                                                htmlFor={`price-value-${index}`}
                                                error={priceError}
                                            >
                                                <div
                                                    className={[
                                                        "flex items-stretch overflow-hidden rounded-xl border bg-base-100 transition-colors duration-200 focus-within:ring-2",
                                                        priceError
                                                            ? "border-error/40 focus-within:border-error/60 focus-within:ring-error/15"
                                                            : "border-base-300 focus-within:border-primary/40 focus-within:ring-primary/15",
                                                    ].join(" ")}
                                                >
                                                    <span className="flex items-center border-r border-base-300/70 bg-base-200/40 px-3 text-sm font-semibold text-ink-soft/70">
                                                        ৳
                                                    </span>

                                                    <input
                                                        id={`price-value-${index}`}
                                                        type="number"
                                                        inputMode="decimal"
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
                                                        className="w-full border-0 bg-transparent px-3.5 py-2.5 text-sm text-base-content placeholder:text-ink-soft/45 focus:outline-none"
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
                    <section className="overflow-hidden rounded-[1.5rem] border border-base-300/70 bg-base-100 shadow-[0_1px_2px_rgba(18,35,28,0.04)]">
                        <div className="flex items-center justify-between gap-3 border-b border-base-300/60 bg-base-200/30 px-5 py-4">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-soft/60">
                                Live preview
                            </p>

                            <StatusPill status={status} />
                        </div>

                        <div className="p-5">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={
                                        itemName
                                            ? `${itemName} preview`
                                            : "Product preview"
                                    }
                                    className="h-40 w-full rounded-2xl border border-base-300/60 object-cover"
                                />
                            ) : (
                                <div className="grid h-40 w-full place-items-center rounded-2xl border border-dashed border-base-300 bg-base-200/30 text-center">
                                    <div>
                                        <Image
                                            className="mx-auto size-6 text-primary/50"
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                        <p className="mt-2 text-xs font-semibold text-ink-soft/70">
                                            Add an image URL
                                        </p>
                                    </div>
                                </div>
                            )}

                            <p className="mt-4 truncate text-lg font-semibold tracking-[-0.01em] text-base-content">
                                {itemName?.trim() || "Untitled item"}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-soft">
                                <Store
                                    className="size-3.5 shrink-0 text-primary/60"
                                    strokeWidth={1.9}
                                    aria-hidden="true"
                                />
                                {marketName?.trim() || "Market not set"}
                            </p>

                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                                    <CircleDollarSign
                                        className="size-3.5 text-primary/70"
                                        strokeWidth={1.9}
                                        aria-hidden="true"
                                    />
                                    {pricePerUnit?.trim() ||
                                        "No display price"}
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                                    <Boxes
                                        className="size-3.5 text-primary/70"
                                        strokeWidth={1.9}
                                        aria-hidden="true"
                                    />
                                    {stock === "" ||
                                    stock === undefined ||
                                    stock === null
                                        ? "Stock not set"
                                        : Number(stock) <= 0
                                          ? "Out of stock"
                                          : `${stock} in stock`}
                                </span>

                                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-2.5 py-1 text-[11px] font-semibold text-ink-soft">
                                    <History
                                        className="size-3.5 text-primary/70"
                                        strokeWidth={1.9}
                                        aria-hidden="true"
                                    />
                                    {fields.length} price{" "}
                                    {fields.length === 1 ? "entry" : "entries"}
                                </span>
                            </div>
                        </div>
                    </section>

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

                    <FormSection
                        icon={ShieldCheck}
                        title="Publish changes"
                        description="Save your edits to keep this listing accurate for shoppers."
                    >
                        <input type="hidden" {...register("status")} />

                        <div className="rounded-2xl border border-base-300/60 bg-base-200/30 p-3.5">
                            <div className="flex items-center justify-between gap-3">
                                <span className="text-xs font-semibold text-ink-soft">
                                    Listing status
                                </span>

                                <StatusPill status={status} />
                            </div>

                            <p className="mt-2 text-xs leading-relaxed text-ink-soft/80">
                                Approved listings go live immediately. Pending
                                listings are reviewed by an admin.
                            </p>
                        </div>

                        <div className="mt-4 space-y-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-content transition-colors duration-200 hover:bg-forest-soft disabled:pointer-events-none disabled:opacity-60"
                            >
                                {isSubmitting ? (
                                    <Spinner size="sm" />
                                ) : (
                                    <Check
                                        className="size-4"
                                        strokeWidth={2.2}
                                        aria-hidden="true"
                                    />
                                )}
                                {isSubmitting
                                    ? "Saving changes…"
                                    : "Save changes"}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                disabled={isSubmitting}
                                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-base-300 bg-base-100 px-4 py-2.5 text-sm font-semibold text-ink-soft transition-colors duration-200 hover:border-primary/25 hover:text-primary disabled:pointer-events-none disabled:opacity-50"
                            >
                                <RotateCcw
                                    className="size-4"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                                Reset changes
                            </button>
                        </div>
                    </FormSection>
                </aside>
            </form>
        </div>
    );
};

export default UpdateProduct;
