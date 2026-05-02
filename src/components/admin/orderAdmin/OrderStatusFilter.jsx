import React from "react";
import { ORDER_STATUS_FILTER_CLASS } from "./orderStatusTheme";
import { getOrderStatusLabelVi, ORDER_STATUS } from "@/utils/orderStatus";

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
				onClick={() => onFilterChange(ORDER_STATUS.DELIVERED)}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === ORDER_STATUS.DELIVERED
						? ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.DELIVERED].active
						: ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.DELIVERED].idle
				}`}
			>
				{getOrderStatusLabelVi(ORDER_STATUS.DELIVERED)} ({statusCounts[ORDER_STATUS.DELIVERED] || 0})
			</button>
			<button
				onClick={() => onFilterChange(ORDER_STATUS.SHIPPED)}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === ORDER_STATUS.SHIPPED
						? ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.SHIPPED].active
						: ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.SHIPPED].idle
				}`}
			>
				{getOrderStatusLabelVi(ORDER_STATUS.SHIPPED)} ({statusCounts[ORDER_STATUS.SHIPPED] || 0})
			</button>
			<button
				onClick={() => onFilterChange(ORDER_STATUS.CONFIRMED)}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === ORDER_STATUS.CONFIRMED
						? ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.CONFIRMED].active
						: ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.CONFIRMED].idle
				}`}
			>
				{getOrderStatusLabelVi(ORDER_STATUS.CONFIRMED)} ({statusCounts[ORDER_STATUS.CONFIRMED] || 0})
			</button>
			<button
				onClick={() => onFilterChange(ORDER_STATUS.PAID)}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === ORDER_STATUS.PAID
						? ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.PAID].active
						: ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.PAID].idle
				}`}
			>
				{getOrderStatusLabelVi(ORDER_STATUS.PAID)} ({statusCounts[ORDER_STATUS.PAID] || 0})
			</button>
			<button
				onClick={() => onFilterChange(ORDER_STATUS.PENDING)}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === ORDER_STATUS.PENDING
						? ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.PENDING].active
						: ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.PENDING].idle
				}`}
			>
				{getOrderStatusLabelVi(ORDER_STATUS.PENDING)} ({statusCounts[ORDER_STATUS.PENDING] || 0})
			</button>
			<button
				onClick={() => onFilterChange(ORDER_STATUS.CANCELLED)}
				className={`px-3 py-1 rounded-md text-sm ${
					statusFilter === ORDER_STATUS.CANCELLED
						? ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.CANCELLED].active
						: ORDER_STATUS_FILTER_CLASS[ORDER_STATUS.CANCELLED].idle
				}`}
			>
				{getOrderStatusLabelVi(ORDER_STATUS.CANCELLED)} ({statusCounts[ORDER_STATUS.CANCELLED] || 0})
			</button>
		</div>
	);
};

export default OrderStatusFilter;
