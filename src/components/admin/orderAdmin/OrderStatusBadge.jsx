import React from "react";
import { ORDER_STATUS_BADGE_CLASS } from "./orderStatusTheme";

const OrderStatusBadge = ({ status }) => {
	const getStatusColor = (status) => {
		return ORDER_STATUS_BADGE_CLASS[status] || "bg-gray-100 text-gray-800";
	};

	return (
		<span
			className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
				status
			)}`}
		>
			{status}
		</span>
	);
};

export default OrderStatusBadge;
