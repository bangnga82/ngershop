/* eslint-disable */
import Banner from "@/components/commons/banner/Banner";
import Layout from "@/components/commons/layout/Layout";
import Category from "@/components/product/category/Category";
import DiscountedProduct from "@/components/product/discountedProduct/DiscountedProduct";
import SuggestedProduct from "@/components/product/suggestedProducts/SuggestedProduct";
import React from "react";
import BeautyCorner from "@/components/blog/BeautyCorner";
import RecentlyViewedProducts from "@/components/product/recentlyViewed/RecentlyViewedProducts";

const Home = () => {
    return (
        <div>
            <Layout>
                <Banner />
                <Category />
                <DiscountedProduct />
                <SuggestedProduct />
                <RecentlyViewedProducts limit={6} />
                <BeautyCorner />
                {/* Male/Female/Accessory/Comment currently render empty wrappers (UI commented out),
                    which creates a large blank area before the footer. Re-enable once implemented. */}
            </Layout>
        </div>
    );
};


export default Home;
