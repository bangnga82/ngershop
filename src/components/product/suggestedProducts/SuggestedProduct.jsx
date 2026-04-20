/* eslint-disable */
import React, { useEffect, useState } from "react";
import "./SuggestedProduct.scss";

import productApi from "@/utils/api/productApi";
import { mapProductToCard } from "@/utils/api/mappers";
import ProductItem from "@/components/product/discountedProduct/productItem/ProductItem";

const SUGGESTED_LIMIT = 6;

const SuggestedProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      try {
        // Fetch a bit more so we can filter out combo items without ending up empty.
        const res = await productApi.getProducts({
          page: 0,
          size: Math.max(20, SUGGESTED_LIMIT),
          status: true,
          sortedBy: "createdDate",
          sortDirection: "desc",
        });

        const items = res?.data?.data?.content || [];
        const mapped = items
          .map(mapProductToCard)
          .filter(
            (p) => String(p?.categoryName || "").trim().toLowerCase() !== "combo"
          )
          .slice(0, SUGGESTED_LIMIT);

        if (isMounted) setProducts(mapped);
      } catch (error) {
        console.error("Load suggested products error:", error);
        if (isMounted) setProducts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="tech-section suggested-products tech-section--suggested tech-section--dark">
      <div className="suggested-products__header tech-section__header">
        <h2>SAN PHAM GOI Y</h2>
        <p>Lua chon noi bat, de dang tim thay mon do phu hop.</p>
      </div>

      <div className="suggested-products__grid">
        {loading && <div className="suggested-products__state">Đang tải...</div>}
        {!loading && products.length === 0 && (
          <div className="suggested-products__state">
            Chưa có sản phẩm. Hãy thêm sản phẩm đang hoạt động để hiển thị tại đây.
          </div>
        )}
        {!loading &&
          products.map((item) => <ProductItem key={item.id} product={item} />)}
      </div>
    </section>
  );
};

export default SuggestedProduct;
