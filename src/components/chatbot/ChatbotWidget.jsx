/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";

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

    if (!onSend) {
      setIsSending(true);
      setTimeout(() => {
        pushMessage({
          role: "bot",
          text: "Mình đã nhận câu hỏi. Vui lòng chờ trong giây lát nhé.",
        });
        setIsSending(false);
      }, 700);
      return;
    }

    try {
      setIsSending(true);
      const reply = await onSend(trimmed);
      if (reply) {
        pushMessage({ role: "bot", text: reply });
      }
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
              <div className="chatbot-bubble">{message.text}</div>
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
