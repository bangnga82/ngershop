/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import Layout from "@/components/commons/layout/Layout";
import TitleRouter from "@/components/product/titleRouter/TitleRouter";
import orderApi from "@/utils/api/orderApi";
import variantApi from "@/utils/api/variantApi";
import {
  buildAuthRedirectPath,
  isAuthenticated,
} from "@/utils/auth";
import {
  buildVariantLabel,
  resolveImageUrl,
} from "@/utils/api/mappers";
import { formatNumber } from "@/utils/function";
import { getOrderStatusLabelVi, normalizeOrderStatus } from "@/utils/orderStatus";
import { applyImageFallback, DEFAULT_IMAGE_FALLBACK_SRC } from "@/utils/imageFallback";

import "./OrderTracking.scss";

const mapOrderItemWithVariant = async (item) => {
  try {
    const res = await variantApi.getById(item.variantId);
    const variant = res?.data?.data;
    return {
      variantId: item.variantId,
      productId: variant?.productId || null,
      quantity: item.quantity,
      price: item.price,
      name: variant?.productName || `San pham ${item.variantId}`,
      imageUrl: resolveImageUrl(variant?.imageUrl) || DEFAULT_IMAGE_FALLBACK_SRC,
      variantLabel: buildVariantLabel(variant),
    };
  } catch (error) {
    return {
      variantId: item.variantId,
      productId: null,
      quantity: item.quantity,
      price: item.price,
      name: `San pham ${item.variantId}`,
      imageUrl: DEFAULT_IMAGE_FALLBACK_SRC,
      variantLabel: "",
    };
  }
};

const mapOrder = async (order) => {
  const items = await Promise.all((order?.items || []).map(mapOrderItemWithVariant));
  return {
    ...order,
    items,
  };
};

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("vi-VN");
};

const OrderTracking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const highlightedRef = searchParams.get("orderRef");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(buildAuthRedirectPath("/order-tracking"));
      return;
    }

    let isMounted = true;

    const loadOrders = async () => {
      try {
        setLoading(true);
        const res = await orderApi.getMyOrders({ page: 0, size: 20 });
        const items = res?.data?.data?.content || [];
        const enriched = await Promise.all(items.map(mapOrder));
        const sorted = enriched.sort(
          (a, b) => new Date(b?.createdDate || 0) - new Date(a?.createdDate || 0)
        );
        if (isMounted) {
          setOrders(sorted);
        }
      } catch (error) {
        if (error?.response?.status === 401) {
          navigate(buildAuthRedirectPath("/order-tracking"));
          return;
        }
        console.error("Load orders error:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const orderedList = useMemo(() => {
    if (!highlightedRef) return orders;
    const highlighted = orders.find((order) => order.reference === highlightedRef);
    if (!highlighted) return orders;
    return [highlighted, ...orders.filter((order) => order.reference !== highlightedRef)];
  }, [highlightedRef, orders]);

  return (
    <Layout>
      <div className="order-tracking-page">
        <TitleRouter title="Kiểm tra đơn hàng" />
        <div className="order-tracking-page__container">
          <h1>Đơn hàng của bạn</h1>
          {loading ? (
            <p className="order-tracking-page__empty">Đang tải đơn hàng...</p>
          ) : orderedList.length === 0 ? (
            <p className="order-tracking-page__empty">
              Bạn chưa có đơn hàng nào.
            </p>
          ) : (
            <div className="order-tracking-page__list">
              {orderedList.map((order) => {
                const isHighlighted = highlightedRef === order.reference;
                return (
                  <div
                    key={order.id}
                    className={`order-card ${isHighlighted ? "is-highlighted" : ""}`}
                  >
                    <div className="order-card__header">
                      <div>
                        <p className="order-card__label">Mã đơn hàng</p>
                        <h2>{order.reference}</h2>
                      </div>
                      <div className="order-card__meta">
                        <span className="order-card__status">
                          {getOrderStatusLabelVi(order.status) || order.status}
                        </span>
                        <p>
                          {normalizeOrderStatus(order.status) === "DELIVERED"
                            ? formatDate(order.deliveredAt)
                            : order.createdDate
                              ? new Date(order.createdDate).toLocaleString("vi-VN")
                              : ""}
                        </p>
                      </div>
                    </div>

                    <div className="order-card__items">
                      {order.items.map((item) => (
                        <div key={item.variantId} className="order-item">
                          <img
                            src={item.imageUrl || DEFAULT_IMAGE_FALLBACK_SRC}
                            alt={item.name}
                            onError={(event) => {
                              event.currentTarget.dataset.fallbackKey = String(item.variantId || item.name || "");
                              applyImageFallback(event);
                            }}
                          />
                          <div className="order-item__info">
                            <h3>{item.name}</h3>
                            {item.variantLabel && (
                              <p className="order-item__variant">
                                Phân loại: {item.variantLabel}
                              </p>
                            )}
                            <p>Số lượng: {item.quantity}</p>
                          </div>
                          <div className="order-item__price">
                            <p>{formatNumber(item.price)} d</p>
                            <span>
                              Tạm tính: {formatNumber(item.price * item.quantity)} d
                            </span>
                            {normalizeOrderStatus(order.status) === "DELIVERED" && item.productId && (
                              <button
                                type="button"
                                className="order-item__review"
                                onClick={() => {
                                  navigate(`/product/${item.productId}`, {
                                    state: { scrollTo: "reviews" },
                                  });
                                }}
                              >
                                Đánh giá
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="order-card__footer">
                      <p>
                        Tổng tiền: <span>{formatNumber(order.totalAmount || 0)} d</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderTracking;
