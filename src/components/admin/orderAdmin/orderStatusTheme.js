// Shared status theme for admin order UI (filters, badges, charts).
// Use backend enum values as keys. Display labels are localized elsewhere.

import { ORDER_STATUS, normalizeOrderStatus } from "@/utils/orderStatus";

export const ORDER_STATUS_HEX = {
  [ORDER_STATUS.PENDING]: "#6366f1", // indigo
  [ORDER_STATUS.CONFIRMED]: "#6366f1",
  [ORDER_STATUS.PAID]: "#f59e0b", // amber
  [ORDER_STATUS.SHIPPED]: "#10b981", // emerald
  [ORDER_STATUS.DELIVERED]: "#8b5cf6", // violet
  [ORDER_STATUS.CANCELLED]: "#ec4899", // pink
};

export const getOrderStatusHex = (status) => {
  const key = normalizeOrderStatus(status) || status;
  return (key && ORDER_STATUS_HEX[key]) || null;
};

export const ORDER_STATUS_BADGE_CLASS = {
  [ORDER_STATUS.PENDING]: "bg-indigo-100 text-indigo-800",
  [ORDER_STATUS.CONFIRMED]: "bg-indigo-100 text-indigo-800",
  [ORDER_STATUS.PAID]: "bg-amber-100 text-amber-800",
  [ORDER_STATUS.SHIPPED]: "bg-emerald-100 text-emerald-800",
  [ORDER_STATUS.DELIVERED]: "bg-violet-100 text-violet-800",
  [ORDER_STATUS.CANCELLED]: "bg-pink-100 text-pink-800",
};

export const ORDER_STATUS_FILTER_CLASS = {
  [ORDER_STATUS.PENDING]: {
    active: "bg-indigo-600 text-white",
    idle: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  },
  [ORDER_STATUS.CONFIRMED]: {
    active: "bg-indigo-600 text-white",
    idle: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  },
  [ORDER_STATUS.PAID]: {
    active: "bg-amber-500 text-white",
    idle: "bg-amber-100 text-amber-800 hover:bg-amber-200",
  },
  [ORDER_STATUS.SHIPPED]: {
    active: "bg-emerald-600 text-white",
    idle: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
  },
  [ORDER_STATUS.DELIVERED]: {
    active: "bg-violet-600 text-white",
    idle: "bg-violet-100 text-violet-800 hover:bg-violet-200",
  },
  [ORDER_STATUS.CANCELLED]: {
    active: "bg-pink-600 text-white",
    idle: "bg-pink-100 text-pink-800 hover:bg-pink-200",
  },
};
