// Shared <img> fallback for remote URLs that might 404 / be blocked.
// Use neutral external placeholders so we don't show unrelated local banners/products
// when an image fails to load.
const FALLBACK_SOURCES = [
  "https://placehold.co/1600x900/fff7f3/3b2f2a?text=NGERShop",
  "https://placehold.co/1600x900/f7f2ef/3b2f2a?text=Image+unavailable",
  "https://placehold.co/1600x900/f3f4f6/111827?text=No+image",
];

export const DEFAULT_IMAGE_FALLBACK_SRC = FALLBACK_SOURCES[0];

const hashString = (value = "") => {
  // Simple stable hash (djb2-ish) for deterministic fallback selection.
  let hash = 5381;
  const str = String(value);
  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
};

export const getFallbackImageForKey = (key) => {
  const idx = hashString(key) % FALLBACK_SOURCES.length;
  return FALLBACK_SOURCES[idx] || DEFAULT_IMAGE_FALLBACK_SRC;
};

export const applyImageFallback = (event, fallbackSrc) => {
  const img = event?.currentTarget;
  if (!img) return;

  // Prevent infinite loops if the fallback also fails.
  if (img.dataset?.fallbackApplied === "1") return;
  img.dataset.fallbackApplied = "1";

  img.onerror = null;
  const key = img.dataset?.fallbackKey;
  img.src = fallbackSrc || (key ? getFallbackImageForKey(key) : DEFAULT_IMAGE_FALLBACK_SRC);
};
