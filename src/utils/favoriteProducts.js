export const FAVORITE_PRODUCTS_KEY_PREFIX = "likeProducts";
export const FAVORITES_UPDATED_EVENT = "favorites-updated";

const decodeJwtPayload = (token) => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  try {
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const getCurrentUserId = () => {
  if (typeof window === "undefined") return null;
  const token = window.localStorage.getItem("accessToken");
  const payload = decodeJwtPayload(token);
  return payload?.sub ?? null;
};

export const getFavoriteProductsStorageKey = () => {
  if (typeof window === "undefined") return FAVORITE_PRODUCTS_KEY_PREFIX;
  const userId = getCurrentUserId();
  return userId != null && String(userId).length > 0
    ? `${FAVORITE_PRODUCTS_KEY_PREFIX}:${userId}`
    : `${FAVORITE_PRODUCTS_KEY_PREFIX}:guest`;
};

export const getFavoriteProducts = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(getFavoriteProductsStorageKey());
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const emitFavoriteProductsUpdated = (products = getFavoriteProducts()) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(FAVORITES_UPDATED_EVENT, {
      detail: { products },
    })
  );
};

const saveFavoriteProducts = (products) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    getFavoriteProductsStorageKey(),
    JSON.stringify(products)
  );
  emitFavoriteProductsUpdated(products);
};

export const isFavoriteProduct = (productId) =>
  getFavoriteProducts().some((product) => String(product?.id) === String(productId));

export const addFavoriteProduct = (product) => {
  const favorites = getFavoriteProducts();
  if (favorites.some((item) => String(item?.id) === String(product?.id))) {
    return favorites;
  }
  const updated = [product, ...favorites];
  saveFavoriteProducts(updated);
  return updated;
};

export const removeFavoriteProduct = (productId) => {
  const updated = getFavoriteProducts().filter(
    (product) => String(product?.id) !== String(productId)
  );
  saveFavoriteProducts(updated);
  return updated;
};

export const toggleFavoriteProduct = (product) => {
  if (isFavoriteProduct(product?.id)) {
    return {
      isFavorite: false,
      products: removeFavoriteProduct(product?.id),
    };
  }

  return {
    isFavorite: true,
    products: addFavoriteProduct(product),
  };
};
