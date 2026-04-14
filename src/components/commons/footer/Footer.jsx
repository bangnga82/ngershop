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
        <li className="footer__title">Cong ty...</li>
        <li className="footer__item">Dia chi: ...</li>
        <li className="footer__item">Email: ...</li>
        <li className="footer__item">Hotline: ...</li>
      </ul>
      <ul className="footer__list">
        <li className="footer__title">Ve chung toi</li>
        <li className="footer__item hover">Gioi thieu</li>
        <li className="footer__item hover">Lien he</li>
        <li className="footer__item hover">Tin tuc</li>
        <li className="footer__item hover">He thong cua hang</li>
        <li className="footer__item hover">San pham</li>
      </ul>
      <ul className="footer__list">
        <li className="footer__title">Dich vu khach hang</li>
        <li
          className="footer__item hover"
          onClick={() => navigate("/order-tracking")}
        >
          Kiem tra don hang
        </li>
        <li className="footer__item hover">Chinh sach van chuyen</li>
        <li className="footer__item hover">Chinh sach doi tra</li>
        <li className="footer__item hover">Bao mat khach hang</li>
        <li className="footer__item hover">Dang ky tai khoan</li>
      </ul>
    </div>
  );
};

export default Footer;
