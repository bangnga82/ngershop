import React, { useState } from 'react'
import {
	BarChart2,
	DollarSign,
	Layers,
	Mail,
	Menu,
	ShoppingBag,
	Sliders,
	TrendingUp,
	Users,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/images/logo.png";

const SIDEBAR_ITEMS = [
	{
		name: "Tổng quan",
		icon: BarChart2,
		color: "#6366f1",
		href: "/admin",
	},
	{
		name: "Danh mục",
		icon: TrendingUp,
		color: "#8B5CF6",
		href: "/admin/categories",
	},
	{
		name: "Sản phẩm",
		icon: ShoppingBag,
		color: "#EC4899",
		href: "/admin/products",
	},
	{
		name: "Các biến thể",
		icon: Layers,
		color: "#F97316",
		href: "/admin/variants",
	},
	{
		name: "Phân loại",
		icon: Sliders,
		color: "#14B8A6",
		href: "/admin/attributes",
	},
	{
		name: "Đơn hàng",
		icon: DollarSign,
		color: "#10b981",
		href: "/admin/orders",
	},
	{
		name: "Người dùng",
		icon: Users,
		color: "#0ea5e9",
		href: "/admin/users",
	},
	{
		name: "Liên hệ",
		icon: Mail,
		color: "#ef4444",
		href: "/admin/contact-messages",
	},
];
const SidebarAdmin = () => {
	const location = useLocation();
	const [isSidebarOpen, setIsSidebarOpen] = useState(true);

	return (
		<motion.div
			className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
				isSidebarOpen ? "w-64" : "w-20"
			}`}
			animate={{
				width: isSidebarOpen ? 256 : 80,
			}}
		>
			<div className="text-gray-100 h-full bg-white p-4 flex flex-col border">
				{isSidebarOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2, delay: 0.3 }}
						className="flex items-center justify-center"
					>
						<p>
							<Link to={"/"} className="flex items-center justify-center">
								<img src={logo} alt="TechNova" className="h-20 w-auto" />
							</Link>
						</p>
					</motion.div>
				)}

				<nav className="mt-8 flex-grow">
					{SIDEBAR_ITEMS.map((item, index) => (
						<Link key={item.href} to={item.href}>
							<motion.div
								className={`flex items-center p-4 text-sm font-medium rounded-lg transition-colors mb-2 ${
									location.pathname === item.href
										? 'bg-[#FFF0F7] text-[#C2185B] hover:bg-[#FFE3F1] active:bg-[#FFE3F1]'
										: 'bg-[#FFD1E6] text-[#7A1E46] hover:bg-[#FFC1DE] active:bg-[#FFC1DE]'
								}`}
							>
								<item.icon
									size={20}
									style={{
										color:
											location.pathname === item.href
												? "#C2185B"
												: "#7A1E46",
										minWidth: "20px",
									}}
								/>
								<AnimatePresence>
									{isSidebarOpen && (
										<motion.span
											className="ml-4 whitespace-nowrap"
											initial={{ opacity: 0, width: 0 }}
											animate={{
												opacity: 1,
												width: "auto",
											}}
											transition={{
												duration: 0.2,
												delay: 0.3,
											}}
										>
											{item.name}
										</motion.span>
									)}
								</AnimatePresence>
							</motion.div>
						</Link>
					))}
				</nav>
				<div className='flex items-center justify-center'>
					<motion.button
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						onClick={() => setIsSidebarOpen(!isSidebarOpen)}
						className="p-2 rounded-full hover:bg-[#FFE3F1] active:bg-[#FFE3F1] transition-colors max-w-fit"
					>
						<Menu size={24} />
					</motion.button>
				</div>
			</div>
		</motion.div>
	);
}

export default SidebarAdmin
