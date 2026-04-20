export const RECENTLY_VIEWED_PRODUCTS_KEY = "recentlyViewedProducts";
export const RECENTLY_VIEWED_UPDATED_EVENT = "recently-viewed-updated";

const MAX_RECENTLY_VIEWED = 12;

export const getRecentlyViewedProducts = () => {
  if (typeof window === "undefined") return [];
  try {
    const stored = window.localStorage.getItem(RECENTLY_VIEWED_PRODUCTS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveRecentlyViewedProducts = (products) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    RECENTLY_VIEWED_PRODUCTS_KEY,
    JSON.stringify(products)
  );
  window.dispatchEvent(
    new CustomEvent(RECENTLY_VIEWED_UPDATED_EVENT, {
      detail: { products },
    })
  );
};

const normalizeForStorage = (product) => {
  if (!product) return null;
  return {
    id: product?.id,
    name: product?.name || "",
    image: product?.image || ["/vite.svg"],
    discount: Number(product?.discount || 0),
    price: Number(product?.price || 0),
    count: product?.count ?? 0,
    variants: product?.variants || [],
    categoryName: product?.categoryName || "",
    isActive: product?.isActive,
  };
};

export const addRecentlyViewedProduct = (product, maxItems = MAX_RECENTLY_VIEWED) => {
  const normalized = normalizeForStorage(product);
  if (!normalized?.id) return getRecentlyViewedProducts();

  const current = getRecentlyViewedProducts();
  const filtered = current.filter((p) => String(p?.id) !== String(normalized.id));
  const updated = [normalized, ...filtered].slice(0, Math.max(1, maxItems));
  saveRecentlyViewedProducts(updated);
  return updated;
};

export const clearRecentlyViewedProducts = () => {
  saveRecentlyViewedProducts([]);
  return [];
};

