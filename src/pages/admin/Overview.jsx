import HeaderAdmin from "@/components/admin/HeaderAdmin";
import React, { useEffect, useState } from "react";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/admin/StatCard";
import SaleOverviewChart from "@/components/admin/chart/SaleOverviewChart";
import CategoryDistributionChart from "@/components/admin/chart/CategoryDistributionChart";
import WeeklyRevenueChart from "@/components/admin/chart/WeeklyRevenueChart";
import adminDashboardApi from "@/utils/api/adminDashboardApi";

const defaultDashboard = {
	totalSales: 0,
	newUsers: 0,
	totalProducts: 0,
	conversionRate: 0,
	saleOverview: [],
	weeklyRevenue: [],
	categoryDistribution: [],
};

const formatCurrency = (value) =>
	new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
		Number(value || 0)
	) + " VND";

const formatInteger = (value) =>
	new Intl.NumberFormat("en-US").format(Number(value || 0));

const formatPercent = (value) =>
	`${Number(value || 0).toFixed(1).replace(".", ",")}%`;

const getCurrentMonthInput = () => {
	const now = new Date();
	const mm = String(now.getMonth() + 1).padStart(2, "0");
	return `${now.getFullYear()}-${mm}`; // YYYY-MM for <input type="month" />
};

const Overview = () => {
	const [dashboard, setDashboard] = useState(defaultDashboard);
	const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthInput());

	useEffect(() => {
		const loadDashboard = async () => {
			try {
				const response = await adminDashboardApi.getOverview(selectedMonth);
				setDashboard(response?.data?.data || defaultDashboard);
			} catch (error) {
				console.error("Load admin dashboard error:", error);
			}
		};

		loadDashboard();
	}, [selectedMonth]);

	return (
		<>
			<HeaderAdmin title={"Tổng quan"} />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<motion.div
					className="grid grid-cols-1 gap-5 mb-8 lg:grid-cols-4"
					initial={{ opacity: 0, x: 30 }}
					animate={{ opacity: 10, x: 0 }}
					transition={{ duration: 0.5 }}
				>
					<StatCard
						name="Tổng doanh thu"
						icon={Zap}
							value={formatCurrency(dashboard.totalSales)}
							color="#6366F1"
						/>
						<StatCard
							name="Người dùng mới"
							icon={Users}
							value={formatInteger(dashboard.newUsers)}
							color="#8B5CF6"
						/>
						<StatCard
							name="Tổng sản phẩm"
							icon={ShoppingBag}
							value={formatInteger(dashboard.totalProducts)}
							color="#EC4899"
						/>
						<StatCard
							name="Tỉ lệ người dùng/đơn hàng"
							icon={BarChart2}
							value={formatPercent(dashboard.conversionRate)}
							color="#10B981"
						/>
					</motion.div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
						<div className="flex flex-col gap-8">
							<SaleOverviewChart data={dashboard.saleOverview} />
							<WeeklyRevenueChart
								data={dashboard.weeklyRevenue}
								month={selectedMonth}
								onMonthChange={(m) => setSelectedMonth(m || getCurrentMonthInput())}
							/>
						</div>
						<CategoryDistributionChart data={dashboard.categoryDistribution} />
					</div>
				</main>
		</>
	);
};

export default Overview;
