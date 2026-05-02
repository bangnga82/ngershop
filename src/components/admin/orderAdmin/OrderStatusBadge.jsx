import React from "react";
import { ORDER_STATUS_BADGE_CLASS } from "./orderStatusTheme";
import { getOrderStatusLabelVi, normalizeOrderStatus } from "@/utils/orderStatus";

const OrderStatusBadge = ({ status }) => {
	const getStatusColor = (status) => {
		const key = normalizeOrderStatus(status) || status;
		return ORDER_STATUS_BADGE_CLASS[key] || "bg-gray-100 text-gray-800";
	};

	return (
		<span
			className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
				status
			)}`}
		>
			{getOrderStatusLabelVi(status)}
		</span>
	);
};

export default OrderStatusBadge;
