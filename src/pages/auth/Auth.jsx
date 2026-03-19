import React, { useState } from "react";
import "./Auth.scss";
import RegisterForm from "@/components/auth/register/RegisterForm";
import LoginForm from "@/components/auth/login/LoginForm";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="auth">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-logo">NgerShop</div>
            <div className="auth-sub">Beauty &amp; Cosmetics</div>
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
          </div>
          {isLogin ? (
            <LoginForm setIsLogin={setIsLogin} />
          ) : (
            <RegisterForm setIsLogin={setIsLogin} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
