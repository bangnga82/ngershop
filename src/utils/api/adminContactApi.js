import axiosClient from "./axiosClient";

const adminContactApi = {
  list: (params) => axiosClient.get("/api/admin/contact-messages", { params }),
  getById: (id) => axiosClient.get(`/api/admin/contact-messages/${id}`),
  markRead: (id, read = true) =>
    axiosClient.patch(`/api/admin/contact-messages/${id}/read`, null, {
      params: { read },
    }),
};

export default adminContactApi;

