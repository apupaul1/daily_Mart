import React from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "../SocialLogin/SocialLogin";
import useAuth from "../../../hooks/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const onSubmit = (data) => {
    signIn(data.email, data.password)
      .then((result) => {
        navigate(from);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="card bg-base-100 w-full max-w-sm mx-auto shadow-2xl">
      <div className="card-body p-8">
        <h1 className="text-3xl font-bold text-black mb-4 text-center">
          Login Now
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              {...register("email", {
                required: "Email Address is required",
              })}
              type="email"
              className="input input-bordered w-full mb-2"
              placeholder="Email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-2">
                {errors.email.message}
              </p>
            )}

            <label className="block text-gray-700 mb-1">Password</label>
            <input
              {...register("password", {
                required: true,
                minLength: 6,
              })}
              type="password"
              className="input input-bordered w-full mb-2"
              placeholder="Password"
            />
            {errors.password?.type === "required" && (
              <p className="text-red-500 text-sm mb-2">Password is required</p>
            )}
            {errors.password?.type === "minLength" && (
              <p className="text-red-500 text-sm mb-2">
                Password must be 6 characters or longer
              </p>
            )}

            <div className="mb-4 text-right">
              <a className="text-sm text-blue-600 hover:underline cursor-pointer">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="btn btn-neutral w-full">
              Login
            </button>
          </fieldset>
          <p>
            <small>
              Don't have an account?{" "}
              <Link className="btn-link" to={"/register"}>
                Register
              </Link>
            </small>
          </p>
        </form>
        <SocialLogin></SocialLogin>
      </div>
    </div>
  );
};

export default Login;
