import React from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
    Number(value || 0)
  ) + " VND";

const WeeklyRevenueChart = ({ data = [], month, onMonthChange }) => {
  const hasData = data.some((item) => Number(item?.revenue || 0) > 0);

  return (
    <motion.div
      className="bg-white bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex flex-col gap-3 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-medium text-black">
            Doanh số theo tuần{month ? ` (${month})` : ""}
          </h2>
          <div className="text-xs text-gray-600 mt-1">
            Chọn tháng để xem doanh số theo các tuần trong tháng.
          </div>
        </div>

        <input
          type="month"
          value={month || ""}
          onChange={(e) => onMonthChange?.(e.target.value)}
          className="w-full sm:w-auto bg-white/80 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="h-80">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" />
              <XAxis dataKey="name" stroke="#000000" />
              <YAxis
                stroke="#000000"
                tickFormatter={(v) =>
                  new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(
                    Number(v || 0)
                  )
                }
              />
              <Tooltip
                formatter={(value) => [formatCurrency(value), "Doanh so"]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderColor: "#4B5563",
                }}
                itemStyle={{ color: "#000000" }}
              />
              <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-600">
            Chưa có dữ liệu doanh số của tuần.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WeeklyRevenueChart;

