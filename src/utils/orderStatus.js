export const ORDER_STATUS = Object.freeze({
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  PAID: "PAID",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
});

export const ORDER_STATUS_LABEL_VI = Object.freeze({
  [ORDER_STATUS.PENDING]: "Đang chờ",
  [ORDER_STATUS.CONFIRMED]: "Đang xử lý",
  [ORDER_STATUS.PAID]: "Đã thanh toán",
  [ORDER_STATUS.SHIPPED]: "Đang giao hàng",
  [ORDER_STATUS.DELIVERED]: "Đã giao hàng",
  [ORDER_STATUS.CANCELLED]: "Đã hủy",
});

const STATUS_ALIASES_TO_ENUM = Object.freeze({
  Pending: ORDER_STATUS.PENDING,
  Processing: ORDER_STATUS.CONFIRMED,
  Confirmed: ORDER_STATUS.CONFIRMED,
  Paid: ORDER_STATUS.PAID,
  Shipping: ORDER_STATUS.SHIPPED,
  Shipped: ORDER_STATUS.SHIPPED,
  Delivered: ORDER_STATUS.DELIVERED,
  Cancelled: ORDER_STATUS.CANCELLED,
  Canceled: ORDER_STATUS.CANCELLED,
  SHIPPING: ORDER_STATUS.SHIPPED, // legacy typo in some UIs
});

export const normalizeOrderStatus = (value) => {
  if (!value) return null;

  const raw = String(value).trim();
  if (!raw) return null;

  // Already enum?
  const upper = raw.toUpperCase();
  if (ORDER_STATUS[upper]) return ORDER_STATUS[upper];

  // Title-case / label aliases (dashboard, older UIs).
  if (STATUS_ALIASES_TO_ENUM[raw]) return STATUS_ALIASES_TO_ENUM[raw];

  return null;
};

export const getOrderStatusLabelVi = (value) => {
  const key = normalizeOrderStatus(value);
  return (key && ORDER_STATUS_LABEL_VI[key]) || (value ? String(value) : "");
};

