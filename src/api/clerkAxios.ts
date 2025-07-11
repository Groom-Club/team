import axiosInstance from "./axiosInstance";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

export const useClerkAxios = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const interceptor = axiosInstance.interceptors.request.use(async (config) => {
      const token = await getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axiosInstance.interceptors.request.eject(interceptor);
    };
  }, [getToken]);

  return axiosInstance;
}; 