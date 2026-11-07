import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const reqInterceptors = axiosSecure.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    const resInterceptors = axiosSecure.interceptors.response.use(
      (res) => {
        return res;
      },
      (error) => {
        const status = error.status;
        if (status === 403) {
          navigate("/forbidden");
        } else if (status === 401) {
          logOut()
            .then(() => {
              navigate("/login");
            })
            .catch(() => {});
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptors);
      axiosSecure.interceptors.response.eject(resInterceptors);
    };
  }, [user]);

  return axiosSecure;
};

export default useAxiosSecure;
