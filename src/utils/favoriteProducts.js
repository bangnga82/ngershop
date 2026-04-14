export const FAVORITE_PRODUCTS_KEY = "likeProducts";
export const FAVORITES_UPDATED_EVENT = "favorites-updated";

export const getFavoriteProducts = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(FAVORITE_PRODUCTS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveFavoriteProducts = (products) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITE_PRODUCTS_KEY, JSON.stringify(products));
  window.dispatchEvent(
    new CustomEvent(FAVORITES_UPDATED_EVENT, {
      detail: { products },
    })
  );
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
