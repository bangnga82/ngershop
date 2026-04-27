import React from "react";
import { ORDER_STATUS_FILTER_CLASS } from "./orderStatusTheme";

const OrderStatusFilter = ({
	statusFilter,
	onFilterChange,
	statusCounts,
	totalCount,
}) => {
	return (
		<div className="w-full sm:w-auto flex flex-wrap gap-2">
			<span className="text-sm font-medium text-gray-700 self-center mr-2">
				Status:
			</span>
			<button
				onClick={() => onFilterChange("All")}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === "All"
						? "bg-emerald-600 text-white"
						: "bg-gray-100 text-gray-700 hover:bg-gray-200"
				}`}
			>
				All ({totalCount})
			</button>
			<button
				onClick={() => onFilterChange("Delivered")}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === "Delivered"
						? ORDER_STATUS_FILTER_CLASS.Delivered.active
						: ORDER_STATUS_FILTER_CLASS.Delivered.idle
				}`}
			>
				Delivered ({statusCounts["Delivered"] || 0})
			</button>
			<button
				onClick={() => onFilterChange("Shipping")}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === "Shipping"
						? ORDER_STATUS_FILTER_CLASS.Shipping.active
						: ORDER_STATUS_FILTER_CLASS.Shipping.idle
				}`}
			>
				Shipping ({statusCounts["Shipping"] || 0})
			</button>
			<button
				onClick={() => onFilterChange("Paid")}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === "Paid"
						? ORDER_STATUS_FILTER_CLASS.Paid.active
						: ORDER_STATUS_FILTER_CLASS.Paid.idle
				}`}
			>
				Paid ({statusCounts["Paid"] || 0})
			</button>
			<button
				onClick={() => onFilterChange("Pending")}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === "Pending"
						? ORDER_STATUS_FILTER_CLASS.Pending.active
						: ORDER_STATUS_FILTER_CLASS.Pending.idle
				}`}
			>
				Pending ({statusCounts["Pending"] || 0})
			</button>
			<button
				onClick={() => onFilterChange("Cancelled")}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === "Cancelled"
						? ORDER_STATUS_FILTER_CLASS.Cancelled.active
						: ORDER_STATUS_FILTER_CLASS.Cancelled.idle
				}`}
			>
				Cancelled ({statusCounts["Cancelled"] || 0})
			</button>
		</div>
	);
};

export default OrderStatusFilter;
