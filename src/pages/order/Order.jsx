/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Order.scss";
import Layout from "@/components/commons/layout/Layout";
import LeftOrder from "@/components/order/leftOrder/LeftOrder";
import RightOrder from "@/components/order/rightOrder/RightOrder";
import { useDispatch, useSelector } from "react-redux";
import addressApi from "@/utils/api/addressApi";
import orderApi from "@/utils/api/orderApi";
import paymentApi from "@/utils/api/paymentApi";
import cartApi from "@/utils/api/cartApi";
import { setOrderList } from "@/store/orderSlice";
import AddAddressModal from "@/components/order/addAddressModal/AddAddressModal";

const Order = () => {
  const selectedProducts = useSelector((state) => state.order.orderList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [placing, setPlacing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const loadAddresses = async () => {
    try {
      const res = await addressApi.getOwn();
      const list = res?.data?.data || [];
      setAddresses(list);
      const defaultAddr = list.find((a) => a.isDefault) || list[0];
      setSelectedAddressId(defaultAddr?.id || null);
    } catch (error) {
      console.error("Load addresses error:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await addressApi.getOwn();
        const list = res?.data?.data || [];
        if (!isMounted) return;
        setAddresses(list);
        const defaultAddr = list.find((a) => a.isDefault) || list[0];
        setSelectedAddressId(defaultAddr?.id || null);
      } catch (error) {
        console.error("Load addresses error:", error);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleIncrease = (id) => {
    dispatch(
      setOrderList(
        selectedProducts.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    );
  };

  const handleDecrease = (id) => {
    dispatch(
      setOrderList(
        selectedProducts.map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      )
    );
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddAddress(true);
  };

  const handleUpsertAddress = async (payload) => {
    try {
      setSavingAddress(true);
      const res = editingAddress?.id
        ? await addressApi.update(editingAddress.id, payload)
        : await addressApi.create(payload);
      const saved = res?.data?.data;
      setShowAddAddress(false);
      await loadAddresses();
      if (saved?.id) setSelectedAddressId(saved.id);
    } catch (error) {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        (editingAddress?.id ? "Cap nhat dia chi that bai." : "Them dia chi that bai.");
      alert(message);
    } finally {
      setSavingAddress(false);
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setShowAddAddress(true);
  };

  const handlePlaceOrder = async () => {
    if (!selectedProducts.length) {
      alert("Khong co san pham de dat hang.");
      return;
    }
    if (!selectedAddressId) {
      alert("Vui long chon dia chi giao hang.");
      return;
    }
    const payload = {
      items: selectedProducts.map((item) => ({
        variantId: item.variantId || item.id,
        quantity: item.quantity,
      })),
      paymentMethod,
      addressId: selectedAddressId,
      notes: "",
      bankCode: null,
      language: "vn",
    };
    try {
      setPlacing(true);
      const res = await orderApi.create(payload);
      const order = res?.data?.data;
      if (paymentMethod === "VN_PAY" && order?.reference) {
        const paymentRes = await paymentApi.createVnpayLink(order.reference);
        const paymentUrl = paymentRes?.data?.data;
        if (paymentUrl) {
          window.location.href = paymentUrl;
          return;
        }
      }
      await Promise.all(
        selectedProducts.map((item) =>
          cartApi.removeItem(item.variantId || item.id)
        )
      );
      alert("Dat hang thanh cong.");
      dispatch(setOrderList([]));
      navigate(`/order-tracking?orderRef=${encodeURIComponent(order?.reference || "")}`, {
        replace: true,
      });
    } catch (error) {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Dat hang that bai.";
      alert(message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Layout>
      <div className="order">
        <LeftOrder
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          paymentMethod={paymentMethod}
          onSelectPayment={setPaymentMethod}
          onAddAddress={handleAddAddress}
          onEditAddress={handleEditAddress}
        />
        <RightOrder
          products={selectedProducts}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
          onPlaceOrder={placing ? () => {} : handlePlaceOrder}
        />
      </div>
      <AddAddressModal
        isOpen={showAddAddress}
        onClose={() => {
          if (!savingAddress) setShowAddAddress(false);
        }}
        onSubmit={handleUpsertAddress}
        submitting={savingAddress}
        initialData={editingAddress}
      />
    </Layout>
  );
};

export default Order;
