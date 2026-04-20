/* eslint-disable */
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineHeart } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { GrCart } from "react-icons/gr";
import { IoNotificationsOutline } from "react-icons/io5";
import { MdOutlineAccountCircle } from "react-icons/md";

import logo from "@/assets/images/logo.png";
import { setInputValue, setResult } from "@/store/searchSlice";
import authApi from "@/utils/api/authApi";
import cartApi, { CART_UPDATED_EVENT } from "@/utils/api/cartApi";
import notificationApi from "@/utils/api/notificationApi";
import productApi from "@/utils/api/productApi";
import { mapProductToCard } from "@/utils/api/mappers";
import { clearAdminFlag, ensureAdminStatus } from "@/utils/auth";

import Menu from "./Menu";

import "./HeaderDesktop.scss";

const HeaderDesktop = () => {
  const [inputText, setInputText] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const accountRef = useRef(null);
  const notificationRef = useRef(null);
  const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resultFake = [];

  const getCartCount = (items = []) =>
    (items || []).reduce(
      (total, item) => total + Math.max(0, Number(item?.quantity || 0)),
      0
    );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setIsShow(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setIsAdmin(false);
      setCartCount(0);
      setUnreadCount(0);
      setNotifications([]);
      return;
    }

    let isMounted = true;

    ensureAdminStatus()
      .then((value) => {
        if (isMounted) setIsAdmin(value);
      })
      .catch(() => {
        if (isMounted) setIsAdmin(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setCartCount(0);
      return;
    }

    let isMounted = true;

    const loadCartCount = async () => {
      try {
        const res = await cartApi.getCart();
        if (!isMounted) return;
        setCartCount(getCartCount(res?.data?.data?.items || []));
      } catch (error) {
        if (!isMounted) return;
        if (error?.response?.status === 401) {
          setCartCount(0);
          return;
        }
        console.error("Load cart count error:", error);
      }
    };

    const handleCartUpdated = (event) => {
      if (!isMounted) return;
      setCartCount(getCartCount(event?.detail?.items || []));
    };

    loadCartCount();
    window.addEventListener(CART_UPDATED_EVENT, handleCartUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener(CART_UPDATED_EVENT, handleCartUpdated);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    if (!isLoggedIn) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let isMounted = true;
    let streamHandle = null;

    const loadNotifications = async () => {
      try {
        const [listRes, unreadRes] = await Promise.all([
          notificationApi.getAll({ page: 0, size: 6 }),
          notificationApi.getUnreadCount(),
        ]);
        if (!isMounted) return;
        setNotifications(listRes?.data?.data?.content || []);
        setUnreadCount(Number(unreadRes?.data?.data || 0));
      } catch (error) {
        if (!isMounted) return;
        if (error?.response?.status === 401) {
          setNotifications([]);
          setUnreadCount(0);
          return;
        }
        console.error("Load notifications error:", error);
      }
    };

    loadNotifications();

    notificationApi
      .subscribe({
        onMessage: ({ data }) => {
          if (!isMounted || !data?.id) return;
          setNotifications((prev) => [data, ...prev].slice(0, 6));
          setUnreadCount((prev) => prev + (data.read ? 0 : 1));
        },
        onError: (error) => {
          if (!isMounted) return;
          console.error("Notification stream error:", error);
        },
      })
      .then((handle) => {
        if (!isMounted) {
          handle?.close?.();
          return;
        }
        streamHandle = handle;
      })
      .catch((error) => {
        if (!isMounted) return;
        console.error("Subscribe notifications error:", error);
      });

    return () => {
      isMounted = false;
      streamHandle?.close?.();
    };
  }, [isLoggedIn]);

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) return "";
    try {
      return new Date(createdAt).toLocaleString("vi-VN");
    } catch {
      return "";
    }
  };

  const handleKeyPress = async (event) => {
    if (event.key !== "Enter") return;
    const keyword = inputText.trim();
    if (!keyword) return;

    dispatch(setInputValue(keyword));

    try {
      const res = await productApi.search(keyword);
      const items = res?.data?.data || [];
      dispatch(setResult(items.map(mapProductToCard)));
    } catch (error) {
      console.error("Search error:", error);
      dispatch(setResult(resultFake));
    }

    navigate("/search");
    dispatch(setInputValue(""));
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessTokenExpiresAt");
      clearAdminFlag();
      setIsShow(false);
      setIsNotificationOpen(false);
      navigate("/auth");
    }
  };

  const handleToggleAccount = () => {
    setIsNotificationOpen(false);
    setIsShow((prev) => !prev);
  };

  const handleToggleNotifications = () => {
    setIsShow(false);
    setIsNotificationOpen((prev) => !prev);
  };

  const handleReadNotification = async (notification) => {
    if (!notification?.id) return;

    try {
      if (!notification.read) {
        await notificationApi.markRead(notification.id);
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id ? { ...item, read: true } : item
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      setIsNotificationOpen(false);
      if (notification.type === "ORDER" || notification.type === "PAYMENT") {
        navigate("/order-tracking");
      } else if (notification.type === "CONTACT" && isAdmin) {
        const openId = notification.referenceId || notification.id;
        navigate(`/admin/contact-messages?open=${encodeURIComponent(openId)}`);
      }
    } catch (error) {
      console.error("Mark notification read error:", error);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Mark all notifications read error:", error);
    }
  };

  return (
    <div className="header-desktop">
      <div className="header-desktop__search">
        <div onClick={() => navigate("/")} className="header-desktop__logo">
          <img className="header-desktop__logo-img" src={logo} alt="NgerShop" />
          <span className="header-desktop__logo-text">NgerShop</span>
        </div>

        <div className="header-desktop__search-input">
          <button className="header-desktop__search-input-button">
            <FiSearch className="header-desktop__search-input-icon1" />
          </button>
          <input
            onChange={(event) => setInputText(event.target.value)}
            className="header-desktop__search-i"
            onKeyDown={handleKeyPress}
            value={inputText}
            type="text"
            placeholder="Tìm kiếm sản phẩm"
          />
        </div>

        <div className="header-desktop__group-icon">
          <div
            className="header-desktop__group-icon-item flex items-center justify-center flex-col"
            onClick={() => navigate("/followingProducts/1")}
          >
            <AiOutlineHeart className="header-desktop_group-i" />
            <p className="header-desktop_group-p">Yêu thích</p>
          </div>

          {isLoggedIn && (
            <div ref={notificationRef} className="header-desktop__notification">
              <div
                className="header-desktop__group-icon-item flex items-center justify-center flex-col"
                onClick={handleToggleNotifications}
              >
                <div className="header-desktop__cart-icon-wrapper">
                  <IoNotificationsOutline className="header-desktop_group-i" />
                  {unreadCount > 0 && (
                    <span className="header-desktop__cart-badge">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
                <p className="header-desktop_group-p">Thông báo</p>
              </div>

              {isNotificationOpen && (
                <div className="header-desktop__notification-panel">
                  <div className="header-desktop__notification-header">
                    <div>
                        <h4>Thông báo</h4>
                        <span>{unreadCount} chưa đọc</span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllNotificationsRead}
                      >
                          Đọc tất cả
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="header-desktop__notification-empty">
                      Chưa có thông báo nào.
                    </div>
                  ) : (
                    <div className="header-desktop__notification-list">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          type="button"
                          className={`header-desktop__notification-item ${
                            notification.read ? "is-read" : ""
                          }`}
                          onClick={() => handleReadNotification(notification)}
                        >
                          <div className="header-desktop__notification-item-top">
                            <strong>{notification.title}</strong>
                            {!notification.read && <span />}
                          </div>
                          <p>{notification.message}</p>
                          <small>
                            {formatNotificationTime(notification.createdAt)}
                          </small>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div
            className="header-desktop__group-icon-item flex items-center justify-center flex-col"
            onClick={() => navigate("/cart")}
          >
            <div className="header-desktop__cart-icon-wrapper">
              <GrCart className="header-desktop_group-i" />
              {cartCount > 0 && (
                <span className="header-desktop__cart-badge">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </div>
            <p className="header-desktop_group-p">Giỏ hàng</p>
          </div>

          <div
            ref={accountRef}
            className="header-desktop__account"
          >
            <div
              className="header-desktop__group-icon-item flex items-center justify-center flex-col"
              onClick={handleToggleAccount}
            >
              <MdOutlineAccountCircle className="header-desktop_group-i" />
              <p className="header-desktop_group-p">Tài khoản</p>
            </div>

            {isShow && (
              <div className="header-desktop__group-icon-item-child">
                {isLoggedIn ? (
                  <>
                    {isAdmin && <p onClick={() => navigate("/admin")}>Admin</p>}
                    <p onClick={() => navigate("/account")}>Tài khoản</p>
                    <p onClick={() => navigate("/order-tracking")}>
                      Đơn hàng
                    </p>
                    <p onClick={handleLogout}>Đăng xuất</p>
                  </>
                ) : (
                  <>
                    <p onClick={() => navigate("/auth?mode=register")}>
                      Đăng ký
                    </p>
                    <p onClick={() => navigate("/auth?mode=login")}>
                      Đăng nhập
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-desktop__menu">
        <Menu />
      </div>
    </div>
  );
};

export default HeaderDesktop;
