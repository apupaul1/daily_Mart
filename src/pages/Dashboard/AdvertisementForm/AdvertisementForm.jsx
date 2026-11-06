import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import {
    Check,
    CircleAlert,
    FileText,
    ImagePlus,
    Loader2,
    Megaphone,
    ShieldCheck,
    UploadCloud,
} from "lucide-react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { toast } from "sonner";
import { TablePageHeader } from "../../../Shared/DashboardComponent/DataTable";
import { FormField, FormSection } from "../../../Shared/FormComponent/FormUI";
import {
    fieldClass,
    textareaClass,
    withFieldError,
} from "../../../Shared/FormComponent/formStyles";

const MAX_BANNER_SIZE = 5 * 1024 * 1024;

const AdvertisementForm = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const fileInputRef = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: {
            status: "pending",
        },
    });

    const [bannerImage, setBannerImage] = useState("");
    const [uploading, setUploading] = useState(false);
    const [bannerError, setBannerError] = useState("");

    const handleBannerUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setBannerError("");

        if (!file.type.startsWith("image/")) {
            toast.error("Please choose an image file.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_BANNER_SIZE) {
            toast.error("Banner must be 5 MB or smaller.");
            event.target.value = "";
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`,
                formData,
            );

            const url = res.data?.data?.url;

            if (!url) {
                throw new Error("Upload did not return an image URL.");
            }

            setBannerImage(url);
        } catch (error) {
            console.error("Banner upload error:", error);
            setBannerImage("");
            setBannerError("We couldn't upload this image. Please try again.");
            toast.error("Failed to upload the banner.");
            event.target.value = "";
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!bannerImage) {
            setBannerError("Upload a promotional banner before submitting.");
            toast.error("Please upload a promotional banner.");
            return;
        }

        try {
            const adData = {
                ...data,
                banner: bannerImage,
                name: user?.displayName || user?.email || "",
                email: user?.email || "",
            };

            const res = await axiosSecure.post("/ads", adData);

            if (res.data.insertedId) {
                toast.success("Advertisement submitted successfully!");
                reset();
                setBannerImage("");
                setBannerError("");

                if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                }
            } else {
                toast.error("Submission failed. Please try again.");
            }
        } catch (err) {
            console.error("Submit error:", err);
            toast.error("Something went wrong while submitting.");
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                eyebrow="Promotions"
                icon={Megaphone}
                title={
                    <>
                        Submit an{" "}
                        <em className="italic text-primary">advertisement.</em>
                    </>
                }
                description="Promote your market to shoppers across DailyMart. Every campaign is reviewed before it goes live."
            >
                <span className="inline-flex items-center gap-1.5 rounded-full border border-citron/60 bg-citron/25 px-3.5 py-2 text-xs font-semibold text-forest">
                    <ShieldCheck
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                    Pending review
                </span>
            </TablePageHeader>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="grid gap-4 md:gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start"
            >
                <FormSection
                    icon={Megaphone}
                    title="Campaign details"
                    description="Keep the message short and make the offer easy to understand."
                >
                    <div className="space-y-4">
                        <FormField
                            label="Ad title"
                            icon={Megaphone}
                            required
                            htmlFor="adTitle"
                            error={errors.title?.message}
                        >
                            <input
                                id="adTitle"
                                type="text"
                                placeholder="e.g. Fresh produce at 20% off"
                                {...register("title", {
                                    required: "Ad title is required.",
                                })}
                                className={withFieldError(
                                    fieldClass,
                                    errors.title,
                                )}
                            />
                        </FormField>

                        <FormField
                            label="Short description"
                            icon={FileText}
                            required
                            htmlFor="adDescription"
                            error={errors.description?.message}
                            hint="One or two sentences work best."
                        >
                            <textarea
                                id="adDescription"
                                rows={6}
                                placeholder="Tell shoppers what you are promoting and why they should visit your market."
                                {...register("description", {
                                    required: "Description is required.",
                                })}
                                className={withFieldError(
                                    textareaClass,
                                    errors.description,
                                )}
                            />
                        </FormField>
                    </div>
                </FormSection>

                <aside className="space-y-4 md:space-y-5 lg:sticky lg:top-24">
                    <FormSection
                        icon={ImagePlus}
                        title="Promotional banner"
                        description="Use a clear, high-quality image that represents your campaign."
                    >
                        <label
                            htmlFor="banner-upload"
                            className={[
                                "flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed text-center transition-colors duration-200",
                                bannerImage
                                    ? "border-base-300 bg-base-200/20 p-2"
                                    : "border-base-300 bg-base-200/30 px-5 py-8 hover:border-primary/30 hover:bg-base-200/50",
                                uploading
                                    ? "pointer-events-none opacity-70"
                                    : "",
                            ].join(" ")}
                        >
                            {uploading ? (
                                <>
                                    <span className="grid size-11 place-items-center rounded-2xl bg-citron/35 text-primary">
                                        <Loader2
                                            className="size-5 animate-spin"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <p className="mt-3 text-sm font-semibold text-base-content">
                                        Uploading banner…
                                    </p>
                                </>
                            ) : bannerImage ? (
                                <img
                                    src={bannerImage}
                                    alt="Advertisement banner preview"
                                    className="h-36 w-full rounded-xl object-cover"
                                />
                            ) : (
                                <>
                                    <span className="grid size-12 place-items-center rounded-2xl bg-citron/35 text-primary">
                                        <UploadCloud
                                            className="size-6"
                                            strokeWidth={1.8}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <p className="mt-3 text-sm font-semibold text-base-content">
                                        Upload a banner
                                    </p>
                                    <p className="mt-1 text-xs text-ink-soft">
                                        PNG, JPG, or WEBP · up to 5 MB
                                    </p>
                                </>
                            )}
                        </label>

                        <input
                            ref={fileInputRef}
                            id="banner-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            className="sr-only"
                        />

                        {bannerImage && !uploading && (
                            <p className="mt-2 text-center text-xs text-ink-soft">
                                Click the preview to replace the banner.
                            </p>
                        )}

                        {bannerError && (
                            <p className="mt-2 flex items-start gap-1 text-xs font-medium text-error">
                                <CircleAlert
                                    className="mt-0.5 size-3 shrink-0"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                                {bannerError}
                            </p>
                        )}

                        <input type="hidden" {...register("status")} />

                        <div className="mt-5 space-y-2">
                            <button
                                type="submit"
                                disabled={uploading || isSubmitting}
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
                                    : "Submit advertisement"}
                            </button>

                            <p className="text-center text-xs text-ink-soft">
                                Reviewed by an admin before going live.
                            </p>
                        </div>
                    </FormSection>
                </aside>
            </form>
        </div>
    );
};

export default AdvertisementForm;
