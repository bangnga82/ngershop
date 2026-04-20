/* eslint-disable */
import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";

import "./Footer.scss";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <div className="footer" data-aos="fade-up">
      <div className="header-desktop__logo">
        <img className="footer__logo-img" src={logo} alt="TechNova" />
      </div>
      <ul className="footer__list">
        <li className="footer__title">Cong ty: Mỹ phẩm NgerShop</li>
        <li className="footer__item">Dia chi: 266 P.Đội Cấn, Liễu Giai, Ba Đình, Hà Nội</li>
        <li className="footer__item">Email: bangnga@gmail.com</li>
        <li className="footer__item">Hotline: 0362648200</li>
      </ul>
      <ul className="footer__list">
        <li className="footer__title">Về chúng tôi</li>
        <li className="footer__item hover">Giới thiệu</li>
        <li className="footer__item hover">Liên hệ</li>
        <li className="footer__item hover">Tin tức</li>
        <li className="footer__item hover">Hệ thống cửa hàng</li>
        <li className="footer__item hover">Sản phẩm</li>
      </ul>
      <ul className="footer__list">
        <li className="footer__title">Dịch vụ khách hàng</li>
        <li
          className="footer__item hover"
          onClick={() => navigate("/order-tracking")}
        >
          Kiem tra don hang
        </li>
        <li className="footer__item hover">Chính sách vận chuyển</li>
        <li className="footer__item hover">Chính sách đổi trả</li>
        <li className="footer__item hover">Bảo mật khác hàng</li>
        <li className="footer__item hover">Đăng ký tài khoản</li>
      </ul>
    </div>
  );
};

export default Footer;
