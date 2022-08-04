import Axios from "axios";
import { configure } from "axios-hooks";
import { config } from "process";

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
      //const config = error.config;
  
      if (error.config.url !== '/auth/signin' && error.response.status === 401) {
        //TODO: refresh token logic with config.retry flag
        localStorage.setItem("token", "");
        window.location.reload();
      }
  
      return Promise.reject(error);
    }
  );
  
  configure({ axios: axiosInstance, cache: null });
};

export default configureAxios;