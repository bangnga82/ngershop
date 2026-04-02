/* eslint-disable */
import React from "react";
import "./Banner.scss";

const Banner = () => {
  return (
      <section className="tech-hero">
        <div className="tech-hero__content">
          <p className="tech-hero__eyebrow">NgerShop | My pham chinh hang</p>
          <h1>Mai tuoi - Mai xinh nha nguoi dep.</h1>
          <p className="tech-hero__sub">
            Hang moi moi tuan, chat luong, giao giao hang nhanh.
          </p>
          <div className="tech-hero__actions">
            <button className="btn btn--primary">Mua ngay</button>
            <button className="btn btn--ghost">Xem khuyen mai</button>
          </div>
          <div className="tech-hero__stats">
            <div>
              <strong>10k+</strong>
              <span>Khach hang tin dung</span>
            </div>
            <div>
              <strong>500+</strong>
              <span>San pham lam dep</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>Danh gia trung binh</span>
            </div>
          </div>
        </div>
        <div className="tech-hero__visual">
          <div className="glow" />
          <div className="device device--laptop" />
          <div className="device device--phone" />
          <div className="device device--buds" />
        </div>
      </section>
  );
};

export default Banner;
