import axios from "axios";
import Axios from "axios";
import { configure } from "axios-hooks";

const configureAxios = () => {
  const axiosInstance = Axios.create({
    baseURL: "http://localhost:3001",
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = {
          authorization: `Bearer ${token}`,
        };
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;

      if (
        error.config.url !== "/auth/signin" &&
        error.response.status === 401 &&
        !config._retry
      ) {
        config._retry = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          window.location.reload();
          return Promise.reject(error);
        }

        await axiosInstance
          .post("/auth/refresh", { refreshToken })
          .then((response) => {
            config.headers = {
              authorization: `Bearer ${response.data.accessToken}`,
            };
            localStorage.setItem("refreshToken", response.data.refreshToken);
            localStorage.setItem("token", response.data.accessToken);
          });

        return axios(config);
      }

      if (error.response.status === 401 && config._retry) {
        localStorage.setItem("token", "");
        localStorage.setItem("refreshToken", "");
        window.location.reload();
      }

      return Promise.reject(error);
    }
  );

  configure({ axios: axiosInstance, cache: null });
};

export default configureAxios;
