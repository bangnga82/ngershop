import axiosClient from "./axiosClient";

const adminDashboardApi = {
  getOverview: (month) =>
    axiosClient.get("/api/admin/dashboard", {
      params: month ? { month } : undefined,
    }),
};

export default adminDashboardApi;
