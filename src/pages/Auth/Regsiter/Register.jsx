import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";
import { useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";
import { toast } from "sonner";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateUserInfo } = useAuth();
  const axiosInstance = useAxios();
  const location = useLocation();
  const navigate = useNavigate();
  // Correctly access the 'from' state
  const from = location.state?.from?.pathname || "/";
  const [profilePhoto, setProfilePhoto] = useState("");

  const onSubmit = (data) => {
    console.log(data);

    createUser(data.email, data.password)
      .then(async (result) => {
        console.log(result.user);
        navigate(from);

        const userData = {
          email: data.email,
          name: data.name,
          role: "user",
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
        };

        const userRes = await axiosInstance.post("/users", userData);
        console.log(userRes.data);

        const userInfo = {
          displayName: data.name,
          photoURL: profilePhoto,
        };

        updateUserInfo(userInfo)
          .then(() => {
            console.log("User info updated successfully");
          })
          .catch((error) => {
            console.log(error);
          });

        toast.success("Account creation successfull");
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.message);
      });
  };

  const handleImageupload = async (e) => {
    const image = e.target.files[0];
    console.log(image);
    const formData = new FormData();
    formData.append("image", image);

    const imageUploadURL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_upload_key}`;
    const res = await axios.post(imageUploadURL, formData);

    setProfilePhoto(res.data.data.url);
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
                    className="file-input file-input-bordered w-full"
                    placeholder="Your profile picture"
                  />
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

                <div className="text-right">
                  <a className="link link-hover text-sm text-black">
                    Forgot password?
                  </a>
                </div>

                <button type="submit" className="btn btn-neutral w-full">
                  Register
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
