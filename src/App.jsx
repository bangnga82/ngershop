/* eslint-disable */
import React, { useEffect } from "react";
import { useRoutes } from "react-router-dom";
import Home from "./pages/home/Home";
import AOS from "aos";
import "aos/dist/aos.css";
import DetailProduct from "./pages/product/DetailProduct/DetailProduct";
import Search from "./pages/product/search/Search";
import Cart from "./pages/cart/Cart";
import Auth from "./pages/auth/Auth";
import OAuthCallback from "./pages/auth/OAuthCallback";
import Account from "./pages/account/Account";
import ProductsByCategory from "./pages/productsByCategory/ProductsByCategory";
import ContactPage from "./pages/contact/ContactPage";
import MarketSystemPage from "./pages/market-system/MarketSystemPage";
import Order from "./pages/order/Order";
import BlogList from "./components/blog/BlogList";
import BlogDetail from "./components/blog/BlogDetail";
import SearchResultPage from "./pages/blog/SearchResultPage";
import Overview from "./pages/admin/Overview";
import LayoutAdmin from "./pages/admin/LayoutAdmin";
import ProductAdminPage from "./pages/admin/ProductAdminPage";
import ProductVariantAdminPage from "./pages/admin/ProductVariantAdminPage";
import ProductAttributeAdminPage from "./pages/admin/ProductAttributeAdminPage";
import OrderAdminPage from "./pages/admin/OrderAdminPage";
import CategoryAdminPage from "./pages/admin/CategoryAdminPage";
import UserAdminPage from "./pages/admin/UserAdminPage";
import ContactAdminPage from "./pages/admin/ContactAdminPage";
import FollowingProducts from "./pages/followingProducts/FollowingProducts";
import AdminGuard from "./components/commons/guards/AdminGuard";
import ChatbotWidget from "./components/chatbot/ChatbotWidget";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentFailed from "./pages/payment/PaymentFailed";
import OrderTracking from "./pages/order-tracking/OrderTracking";
const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Thời gian hiệu ứng (ms)
      once: true, // Chỉ chạy một lần khi cuộn
    });
  }, []);

  const routes = useRoutes([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/product/:id",
      element: <DetailProduct />,
    },
    {
      path: "/search",
      element: <Search />,
    },
    {
      path: "/cart",
      element: <Cart />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/auth/callback",
      element: <OAuthCallback />,
    },
    {
      path: "/account",
      element: <Account />,
    },
    {
      path: "/productsByCategory/:categoryName",
      element: <ProductsByCategory />,
    },
    {
      path: "/contact",
      element: <ContactPage />,
    },
    {
      path: "/market-system",
      element: <MarketSystemPage />,
    },
    {
      path: "/order",
      element: <Order />,
    },
    {
      path: "/order-tracking",
      element: <OrderTracking />,
    },
    {
      path: "/blog",
      element: <BlogList />,
    },
    {
      path: "/blog/:slug",
      element: <BlogDetail />,
    },
    {
      path: "/search-blog",
      element: <SearchResultPage />,
    },
    {
      path: "/admin",
      element: (
        <AdminGuard>
          <LayoutAdmin />
        </AdminGuard>
      ),
      children: [
        { index: true, element: <Overview /> },
        { path: "categories", element: <CategoryAdminPage /> },
        { path: "products", element: <ProductAdminPage /> },
        { path: "variants", element: <ProductVariantAdminPage /> },
        { path: "attributes", element: <ProductAttributeAdminPage /> },
        { path: "orders", element: <OrderAdminPage /> },
        { path: "users", element: <UserAdminPage /> },
        { path: "contact-messages", element: <ContactAdminPage /> },
      ],
    },
    {
      path: "/followingProducts/:id",
      element: <FollowingProducts />,
    },
    {
      path: "/payment-success",
      element: <PaymentSuccess />,
    },
    {
      path: "/payment-failed",
      element: <PaymentFailed />,
    },
  ]);
  return (
    <>
      {routes}
      <ChatbotWidget />
    </>
  );
};

export default App;
