import React, { useEffect, useState } from "react";
import LayoutAdmin from "./LayoutAdmin";
import HeaderAdmin from "@/components/admin/HeaderAdmin";
import { motion } from "framer-motion";
import productApi from "@/utils/api/productApi";
import variantApi from "@/utils/api/variantApi";
import { buildVariantLabel, resolveImageUrl } from "@/utils/api/mappers";

const ProductVariantAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [variantFormOpen, setVariantFormOpen] = useState(false);
  const [variantFormType, setVariantFormType] = useState("add");
  const [variantForm, setVariantForm] = useState({
    id: "",
    price: "",
    stock: "",
    imageFile: null,
    imageUrl: "",
  });

  const refreshVariants = async (productId) => {
    if (!productId) {
      setSelectedProduct(null);
      setVariants([]);
      return;
    }
    setLoading(true);
    try {
      const res = await productApi.getById(productId);
      const product = res?.data?.data;
      setSelectedProduct(product || null);
      setVariants(product?.variants || []);
    } catch (error) {
      console.error("Load variants error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    productApi
      .getProducts({ page: 0, size: 50, status: true })
      .then((res) => {
        setProducts(res?.data?.data?.content || []);
      })
      .catch((error) => {
        console.error("Load products error:", error);
      });
  }, []);

  useEffect(() => {
    refreshVariants(selectedProductId);
  }, [selectedProductId]);

  const openAddVariant = () => {
    setVariantFormType("add");
    setVariantForm({
      id: "",
      price: "",
      stock: "",
      imageFile: null,
      imageUrl: "",
    });
    setVariantFormOpen(true);
  };

  const openEditVariant = (variant) => {
    setVariantFormType("edit");
    setVariantForm({
      id: variant.id,
      price: variant.price ?? "",
      stock: variant.stock ?? "",
      imageFile: null,
      imageUrl: variant.imageUrl || "",
    });
    setVariantFormOpen(true);
  };

  const handleVariantSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProductId) {
      alert("Chon san pham truoc.");
      return;
    }
    if (variantForm.price === "" || variantForm.stock === "") {
      alert("Nhap gia va ton kho.");
      return;
    }
    const form = new FormData();
    form.append("productId", selectedProductId);
    form.append("price", String(variantForm.price));
    form.append("stock", String(variantForm.stock));
    if (variantForm.imageFile) {
      form.append("image", variantForm.imageFile);
    }
    try {
      if (variantFormType === "add") {
        await variantApi.create(form);
      } else {
        await variantApi.update(variantForm.id, form);
      }
      setVariantFormOpen(false);
      await refreshVariants(selectedProductId);
    } catch (error) {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Khong the luu variant.";
      alert(message);
    }
  };

  const handleDeleteVariant = async (variant) => {
    if (!window.confirm("Xoa variant nay?")) return;
    try {
      await variantApi.remove(variant.id);
      await refreshVariants(selectedProductId);
    } catch (error) {
      const message =
        error?.response?.data?.data?.message ||
        error?.response?.data?.message ||
        "Khong the xoa variant.";
      alert(message);
    }
  };

  return (
    <LayoutAdmin>
      <div className="flex-1 overflow-auto relative z-10">
        <HeaderAdmin title={"Product Variants"} />
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 10, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">
                  San pham
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Chon san pham</option>
                  {products.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={openAddVariant}
                disabled={!selectedProductId}
                className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Add Variant
              </button>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {selectedProduct?.name || "Variants"}
                </h3>
                <span className="text-sm text-gray-500">
                  {variants.length} items
                </span>
              </div>

              {loading ? (
                <p className="mt-4 text-sm text-gray-500">Dang tai...</p>
              ) : (
                <div className="mt-4 space-y-2">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="flex flex-col gap-2 rounded-lg border border-gray-200 p-3 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="text-sm">
                        <div className="font-medium">
                          {buildVariantLabel(variant)}
                        </div>
                        <div className="text-gray-500">
                          Price: {variant.price ?? "-"} | Stock:{" "}
                          {variant.stock ?? "-"}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {variant.imageUrl && (
                          <img
                            src={resolveImageUrl(variant.imageUrl)}
                            alt="variant"
                            className="h-10 w-10 rounded object-cover"
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => openEditVariant(variant)}
                          className="px-3 py-1 text-xs border border-gray-200 rounded-lg"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteVariant(variant)}
                          className="px-3 py-1 text-xs border border-gray-200 rounded-lg"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                  {variants.length === 0 && (
                    <p className="text-sm text-gray-500">Chua co variant.</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {variantFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h3 className="text-lg font-semibold">
              {variantFormType === "add" ? "Add variant" : "Edit variant"}
            </h3>
            <form onSubmit={handleVariantSubmit} className="mt-4 space-y-3">
              <input
                type="number"
                step="0.01"
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                placeholder="Price"
                value={variantForm.price}
                onChange={(e) =>
                  setVariantForm((prev) => ({ ...prev, price: e.target.value }))
                }
              />
              <input
                type="number"
                className="w-full rounded-md border border-gray-200 px-3 py-2"
                placeholder="Stock"
                value={variantForm.stock}
                onChange={(e) =>
                  setVariantForm((prev) => ({ ...prev, stock: e.target.value }))
                }
              />
              {variantForm.imageUrl && (
                <img
                  src={resolveImageUrl(variantForm.imageUrl)}
                  alt="variant"
                  className="h-16 w-16 rounded object-cover"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setVariantForm((prev) => ({
                    ...prev,
                    imageFile: e.target.files?.[0] || null,
                  }))
                }
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVariantFormOpen(false)}
                  className="rounded-md border border-gray-200 px-4 py-2"
                >
                  Huy
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-emerald-600 px-4 py-2 text-white"
                >
                  Luu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </LayoutAdmin>
  );
};

export default ProductVariantAdminPage;
