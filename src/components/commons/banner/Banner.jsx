/* eslint-disable */
import React, { useEffect, useState } from "react";
import productApi from "@/utils/api/productApi";
import { mapProductToCard } from "@/utils/api/mappers";
import bannerLarge from "@/assets/images/banner-large.png";
import bannerMedium from "@/assets/images/banner-medium.png";
import "./Banner.scss";

const Banner = () => {
  const [lipstick, setLipstick] = useState(null);

  useEffect(() => {
    let isMounted = true;
    productApi
      .getProducts({ page: 0, size: 20, status: true })
      .then((res) => {
        const items = res?.data?.data?.content || [];
        const mapped = items
          .map(mapProductToCard)
          .filter((item) => item.image?.[0]);
        const lipstickItem =
          mapped.find((item) =>
            String(item.name || "").toLowerCase().includes("3ce")
          ) ||
          mapped.find((item) =>
            String(item.name || "").toLowerCase().includes("son")
          ) ||
          null;
        if (isMounted) setLipstick(lipstickItem || null);
      })
      .catch((error) => {
        console.error("Load banner products error:", error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

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
        <div className="device device--laptop">
          <img src={bannerLarge} alt="Featured beauty" />
        </div>
        <div className="device device--phone">
          <img src={bannerMedium} alt="Makeup set" />
        </div>
        <div className="device device--buds">
          {lipstick ? (
            <img src={lipstick.image[0]} alt={lipstick.name} />
          ) : null}
        </div>
      </div>
    </section>
  );
};

export default Banner;
