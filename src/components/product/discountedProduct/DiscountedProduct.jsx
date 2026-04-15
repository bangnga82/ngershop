/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./DiscountedProduct.scss";
import productApi from "@/utils/api/productApi";
import { mapProductToCard } from "@/utils/api/mappers";
import { Link } from "react-router-dom";

const DiscountedProduct = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadCombos = async () => {
      setLoading(true);
      try {
        const res = await productApi.getProducts({
          page: 0,
          size: 6,
          status: true,
          category: "Combo",
        });
        const items = res?.data?.data?.content || [];
        const mapped = items.map(mapProductToCard);
        if (isMounted) {
          setCombos(mapped);
        }
      } catch (error) {
        console.error("Load combo products error:", error);
        if (isMounted) {
          setCombos([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCombos();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="tech-section">
      <div className="tech-section__header">
        <h2>DEAL THEO COMBO</h2>
        <p>Tiet kiem hon khi mua theo combo.</p>
      </div>
      <div className="tech-grid tech-grid--deals">
        {loading && (
          <div className="tech-card tech-card--deal">
            <h3>Dang tai...</h3>
            <p>Vui long doi.</p>
          </div>
        )}
        {!loading && combos.length === 0 && (
          <div className="tech-card tech-card--deal">
            <h3>Chua co combo</h3>
            <p>Hay them san pham vao danh muc Combo.</p>
          </div>
        )}
        {!loading &&
          combos.map((item) => (
            <div key={item.id} className="tech-card tech-card--deal">
              <span className="tag">Combo</span>
              {item.image?.[0] && (
                <div className="tech-card__media">
                  <img src={item.image[0]} alt={item.name} loading="lazy" />
                </div>
              )}
              <h3>{item.name}</h3>
              <p>{item.categoryName || ""}</p>
              <Link to={`/product/${item.id}`} className="btn btn--combo">
                Xem ngay
              </Link>
            </div>
          ))}
      </div>
    </section>
  );
};

export default DiscountedProduct;
