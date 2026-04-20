import React from "react";

const ProductStatusFilter = ({
	statusFilter,
	onFilterChange,
	statusCounts,
	totalCount,
}) => {
	return (
		<div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
			<span className="mr-2 self-center text-sm font-medium text-gray-700 whitespace-nowrap">
				Status:
			</span>
			<button
				onClick={() => onFilterChange("All")}
				className={`whitespace-nowrap rounded-md px-3 py-1 text-sm ${
					statusFilter === "All"
						? "bg-emerald-600 text-white"
						: "bg-gray-100 text-gray-700 hover:bg-gray-200"
				}`}
			>
				All ({totalCount})
			</button>
			<button
				onClick={() => onFilterChange("Active")}
				className={`whitespace-nowrap rounded-md px-3 py-1 text-sm ${
					statusFilter === "Active"
						? "bg-green-600 text-white"
						: "bg-green-100 text-green-800 hover:bg-green-200"
				}`}
			>
				Active ({statusCounts["Active"]})
			</button>
			<button
				onClick={() => onFilterChange("Low Stock")}
				className={`whitespace-nowrap rounded-md px-3 py-1 text-sm ${
					statusFilter === "Low Stock"
						? "bg-yellow-500 text-white"
						: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
				}`}
			>
				Low Stock ({statusCounts["Low Stock"]})
			</button>
			<button
				onClick={() => onFilterChange("Out of Stock")}
				className={`whitespace-nowrap rounded-md px-3 py-1 text-sm ${
					statusFilter === "Out of Stock"
						? "bg-red-600 text-white"
						: "bg-red-100 text-red-800 hover:bg-red-200"
				}`}
			>
				Out of Stock ({statusCounts["Out of Stock"]})
			</button>
			<button
				onClick={() => onFilterChange("Clearance")}
				className={`whitespace-nowrap rounded-md px-3 py-1 text-sm ${
					statusFilter === "Clearance"
						? "bg-blue-600 text-white"
						: "bg-blue-100 text-blue-800 hover:bg-blue-200"
				}`}
			>
				Clearance ({statusCounts["Clearance"]})
			</button>
		</div>
	);
};

export default ProductStatusFilter;
