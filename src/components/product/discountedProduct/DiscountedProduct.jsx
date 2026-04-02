/* eslint-disable */
import React from "react";
import "./DiscountedProduct.scss";

const DiscountedProduct = () => {
  const deals = [
    { title: "Combo duong am", desc: "Ngay va dem", tag: "-10%" },
    { title: "Combo son", desc: "Son li va tint", tag: "-20%" },
    { title: "Combo lam sach da", desc: "Tay trang va tay te bao chet", tag: "-15%" },
  ];

  return (
      <section className="tech-section">
        <div className="tech-section__header">
          <h2>Deal theo bo</h2>
          <p>Tiet kiem hon khi mua theo combo.</p>
        </div>
        <div className="tech-grid tech-grid--deals">
          {deals.map((item) => (
              <div key={item.title} className="tech-card tech-card--deal">
                <span className="tag">{item.tag}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <button className="btn btn--ghost">Xem ngay</button>
              </div>
          ))}
        </div>
      </section>
  );
};

export default DiscountedProduct;
