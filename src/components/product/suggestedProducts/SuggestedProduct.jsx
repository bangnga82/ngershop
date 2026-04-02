/* eslint-disable */
import React, { useMemo } from "react";
import "./SuggestedProduct.scss";

const SuggestedProduct = () => {
  const featured = useMemo(
    () => [
      { id: "featured-1", name: "Featured Product 1", price: 199000 },
      { id: "featured-2", name: "Featured Product 2", price: 249000 },
      { id: "featured-3", name: "Featured Product 3", price: 299000 },
      { id: "featured-4", name: "Featured Product 4", price: 349000 },
    ],
    []
  );

  return (
      <section className="tech-section tech-section--dark">
        <div className="tech-section__header">
          <h2>San pham noi bat</h2>
          <p>De xuat boi nhan vien cham soc da NgerShop.</p>
        </div>
        <div className="tech-grid tech-grid--featured">
          {featured.map((item) => (
              <div key={item.id || item.name} className="tech-card tech-card--product">
                <div className="tech-card__badge">Moi</div>
                <div className="tech-card__media" />
                <h3>{item.name}</h3>
                <p className="tech-price">
                  {new Intl.NumberFormat("vi-VN").format(item.price)} d
                </p>
                <button className="btn btn--small">Them vao gio</button>
              </div>
          ))}
        </div>
      </section>
  );
};

export default SuggestedProduct;
