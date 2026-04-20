import axiosClient from "./axiosClient";

const productApi = {
  getProducts: (params, config = {}) =>
    axiosClient.get("/api/v1/products", { ...config, params }),
  // Convenience for admin UIs that currently do client-side filtering/sorting:
  // fetch all pages and return a flat array.
  getAllProducts: async (params = {}, config = {}) => {
    const size = Number.isFinite(params?.size) ? params.size : 100;
    let page = Number.isFinite(params?.page) ? params.page : 0;

    const items = [];
    let totalPages = Infinity;
    const maxPagesSafety = 1000; // avoid infinite loops if backend misbehaves
    let loops = 0;

    // Keep requesting until backend marks last page, or we reach totalPages.
    // Backend returns PageResponse: { content, totalPages, isLast, ... }.
    while (page < totalPages && loops < maxPagesSafety) {
      loops += 1;
      const res = await axiosClient.get("/api/v1/products", {
        ...config,
        params: { ...params, page, size },
      });

      const pageData = res?.data?.data;
      const content = pageData?.content || [];
      items.push(...content);

      if (typeof pageData?.totalPages === "number") {
        totalPages = pageData.totalPages;
      }

      if (pageData?.isLast === true) break;
      if (!content.length) break;

      page += 1;
    }

    return { items };
  },
  getById: (id) => axiosClient.get(`/api/v1/products/${id}`),
  search: (keyword) =>
    axiosClient.get("/api/v1/products/search", { params: { keyword } }),
  create: (formData) =>
    axiosClient.post("/api/v1/products", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    axiosClient.put(`/api/v1/products/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  uploadImages: (id, formData) =>
    axiosClient.put(`/api/v1/products/${id}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  toggleStatus: (id) => axiosClient.put(`/api/v1/products/${id}/status`),
};

export default productApi;
