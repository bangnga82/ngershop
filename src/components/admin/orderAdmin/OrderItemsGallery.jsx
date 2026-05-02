import React from "react";

import ImageOrderGallery from "./ImageOrderGallery";
import { formatVND } from "@/utils/currency";

const OrderItemsGallery = ({ items }) => {
  const safeItems = items || [];
  const totalValue = safeItems.reduce(
    (sum, item) =>
      sum + Number(item.priceValue || 0) * Number(item.quantity || 0),
    0
  );

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin sản phẩm</h3>

      <ImageOrderGallery items={safeItems} />

      <div className="mt-6">
        <div className="text-sm text-gray-500 mb-2">Tóm tắt đơn hàng</div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-gray-600">Tổng đơn hàng:</div>
            <div className="text-right font-medium">
              {safeItems.length} sản phẩm
            </div>

            <div className="text-gray-600">Tổng:</div>
            <div className="text-right font-medium">{formatVND(totalValue)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsGallery;

