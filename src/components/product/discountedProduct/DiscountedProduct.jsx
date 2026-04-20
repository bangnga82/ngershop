/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./DiscountedProduct.scss";
import productApi from "@/utils/api/productApi";
import { mapProductToCard } from "@/utils/api/mappers";
import ProductItem from "@/components/product/discountedProduct/productItem/ProductItem";

const COMBO_LIMIT = 6;

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
          size: COMBO_LIMIT,
          status: true,
          category: "Combo",
          sortedBy: "createdDate",
          sortDirection: "desc",
        });
        const items = res?.data?.data?.content || [];
        const mapped = items.map(mapProductToCard).slice(0, COMBO_LIMIT);
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
    <section className="tech-section combo-deals tech-section--combo-deals tech-section--dark">
      <div className="combo-deals__header tech-section__header">
        <h2>DEAL THEO COMBO</h2>
        <p>Tiết kiệm hơn khi mua theo combo</p>
      </div>
      <div className="combo-deals__grid">
        {loading && <div className="combo-deals__state">Đang tải...</div>}
        {!loading && combos.length === 0 && (
          <div className="combo-deals__state">
            Chưa có combo. Hãy thêm sản phẩm vào danh mục Combo.
          </div>
        )}
        {!loading &&
          combos.map((item) => <ProductItem key={item.id} product={item} />)}
      </div>
    </section>
  );
};

export default DiscountedProduct;
