import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useEffect, useRef } from "react";

export const LineChartComponent = ({ data }) => {
  const chartData = useRef([]);
  useEffect(() => {
    // Thêm dữ liệu mới vào mảng chartData.current khi props data thay đổi
    chartData.current = [...chartData.current, data];
  }, [data]);
  return (
    <LineChart
      width={340}
      height={170}
      data={chartData.current}
      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
    >
      <Line type="monotone" dataKey="data" stroke="#8884d8" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};
