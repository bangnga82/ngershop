/* eslint-disable */
import React from "react";
import "./Voucher.scss";

const Voucher = () => {
  const items = [
    "Mien phi doi tra 7 ngay",
    "Free ship moi don hang",
    "Mua la co qua",
    "Mua sam hang chuan",
  ];

  return (
      <section className="tech-strip">
        {items.map((text) => (
            <div key={text} className="tech-strip__item">
              {text}
            </div>
        ))}
      </section>
  );
};

export default Voucher;
