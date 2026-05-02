/* eslint-disable */
import React, { useEffect, useMemo, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./RightSession.scss";
import { formatNumber } from "@/utils/function";
import cartApi from "@/utils/api/cartApi";
import { setOrderList, setPrice } from "@/store/orderSlice";
import { buildAuthRedirectPath, isAuthenticated } from "@/utils/auth";
import {
    FAVORITES_UPDATED_EVENT,
    getFavoriteProducts,
    isFavoriteProduct,
    toggleFavoriteProduct,
} from "@/utils/favoriteProducts";

const RightSession = ({
    product,
    selectedType = null,
    previewType = 0,
    onSelectType,
    onPreviewType,
}) => {
    const [infoSelect, setInfoSelect] = useState({
        quantity: "1",
    });
    const [isLike, setIsLike] = useState(false);
    const [likeProducts, setLikeProducts] = useState(getFavoriteProducts());
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const variants = product?.variants || [];
    const activeType = selectedType ?? previewType;
    const selectedVariant = useMemo(() => {
        if (activeType == null) return null;
        return variants[activeType] || null;
    }, [activeType, variants]);
    const unitPrice =
        selectedVariant?.price != null ? selectedVariant.price : product?.price;
    const discount = Number(product?.discount || 0);
    const hasDiscount = discount > 0;
    const requiresVariantSelection = variants.length > 1;

    useEffect(() => {
        setIsLike(isFavoriteProduct(product?.id));
    }, [product?.id, likeProducts]);

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

    const ensureVariantSelected = () => {
        if (requiresVariantSelection && selectedType == null) {
            navigate(`/product/${product?.id}`);
            return false;
        }
        return true;
    };

    const handleAddToCart = async () => {
        if (!ensureVariantSelected()) return;
        const variantId = selectedVariant?.id;
        const selectedVariantLabel = product?.types?.[activeType] || "";
        if (!variantId) {
            alert("San pham chua co bien the de mua.");
            return;
        }
        if (!isAuthenticated()) {
            navigate(buildAuthRedirectPath(`/product/${product?.id}`));
            return;
        }
        const qty = Math.max(1, Number(infoSelect.quantity || 1));
        try {
            await cartApi.addItem(variantId, qty, selectedVariantLabel);
            alert("Đã thêm vào giỏ hàng.");
        } catch (error) {
            if (error?.response?.status === 401) {
                navigate(buildAuthRedirectPath(`/product/${product?.id}`));
                return;
            }
            const message =
                error?.response?.data?.data?.message ||
                error?.response?.data?.message ||
                "Thêm vào giỏ hàng thât bại.";
            alert(message);
        }
    };

    const handleBuyNow = async () => {
        if (!ensureVariantSelected()) return;
        const variantId = selectedVariant?.id;
        if (!variantId) {
            alert("San pham chua co bien the de mua.");
            return;
        }
        if (!isAuthenticated()) {
            navigate(buildAuthRedirectPath(`/product/${product?.id}`));
            return;
        }
        const quantity = Math.max(1, Number(infoSelect.quantity || 1));
        const orderItem = {
            id: variantId,
            variantId,
            name: product?.name || "",
            image: product?.images || ["/vite.svg"],
            price: Number(unitPrice || 0),
            quantity,
            discount,
            type: product?.types?.[activeType] || "",
            fromCart: false,
        };

        dispatch(setOrderList([orderItem]));
        dispatch(setPrice(orderItem.price * orderItem.quantity));
        navigate("/order");
    };

    const handleToggleFavorite = () => {
        toggleFavoriteProduct({
            id: product?.id,
            name: product?.name || "",
            image: product?.images?.length ? product.images : ["/vite.svg"],
            discount,
            price: Number(product?.price || 0),
            count: product?.count ?? 0,
            variants: product?.variants || [],
        });
    };

    return (
        <div className="right-session">
            <div className="right-session__product-name">
                <h1>{product.name}</h1>
                <div className="right-session__product-name__icons">
                    {isLike ? (
                            <FaHeart
                            onClick={handleToggleFavorite}
                            style={{ fontSize: "24px", cursor: "pointer", color: "var(--accent)" }}
                        />
                    ) : (
                        <FaRegHeart
                            onClick={handleToggleFavorite}
                            style={{ fontSize: "24px", cursor: "pointer" }}
                        />
                    )}
                    <button>{product.status}</button>
                </div>
            </div>
            <div className="right-session__price">
                {hasDiscount && (
                    <span className="right-session__price__sale">
                        {formatNumber(unitPrice * (1 - discount / 100))} d
                    </span>
                )}
                <span
                    className={`right-session__price__real ${
                        hasDiscount ? "is-original" : "is-current"
                    }`}
                >
          {formatNumber(unitPrice)} d
        </span>
            </div>
            <div className="right-session__type">
                <p>Phân loại</p>
                <div className="right-session__type__buttons">
                    {(product.types || ["Default"]).map((type, index) => (
                        <button
                            onMouseEnter={() => onPreviewType?.(index)}
                            onFocus={() => onPreviewType?.(index)}
                            onTouchStart={() => onPreviewType?.(index)}
                            onClick={() => {
                                onPreviewType?.(index);
                                onSelectType?.(index);
                            }}
                            key={index}
                            className={`${
                                (selectedType ?? previewType) === index ? "active" : ""
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
            <div className="right-session__quantity-group">
                <p>Số lượng</p>
                <div className="right-session__quantity-group__quantity">
                    <div className="right-session__quantity-group__quantity-buttons">
                        <button
                            onClick={() =>
                                setInfoSelect({
                                    ...infoSelect,
                                    quantity:
                                        Number(infoSelect.quantity) > 1
                                            ? Number(infoSelect.quantity) - 1
                                            : 1,
                                })
                            }
                        >
                            -
                        </button>
                        <input
                            name="quantity"
                            value={infoSelect.quantity}
                            onChange={(e) =>
                                setInfoSelect({ ...infoSelect, quantity: e.target.value })
                            }
                        />
                        <button
                            onClick={() =>
                                setInfoSelect({
                                    ...infoSelect,
                                    quantity: Number(infoSelect.quantity) + 1,
                                })
                            }
                        >
                            +
                        </button>
                    </div>
                    {/*<p>Tim kiem san pham tuong tu</p>*/}
                </div>
            </div>
            <div className="right-session__button">
                <button className="right-session__button-add" onClick={handleAddToCart}>
                    Thêm vào giỏ hàng
                </button>
                <button className="right-session__button-buy" onClick={handleBuyNow}>
                    Mua ngay
                </button>
            </div>
        </div>
    );
};

export default RightSession;
