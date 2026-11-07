import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import { useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";
import { Spinner } from "../../../Shared/Loading/Loading";
import { toast } from "sonner";

const Register = ({ from }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const { createUser, updateUserInfo } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const onSubmit = async (data) => {
    try {
      await createUser(data.email, data.password);

      const userData = {
        email: data.email,
        name: data.name,
        role: "user",
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      await axiosInstance.post("/users", userData);

      const userInfo = {
        displayName: data.name,
        photoURL: profilePhoto,
      };

      await updateUserInfo(userInfo);

      toast.success("Account creation successfull");
      navigate(from);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const handleImageupload = async (e) => {
    const image = e.target.files?.[0];
    if (!image) return;

    setUploadingPhoto(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const imageUploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
      const res = await axios.post(imageUploadURL, formData);

      setProfilePhoto(res.data.data.url);
      toast.success("Profile photo uploaded.");
    } catch (error) {
      console.error(error);
      toast.error("Could not upload the profile photo. Please try again.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div className="hero">
      <div className="hero-content flex-col lg:flex-row-reverse w-full max-w-md">
        <div className="card bg-base-100 w-full shadow-2xl">
          <div className="card-body p-8 lg:p-10 xl:p-12">
            <h1 className="text-3xl font-bold text-black mb-4 text-center">
              Create an Account
            </h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              <fieldset className="fieldset space-y-1">
                {/* Name */}
                <div className="form-control">
                  <label className="label text-black">Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 z-10">
                      <FaUser />
                    </span>
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10" // Added pl-10 for icon padding
                      placeholder="Full Name"
                      {...register("name", { required: "Name is Required" })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Profile Picture */}
                <div className="form-control">
                  <label className="label text-black">Profile Picture</label>
                  <input
                    onChange={handleImageupload}
                    type="file"
                    accept="image/*"
                    disabled={uploadingPhoto}
                    className="file-input file-input-bordered w-full disabled:opacity-60"
                    placeholder="Your profile picture"
                  />
                  {uploadingPhoto && (
                    <p className="mt-1.5 inline-flex items-center gap-2 text-sm text-gray-600">
                      <Spinner size="xs" />
                      Uploading photo…
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="form-control">
                  <label className="label text-black">Email</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 z-10">
                      <FaEnvelope />
                    </span>
                    <input
                      type="email"
                      className="input input-bordered w-full pl-10" // Added pl-10 for icon padding
                      placeholder="Email"
                      {...register("email", { required: "Email is Required" })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="form-control">
                  <label className="label text-black">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 z-10">
                      <FaLock />
                    </span>
                    <input
                      type="password"
                      className="input input-bordered w-full pl-10" // Added pl-10 for icon padding
                      placeholder="Password"
                      {...register("password", {
                        required: "Password is Required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                        pattern: {
                          value:
                            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                          message:
                            "Password must contain at least one letter, one number, and one special character",
                        },
                      })}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || uploadingPhoto}
                  className="btn btn-neutral w-full"
                >
                  {(isSubmitting || uploadingPhoto) && <Spinner size="sm" />}
                  {uploadingPhoto
                    ? "Uploading photo…"
                    : isSubmitting
                      ? "Creating account…"
                      : "Register"}
                </button>
              </fieldset>
              <p className="mt-1 text-center text-black">
                <small>
                  Already have an account?{" "}
                  <Link className="btn-link" to={"/login"}>
                    Login
                  </Link>
                </small>
              </p>
            </form>
            <SocialLogin></SocialLogin>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
