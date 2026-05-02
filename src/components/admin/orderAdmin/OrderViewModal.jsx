import { MapPin, Package, Truck, User, X } from "lucide-react";
import React, { useState } from "react";

import OrderItemsGallery from "./OrderItemsGallery";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderStatusEditor from "./OrderStatusEditor";
import { formatVND } from "@/utils/currency";

const OrderViewModal = ({ order, onClose, onStatusChange }) => {
  const [activeTab, setActiveTab] = useState("details");

  if (!order) return null;

  const orderCode = order.reference || order.id;
  const computedSubtotalValue =
    typeof order.subtotalValue === "number"
      ? order.subtotalValue
      : (order.items || []).reduce(
          (sum, item) =>
            sum + Number(item.priceValue || 0) * Number(item.quantity || 0),
          0
        );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0000009e] p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-semibold">Don hang #{orderCode}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "details"
                ? "border-b-2 border-[color:var(--accent)] text-[color:var(--accent)]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Chi tiet don hang
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "items"
                ? "border-b-2 border-[color:var(--accent)] text-[color:var(--accent)]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("items")}
          >
            Sản phẩm trong đơn ({order.items.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "details" ? (
            <div className="p-6">
              <div className="mb-6">
                <h4 className="mb-4 text-lg font-medium">Tổng quan đơn hàng</h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-start">
                      <div className="mr-3 rounded-lg bg-[color:var(--accent-soft)] p-2">
                        <Package className="h-5 w-5 text-[color:var(--accent)]" />
                      </div>
                      <div className="w-full">
                        <div className="text-sm font-medium">
                          Thông tin đơn hàng
                        </div>
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Mã đơn hàng:</div>
                            <div>{orderCode}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Ngày đặt:</div>
                            <div>
                              {new Date(order.orderDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Trạng thái:</div>
                            <div className="flex flex-col gap-2">
                              <OrderStatusBadge status={order.status} />
                              <OrderStatusEditor
                                value={order.rawStatus}
                                onChange={(nextStatus) =>
                                  onStatusChange?.(order.id, nextStatus)
                                }
                              />
                              <p className="text-xs text-gray-500">
                                Chuyển sang "Đã giao hàng" để khách hàng có thể viết đánh giá sản phẩm.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-start">
                      <div className="mr-3 rounded-lg bg-blue-100 p-2">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Thông tin người bán
                        </div>
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Tên người bán:</div>
                            <div>{order.sellerName}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Tên cửa hàng:</div>
                            <div>{order.storeName || "N/A"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Liên hệ:</div>
                            <div>{order.sellerContact || "N/A"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-start">
                      <div className="mr-3 rounded-lg bg-green-100 p-2">
                        <Truck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          Thông tin vận chuyển
                        </div>
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">
                              Phương thức vận chuyển:
                            </div>
                            <div>{order.shippingMethod || "Standard Delivery"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Phí vận chuyển:</div>
                            <div>{order.shippingFee || "Free"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Ngày giao hàng:</div>
                            <div>{order.estimatedDelivery || "N/A"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="flex items-start">
                      <div className="mr-3 rounded-lg bg-purple-100 p-2">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Địa chỉ nhận đơn</div>
                        <div className="mt-2 space-y-2 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Người nhận:</div>
                            <div>{order.recipient || "N/A"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Số điện thoại:</div>
                            <div>{order.recipientPhone || "N/A"}</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Địa chỉ:</div>
                            <div>{order.deliveryAddress || "N/A"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="mb-4 text-lg font-medium">Thông tin thanh toán</h4>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <div className="mb-1 text-sm text-gray-500">
                        Phương thức thanh toán
                      </div>
                      <div>{order.paymentMethod || "Credit Card"}</div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-gray-500">
                        Trạng thái thanh toán
                      </div>
                      <div
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          order.paymentStatus === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.paymentStatus || "Paid"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-medium">Tổng tiền đơn hàng</h4>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tổng tiền:</span>
                      <span>{order.subtotal || formatVND(computedSubtotalValue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phí vận chuyển:</span>
                      <span>{order.shippingFee || "Free"}</span>
                    </div>
                    {order.discount && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Giảm giá:</span>
                        <span className="text-green-600">-{order.discount}</span>
                      </div>
                    )}
                    {order.tax && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thuế:</span>
                        <span>{order.tax}</span>
                      </div>
                    )}
                    <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
                      <span>Thành tiền:</span>
                      <span>{order.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <OrderItemsGallery
              items={order.items}
              onClose={() => setActiveTab("details")}
            />
          )}
        </div>

        <div className="flex justify-end border-t p-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderViewModal;
