import React from "react";
import { motion } from "framer-motion";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { getOrderStatusHex } from "@/components/admin/orderAdmin/orderStatusTheme";

const FALLBACK_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

const CategoryDistributionChart = ({ data = [] }) => {
  const hasData = data.some((item) => Number(item?.value || 0) > 0);

  return (
    <motion.div
      className="bg-white bg-opacity-70 backdrop-blur-md shadow-lg rounded-xl p-6 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-lg font-medium mb-4 text-black">
        Order Status Distribution
      </h2>
      <div className="h-80">
        {hasData ? (
          <ResponsiveContainer width={"100%"} height={"100%"}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx={"50%"}
                cy={"50%"}
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getOrderStatusHex(entry?.name) || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value} orders`, "Orders"]}
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  borderColor: "#4b5563",
                }}
                itemStyle={{ color: "#000000" }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-sm text-gray-600">
            Chua co du lieu trang thai don hang.
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CategoryDistributionChart;
