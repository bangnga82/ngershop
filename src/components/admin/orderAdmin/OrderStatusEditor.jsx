import React from "react";

import { ORDER_STATUS_OPTIONS } from "./orderStatusOptions";

const OrderStatusEditor = ({
  value,
  disabled = false,
  onChange,
  className = "",
}) => (
  <select
    value={value || "PENDING"}
    disabled={disabled}
    onChange={(event) => onChange?.(event.target.value)}
    className={`rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-orange-400 disabled:cursor-not-allowed disabled:bg-gray-100 ${className}`}
  >
    {ORDER_STATUS_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

export default OrderStatusEditor;
