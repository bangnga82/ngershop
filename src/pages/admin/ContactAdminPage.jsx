import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";

import HeaderAdmin from "@/components/admin/HeaderAdmin";
import adminContactApi from "@/utils/api/adminContactApi";

const formatTime = (createdAt) => {
  if (!createdAt) return "";
  try {
    return new Date(createdAt).toLocaleString("vi-VN");
  } catch {
    return String(createdAt);
  }
};

const ContactAdminPage = () => {
  const [searchParams] = useSearchParams();
  const openId = searchParams.get("open");

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(30);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");

  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((x) => {
      const haystack = `${x?.name || ""} ${x?.email || ""} ${x?.phone || ""} ${
        x?.content || ""
      }`.toLowerCase();
      return haystack.includes(q);
    });
  }, [items, query]);

  const loadPage = async (nextPage = 0) => {
    setIsLoading(true);
    try {
      const res = await adminContactApi.list({ page: nextPage, size });
      const data = res?.data?.data;
      setItems(data?.content || []);
      setTotalPages(Number(data?.totalPages || 1));
      setPage(Number(data?.page || nextPage));
    } catch (error) {
      console.error("Load contact messages error:", error);
      alert(
        error?.response?.data?.data?.message ||
          error?.response?.data?.message ||
          "Không thể tải danh sách liên hệ."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const openFromListItem = async (item) => {
    if (!item?.id) return;
    setSelected(item);
    if (item.read === false) {
      try {
        await adminContactApi.markRead(item.id, true);
        setItems((prev) =>
          prev.map((x) => (x.id === item.id ? { ...x, read: true } : x))
        );
        setSelected((prev) => (prev?.id === item.id ? { ...prev, read: true } : prev));
      } catch (e) {
        console.error("Mark read error:", e);
      }
    }
  };

  useEffect(() => {
    loadPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!openId) return;
    const idNum = Number(openId);
    if (!Number.isFinite(idNum) || idNum <= 0) return;
    if (!items.length) return;
    if (selected?.id === idNum) return;
    const found = items.find((x) => Number(x?.id) === idNum);
    if (found) {
      openFromListItem(found);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId, items]);

  return (
    <>
      <HeaderAdmin title={"Liên hệ"} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <input
                className="w-full sm:max-w-md bg-gray-50 border border-gray-200 px-4 py-3 rounded-md focus:ring-0 focus:outline-none"
                placeholder="Tim theo ten / email / so dien thoai / noi dung..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => loadPage(Math.max(0, page - 1))}
                  disabled={isLoading || page <= 0}
                  className="px-4 py-2 border rounded-md disabled:opacity-60"
                >
                  Trước
                </button>
                <button
                  type="button"
                  onClick={() => loadPage(Math.min(totalPages - 1, page + 1))}
                  disabled={isLoading || page >= totalPages - 1}
                  className="px-4 py-2 border rounded-md disabled:opacity-60"
                >
                  Sau
                </button>
              </div>
            </div>

            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-gray-50 text-sm font-semibold">
                <div className="col-span-3">Khách hàng</div>
                <div className="col-span-3">Liên hệ</div>
                <div className="col-span-4">Nội dung</div>
                <div className="col-span-2">Thời gian</div>
              </div>

              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-sm text-gray-500">
                  Chưa có tin nhắn.
                </div>
              ) : (
                filtered.map((x) => (
                  <button
                    key={x.id}
                    type="button"
                    onClick={() => openFromListItem(x)}
                    className="w-full text-left grid grid-cols-12 gap-2 px-4 py-3 border-t hover:bg-[color:var(--accent-soft)]"
                  >
                    <div className="col-span-3">
                      <div className="font-medium">
                        {x?.name || "-"}{" "}
                        {!x?.read && (
                          <span className="ml-2 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                            Mới
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">ID: {x?.id}</div>
                    </div>
                    <div className="col-span-3 text-sm">
                      <div className="truncate">{x?.email || "-"}</div>
                      <div className="text-gray-600 truncate">{x?.phone || "-"}</div>
                    </div>
                    <div className="col-span-4 text-sm text-gray-700 truncate">
                      {x?.content || "-"}
                    </div>
                    <div className="col-span-2 text-xs text-gray-500">
                      {formatTime(x?.createdAt)}
                    </div>
                  </button>
                ))
              )}
            </div>

            {selected && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-2xl bg-white rounded-lg border shadow-xl overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
                    <div className="font-semibold">
                      Liên hệ #{selected.id}{" "}
                      {!selected.read && (
                        <span className="ml-2 text-xs px-2 py-1 rounded-full bg-red-100 text-red-700">
                          Mới
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelected(null)}
                      className="px-3 py-1 border rounded-md"
                    >
                      Đóng
                    </button>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="text-sm">
                      <div className="font-medium">{selected.name}</div>
                      <div className="text-gray-600">
                        {selected.email} | {selected.phone}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(selected.createdAt)}
                      </div>
                    </div>

                    <div className="text-sm whitespace-pre-wrap border rounded-md p-3 bg-gray-50">
                      {selected.content}
                    </div>
                  </div>
                </div>
              </div>
            )}
        </motion.div>
      </main>
    </>
  );
};

export default ContactAdminPage;
