/* eslint-disable */
import React from "react";
import { MdAddCircleOutline } from "react-icons/md";
import cod from "@/assets/images/cod.png";
import vnpay from "@/assets/images/vnpay.png";
import vnpayIcon from "@/assets/images/vnpayIcon.png";

import "./LeftOrder.scss";
const LeftOrder = ({
  addresses,
  selectedAddressId,
  onSelectAddress,
  paymentMethod,
  onSelectPayment,
  onAddAddress,
  onEditAddress,
}) => {
  return (
    <div className="leftOrder">
      <h1>Địa chỉ nhận hàng</h1>
      <div className="leftOrder__address">
        {addresses.map((address) => (
          <div key={address.id} className="leftOrder__address-item">
            <input
              type="radio"
              name="address"
              checked={selectedAddressId === address.id}
              onChange={() => onSelectAddress(address.id)}
            />
            <div className="leftOrder__address-item-info">
              <p className="leftOrder__address-item-info-name">
                {address.description || "Dia chi"}
              </p>
              <p>{address.phoneNumber}</p>
              <p>
                {address.street}, {address.state}, {address.city}
              </p>
            </div>
            <button
              type="button"
              className="leftOrder__address-item-edit"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditAddress?.(address);
              }}
            >
              Sửa
            </button>
          </div>
        ))}
        <div
          className="leftOrder__address-addAddress"
          onClick={onAddAddress}
        >
          <MdAddCircleOutline className="leftOrder__address-addAddress-icon" />
          <p>Thêm địa chỉ mới</p>
        </div>
      </div>
      <h1>Phương thức thanh toán</h1>
      <div className="leftOrder__payment">
        <div className="leftOrder__payment-item">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "COD"}
            onChange={() => onSelectPayment("COD")}
          />
          <div className="leftOrder__payment-item-info">
            <img src={cod} />
            <div className="leftOrder__payment-item-info-detail">
              <p className="title">Thanh toán khi nhận hàng</p>
              <div className="detailt-item">
                <p>COD</p>
              </div>
            </div>
          </div>
        </div>
        <div className="leftOrder__payment-item">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "VN_PAY"}
            onChange={() => onSelectPayment("VN_PAY")}
          />
          <div className="leftOrder__payment-item-info">
            <img src={vnpay} />
            <div className="leftOrder__payment-item-info-detail">
              <p className="title">Ví điện tử</p>
              <div className="detailt-item">
                <p>VN PAY</p>
                <img src={vnpayIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftOrder;
