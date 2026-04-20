/* eslint-disable */
import React from "react";

import "./SwiperHeader.scss";

const SwiperHeader = () => {
    return (
        <div className="swiper-header">
            <div className="swiper-header__items" role="list">
                <div className="swiper-header__item" role="listitem">
                    <span className="swiper-header__text">NgerShop: Hàng mới về hàng tuần</span>
                </div>
                <div className="swiper-header__item" role="listitem">
                    <span className="swiper-header__text">Quà xinh - Phụ kiện dễ thương</span>
                </div>
                <div className="swiper-header__item" role="listitem">
                    <span className="swiper-header__text">Da xinh tự tin đón hè</span>
                </div>
            </div>
        </div>
    );
};

export default SwiperHeader;
