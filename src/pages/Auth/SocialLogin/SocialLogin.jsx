import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import useAxios from "../../../hooks/useAxios";
import { Spinner } from "../../../Shared/Loading/Loading";
import { toast } from "sonner";

const SocialLogin = ({from}) => {
  const { googleSignIn } = useAuth();
  const axiosInstance = useAxios();
  const navigate = useNavigate();
  const [googlePending, setGooglePending] = useState(false);

  const handleGoogleSignIn = async () => {
    if (googlePending) return;

    setGooglePending(true);

    try {
      const result = await googleSignIn();
      const user = result.user;

      const userData = {
        email: user.email,
        role: "user",
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
      };

      await axiosInstance.post("/users", userData);

      navigate(from);
      toast.success("Google login successfull");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong! Try Again");
    } finally {
      setGooglePending(false);
    }
  };

  return (
    <div>
      <div className="divider">OR</div>
      <div className="text-center">
        <button
          onClick={handleGoogleSignIn}
          disabled={googlePending}
          className="btn bg-white text-black border-[#e5e5e5]"
        >
          {googlePending ? (
            <Spinner size="sm" />
          ) : (
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
          )}
          {googlePending ? "Connecting…" : "Login with Google"}
        </button>
      </div>
    </div>
  );
};

export default SocialLogin;
