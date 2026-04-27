/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import {
  FaRegStar,
  FaRegStarHalfStroke,
  FaStar,
} from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

import reviewApi from "@/utils/api/reviewApi";
import {
  buildAuthRedirectPath,
  isAuthenticated,
} from "@/utils/auth";

import "./InformationDetail.scss";

const REVIEW_EMPTY_FORM = {
  rating: 5,
  comment: "",
};

const getInitial = (name = "") => {
  const trimmed = name.trim();
  return trimmed ? trimmed.charAt(0).toUpperCase() : "U";
};

const InformationDetail = ({ product, onReviewCreated, focusSection }) => {
  const navigate = useNavigate();
  const [typeMenu, setTypeMenu] = useState("info");
  const [rate, setRate] = useState(0);
  const [reviewForm, setReviewForm] = useState(REVIEW_EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const comments = product?.comments || [];
  const focusedProductRef = useRef(null);

  useEffect(() => {
    if (focusSection !== "reviews" || !product?.id) return;
    if (focusedProductRef.current === product.id) return;
    focusedProductRef.current = product.id;
    setTypeMenu("comment");
  }, [focusSection, product?.id]);

  useEffect(() => {
    if (focusSection !== "reviews") return;
    if (typeMenu !== "comment") return;
    const el = document.getElementById("product-reviews");
    el?.scrollIntoView?.({ behavior: "smooth", block: "start" });
  }, [focusSection, typeMenu]);

  useEffect(() => {
    if (!comments.length) {
      setRate(0);
      return;
    }
    const sumRate = comments.reduce((sum, item) => sum + (item.rating || 0), 0);
    setRate(sumRate / comments.length);
  }, [comments]);

  const handleSubmitReview = async () => {
    if (!product?.id) return;

    if (!isAuthenticated()) {
      navigate(
        buildAuthRedirectPath(
          `/product/${product.id}`,
          "login"
        )
      );
      return;
    }

    const trimmedComment = reviewForm.comment.trim();
    if (!trimmedComment) {
      alert("Vui long nhap noi dung danh gia.");
      return;
    }

    try {
      setSubmitting(true);
      const res = await reviewApi.create({
        productId: product.id,
        rating: reviewForm.rating,
        comment: trimmedComment,
      });
      onReviewCreated?.(res?.data?.data);
      setReviewForm(REVIEW_EMPTY_FORM);
      setTypeMenu("comment");
      alert("Da gui danh gia thanh cong.");
    } catch (error) {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Khong the gui danh gia.";
      alert(message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderAverageStars = () => (
    <>
      {Array.from({ length: Math.floor(rate) }, (_, i) => (
        <FaStar key={`filled-${i}`} />
      ))}
      {rate % 1 !== 0 && <FaRegStarHalfStroke />}
      {Array.from({ length: 5 - Math.ceil(rate) }, (_, i) => (
        <FaRegStar key={`empty-${i}`} />
      ))}
    </>
  );

  const renderReviewComposer = () => (
    <div className="comment__composer">
      <div className="comment__composer-header">
        <div>
          <h2>Viết đánh giá</h2>
          {/*<p>Chi danh gia sau khi don hang da duoc giao thanh cong.</p>*/}
        </div>
        <div className="comment__composer-stars">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={star <= reviewForm.rating ? "active" : ""}
              onClick={() =>
                setReviewForm((prev) => ({ ...prev, rating: star }))
              }
              aria-label={`Chon ${star} sao`}
            >
              <FaStar />
            </button>
          ))}
        </div>
      </div>

      <textarea
        value={reviewForm.comment}
        onChange={(event) =>
          setReviewForm((prev) => ({
            ...prev,
            comment: event.target.value,
          }))
        }
        placeholder="Cảm nhận của bạn về sản phẩm này..."
        rows={5}
      />

      <div className="comment__composer-actions">
        <span>{reviewForm.rating}/5 sao</span>
        <button
          type="button"
          onClick={handleSubmitReview}
          disabled={submitting}
        >
          {submitting ? "Dang gui..." : "Gui danh gia"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="infomation">
      <div data-aos="fade-up" className="infomation-menu">
        <ul className="infomation-menu__list">
          <li
            className={`${typeMenu === "info" ? "active" : ""}`}
            onClick={() => setTypeMenu("info")}
          >
            Thông tin sản phẩm
          </li>
          <li
            className={`${typeMenu === "exchangePolicy" ? "active" : ""}`}
            onClick={() => setTypeMenu("exchangePolicy")}
          >
            Chính sách đổi trả
          </li>
          <li
            className={`${typeMenu === "comment" ? "active" : ""}`}
            onClick={() => setTypeMenu("comment")}
          >
            Đánh giá sản phẩm
          </li>
        </ul>
      </div>
      {typeMenu === "info" && (
        <div data-aos="fade-up" className="info">
          {product.description}
        </div>
      )}
      {typeMenu === "exchangePolicy" && (
        <div data-aos="fade-up" className="exchangePolicy">
          {product.exchangePolicy}
        </div>
      )}
      {typeMenu === "comment" && (
        <div data-aos="fade-up" className="comment" id="product-reviews">
          <div className="comment__summary">
            <h1>{product.name}</h1>
            <div className="comment__summary-rate">
              <div className="comment__summary-rate-stars">
                <span className="comment__summary-rate-number">
                  {rate.toFixed(1)}
                </span>
                <span>{renderAverageStars()}</span>
              </div>
              <div className="comment__summary-rate-count">
                <span>{comments.length}</span> Đánh giá
              </div>
            </div>
          </div>

          {renderReviewComposer()}

          {comments.length === 0 ? (
            <div className="comment__no">Chưa có đánh giá nào</div>
          ) : (
            <div className="comment__list">
              {comments.map((comment) => (
                <div className="comment__item" key={comment.id}>
                  {comment.avatar ? (
                    <img
                      src={comment.avatar}
                      alt={comment.name}
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                        event.currentTarget.nextElementSibling?.classList.add(
                          "is-visible"
                        );
                      }}
                    />
                  ) : null}
                  <div
                    className={`comment__avatar-fallback ${
                      comment.avatar ? "" : "is-visible"
                    }`}
                    aria-hidden={comment.avatar ? "true" : "false"}
                  >
                    {getInitial(comment.name)}
                  </div>
                  <div className="comment__item-content">
                    <p className="name">{comment.name}</p>
                    <div className="rating">
                      {Array.from({ length: comment.rating }, (_, i) => (
                        <FaStar key={`review-star-${comment.id}-${i}`} />
                      ))}
                      {Array.from({ length: 5 - comment.rating }, (_, i) => (
                        <FaRegStar key={`review-empty-${comment.id}-${i}`} />
                      ))}
                    </div>
                    <p className="content">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InformationDetail;
