/* eslint-disable */
import React from "react";
import { formatNumber } from "@/utils/function";

import "./CartItem.scss";

const CartItem = ({
  product,
  selectedProducts,
  onToggleSelect,
  onIncrease,
  onDecrease,
  onRemove,
}) => {
  const isSelected = selectedProducts.some((p) => p.id === product.id);
  const variantText = product?.type?.trim();

  return (
    <div className="card-item">
      <button
        type="button"
        className="card-item__remove"
        onClick={() => onRemove(product.id)}
        aria-label={`Xoa ${product.name} khoi gio hang`}
      >
        x
      </button>

      <div className="card-item__left">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(product.id)}
        />

        <img
          src={product.image?.[0] || "/vite.svg"}
          alt={product.name || "product"}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = "/vite.svg";
          }}
        />

        <div className="card-item__left-info">
          <h3>{product.name}</h3>
          {variantText ? (
            <div className="variant-group">
              <span className="variant-label">Phan loai</span>
              <p className="variant">{variantText}</p>
            </div>
          ) : null}
          <p className="price">
            <span className="sale">{formatNumber(product.price)} d</span>
          </p>
          <div className="quantity">
            <button onClick={() => onDecrease(product.id)}>-</button>
            <span>{product.quantity}</span>
            <button onClick={() => onIncrease(product.id)}>+</button>
          </div>
          <p className="price__res">
            {formatNumber(product.quantity * product.price)} d
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
