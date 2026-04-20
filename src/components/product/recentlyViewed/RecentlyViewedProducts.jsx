/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import ProductItem from "@/components/product/discountedProduct/productItem/ProductItem";
import {
  getRecentlyViewedProducts,
  RECENTLY_VIEWED_UPDATED_EVENT,
} from "@/utils/recentlyViewedProducts";
import "./RecentlyViewedProducts.scss";

const RecentlyViewedProducts = ({ title = "BẠN ĐÃ XEM GẦN ĐÂY", limit = 6 }) => {
  const [items, setItems] = useState(() => getRecentlyViewedProducts());

  useEffect(() => {
    const sync = (event) => {
      const next = event?.detail?.products || getRecentlyViewedProducts();
      setItems(Array.isArray(next) ? next : []);
    };

    window.addEventListener(RECENTLY_VIEWED_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(RECENTLY_VIEWED_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const visible = useMemo(() => {
    const list = Array.isArray(items) ? items : [];
    return list.slice(0, Math.max(1, limit));
  }, [items, limit]);

  if (!visible.length) return null;

  return (
    <section className="recently-viewed tech-section" data-aos="fade-up">
      <div className="recently-viewed__header">
        <h2>{title}</h2>
      </div>

      <div className="recently-viewed__grid">
        {visible.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default RecentlyViewedProducts;
