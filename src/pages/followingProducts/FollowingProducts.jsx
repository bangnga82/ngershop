/* eslint-disable*/
import React, { useEffect, useMemo, useState } from "react";

import "./FollowingProducts.scss";
import Layout from "@/components/commons/layout/Layout";
import TitleRouter from "@/components/product/titleRouter/TitleRouter";
import ProductItem from "@/components/product/discountedProduct/productItem/ProductItem";
import { Pagination } from "antd";
import {
  FAVORITES_UPDATED_EVENT,
  getFavoriteProducts,
} from "@/utils/favoriteProducts";
const FollowingProducts = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [likeProducts, setLikeProducts] = useState(getFavoriteProducts());

  useEffect(() => {
    const syncFavorites = (event) => {
      setLikeProducts(event?.detail?.products || getFavoriteProducts());
    };

    window.addEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);
    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(likeProducts.length / 8));
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, likeProducts.length]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * 8;
    return likeProducts.slice(start, start + 8);
  }, [currentPage, likeProducts]);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };
  return (
    <Layout>
      <TitleRouter title="Yêu thích" />
      {likeProducts.length === 0 ? (
        <div className="following-products-empty">
          Chưa có sản phẩm yêu thích nào, hãy thêm vào nhé!
        </div>
      ) : (
        <div>
          <div className="following-products">
            {paginatedProducts.map((item) => (
              <ProductItem product={item} key={item.id} />
            ))}
          </div>
          <Pagination
            align="center"
            pageSize={8}
            total={likeProducts.length}
            current={currentPage}
            onChange={handleChangePage}
            style={{ marginBottom: "20px" }}
          />
        </div>
      )}
    </Layout>
  );
};

export default FollowingProducts;
