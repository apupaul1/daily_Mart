import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import {
    ImagePlus,
    Megaphone,
    Pencil,
    Plus,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
    DataTable,
    DataTableBody,
    DataTableCell,
    DataTableHead,
    DataTableHeader,
    DataTableRow,
    StatusPill,
    TableAction,
    TableEmpty,
    TableLink,
    TablePageHeader,
    TableShell,
    TableSkeleton,
} from "../../../Shared/DashboardComponent/DataTable";

const fieldClass =
    "mt-1.5 w-full rounded-xl border border-base-300 bg-base-100 px-3.5 py-2.5 text-sm text-base-content placeholder:text-ink-soft/50 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15";

const labelClass =
    "block text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft/60";

const MyAdvertisements = () => {
    const [selectedAd, setSelectedAd] = useState(null);
    const [bannerImage, setBannerImage] = useState("");
    const [uploading, setUploading] = useState(false);

    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            status: "pending",
        },
    });

    const {
        data: ads = [],
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ["my-ads", user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/ads?email=${user.email}`);
            return res.data;
        },
    });

    const handleBannerupload = async (event) => {
        const banner = event.target.files?.[0];
        if (!banner) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", banner);

            const bannerUploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
            const res = await axios.post(bannerUploadURL, formData);

            setBannerImage(res.data.data.url);
        } catch (error) {
            console.error(error);
            toast.error("Banner upload failed. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const closeEditor = () => {
        document.getElementById("my_modal_5")?.close();
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (confirm.isConfirmed) {
            try {
                const res = await axiosSecure.delete(`/ads/${id}`);

                if (res.data.deletedCount) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "Advertisement has been deleted.",
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                }

                refetch();
            } catch (error) {
                console.error(error);
                Swal.fire(
                    "Error!",
                    error.message || "Failed to delete the advertisement.",
                    "error",
                );
            }
        }
    };

    useEffect(() => {
        if (selectedAd) {
            reset({
                title: selectedAd.title,
                description: selectedAd.description,
                status: selectedAd.status || "pending",
            });
            setBannerImage(selectedAd.banner || "");
        }
    }, [selectedAd, reset]);

    const onSubmit = async (data) => {
        try {
            if (!bannerImage) {
                toast.error(
                    uploading
                        ? "Please wait for the banner to finish uploading."
                        : "Please upload a promotional banner.",
                );
                return;
            }

            const adData = {
                ...data,
                banner: bannerImage,
                name: user.displayName,
                email: user.email,
            };

            if (selectedAd) {
                const res = await axiosSecure.patch(
                    `/ads/${selectedAd._id}`,
                    adData,
                );

                if (res.data.message === "Ad updated successfully") {
                    toast.success("Advertisement updated successfully!");
                    setSelectedAd(null);
                    reset();
                    setBannerImage("");
                    refetch();
                    closeEditor();
                } else {
                    toast.error("Update failed.");
                }
            } else {
                const res = await axiosSecure.post("/ads", adData);

                if (res.data.insertedId) {
                    toast.success("Advertisement submitted successfully!");
                    reset();
                    setBannerImage("");
                    refetch();
                } else {
                    toast.error("Submission failed.");
                }
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("Something went wrong.");
        }
    };

    return (
        <div className="space-y-6 md:space-y-8">
            <TablePageHeader
                eyebrow="Marketing"
                icon={Megaphone}
                title="My advertisements"
                description="Review your promotional campaigns, update creative details, and track approval status."
            >
                <TableLink
                    to="/dashboard/postadvertisement"
                    icon={Plus}
                    tone="primary"
                >
                    Post advertisement
                </TableLink>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-base-300/70 bg-base-100 px-3.5 py-2 text-[11px] font-semibold text-ink-soft">
                    {isLoading
                        ? "Loading campaigns…"
                        : `${ads.length} campaign${ads.length === 1 ? "" : "s"}`}
                </span>
            </TablePageHeader>

            {isLoading ? (
                <TableSkeleton rows={4} columns={5} />
            ) : ads.length === 0 ? (
                <TableEmpty
                    icon={ImagePlus}
                    title="No advertisements yet"
                    description="Create a promotional banner to feature your store and products across the marketplace."
                    action={
                        <TableLink
                            to="/dashboard/postadvertisement"
                            icon={Plus}
                            tone="primary"
                        >
                            Post your first advertisement
                        </TableLink>
                    }
                />
            ) : (
                <TableShell>
                    <DataTable
                        label="My advertisements"
                        minWidthClass="md:min-w-[50rem]"
                    >
                        <DataTableHead>
                            <DataTableHeader>#</DataTableHeader>
                            <DataTableHeader>Campaign</DataTableHeader>
                            <DataTableHeader>Description</DataTableHeader>
                            <DataTableHeader>Status</DataTableHeader>
                            <DataTableHeader className="text-right">
                                Actions
                            </DataTableHeader>
                        </DataTableHead>

                        <DataTableBody>
                            {ads.map((ad, index) => (
                                <DataTableRow key={ad._id}>
                                    <DataTableCell label="No.">
                                        <span className="font-mono text-[12px] text-ink-soft/60">
                                            {index + 1}
                                        </span>
                                    </DataTableCell>

                                    <DataTableCell label="Campaign" emphasis>
                                        {ad.title || "Untitled campaign"}
                                    </DataTableCell>

                                    <DataTableCell label="Description">
                                        <span className="line-clamp-2 max-w-[24rem]">
                                            {ad.description || "—"}
                                        </span>
                                    </DataTableCell>

                                    <DataTableCell label="Status">
                                        <StatusPill
                                            status={ad.status || "pending"}
                                        />
                                    </DataTableCell>

                                    <DataTableCell label="Actions" align="end">
                                        <div className="flex flex-wrap gap-2 md:justify-end">
                                            <TableAction
                                                icon={Pencil}
                                                tone="warning"
                                                onClick={() => {
                                                    setSelectedAd(ad);
                                                    document
                                                        .getElementById(
                                                            "my_modal_5",
                                                        )
                                                        ?.showModal();
                                                }}
                                            >
                                                Update
                                            </TableAction>

                                            <TableAction
                                                icon={Trash2}
                                                tone="danger"
                                                onClick={() =>
                                                    handleDelete(ad._id)
                                                }
                                            >
                                                Delete
                                            </TableAction>
                                        </div>
                                    </DataTableCell>
                                </DataTableRow>
                            ))}
                        </DataTableBody>
                    </DataTable>
                </TableShell>
            )}

            <dialog
                id="my_modal_5"
                className="modal modal-bottom md:modal-middle"
                onClose={() => {
                    setSelectedAd(null);
                    setBannerImage("");
                }}
            >
                <div className="w-full max-w-lg rounded-t-[1.5rem] bg-base-100 p-5 shadow-soft md:rounded-[1.5rem] md:p-7">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-ink-soft/50">
                                Marketing studio
                            </p>
                            <h3 className="mt-1.5 font-display text-xl font-semibold tracking-[-0.02em] text-base-content md:text-2xl">
                                Update advertisement
                            </h3>
                        </div>

                        <button
                            type="button"
                            onClick={closeEditor}
                            aria-label="Close advertisement editor"
                            className="grid size-9 shrink-0 place-items-center rounded-full border border-base-300 text-ink-soft transition-colors duration-300 hover:border-primary/25 hover:text-primary"
                        >
                            <X
                                className="size-4"
                                strokeWidth={2}
                                aria-hidden="true"
                            />
                        </button>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-5 space-y-4"
                    >
                        <div>
                            <label htmlFor="my-ad-title" className={labelClass}>
                                Ad title
                            </label>
                            <input
                                id="my-ad-title"
                                {...register("title", { required: true })}
                                className={fieldClass}
                                placeholder="Enter ad title"
                            />
                            {errors.title && (
                                <p className="mt-1.5 text-[11px] font-semibold text-error">
                                    Title is required
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="my-ad-description"
                                className={labelClass}
                            >
                                Short description
                            </label>
                            <textarea
                                id="my-ad-description"
                                {...register("description", {
                                    required: true,
                                })}
                                className={[fieldClass, "min-h-24 resize-y"].join(
                                    " ",
                                )}
                                placeholder="Enter description"
                            />
                            {errors.description && (
                                <p className="mt-1.5 text-[11px] font-semibold text-error">
                                    Description is required
                                </p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="my-ad-status" className={labelClass}>
                                Status
                            </label>
                            <input
                                id="my-ad-status"
                                {...register("status")}
                                readOnly
                                className={[
                                    fieldClass,
                                    "cursor-not-allowed bg-base-200 text-ink-soft",
                                ].join(" ")}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="my-ad-banner"
                                className={labelClass}
                            >
                                Promotional banner
                            </label>

                            <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-dashed border-base-300 bg-base-200/40 px-3.5 py-2.5">
                                <Upload
                                    className="size-4 shrink-0 text-primary/60"
                                    strokeWidth={1.9}
                                    aria-hidden="true"
                                />
                                <input
                                    id="my-ad-banner"
                                    onChange={handleBannerupload}
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-[12px] text-ink-soft file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-[11px] file:font-semibold file:text-primary-content"
                                />
                            </div>

                            {uploading && (
                                <p className="mt-1.5 text-[11px] font-semibold text-primary">
                                    Uploading banner…
                                </p>
                            )}

                            {bannerImage && (
                                <img
                                    src={bannerImage}
                                    alt="Advertisement banner preview"
                                    className="mt-2 h-24 w-full rounded-xl object-cover"
                                />
                            )}
                        </div>

                        <div className="flex flex-col gap-2 pt-1 md:flex-row">
                            <button
                                type="submit"
                                disabled={uploading}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-content transition-colors duration-300 hover:bg-forest-soft disabled:pointer-events-none disabled:opacity-50"
                            >
                                Update advertisement
                            </button>

                            <button
                                type="button"
                                onClick={closeEditor}
                                className="inline-flex items-center justify-center rounded-full border border-base-300 bg-base-100 px-5 py-2.5 text-[13px] font-semibold text-ink-soft transition-colors duration-300 hover:border-primary/25 hover:text-primary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </dialog>
        </div>
    );
};

export default MyAdvertisements;
