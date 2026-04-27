// Shared status theme for admin order UI (filters, badges, charts).
// Keep labels in sync with mapped order.status values in OrderAdminPage.

export const ORDER_STATUS_HEX = {
  Pending: "#6366f1", // indigo
  Processing: "#6366f1", // "Confirmed" in chart
  Paid: "#f59e0b", // amber
  Shipping: "#10b981", // shipped
  Delivered: "#8b5cf6", // violet
  Cancelled: "#ec4899", // pink
};

export const getOrderStatusHex = (label) => {
  if (!label) return null;
  if (ORDER_STATUS_HEX[label]) return ORDER_STATUS_HEX[label];

  // Support alternate labels if backend/dashboard uses these names.
  const normalized = String(label).trim();
  if (normalized === "Confirmed") return ORDER_STATUS_HEX.Processing;
  if (normalized === "Shipped") return ORDER_STATUS_HEX.Shipping;

  return null;
};

export const ORDER_STATUS_BADGE_CLASS = {
  Pending: "bg-indigo-100 text-indigo-800",
  Processing: "bg-indigo-100 text-indigo-800",
  Paid: "bg-amber-100 text-amber-800",
  Shipping: "bg-emerald-100 text-emerald-800",
  Delivered: "bg-violet-100 text-violet-800",
  Cancelled: "bg-pink-100 text-pink-800",
};

export const ORDER_STATUS_FILTER_CLASS = {
  Pending: {
    active: "bg-indigo-600 text-white",
    idle: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  },
  Processing: {
    active: "bg-indigo-600 text-white",
    idle: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  },
  Paid: {
    active: "bg-amber-500 text-white",
    idle: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  },
  Shipping: {
    active: "bg-emerald-600 text-white",
    idle: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  },
  Delivered: {
    active: "bg-violet-600 text-white",
    idle: "bg-violet-100 text-violet-800 hover:bg-violet-200",
  },
  Cancelled: {
    active: "bg-pink-600 text-white",
    idle: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  },
};

