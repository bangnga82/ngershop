/* eslint-disable */
import Banner from "@/components/commons/banner/Banner";
import Layout from "@/components/commons/layout/Layout";
import Category from "@/components/product/category/Category";
import Accessory from "@/components/product/collection/accessory/Accessory";
import Female from "@/components/product/collection/female/Female";
import Male from "@/components/product/collection/male/Male";
import Comment from "@/components/product/comment/Comment";
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
                <BeautyCorner />
                <RecentlyViewedProducts limit={6} />
                <Male />
                <Female />
                <Accessory/>
                <Comment />
            </Layout>
        </div>
    );
};


export default Home;
