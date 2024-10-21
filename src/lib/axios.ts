import axios from "axios";
import { getServerToken } from "./get-server-token";
import { getClientToken } from "./utils";

const instance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
});

instance.interceptors.request.use(
  async (config) => {
    let accessToken;
    if (typeof window !== "undefined") {
      accessToken = getClientToken();
    } else {
      accessToken = getServerToken();
    }
    // Retrieve token from local storage or cookies
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return Promise.reject(error);
  }
);

export default instance;
