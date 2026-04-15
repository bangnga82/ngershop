/* eslint-disable */
import React from "react";
import "./Voucher.scss";

const Voucher = () => {
  const items = [
    {
      title: "7days",
      text: "Miễn phí trả trong 7 ngày",
    },
    {
      title: "Free",
      text: "Freeship mọi đơn hàng",
    },
    {
      title: "Shopping",
      text: "Mua sắm hàng chính hãng",
    },
  ];

  return (
    <section className="tech-strip">
      {items.map((item) => (
        <div key={item.title} className="tech-strip__item">
          <strong>{item.title}</strong>
          <span>{item.text}</span>
        </div>
      ))}
    </section>
  );
};

export default Voucher;
