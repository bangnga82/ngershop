import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  useEffect(() => {
    alert("Thanh toan that bai.");
    navigate("/order", { replace: true });
  }, [navigate]);

  return null;
};

export default PaymentFailed;
