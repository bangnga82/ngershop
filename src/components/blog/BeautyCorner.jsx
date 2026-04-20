/* eslint-disable */
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { blogData } from "@/components/blog/blogData";
import {
  applyImageFallback,
  DEFAULT_IMAGE_FALLBACK_SRC,
} from "@/utils/imageFallback";

const TABS = [
  {
    id: "skincare",
    label: "Cách chăm sóc da",
    category: "Cách chăm sóc da",
  },
  {
    id: "review",
    label: "Góc review",
    category: "Góc review",
  },
  {
    id: "makeup-trend",
    label: "Xu hướng trang điểm",
    category: "Xu hướng trang điểm",
  },
  {
    id: "tips",
    label: "Bí quyết khỏe đẹp",
    category: "Bí quyết khỏe đẹp",
  },
  {
    id: "news",
    label: "Tin tức",
    category: "Tin tức",
  },
];

const BeautyCorner = () => {
  const [activeTabId, setActiveTabId] = useState(TABS[0].id);

  const activeTab = useMemo(
    () => TABS.find((t) => t.id === activeTabId) ?? TABS[0],
    [activeTabId]
  );
  const posts = useMemo(() => {
    const list = blogData.filter((b) => b.category === activeTab.category);
    return list.slice(0, 3);
  }, [activeTab.category]);

  return (
    <section className="tech-section">
      <div className="w-full">
        <div className="rounded-[20px] border border-[#efe6e1] bg-[#fff7f3] p-6 md:p-8 text-[#3b2f2a]">
        <h2 className="text-center text-[20px] lg:text-[26px] font-black tracking-[0.06em] lg:tracking-[0.08em] uppercase text-[#3b2f2a]">
          GÓC ĐẸP NGERShop
        </h2>

        <div className="mt-6 md:mt-7">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-[15px] md:text-base">
            {TABS.map((tab) => {
              const active = tab.id === activeTabId;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTabId(tab.id)}
                  className={[
                    "relative pb-2 transition-colors",
                    active
                      ? "text-neutral-900 font-semibold"
                      : "text-neutral-500 hover:text-neutral-800",
                  ].join(" ")}
                >
                  {tab.label}
                  <span
                    className={[
                      "pointer-events-none absolute left-1/2 bottom-0 h-[2px] w-8 -translate-x-1/2 rounded-full transition-all",
                      active ? "bg-neutral-900 opacity-100" : "opacity-0",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-6 border-t border-black/10" />
        </div>

        <div
          className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3"
          data-aos="fade-up"
        >
          {posts.map((blog) => (
            <Link
              key={blog.slug}
              to={`/blog/${blog.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff6347]"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100">
                <img
                  src={blog.thumbnail || DEFAULT_IMAGE_FALLBACK_SRC}
                  alt={blog.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  data-fallback-key={blog.slug}
                  onError={applyImageFallback}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
              </div>

              <div className="px-5 pb-6 pt-5">
                <h3 className="text-[18px] font-extrabold leading-snug text-neutral-950">
                  {blog.title}
                </h3>
                <p className="mt-2 text-[15px] leading-relaxed text-neutral-600 line-clamp-3">
                  {blog.summary}
                </p>
              </div>
            </Link>
          ))}

          {posts.length === 0 && (
            <div className="md:col-span-3 rounded-2xl border border-black/10 bg-neutral-50 p-6 text-neutral-700">
              Chưa có bài viết cho mục này.
            </div>
          )}
        </div>
        </div>
      </div>
    </section>
  );
};

export default BeautyCorner;
