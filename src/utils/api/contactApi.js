import axiosClient from "./axiosClient";

const contactApi = {
  sendMessage: (payload) => axiosClient.post("/api/v1/contact-messages", payload),
};

export default contactApi;

