import React from "react";
import SearchBox from "./SearchBox";
import { blogData } from "./blogData";
import { getCategories, getPopularTags } from "./helper.js";
import { motion } from "framer-motion";
import {
  applyImageFallback,
  DEFAULT_IMAGE_FALLBACK_SRC,
} from "@/utils/imageFallback";
const SidebarBlog = ({onBlogSelect}) => {
  const categories = getCategories();
  const popularTags = getPopularTags();

  const beautyCategories = [
    "Cách chăm sóc da",
    "Góc review",
    "Xu hướng trang điểm",
    "Bí quyết khỏe đẹp",
    "Tin tức",
  ];

  const featuredBlog =
    blogData.find((b) => beautyCategories.includes(b.category)) || blogData[0];
	return (
		<div className="bg-white rounded-lg shadow p-6 space-y-8">
			<SearchBox blogs={blogData} />
			<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">Tư vấn mỹ phẩm</h2>
        {featuredBlog && (
          <div className="mb-6" onClick={() => onBlogSelect(featuredBlog.slug)} >
              <img 
                src={featuredBlog.thumbnail || DEFAULT_IMAGE_FALLBACK_SRC} 
                alt={featuredBlog.title} 
                className="w-full h-50 object-cover rounded-lg mb-2"
                data-fallback-key={featuredBlog.slug}
                onError={applyImageFallback}
              />
              <h3 className="font-semibold text-gray-800 mb-2 hover:text-[color:var(--accent)] cursor-pointer duration-300">
                {featuredBlog.title}
              </h3>
            </div>
        )}
      </motion.div>
      <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Từ khóa phổ biến</h2>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition cursor-pointer"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </motion.div>
    
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Danh mục</h2>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <button
                      className="flex items-center justify-between text-gray-700 hover:text-[color:var(--accent)] transition w-full"
                    >
                      <span>{category.name}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                        {category.count}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
    
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bài viết mới nhất</h2>
              <ul className="space-y-4">
                {blogData.slice(0, 3).map((blog, index) => (
                  <li key={index}>
                    <div 
                      className="flex items-start gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition"
                      onClick={() => onBlogSelect(blog.slug)}
                    >
                      <img 
                        src={blog.thumbnail || DEFAULT_IMAGE_FALLBACK_SRC} 
                        alt={blog.title} 
                        className="w-16 h-16 object-cover rounded"
                        data-fallback-key={blog.slug}
                        onError={applyImageFallback}
                      />
                      <div>
                        <h4 className="text-sm font-medium text-gray-800">{blog.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{blog.date}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
		</div>
	);
};

export default SidebarBlog;
