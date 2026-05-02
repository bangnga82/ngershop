import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  getOrderStatusCounts,
  sortOrders,
  exportOrdersToExcel,
} from "@/components/admin/orderAdmin/orderExcel";
import OrderFilters from "@/components/admin/orderAdmin/OrderFilters";
import OrderList from "@/components/admin/orderAdmin/OrderList";
import OrderViewModal from "@/components/admin/orderAdmin/OrderViewModal";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import { getOrderStatusLabelVi } from "@/utils/orderStatus";
import orderApi from "@/utils/api/orderApi";
import { resolveImageUrl } from "@/utils/api/mappers";
import { normalizeOrderStatus } from "@/utils/orderStatus";
import { coerceNumber, formatVND } from "@/utils/currency";

const placeholderItem = {
  image: "/vite.svg",
  description: "",
  size: "N/A",
};

const formatDateRange = (from, to) => {
  if (!from || !to) return null;
  const fromDate = new Date(from);
  const toDate = new Date(to);
  if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime())) return null;
  const a = fromDate.toLocaleDateString("vi-VN");
  const b = toDate.toLocaleDateString("vi-VN");
  return `${a} - ${b}`;
};

const formatDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("vi-VN");
};

const mapOrderToAdmin = (order) => {
  const items =
    order?.items?.map((item) => ({
      id: item.variantId,
      name: item.productName || `Variant ${item.variantId}`,
      priceValue: coerceNumber(item.price, 0),
      price: formatVND(item.price),
      quantity: item.quantity,
      subtotalValue: coerceNumber(item.price, 0) * coerceNumber(item.quantity, 0),
      subtotal: formatVND(coerceNumber(item.price, 0) * coerceNumber(item.quantity, 0)),
      ...placeholderItem,
      image: resolveImageUrl(item.imageUrl) || placeholderItem.image,
    })) || [];

  const rawStatus = order?.status || "PENDING";
  const normalized = normalizeOrderStatus(rawStatus) || rawStatus;
  const etaRange = formatDateRange(order?.estimatedDeliveryFrom, order?.estimatedDeliveryTo);
  const deliveredDate = formatDate(order?.deliveredAt);
  const totalAmountValue = coerceNumber(order?.totalAmount, 0);
  return {
    id: order?.id,
    reference: order?.reference || order?.id,
    orderDate: order?.createdDate || new Date().toISOString(),
    sellerName: "NgerShop",
    storeName: "NgerShop Official",
    sellerContact: "N/A",
    rawStatus,
    status: rawStatus,
    statusLabel: getOrderStatusLabelVi(rawStatus),
    shippingMethod: "Standard Delivery",
    shippingFee: order?.shippingFee ?? "Free",
    // If delivered, show the actual delivered date. If shipping, show ETA range.
    estimatedDelivery:
      normalized === "DELIVERED"
        ? deliveredDate || "N/A"
        : normalized === "SHIPPED" && etaRange
          ? etaRange
          : "N/A",
    recipient: order?.recipient || "N/A",
    recipientPhone: order?.recipientPhone || "N/A",
    deliveryAddress: order?.deliveryAddress || "N/A",
    paymentMethod: order?.paymentMethod || "N/A",
    paymentStatus:
      rawStatus === "PAID" || rawStatus === "DELIVERED" ? "Paid" : "Pending",
    subtotalValue: totalAmountValue,
    subtotal: formatVND(totalAmountValue),
    discount: null,
    tax: null,
    totalAmountValue,
    totalAmount: formatVND(totalAmountValue),
    items,
  };
};

const OrderAdminPage = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "orderDate",
    direction: "desc",
  });
  const [ordersPerPage, setOrdersPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    let isMounted = true;
    orderApi
      .adminGetAll({ page: 0, size: 50 })
      .then((res) => {
        const items = res?.data?.data?.content || [];
        if (isMounted) setOrders(items.map(mapOrderToAdmin));
      })
      .catch((error) => {
        console.error("Load orders error:", error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const statusCounts = useMemo(() => getOrderStatusCounts(orders), [orders]);

  const filteredOrders = orders.filter(
    (order) =>
      (String(order.reference || order.id)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        order.sellerName.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (statusFilter === "All" || order.status === statusFilter)
  );

  const sortedOrders = sortOrders(filteredOrders, sortConfig);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleStatusChange = async (orderId, nextStatus) => {
    try {
      const res = await orderApi.changeStatus(orderId, nextStatus);
      const updated = mapOrderToAdmin(res?.data?.data);

      setOrders((prev) =>
        prev.map((order) => (order.id === orderId ? updated : order))
      );
      setSelectedOrder((prev) => (prev?.id === orderId ? updated : prev));
    } catch (error) {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Khong the cap nhat trang thai don hang.";
      alert(message);
    }
  };

  const handleExportExcel = () => {
    exportOrdersToExcel(filteredOrders);
  };

  return (
    <>
      <HeaderAdmin title={"Đơn hàng"} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 10, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <OrderFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            onExportExcel={handleExportExcel}
            statusCounts={statusCounts}
            totalCount={orders.length}
          />

          <OrderList
            orders={sortedOrders}
            currentPage={currentPage}
            ordersPerPage={ordersPerPage}
            totalOrders={sortedOrders.length}
            onPageChange={setCurrentPage}
            onOrdersPerPageChange={setOrdersPerPage}
            onViewOrder={handleViewOrder}
            onStatusChange={handleStatusChange}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
          {showModal && selectedOrder && (
            <OrderViewModal
              order={selectedOrder}
              onStatusChange={handleStatusChange}
              onClose={() => setShowModal(false)}
            />
          )}
        </motion.div>
      </main>
    </>
  );
};

export default OrderAdminPage;
