import { useState } from "react";

import axios from "axios";

import { getClientCookie } from "../utils/cookie";

const apiUrl = process.env.API_URL;
const apiVersion = process.env.API_VERSION;

export default function useApi() {
  const [data, setData] = useState([]);

  const callApi = async (endpoint, method, payload) => {
    const token = getClientCookie("userInfo", "token");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const url = `${apiUrl}${apiVersion}${endpoint}`;

    let response;
    try {
      if (method === "GET") {
        response = await axios.get(url, config);
        setData(response.data.data);
        if (response.data.data.next_cursor) {
          console.log(response.data.data.next_cursor);
        }
      } else if (method === "POST") {
        await axios.post(url, payload, config);
      } else if (method === "PUT") {
        if (endpoint === "/users/picture") {
          const updatePictureConfig = {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          };
          await axios.put(url, payload, updatePictureConfig);
        } else {
          await axios.put(url, payload, config);
        }
      } else if (method === "DELETE") {
        await axios.delete(url, config);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return { data, setData, callApi };
}
