import { PieChart, Pie, Cell, Tooltip } from "recharts";

const RiskChart = ({ high, medium, low }) => {
  const data = [
    { name: "High Risk", value: high },
    { name: "Medium Risk", value: medium },
    { name: "Low Risk", value: low },
  ];

  const COLORS = ["#ef4444", "#f59e0b", "#22c55e"];

  return (
    <div className="bg-white/5 backdrop-blur-lg border border-white/10 
                    rounded-xl p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Risk Distribution
      </h2>

      <PieChart width={300} height={250}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default RiskChart;