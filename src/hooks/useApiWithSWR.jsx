import axios from "axios";

import { getClientCookie } from "../utils/cookie";

const apiUrl = process.env.API_URL;
const apiVersion = process.env.API_VERSION;

const useApiWithSWR = () => {
  const callApi = async (endpoint, method, payload) => {
    const token = getClientCookie("userInfo", "token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${apiUrl}${apiVersion}${endpoint}`;

    try {
      let response;
      if (method === "GET") {
        response = await axios.get(url, config);
      } else if (method === "POST") {
        response = await axios.post(url, payload, config);
      } else if (method === "PUT") {
        if (endpoint === "/users/picture") {
          const updatePictureConfig = {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          };
          response = await axios.put(url, payload, updatePictureConfig);
        } else {
          response = await axios.put(url, payload, config);
        }
      } else if (method === "DELETE") {
        response = await axios.delete(url, config);
      }
      return response.data.data;
    } catch (err) {
      return err;
    }
  };

  return { callApi };
};

export default useApiWithSWR;