/* eslint-disable */
import React, { useEffect, useState } from "react";

import "./AddAddressModal.scss";

const emptyForm = {
  description: "",
  phoneNumber: "",
  street: "",
  city: "",
  state: "",
  isDefault: false,
};

const AddAddressModal = ({
  isOpen,
  onClose,
  onSubmit,
  submitting,
  initialData,
}) => {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isOpen) return;
    if (initialData) {
      setForm({
        description: initialData.description || "",
        phoneNumber: initialData.phoneNumber || "",
        street: initialData.street || "",
        city: initialData.city || "",
        state: initialData.state || "",
        isDefault: !!initialData.isDefault,
      });
    } else {
      setForm(emptyForm);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const setField = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    const required = [
      "phoneNumber",
      "street",
      "city",
      "state",
    ];
    const missing = required.filter((k) => !String(form[k] || "").trim());
    if (missing.length) {
      alert("Vui long nhap day du thong tin dia chi.");
      return;
    }

    onSubmit?.({
      description: form.description?.trim() || null,
      phoneNumber: form.phoneNumber.trim(),
      street: form.street.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      isDefault: !!form.isDefault,
    });
  };

  return (
    <div className="addAddressModal" onMouseDown={onClose}>
      <div
        className="addAddressModal__panel"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="addAddressModal__header">
          <h2>{initialData ? "Sửa địa chỉ" : "Thêm địa chỉ mới"}</h2>
          <button
            type="button"
            className="addAddressModal__close"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <form className="addAddressModal__form" onSubmit={handleSubmit}>
          <label>
            Mô tả
            <input
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="VD: Nha, Cong ty..."
              disabled={!!submitting}
            />
          </label>

          <label>
            Số điện thoại
            <input
              value={form.phoneNumber}
              onChange={(e) => setField("phoneNumber", e.target.value)}
              placeholder="VD: 0376xxxxxx"
              disabled={!!submitting}
            />
          </label>

          <label>
            Đường / số nhà
            <input
              value={form.street}
              onChange={(e) => setField("street", e.target.value)}
              placeholder="VD: 123 Nguyen Trai"
              disabled={!!submitting}
            />
          </label>

          <div className="addAddressModal__row">
            <label>
             Tỉnh / Thành phố
              <input
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="VD: Bắc Giang"
                disabled={!!submitting}
              />
            </label>
            <label>
              Quận / Huyện
              <input
                value={form.state}
                onChange={(e) => setField("state", e.target.value)}
                placeholder="VD: Lục Ngạn"
                disabled={!!submitting}
              />
            </label>
          </div>

          <label className="addAddressModal__checkbox">
            <input
              type="checkbox"
              checked={!!form.isDefault}
              onChange={(e) => setField("isDefault", e.target.checked)}
              disabled={!!submitting}
            />
            Đặt làm mặc định
          </label>

          <div className="addAddressModal__actions">
            <button
              type="button"
              className="secondary"
              onClick={onClose}
              disabled={!!submitting}
            >
              Hủy
            </button>
            <button type="submit" disabled={!!submitting}>
              {submitting
                ? "Đang lưu..."
                : initialData
                  ? "Cập nhật"
                  : "Lưu địa chỉ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
