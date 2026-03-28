import React, { useEffect, useState } from "react";
import "./Auth.scss";
import RegisterForm from "@/components/auth/register/RegisterForm";
import LoginForm from "@/components/auth/login/LoginForm";
import { useLocation } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const authModeClass = isLogin ? "is-login" : "is-register";
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    if (mode === "register") {
      setIsLogin(false);
    } else if (mode === "login") {
      setIsLogin(true);
    }
  }, [location.search]);

  return (
    <div className={`auth ${authModeClass}`}>
      <div className={`auth-card ${authModeClass}`}>
        <div className="auth-card_header">
          <div className="auth-logo">NgerShop</div>
          <div className="auth-sub">BEAUTY & COSMETICS</div>
        </div>

        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Đăng ký
          </button>
          <span className="auth-tabs_indicator" aria-hidden="true" />
        </div>

        <div className="auth-hero">
          <h2>{isLogin ? "Chào mừng bạn quay lại" : "Tạo tài khoản mới"}</h2>
          <p>
            {isLogin
              ? "Đăng nhập để tiếp tục."
              : "Đăng ký để bắt đầu trải nghiệm."}
          </p>
        </div>

        <div className="auth-card_body">
          {isLogin ? (
            <LoginForm setIsLogin={setIsLogin} compact />
          ) : (
            <RegisterForm setIsLogin={setIsLogin} compact />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
