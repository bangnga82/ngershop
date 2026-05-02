import React, { useMemo } from "react";
import {
  BarChart2,
  DollarSign,
  Layers,
  LogOut,
  Mail,
  ShoppingBag,
  Sliders,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo.png";
import authApi from "@/utils/api/authApi";
import { clearAdminFlag, getAccessToken } from "@/utils/auth";
import { emitFavoriteProductsUpdated } from "@/utils/favoriteProducts";
import { emitRecentlyViewedUpdated } from "@/utils/recentlyViewedProducts";
import { resetChatbotStorage } from "@/utils/chatbotSession";

const NAV_ITEMS = [
  { name: "Tổng quan", icon: BarChart2, href: "/admin" },
  { name: "Danh mục", icon: TrendingUp, href: "/admin/categories" },
  { name: "Sản phẩm", icon: ShoppingBag, href: "/admin/products" },
  { name: "Các biển thể", icon: Layers, href: "/admin/variants" },
  { name: "Phân loại", icon: Sliders, href: "/admin/attributes" },
  { name: "Đơn hàng", icon: DollarSign, href: "/admin/orders" },
  { name: "Người dùng", icon: Users, href: "/admin/users" },
  { name: "Liên hệ", icon: Mail, href: "/admin/contact-messages" },
];

const TopNavAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isExpanded = true;
  const isLoggedIn = Boolean(getAccessToken());

  const activeHref = useMemo(() => {
    const path = (location.pathname || "/").replace(/\/+$/, "") || "/";
    // Exact match for /admin, prefix match for other sections.
    const exact = NAV_ITEMS.find((i) => i.href === path);
    if (exact) return exact.href;
    const prefix = NAV_ITEMS.find(
      (i) => i.href !== "/admin" && path.startsWith(i.href + "/")
    );
    return prefix?.href || null;
  }, [location.pathname]);

  const clearAuthTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessTokenExpiresAt");
    clearAdminFlag();
    emitFavoriteProductsUpdated();
    emitRecentlyViewedUpdated();
    resetChatbotStorage();
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // If token is expired/invalid, the API can fail; we still clear local auth state.
      console.error("Logout error:", error);
    } finally {
      clearAuthTokens();
      navigate("/auth?mode=login", { replace: true });
    }
  };

  return (
    <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/70 backdrop-blur-md">
      <div className="flex w-full items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        {/*<Link*/}
        {/*  to="/"*/}
        {/*  className="flex items-center gap-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"*/}
        {/*  aria-label="Go to home"*/}
        {/*>*/}
          <img
            src={logo}
            alt="NgerShop"
            className="h-24 w-24 object-contain"
          />
        {/*</Link>*/}

        <nav className="min-w-0 flex-1">
          <div className="flex w-full min-w-0 items-center justify-start gap-3 overflow-x-auto py-1 sm:gap-4 lg:justify-center lg:gap-5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeHref === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#FFF0F7] text-[#C2185B] hover:bg-[#FFE3F1] active:bg-[#FFE3F1]"
                      : "bg-[#FFD1E6] text-[#7A1E46] hover:bg-[#FFC1DE] active:bg-[#FFC1DE]"
                  }`}
                >
                  <Icon
                    size={18}
                    style={{ color: isActive ? "#C2185B" : "#7A1E46" }}
                  />
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.15 }}
                        className="whitespace-nowrap"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </div>
        </nav>

        {isLoggedIn && (
          <div className="flex shrink-0 items-center justify-end">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg bg-[#FFD1E6] px-3 py-2 text-sm font-medium text-[#7A1E46] transition-colors hover:bg-[#FFC1DE] active:bg-[#FFC1DE]"
            >
              <LogOut size={18} style={{ color: "#7A1E46" }} />
              <span className="whitespace-nowrap">Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopNavAdmin;
