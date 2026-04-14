import axiosClient from "./axiosClient";

export const CART_UPDATED_EVENT = "cart-updated";
const CART_VARIANT_LABELS_KEY = "cart-variant-labels";

const readVariantLabels = () => {
  if (typeof window === "undefined") return {};
  try {
    const stored = window.localStorage.getItem(CART_VARIANT_LABELS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const writeVariantLabels = (labels) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_VARIANT_LABELS_KEY, JSON.stringify(labels));
};

const saveVariantLabel = (variantId, variantLabel) => {
  if (!variantId || !variantLabel?.trim()) return;
  const labels = readVariantLabels();
  labels[String(variantId)] = variantLabel.trim();
  writeVariantLabels(labels);
};

const removeVariantLabel = (variantId) => {
  if (!variantId) return;
  const labels = readVariantLabels();
  delete labels[String(variantId)];
  writeVariantLabels(labels);
};

const emitCartUpdated = (items = []) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, {
      detail: { items },
    })
  );
};

const extractCartItems = (response) => response?.data?.data?.items || [];

export const getStoredCartVariantLabel = (variantId) =>
  readVariantLabels()[String(variantId)] || "";

const cartApi = {
  getCart: () => axiosClient.get("/api/v1/carts"),
  addItem: (variantId, quantity = 1, variantLabel = "") =>
    axiosClient.post("/api/v1/carts/add", { variantId, quantity }).then((response) => {
      saveVariantLabel(variantId, variantLabel);
      emitCartUpdated(extractCartItems(response));
      return response;
    }),
  updateItem: (variantId, qty) =>
    axiosClient.patch(`/api/v1/carts/${variantId}`, null, { params: { qty } }).then((response) => {
      emitCartUpdated(extractCartItems(response));
      return response;
    }),
  removeItem: (variantId) =>
    axiosClient.delete(`/api/v1/carts/${variantId}`).then((response) => {
      removeVariantLabel(variantId);
      emitCartUpdated(extractCartItems(response));
      return response;
    }),
};

export default cartApi;
