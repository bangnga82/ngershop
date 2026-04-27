import React from "react";
import TopNavAdmin from "./TopNavAdmin";
import { Outlet } from "react-router-dom";

const LayoutAdmin = () => {
	return (
		<div className="flex h-screen flex-col bg-slate-50 overflow-hidden">
			<div className="fixed inset-0 z-0">
				<div className="absolute inset-0 bg-slate-50 opacity-90" />
				<div className="absolute inset-0 backdrop-blur-sm" />
			</div>
			<div className="relative z-10 flex min-h-0 flex-1 flex-col">
				<TopNavAdmin />
				<div className="min-h-0 flex-1 overflow-auto">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default LayoutAdmin;
