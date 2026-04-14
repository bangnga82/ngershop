import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import cartApi from "@/utils/api/cartApi";
import orderApi from "@/utils/api/orderApi";
import { setOrderList, setPrice } from "@/store/orderSlice";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let isMounted = true;

    const finishPayment = async () => {
      const orderRef = searchParams.get("orderRef");

      try {
        if (orderRef) {
          const res = await orderApi.getByReference(orderRef);
          const items = res?.data?.data?.items || [];
          await Promise.all(
            items.map((item) => cartApi.removeItem(item.variantId).catch(() => null))
          );
        }
      } catch (error) {
        console.error("Handle payment success error:", error);
      } finally {
        dispatch(setOrderList([]));
        dispatch(setPrice(0));
        if (isMounted) {
          alert("Thanh toan thanh cong.");
          navigate(
            `/order-tracking?orderRef=${encodeURIComponent(orderRef || "")}`,
            { replace: true }
          );
        }
      }
    };

    finishPayment();

    return () => {
      isMounted = false;
    };
  }, [dispatch, navigate, searchParams]);

  return null;
};

export default PaymentSuccess;
