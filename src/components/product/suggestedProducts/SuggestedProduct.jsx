/* eslint-disable */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartApi from "@/utils/api/cartApi";
import productApi from "@/utils/api/productApi";
import { mapProductToCard } from "@/utils/api/mappers";
import { buildAuthRedirectPath, isAuthenticated } from "@/utils/auth";
import "./SuggestedProduct.scss";

const SuggestedProduct = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadFeaturedProducts = async () => {
      try {
        const res = await productApi.getProducts({
          page: 0,
          size: 4,
          status: true,
          sortedBy: "createdDate",
          sortDirection: "desc",
        });
        const items = res?.data?.data?.content || [];
        if (!isMounted) return;
        setFeatured(items.map(mapProductToCard));
      } catch (error) {
        if (!isMounted) return;
        console.error("Load featured products error:", error);
        setFeatured([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFeaturedProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenProduct = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (event, item) => {
    event.stopPropagation();

    const variants = item?.variants || [];
    if (variants.length > 1) {
      navigate(`/product/${item?.id}`);
      return;
    }

    const variantId = variants[0]?.id;
    if (!variantId) {
      alert("San pham chua co bien the de mua.");
      return;
    }

    if (!isAuthenticated()) {
      navigate(buildAuthRedirectPath(`/product/${item?.id}`));
      return;
    }

    try {
      await cartApi.addItem(variantId, 1);
      alert("Da them vao gio hang.");
    } catch (error) {
      if (error?.response?.status === 401) {
        navigate(buildAuthRedirectPath(`/product/${item?.id}`));
        return;
      }
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Them vao gio hang that bai.";
      alert(message);
    }
  };

  return (
    <section className="tech-section tech-section--dark">
      <div className="tech-section__header">
        <h2>GOI Y CHAM DA MUA HE</h2>
        <p>De xuat boi nhan vien cham soc da NgerShop.</p>
      </div>
      <div className="tech-grid tech-grid--featured">
        {isLoading && <p>Dang tai san pham...</p>}
        {!isLoading && featured.length === 0 && <p>Chua co san pham noi bat.</p>}
        {featured.map((item) => (
          <div
            key={item.id || item.name}
            className="tech-card tech-card--product"
            onClick={() => handleOpenProduct(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleOpenProduct(item.id);
              }
            }}
          >
            <div className="tech-card__badge">Moi</div>
            <div className="tech-card__media">
              <img
                src={item?.image?.[0] || "/vite.svg"}
                alt={item?.name}
                loading="lazy"
              />
            </div>
            <h3>{item.name}</h3>
            <p className="tech-price">{new Intl.NumberFormat("vi-VN").format(item.price)} d</p>
            <button className="btn btn--small" onClick={(event) => handleAddToCart(event, item)}>
              Them vao gio
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SuggestedProduct;
