import React, { useEffect, useState } from "react";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import { motion } from "framer-motion";
import productApi from "@/utils/api/productApi";
import attributeApi from "@/utils/api/attributeApi";
import { buildVariantLabel } from "@/utils/api/mappers";

const ATTRIBUTE_TYPES = [
  { label: "Color", value: "COLOR" },
  { label: "Size", value: "SIZE" },
  { label: "Material", value: "MATERIAL" },
  // { label: "Storage", value: "STORAGE" },
  // { label: "RAM", value: "RAM" },
  // { label: "Weight", value: "WEIGHT" },
];

const ProductAttributeAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [attrLoading, setAttrLoading] = useState(false);
  const [attrForm, setAttrForm] = useState({ type: "COLOR", value: "" });
  const [attrEditing, setAttrEditing] = useState(null);

  const refreshVariants = async (productId) => {
    if (!productId) {
      setSelectedProduct(null);
      setVariants([]);
      setSelectedVariantId("");
      setSelectedVariant(null);
      setAttributes([]);
      return;
    }
    try {
      const res = await productApi.getById(productId);
      const product = res?.data?.data;
      setSelectedProduct(product || null);
      const productVariants = product?.variants || [];
      setVariants(productVariants);
      setSelectedVariantId("");
      setSelectedVariant(null);
      setAttributes([]);
    } catch (error) {
      console.error("Load variants error:", error);
    }
  };

  const refreshAttributes = async (variantId) => {
    if (!variantId) {
      setSelectedVariant(null);
      setAttributes([]);
      return;
    }
    setAttrLoading(true);
    try {
      const variant = variants.find((item) => String(item.id) === String(variantId));
      setSelectedVariant(variant || null);
      const res = await attributeApi.getByVariant(variantId);
      setAttributes(res?.data?.data || []);
    } catch (error) {
      console.error("Load attributes error:", error);
    } finally {
      setAttrLoading(false);
    }
  };

  useEffect(() => {
    productApi
      .getAllProducts({ size: 100, status: true })
      .then((res) => setProducts(res?.items || []))
      .catch((error) => console.error("Load products error:", error));
  }, []);

  useEffect(() => {
    refreshVariants(selectedProductId);
  }, [selectedProductId]);

  useEffect(() => {
    refreshAttributes(selectedVariantId);
  }, [selectedVariantId]);

  const handleAddAttribute = async (e) => {
    e.preventDefault();
    if (!selectedVariantId) {
      alert("Chọn variant trước.");
      return;
    }
    if (!attrForm.value.trim()) {
      alert("Nhập giá trị.");
      return;
    }
    try {
      const res = await attributeApi.create(selectedVariantId, {
        type: attrForm.type,
        value: attrForm.value.trim(),
      });
      setAttributes((prev) => [...prev, res?.data?.data].filter(Boolean));
      setAttrForm((prev) => ({ ...prev, value: "" }));
    } catch (error) {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Không thể thêm trước thuộc tính.";
      alert(message);
    }
  };

  const handleUpdateAttr = async (e) => {
    e.preventDefault();
    if (!attrEditing) return;
    try {
      const res = await attributeApi.update(attrEditing.id, {
        type: attrEditing.type,
        value: attrEditing.value,
      });
      setAttributes((prev) =>
        prev.map((item) => (item.id === attrEditing.id ? res?.data?.data : item))
      );
      setAttrEditing(null);
    } catch (error) {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Không thể cập nhật thuộc tính.";
      alert(message);
    }
  };

  const handleDeleteAttr = async (attr) => {
    try {
      await attributeApi.remove(attr.id);
      setAttributes((prev) => prev.filter((item) => item.id !== attr.id));
    } catch (error) {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Không thể xóa thuộc tính.";
      alert(message);
    }
  };

  return (
    <>
      <HeaderAdmin title={"Thể loại"} />
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 10, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
            <div className="grid gap-4 rounded-lg border border-gray-200 bg-white p-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Sản phẩm
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Biến thể
                </label>
                <select
                  value={selectedVariantId}
                  onChange={(e) => setSelectedVariantId(e.target.value)}
                  disabled={!selectedProductId}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)] disabled:opacity-60"
                >
                  <option value="">Chon biến thể</option>
                  {variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {buildVariantLabel(variant)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {selectedProduct?.name || "Thể loại"}
                </h3>
                <span className="text-sm text-gray-500">
                  {attributes.length} items
                </span>
              </div>

              <form onSubmit={handleAddAttribute} className="mt-4 flex gap-2">
                <select
                  className="w-40 rounded-md border border-gray-200 px-3 py-2"
                  value={attrForm.type}
                  onChange={(e) =>
                    setAttrForm((prev) => ({ ...prev, type: e.target.value }))
                  }
                >
                  {ATTRIBUTE_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <input
                  className="flex-1 rounded-md border border-gray-200 px-3 py-2"
                  placeholder="Gia tri"
                  value={attrForm.value}
                  onChange={(e) =>
                    setAttrForm((prev) => ({ ...prev, value: e.target.value }))
                  }
                />
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-4 py-2 text-white"
                >
                  Thêm
                </button>
              </form>

              {attrLoading ? (
                <p className="mt-4 text-sm text-gray-500">Đang tải...</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {attributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex flex-col gap-2 rounded-md border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="text-sm">
                        <strong>{attr.type}</strong>: {attr.value}
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setAttrEditing({ ...attr })}
                          className="rounded-md border border-gray-200 px-3 py-1 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteAttr(attr)}
                          className="rounded-md border border-gray-200 px-3 py-1 text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {attributes.length === 0 && (
                    <p className="text-sm text-gray-500">Không có thuộc tính.</p>
                  )}
                </div>
              )}

              {attrEditing && (
                <form
                  onSubmit={handleUpdateAttr}
                  className="mt-4 rounded-md border border-gray-200 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <select
                      className="w-full rounded-md border border-gray-200 px-3 py-2 sm:w-40"
                      value={attrEditing.type}
                      onChange={(e) =>
                        setAttrEditing((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                    >
                      {ATTRIBUTE_TYPES.map((item) => (
                        <option key={item.value} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                    <input
                      className="flex-1 rounded-md border border-gray-200 px-3 py-2"
                      value={attrEditing.value}
                      onChange={(e) =>
                        setAttrEditing((prev) => ({
                          ...prev,
                          value: e.target.value,
                        }))
                      }
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setAttrEditing(null)}
                        className="rounded-md border border-gray-200 px-3 py-2 text-sm"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
        </motion.div>
      </main>
    </>
  );
};

export default ProductAttributeAdminPage;
