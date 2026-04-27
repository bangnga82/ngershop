/* eslint-disable*/
import React, { useEffect, useState } from "react";
import { Pagination } from "antd";

import productApi from "@/utils/api/productApi";
import { mapProductToCard } from "@/utils/api/mappers";

import ProductItem from "../../discountedProduct/productItem/ProductItem";
import "./ProductsContainer.scss";

const PAGE_SIZE = 8;

const SORT_OPTIONS = {
  DEFAULT: "default",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  PRICE_ASC: "price_asc",
  PRICE_DESC: "price_desc",
  CREATED_DESC: "created_desc",
  CREATED_ASC: "created_asc",
};

const ProductsContainer = ({ categoryName }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState(SORT_OPTIONS.DEFAULT);

  const handleChangePage = (page) => {
    setCurrentPage(page);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    // When switching category, always start from page 1 to avoid landing on an out-of-range page.
    setCurrentPage(1);
  }, [categoryName]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const sortParams = (() => {
      switch (sortOption) {
        case SORT_OPTIONS.NAME_ASC:
          return { sortedBy: "name", sortDirection: "asc" };
        case SORT_OPTIONS.NAME_DESC:
          return { sortedBy: "name", sortDirection: "desc" };
        case SORT_OPTIONS.PRICE_ASC:
          return { sortedBy: "price", sortDirection: "asc" };
        case SORT_OPTIONS.PRICE_DESC:
          return { sortedBy: "price", sortDirection: "desc" };
        case SORT_OPTIONS.CREATED_DESC:
          return { sortedBy: "createdDate", sortDirection: "desc" };
        case SORT_OPTIONS.CREATED_ASC:
          return { sortedBy: "createdDate", sortDirection: "asc" };
        case SORT_OPTIONS.DEFAULT:
        default:
          return {};
      }
    })();

    productApi
      .getProducts({
        page: currentPage - 1,
        size: PAGE_SIZE,
        category: categoryName,
        status: true,
        ...sortParams,
      })
      .then((res) => {
        const pageData = res?.data?.data;
        const items = pageData?.content || [];
        if (isMounted) {
          setProducts(items.map(mapProductToCard));
          setTotal(pageData?.totalElements || items.length);
        }
      })
      .catch((error) => {
        console.error("Load products error:", error);
        if (isMounted) {
          setProducts([]);
          setTotal(0);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [currentPage, categoryName, sortOption]);

  return (
    <div className="productsContainer">
      <div className="productsContainer__header">
        <h1>Tất cả sản phẩm</h1>
        <div className="productsContainer__header-search">
          <p>Sắp xếp theo</p>
          <select value={sortOption} onChange={handleSortChange}>
            <option value={SORT_OPTIONS.DEFAULT}>Mặc định</option>
            <option value={SORT_OPTIONS.NAME_ASC}>A - Z</option>
            <option value={SORT_OPTIONS.NAME_DESC}>Z - A</option>
            <option value={SORT_OPTIONS.PRICE_ASC}>Giá tăng dần</option>
            <option value={SORT_OPTIONS.PRICE_DESC}>Giá giảm dần</option>
            <option value={SORT_OPTIONS.CREATED_DESC}>Hàng mới nhất</option>
            <option value={SORT_OPTIONS.CREATED_ASC}>Hàng cũ nhất</option>
          </select>
        </div>
      </div>

      <div className="productsContainer__list">
        {!loading &&
          products.map((product, index) => (
            <ProductItem
              key={product.id || index}
              product={product}
              breadcrumbCategory={categoryName}
            />
          ))}
      </div>

      <Pagination
        align="center"
        pageSize={PAGE_SIZE}
        total={total}
        current={currentPage}
        onChange={handleChangePage}
        showSizeChanger={false}
        style={{ marginBottom: "20px" }}
      />
    </div>
  );
};

export default ProductsContainer;
