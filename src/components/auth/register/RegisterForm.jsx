/* eslint-disable */
import { ErrorMessage, Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { FaRegEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import "./RegisterForm.scss";
import authApi from "@/utils/api/authApi";
import { registerValidationSchema } from "@/utils/validation/authValidation";
const RegisterForm = ({ setIsLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const initiateValues = {
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: "",
        confirmPassword: "",
    };

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                username: values.userName,
                password: values.password,
                confirmPassword: values.confirmPassword,
            };
            const res = await authApi.register(payload);
            const message =
                res?.data?.message ||
                "ÄÄƒng kÃ½ thÃ nh cÃ´ng. Vui lÃ²ng Ä‘Äƒng nháº­p.";
            alert(message);
            resetForm();
            setIsLogin(true);
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "ÄÄƒng kÃ½ tháº¥t báº¡i. Vui lÃ²ng thá»­ láº¡i.";
            alert(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div data-aos="fade-right" className={`register `}>
            <h1>Tạo tài khoản</h1>
            <div className="register-form">
                <Formik
                    initialValues={initiateValues}
                    validationSchema={registerValidationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <div className="register-form_item">
                                <label className="register-form_title" htmlFor="firstName">
                                    Họ
                                </label>
                                <div className="register-form_input-wrap">
                                    <Field
                                        className="register-form_input"
                                        type="text"
                                        name="firstName"
                                        placeholder="Họ"
                                    />
                                </div>
                                <ErrorMessage
                                    name="firstName"
                                    component="div"
                                    style={{ color: "red", fontSize: "12px" }}
                                />
                            </div>
                            <div className="register-form_item">
                                <label className="register-form_title" htmlFor="lastName">
                                    Tên
                                </label>
                                <div className="register-form_input-wrap">
                                    <Field
                                        className="register-form_input"
                                        type="text"
                                        name="lastName"
                                        placeholder="Tên"
                                    />
                                </div>
                                <ErrorMessage
                                    name="lastName"
                                    component="div"
                                    style={{ color: "red", fontSize: "12px" }}
                                />
                            </div>
                            <div className="register-form_item">
                                <label className="register-form_title" htmlFor="email">
                                    Email
                                </label>
                                <div className="register-form_input-wrap">
                                    <Field
                                        className="register-form_input"
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                    />
                                </div>
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    style={{ color: "red", fontSize: "12px" }}
                                />
                            </div>
                            <div className="register-form_item">
                                <label className="register-form_title" htmlFor="userName">
                                    Tên đăng nhập
                                </label>
                                <div className="register-form_input-wrap">
                                    <Field
                                        className="register-form_input"
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
                            <div className="register-form_item password">
                                <label className="register-form_title" htmlFor="password">
                                    Mật khẩu
                                </label>
                                <div className="register-form_input-wrap">
                                    <Field
                                        className="register-form_input"
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
                            <div className="register-form_item password">
                                <label
                                    className="register-form_title"
                                    htmlFor="confirmPassword"
                                >
                                    Xác nhận mật khẩu
                                </label>
                                <div className="register-form_input-wrap">
                                    <Field
                                        className="register-form_input"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                    {showConfirmPassword ? (
                                        <FaRegEye
                                            className="eye"
                                            onClick={() => setShowConfirmPassword(false)}
                                        />
                                    ) : (
                                        <FaEyeSlash
                                            className="eye"
                                            onClick={() => setShowConfirmPassword(true)}
                                        />
                                    )}
                                </div>
                                <ErrorMessage
                                    name="confirmPassword"
                                    component="div"
                                    style={{ color: "red", fontSize: "12px" }}
                                />
                            </div>
                            <button className="register-submit" type="submit">
                                Đăng ký
                            </button>
                            <div className="register-gg">
                                <button type="button">
                                    <FcGoogle />
                                    <p>Đăng ký bằng Google</p>
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default RegisterForm;