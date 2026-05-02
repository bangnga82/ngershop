import React from "react";
import { Search, Plus, Download } from "lucide-react";
import ProductStatusFilter from "./ProductStatusFilter";

const ProductFilters = ({
	searchQuery,
	onSearchChange,
	statusFilter,
	onStatusFilterChange,
	onExportExcel,
	onAddProduct,
	statusCounts,
	totalCount,
}) => {
	return (
		<div className="mb-6 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-sm xl:flex-row xl:items-center xl:justify-between">
			<div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
				<div className="w-full shrink-0 lg:w-64 xl:w-56">
					<div className="relative">
						<input
							type="text"
							placeholder="Search products..."
							value={searchQuery}
							onChange={(e) => onSearchChange(e.target.value)}
							className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]"
						/>
						<Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
					</div>
				</div>

				<ProductStatusFilter
					statusFilter={statusFilter}
					onFilterChange={onStatusFilterChange}
					statusCounts={statusCounts}
					totalCount={totalCount}
				/>
			</div>

			<div className="flex w-full flex-wrap gap-3 lg:w-auto lg:flex-nowrap lg:justify-end">
				<button
					onClick={onExportExcel}
					className="flex items-center whitespace-nowrap rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
				>
					<Download className="h-4 w-4 mr-2" />
					Xuất dữ liệu
				</button>
				<button
					onClick={onAddProduct}
					className="flex items-center whitespace-nowrap rounded-lg bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700"
				>
					<Plus className="h-4 w-4 mr-2" />
					Thêm sản phẩm
				</button>
			</div>
		</div>
	);
};

export default ProductFilters;
