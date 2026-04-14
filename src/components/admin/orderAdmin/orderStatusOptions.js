export const ORDER_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Processing" },
  { value: "PAID", label: "Paid" },
  { value: "SHIPPED", label: "Shipping" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const ORDER_STATUS_LABELS = ORDER_STATUS_OPTIONS.reduce(
  (acc, option) => ({
    ...acc,
    [option.value]: option.label,
  }),
  {}
);
