/* eslint-disable */
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { FaRegEye, FaEyeSlash, FaUserAlt, FaLock } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import authApi from "@/utils/api/authApi";


import "./LoginForm.scss";
import { loginValidationSchema } from "@/utils/validation/authValidation";
import ForgotPassword from "../forgotPassword/ForgotPassword";
import { useNavigate } from "react-router-dom";
const LoginForm = ({ setIsLogin, compact = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFogotPassword, setIsForgotPassword] = useState(false);
  const navigate = useNavigate();

  const initiateValues = {
    userName: "",
    password: "",
  };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const payload = {
                username: values.userName,
                password: values.password,
            };
            const res = await authApi.login(payload);
            const token = res?.data?.data?.token;
            if (token) {
                localStorage.setItem("accessToken", token);
            }
            navigate("/");
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Đăng nhập thất bại. Vui lòng thử lại.";
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const res = await authApi.googleLogin();
            const data = res?.data;
            const dataField = data?.data;
            const redirectUrl =
                (typeof dataField === "string" ? dataField : null) ||
                dataField?.redirectUrl ||
                dataField?.url ||
                data?.redirectUrl ||
                data?.url;
            if (typeof redirectUrl === "string" && redirectUrl.trim().length > 0) {
                window.location.href = redirectUrl;
                return;
            }
            alert("Không lấy được URL đăng nhập Google từ server.");
        } catch (error) {
            console.error("Google login error:", error);
            alert("Không gọi được API đăng nhập Google. Kiểm tra lại BE/CORS.");
        }
    };

  return (
    <div data-aos="fade-right" className={`login `}>
      <h1>Chào mừng bạn quay lại!</h1>
      <h2>Đăng nhập để tiếp tục.</h2>
      <div className="login-form">
        <Formik
          initialValues={initiateValues}
          validationSchema={loginValidationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="login-form_item">
                <label className="login-form_title" htmlFor="userName">
                  Tên đăng nhập
                </label>
                <div className="login-form_input-wrap">
                  <FaUserAlt className="input-icon" />
                  <Field
                    className="login-form_input"
                    type="text"
                    name="userName"
                    placeholder="Tên đăng nhập"
                  />
                </div>
                <ErrorMessage
                  name="userName"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <div className="login-form_item password">
                <label className="login-form_title" htmlFor="password">
                  Mật khẩu
                </label>
                <div className="login-form_input-wrap">
                  <FaLock className="input-icon" />
                  <Field
                    className="login-form_input"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Mật khẩu"
                  />
                  {showPassword ? (
                    <FaRegEye
                      className="eye"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <FaEyeSlash
                      className="eye"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  style={{ color: "red", fontSize: "12px" }}
                />
              </div>
              <button
                className="login-submit"
                type="submit"
                // onClick={() => navigate("/")}
              >
                Đăng nhập
              </button>
              <p
                className="p_forgotPassword"
                onClick={() => setIsForgotPassword(true)}
              >
                Quên mật khẩu?
              </p>
              <p className="login-switch">
                Bạn chưa có tài khoản?{" "}
                <span onClick={() => setIsLogin(false)}>Đăng ký</span>
              </p>
              {isFogotPassword && <ForgotPassword />}
              <div className="login-or">Hoặc</div>
              <div className="login-gg">
                <button type="button" onClick={handleGoogleLogin}
                >
                  <FcGoogle />
                  <p>Đăng nhập bằng Google</p>
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginForm;
