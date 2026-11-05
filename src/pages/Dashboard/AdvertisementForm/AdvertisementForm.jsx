import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";

const AdvertisementForm = () => {

  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      status: "pending"
    }
  });
  const [bannerImage, setBannerImage] = useState('')
  const axiosSecure = useAxiosSecure();

  const handleBannerupload = async (e) => {
    const banner = e.target.files[0];
    console.log(banner);
    const formData = new FormData();
    formData.append('image', banner);

    const bannerUploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`
    const res = await axios.post(bannerUploadURL, formData);

    console.log(res.data);
    setBannerImage(res.data.data.url);
  }

  const onSubmit = async (data) => {
    try {
      if (!bannerImage) {
        toast.error("Please wait for the image to finish uploading.");
        return;
      }

      console.log(data);

      const adData = {
        ...data,
        banner: bannerImage,
        name: user.displayName,
        email: user.email
      };

      const res = await axiosSecure.post("/ads", adData);

      if (res.data.insertedId) {
        toast.success("Advertisement submitted successfully!");
        reset();
        setBannerImage('');
      } else {
        toast.error("Submission failed. Please try again.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong while submitting.");
    }
  };

  return (
    <div className=" p-9 bg-white rounded-lg">
      <h2 className="text-3xl font-bold mb-12 text-center">Submit Advertisement</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Ad Title */}
        <div>
          <label className="label">Ad Title</label>
          <input
            {...register("title", { required: true })}
            className="input input-bordered w-full"
            placeholder="Enter ad title"
          />
          {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label">Short Description</label>
          <textarea
            {...register("description", { required: true })}
            className="textarea textarea-bordered w-full"
            placeholder="Enter description"
          ></textarea>
          {errors.description && <p className="text-red-500 text-sm">Description is required</p>}
        </div>

        {/* Status (readonly field) */}
        <div>
          <label className="label">Status</label>
          <input
            {...register("status")}
            className="input input-bordered w-full bg-gray-100 text-gray-600 cursor-not-allowed"
            readOnly
          />
        </div>

        {/* Image Upload */}
        <div className="form-control">
          <label className="label text-black">Promotional Banner</label>
          <input
            onChange={handleBannerupload}
            type="file"
            accept="image/*"
            className="file-input file-input-bordered w-full"
            placeholder='Your Advertisement banner' />
        </div>

        {/* Submit */}
        <button className="btn btn-primary w-full" type="submit">Submit Ad</button>
      </form>
    </div>
  );
};

export default AdvertisementForm;
