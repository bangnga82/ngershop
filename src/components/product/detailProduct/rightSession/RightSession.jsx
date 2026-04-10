/* eslint-disable */
import React, { useMemo, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import "./RightSession.scss";
import { formatNumber } from "@/utils/function";
import cartApi from "@/utils/api/cartApi";
import { setOrderList, setPrice } from "@/store/orderSlice";
import { buildAuthRedirectPath, isAuthenticated } from "@/utils/auth";

const RightSession = ({ product, selectedType = 0, onSelectType }) => {
    const [infoSelect, setInfoSelect] = useState({
        quantity: "1",
    });
    const [isLike, setIsLike] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const variants = product?.variants || [];
    const selectedVariant = useMemo(
        () => variants[selectedType],
        [variants, selectedType]
    );
    const unitPrice =
        selectedVariant?.price != null ? selectedVariant.price : product?.price;
    const discount = Number(product?.discount || 0);
    const hasDiscount = discount > 0;

    const handleAddToCart = async () => {
        const variantId = selectedVariant?.id;
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
            await cartApi.addItem(variantId, qty);
            alert("Da them vao gio hang.");
        } catch (error) {
            if (error?.response?.status === 401) {
                navigate(buildAuthRedirectPath(`/product/${product?.id}`));
                return;
            }
            const message =
                error?.response?.data?.data?.message ||
                error?.response?.data?.message ||
                "Them vao gio hang that bai.";
            alert(message);
        }
    };

    const handleBuyNow = async () => {
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
            type: product?.types?.[selectedType] || "",
        };

        dispatch(setOrderList([orderItem]));
        dispatch(setPrice(orderItem.price * orderItem.quantity));
        navigate("/order");
    };

    return (
        <div className="right-session">
            <div className="right-session__product-name">
                <h1>{product.name}</h1>
                <div className="right-session__product-name__icons">
                    {isLike ? (
                        <FaHeart
                            onClick={() => setIsLike(!isLike)}
                            style={{ fontSize: "24px", cursor: "pointer", color: "#ff6347" }}
                        />
                    ) : (
                        <FaRegHeart
                            onClick={() => setIsLike(!isLike)}
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
                <p>Phan loai</p>
                <div className="right-session__type__buttons">
                    {(product.types || ["Default"]).map((type, index) => (
                        <button
                            onMouseEnter={() => onSelectType?.(index)}
                            onFocus={() => onSelectType?.(index)}
                            onClick={() => onSelectType?.(index)}
                            key={index}
                            className={`${selectedType === index ? "active" : ""}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>
            <div className="right-session__quantity-group">
                <p>So luong</p>
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
                    <p>Tim kiem san pham tuong tu</p>
                </div>
            </div>
            <div className="right-session__button">
                <button className="right-session__button-add" onClick={handleAddToCart}>
                    Them vao gio hang
                </button>
                <button className="right-session__button-buy" onClick={handleBuyNow}>
                    Mua ngay
                </button>
            </div>
        </div>
    );
};

export default RightSession;
