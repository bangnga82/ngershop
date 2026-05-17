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
  text: "Xin chao! Ban can tu van gi?",
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

  // Heuristic guard for "meaningless" inputs (e.g. "rrrrrrrr", symbols-only).
  // This is intentionally lightweight and runs client-side before calling the chatbot API.
  const isValidKeyword = (text) => {
    const raw = String(text || "").trim();
    if (raw.length < 2) return false;

    // Reject inputs that are only punctuation/symbols/whitespace.
    // (Keep letters and digits from all languages.)
    try {
      if (!/[\p{L}\p{N}]/u.test(raw)) return false;
    } catch {
      if (!/[A-Za-z0-9]/.test(raw)) return false;
    }

    // Reject long runs of the same character (common spam / gibberish).
    const compact = raw.replace(/\s+/g, "");
    if (compact.length >= 4) {
      const uniq = new Set(compact.toLowerCase().split(""));
      if (uniq.size <= 1) return false;
    }

    // Allow multi-word queries and queries containing numbers.
    if (/\d/.test(raw) || /\s/.test(raw)) return true;

    // Prefer at least one vowel (after stripping diacritics).
    const ascii = raw
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return /[aeiouy]/.test(ascii);
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) return;

    setInputValue("");
    setIsOpen(true);
    pushMessage({ role: "user", text: trimmed });

    if (!isValidKeyword(trimmed)) {
      pushMessage({ role: "bot", text: "Vui lòng nhập từ khóa phù hợp." });
      return;
    }

    try {
      setIsSending(true);
      let replyText = "";
      let products = [];

      if (onSend) {
        const customReply = await onSend(trimmed);
        replyText = customReply || "";
      } else {
        // Send a small rolling window of conversation so the backend can infer multi-turn context.
        const rollingHistory = [...messages, { role: "user", text: trimmed }]
          .filter((m) => m && (m.role === "user" || m.role === "bot") && typeof m.text === "string")
          .slice(-10)
          .map((m) => ({ role: m.role, text: m.text }));

        const response = await chatbotApi.chat({
          message: trimmed,
          sessionId: sessionRef.current,
          history: rollingHistory,
        });
        replyText = response?.data?.reply || "Minh da nhan cau hoi. Vui long cho trong giay lat nhe.";
        products = response?.data?.products || [];
      }

      if (!Array.isArray(products) || products.length === 0) {
        pushMessage({ role: "bot", text: "Không có sản phẩm nào." });
      } else {
        pushMessage({ role: "bot", text: replyText, products });
      }
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


