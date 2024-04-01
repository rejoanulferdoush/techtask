import { useNavigate } from "react-router-dom";
import useAuth from "./useAuth";
import axios from "axios";
import { useEffect } from "react";

const useAxiosIntercept = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const axiosIntercept = axios.create({
    baseURL: "https://techops.sohochor.com/api/",
  });

  useEffect(() => {
    axiosIntercept.interceptors.request.use((config) => {
      const token = localStorage.getItem("access-token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axiosIntercept.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          await logout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );
  }, [logout, navigate, axiosIntercept]);

  return [axiosIntercept];
};

export default useAxiosIntercept;
