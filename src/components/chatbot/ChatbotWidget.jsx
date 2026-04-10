/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import chatbotApi from "@/utils/api/chatbotApi";
import { formatNumber } from "@/utils/function";

const defaultBotMessage = {
  id: "bot-welcome",
  role: "bot",
  text: "Xin chào! Bạn cần tư vấn sản phẩm hay đơn hàng?",
};

const ChatbotWidget = ({ onSend }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([defaultBotMessage]);
  const endRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const pushMessage = (message) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, ...message }]);
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;
    setInputValue("");
    pushMessage({ role: "user", text: trimmed });

    try {
      setIsSending(true);
      let replyText = "";
      let products = [];
      if (onSend) {
        const customReply = await onSend(trimmed);
        replyText = customReply || "";
      } else {
        const response = await chatbotApi.chat(trimmed);
        replyText = response?.data?.reply || "Mình đã nhận câu hỏi. Vui lòng chờ trong giây lát nhé.";
        products = response?.data?.products || [];
      }

      pushMessage({ role: "bot", text: replyText, products });
    } catch (error) {
      pushMessage({
        role: "bot",
        text: "Xin lỗi, hiện tại mình chưa thể phản hồi. Bạn thử lại giúp mình nhé.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const getDisplayPrice = (product) => {
    const prices = Array.isArray(product?.variants)
      ? product.variants
          .map((variant) => variant?.price)
          .filter((price) => typeof price === "number")
      : [];
    if (prices.length > 0) {
      return { value: Math.min(...prices), hasVariantPrice: true };
    }
    if (typeof product?.price === "number") {
      return { value: product.price, hasVariantPrice: false };
    }
    return null;
  };

  const formatPrice = (priceInfo) => {
    if (!priceInfo) return "Xem chi tiết";
    const formatted = formatNumber(priceInfo.value);
    return priceInfo.hasVariantPrice ? `Từ ${formatted}đ` : `${formatted}đ`;
  };

  return (
    <div className="chatbot-widget">
      <button
        className="chatbot-fab"
        aria-label="Open chatbot"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="chatbot-fab-icon">Chat tư vấn</span>
      </button>

      <div className={`chatbot-panel ${isOpen ? "chatbot-panel--open" : ""}`}>
        <div className="chatbot-header">
          <div>
            <p className="chatbot-title">Trợ lý NgerShop</p>
            <p className="chatbot-subtitle">Hỗ trợ 24/7 • Phản hồi nhanh</p>
          </div>
          <button
            className="chatbot-close"
            aria-label="Close chatbot"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
        </div>

        <div className="chatbot-body">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`chatbot-message chatbot-message--${message.role}`}
            >
              <div className="chatbot-bubble">
                <p className="chatbot-text">{message.text}</p>
                {message.role === "bot" &&
                  Array.isArray(message.products) &&
                  message.products.length > 0 && (
                    <div className="chatbot-products">
                      {message.products.slice(0, 4).map((product) => (
                        <Link
                          key={product?.id}
                          to={`/product/${product?.id}`}
                          className="chatbot-product"
                        >
                          <div className="chatbot-product-name">
                            {product?.name}
                          </div>
                          <div className="chatbot-product-price">
                            {formatPrice(getDisplayPrice(product))}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="chatbot-message chatbot-message--bot">
              <div className="chatbot-bubble chatbot-bubble--typing">
                Đang trả lời...
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="chatbot-input">
          <textarea
            rows={1}
            value={inputValue}
            placeholder="Nhập nội dung..."
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend} disabled={!inputValue.trim() || isSending}>
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
