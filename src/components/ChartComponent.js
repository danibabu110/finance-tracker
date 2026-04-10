import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function ChartComponent({ transactions }) {
    const categoryMap = {};

    transactions.forEach((t) => {
        if (t.type === "expense" && t.amount > 0) {
            categoryMap[t.category] =
                (categoryMap[t.category] || 0) + Number(t.amount);
        }
    });

    const data = Object.keys(categoryMap).map((key) => ({
        name: key,
        value: categoryMap[key],
    }));

    console.log("Chart Data:", data);

    if (data.length === 0) {
        return <p>No expense data to display chart 📊</p>;
    }

    const COLORS = ["#ff4d4d", "#ffa500", "#4caf50", "#2196f3"];

    return (
        <div>
            <h3>Expense Breakdown</h3>

            <PieChart width={300} height={300}>
                <Pie data={data} dataKey="value" outerRadius={100} label>
                    {data.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>

                <Tooltip />
                <Legend />
            </PieChart>
        </div>
    );
}