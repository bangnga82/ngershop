import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { emitFavoriteProductsUpdated } from "@/utils/favoriteProducts";
import { emitRecentlyViewedUpdated } from "@/utils/recentlyViewedProducts";
import { ensureAdminStatus } from "@/utils/auth";

const OAuthCallback = () => {
    const navigate = useNavigate();
    const hasHandled = useRef(false);

    useEffect(() => {
        const run = async () => {
            if (hasHandled.current) {
                return;
            }
            hasHandled.current = true;
            const queryParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
            const token =
                queryParams.get("token") ||
                queryParams.get("accessToken") ||
                hashParams.get("token") ||
                hashParams.get("accessToken");
            if (token) {
                localStorage.setItem("accessToken", token);
                emitFavoriteProductsUpdated();
                emitRecentlyViewedUpdated();
                const isAdmin = await ensureAdminStatus().catch(() => false);
                navigate(isAdmin ? "/admin" : "/", { replace: true });
                return;
            }
            const existingToken = localStorage.getItem("accessToken");
            if (existingToken) {
                const isAdmin = await ensureAdminStatus().catch(() => false);
                navigate(isAdmin ? "/admin" : "/", { replace: true });
                return;
            }
            navigate("/auth", { replace: true });
        };
        run();
    }, [navigate]);

    return <div>Đang xử lý đăng nhập...</div>;
};

export default OAuthCallback;
