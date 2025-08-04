import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";

const PRIORITY_COLORS = {
  Low: "#A3D977",
  Medium: "#F9C74F",
  High: "#F94144",
};

const PriorityBarChart = ({ tasks }) => {
  const getPriorityData = () => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    tasks.forEach((task) => {
      counts[task.priority] = (counts[task.priority] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const data = getPriorityData();

  return (
    <div>
      <h5>Task Count by Priority</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#36B37E">
            {data.map((entry, index) => (
              <Cell key={`cell-bar-${index}`} fill={PRIORITY_COLORS[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriorityBarChart;
