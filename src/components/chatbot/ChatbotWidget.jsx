/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import chatbotApi from "@/utils/api/chatbotApi";
import { getUserIdFromToken } from "@/utils/auth";
import { formatNumber } from "@/utils/function";
import { resolveImageUrl } from "@/utils/api/mappers";
import {
  CHATBOT_MESSAGES_KEY,
  CHATBOT_OPEN_KEY,
  CHATBOT_SESSION_KEY,
  CHATBOT_RESET_EVENT,
} from "@/utils/chatbotSession";

const CHATBOT_AUTO_HIDE_DELAY = 60000;

const defaultBotMessage = {
  id: "bot-welcome",
  role: "bot",
  text: "Xin chào!Bạn cần tư vấn gì?",
};

const readStoredMessages = () => {
  try {
    const raw = localStorage.getItem(CHATBOT_MESSAGES_KEY);
    if (!raw) return [defaultBotMessage];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [defaultBotMessage];

    // Migrate legacy welcome text if the conversation hasn't started yet.
    const first = parsed[0];
    if (
      parsed.length === 1 &&
      first?.id === defaultBotMessage.id &&
      first?.role === "bot" &&
      first?.text !== defaultBotMessage.text
    ) {
      return [defaultBotMessage];
    }

    return parsed;
  } catch {
    return [defaultBotMessage];
  }
};

const readStoredOpenState = () => {
  try {
    return localStorage.getItem(CHATBOT_OPEN_KEY) === "true";
  } catch {
    return false;
  }
};

const getChatbotSessionId = () => {
  try {
    const token = localStorage.getItem("accessToken");
    if (!token) return "guest";
    const userId = getUserIdFromToken(token);
    return userId !== null && userId !== undefined ? `user:${userId}` : `token:${token}`;
  } catch {
    return "guest";
  }
};

const ChatbotWidget = ({ onSend }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(readStoredOpenState);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState(readStoredMessages);
  const endRef = useRef(null);
  const autoHideTimeoutRef = useRef(null);
  const sessionRef = useRef(getChatbotSessionId());

  useEffect(() => {
    if (!isOpen) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  useEffect(() => {
    localStorage.setItem(CHATBOT_MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(CHATBOT_OPEN_KEY, String(isOpen));
  }, [isOpen]);

  useEffect(() => {
    const currentSessionId = getChatbotSessionId();
    const storedSessionId = localStorage.getItem(CHATBOT_SESSION_KEY);
    const previousSessionId = sessionRef.current;
    const hasSessionChanged =
      storedSessionId !== currentSessionId || previousSessionId !== currentSessionId;

    if (hasSessionChanged) {
      setMessages([defaultBotMessage]);
      setInputValue("");
      setIsSending(false);
      setIsOpen(false);
      localStorage.setItem(CHATBOT_MESSAGES_KEY, JSON.stringify([defaultBotMessage]));
      localStorage.setItem(CHATBOT_OPEN_KEY, "false");
    }

    localStorage.setItem(CHATBOT_SESSION_KEY, currentSessionId);
    sessionRef.current = currentSessionId;
  }, [location.pathname, location.search]);

  useEffect(() => {
    const handleReset = () => {
      const currentSessionId = getChatbotSessionId();
      sessionRef.current = currentSessionId;
      setMessages([defaultBotMessage]);
      setInputValue("");
      setIsSending(false);
      setIsOpen(false);
      try {
        localStorage.setItem(CHATBOT_MESSAGES_KEY, JSON.stringify([defaultBotMessage]));
        localStorage.setItem(CHATBOT_OPEN_KEY, "false");
        localStorage.setItem(CHATBOT_SESSION_KEY, currentSessionId);
      } catch {
        // ignore
      }
    };

    window.addEventListener(CHATBOT_RESET_EVENT, handleReset);
    return () => {
      window.removeEventListener(CHATBOT_RESET_EVENT, handleReset);
    };
  }, []);

  useEffect(() => {
    if (autoHideTimeoutRef.current) {
      clearTimeout(autoHideTimeoutRef.current);
    }

    if (!isOpen || isSending) {
      return undefined;
    }

    autoHideTimeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, CHATBOT_AUTO_HIDE_DELAY);

    return () => {
      if (autoHideTimeoutRef.current) {
        clearTimeout(autoHideTimeoutRef.current);
      }
    };
  }, [isOpen, isSending, messages, inputValue]);

  const pushMessage = (message) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, ...message }]);
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;

    setInputValue("");
    setIsOpen(true);
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
        replyText = response?.data?.reply || "Minh da nhan cau hoi. Vui long cho trong giay lat nhe.";
        products = response?.data?.products || [];
      }

      pushMessage({ role: "bot", text: replyText, products });
    } catch (error) {
      pushMessage({
        role: "bot",
        text: "Xin loi, hien tai minh chua the phan hoi. Ban thu lai giup minh nhe.",
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
    if (!priceInfo) return "Xem chi tiet";
    const formatted = formatNumber(priceInfo.value);
    return priceInfo.hasVariantPrice ? `Tu ${formatted}d` : `${formatted}d`;
  };

  const getProductImageUrl = (product) => {
    const imageUrl =
      product?.images?.[0]?.imageUrl ||
      product?.image?.[0] ||
      product?.imageUrl ||
      product?.variants?.find((variant) => variant?.imageUrl)?.imageUrl ||
      "";

    return resolveImageUrl(imageUrl);
  };

  const shouldHide = location.pathname.startsWith("/auth");
  if (shouldHide) return null;

  return (
    <div className="chatbot-widget">
      <button
        className="chatbot-fab"
        aria-label="Open chatbot"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="chatbot-fab-icon">Chat tu van</span>
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
            x
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
                      {message.products.slice(0, 5).map((product) => (
                        <Link
                          key={product?.id}
                          to={`/product/${product?.id}`}
                          className="chatbot-product"
                        >
                          <div className="chatbot-product-media">
                            {getProductImageUrl(product) ? (
                              <img
                                src={getProductImageUrl(product)}
                                alt={product?.name || "Product"}
                                className="chatbot-product-image"
                              />
                            ) : (
                              <div className="chatbot-product-image chatbot-product-image--placeholder">
                                N/A
                              </div>
                            )}
                          </div>
                          <div className="chatbot-product-content">
                            <div className="chatbot-product-name">{product?.name}</div>
                            <div className="chatbot-product-price">
                              {formatPrice(getDisplayPrice(product))}
                            </div>
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
              <div className="chatbot-bubble chatbot-bubble--typing">Đang trả lời...</div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        <div className="chatbot-input">
          <textarea
            rows={1}
            value={inputValue}
            placeholder="Nhap noi dung..."
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSend} disabled={!inputValue.trim() || isSending}>
            Gui
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotWidget;
