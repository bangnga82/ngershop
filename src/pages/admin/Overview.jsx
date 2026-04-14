import HeaderAdmin from "@/components/admin/HeaderAdmin";
import React, { useEffect, useState } from "react";
import LayoutAdmin from "./LayoutAdmin";
import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import StatCard from "@/components/admin/StatCard";
import SaleOverviewChart from "@/components/admin/chart/SaleOverviewChart";
import CategoryDistributionChart from "@/components/admin/chart/CategoryDistributionChart";
import adminDashboardApi from "@/utils/api/adminDashboardApi";

const defaultDashboard = {
	totalSales: 0,
	newUsers: 0,
	totalProducts: 0,
	conversionRate: 0,
	saleOverview: [],
	categoryDistribution: [],
};

const formatCurrency = (value) =>
	new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 0,
	}).format(Number(value || 0));

const formatInteger = (value) =>
	new Intl.NumberFormat("en-US").format(Number(value || 0));

const formatPercent = (value) =>
	`${Number(value || 0).toFixed(1).replace(".", ",")}%`;

const Overview = () => {
	const [dashboard, setDashboard] = useState(defaultDashboard);

	useEffect(() => {
		const loadDashboard = async () => {
			try {
				const response = await adminDashboardApi.getOverview();
				setDashboard(response?.data?.data || defaultDashboard);
			} catch (error) {
				console.error("Load admin dashboard error:", error);
			}
		};

		loadDashboard();
	}, []);

	return (
		<LayoutAdmin>
			<div className="flex-1 overflow-auto relative z-10">
				<HeaderAdmin title={"Overview"} />
				<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
					<motion.div
						className="grid grid-cols-1 gap-5 mb-8 lg:grid-cols-4"
						initial={{ opacity: 0, x: 30 }}
						animate={{ opacity: 10, x: 0 }}
						transition={{ duration: 0.5 }}
					>
						<StatCard
							name="Total Sales"
							icon={Zap}
							value={formatCurrency(dashboard.totalSales)}
							color="#6366F1"
						/>
						<StatCard
							name="New Users"
							icon={Users}
							value={formatInteger(dashboard.newUsers)}
							color="#8B5CF6"
						/>
						<StatCard
							name="Total Products"
							icon={ShoppingBag}
							value={formatInteger(dashboard.totalProducts)}
							color="#EC4899"
						/>
						<StatCard
							name="Conversion Rate"
							icon={BarChart2}
							value={formatPercent(dashboard.conversionRate)}
							color="#10B981"
						/>
					</motion.div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<SaleOverviewChart data={dashboard.saleOverview} />
						<CategoryDistributionChart data={dashboard.categoryDistribution} />
					</div>
				</main>
			</div>
		</LayoutAdmin>
	);
};

export default Overview;
