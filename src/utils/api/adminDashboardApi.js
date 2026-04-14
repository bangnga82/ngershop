import axiosClient from "./axiosClient";

const adminDashboardApi = {
  getOverview: () => axiosClient.get("/api/admin/dashboard"),
};

export default adminDashboardApi;
