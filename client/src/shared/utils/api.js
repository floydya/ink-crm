import axios from "axios";
import { objectToQueryString } from "./url";
import pubsub from "sweet-pubsub";

const getAuthenticationToken = () => localStorage.getItem("token") || null;

const api = (method, url, variables) => {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthenticationToken()
          ? `Bearer ${getAuthenticationToken()}`
          : undefined
      }
    });
    instance({
      url: `${process.env.REACT_APP_API_HTTP_URL}${url}`,
      method,
      params: method === "get" ? variables : undefined,
      data: method !== "get" ? variables : undefined,
      paramsSerializer: objectToQueryString
    }).then(
      response => {
        resolve(response.data);
      },
      error => {
        if (error.response) {
          if (error.response.status === 401) {
            pubsub.emit("logout-user");
          } else {
            reject(error.response);
          }
        } else {
          reject({
            code: "INTERNAL_ERROR",
            message:
              "Something went wrong. Please check your internet connection or contact our support.",
            status: 503,
            data: {}
          });
        }
      }
    );
  });
};

export default {
  get: (...args) => api("get", ...args),
  post: (...args) => api("post", ...args),
  put: (...args) => api("put", ...args),
  patch: (...args) => api("patch", ...args),
  delete: (...args) => api("delete", ...args)
};
