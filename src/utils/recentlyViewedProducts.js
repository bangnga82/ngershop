// Storage is scoped by account (JWT sub) to avoid leaking "recently viewed" across logins.
// Legacy key (without suffix) is kept for backward compatibility (guest-only migration).
export const RECENTLY_VIEWED_PRODUCTS_KEY = "recentlyViewedProducts";
export const RECENTLY_VIEWED_PRODUCTS_KEY_PREFIX = RECENTLY_VIEWED_PRODUCTS_KEY;
export const RECENTLY_VIEWED_UPDATED_EVENT = "recently-viewed-updated";

const MAX_RECENTLY_VIEWED = 12;

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

export const getRecentlyViewedProductsStorageKey = () => {
  if (typeof window === "undefined") return `${RECENTLY_VIEWED_PRODUCTS_KEY_PREFIX}:guest`;
  const userId = getCurrentUserId();
  return userId != null && String(userId).length > 0
    ? `${RECENTLY_VIEWED_PRODUCTS_KEY_PREFIX}:${userId}`
    : `${RECENTLY_VIEWED_PRODUCTS_KEY_PREFIX}:guest`;
};

export const getRecentlyViewedProducts = () => {
  if (typeof window === "undefined") return [];
  try {
    const key = getRecentlyViewedProductsStorageKey();
    const stored = window.localStorage.getItem(key);
    // Guest-only migration from the legacy global key, to stop cross-account leakage.
    if (!stored && key.endsWith(":guest")) {
      const legacy = window.localStorage.getItem(RECENTLY_VIEWED_PRODUCTS_KEY);
      if (legacy) {
        window.localStorage.setItem(key, legacy);
        window.localStorage.removeItem(RECENTLY_VIEWED_PRODUCTS_KEY);
        const parsedLegacy = JSON.parse(legacy);
        return Array.isArray(parsedLegacy) ? parsedLegacy : [];
      }
    }
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const emitRecentlyViewedUpdated = (products = getRecentlyViewedProducts()) => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(RECENTLY_VIEWED_UPDATED_EVENT, {
      detail: { products },
    })
  );
};

const saveRecentlyViewedProducts = (products) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    getRecentlyViewedProductsStorageKey(),
    JSON.stringify(products)
  );
  emitRecentlyViewedUpdated(products);
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
