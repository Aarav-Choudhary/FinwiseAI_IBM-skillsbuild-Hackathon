import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { formatCurrency } from "../lib/countries";

export default function BudgetRing({ spent = 0, total = 10000, countryCode = "IN" }) {
  const remaining = Math.max(0, total - spent);
  const isOver = spent > total;
  const overAmount = spent - total;

  const data = [
    { name: "Spent", value: spent, color: isOver ? "#C81E3A" : "#6C63FF" },
    { name: "Remaining", value: isOver ? 0 : remaining, color: "#2A2A2E" },
  ];

  const pct = Math.min(100, Math.round((spent / (total || 1)) * 100));

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="w-full h-44 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className={`text-2xl font-bold ${isOver ? "text-danger" : "text-textPrimary"}`}>
            {pct}%
          </span>
          <span className="text-[11px] text-textSecondary font-medium uppercase tracking-wider">
            {isOver ? "Over Budget" : "Spent"}
          </span>
        </div>
      </div>

      <div className="w-full space-y-2 mt-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-textSecondary flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isOver ? "bg-danger" : "bg-primary"}`}></span>
            Total Spent
          </span>
          <span className="font-semibold text-textPrimary">{formatCurrency(spent, countryCode)}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-textSecondary flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-border"></span>
            {isOver ? "Over Budget By" : "Remaining"}
          </span>
          <span className={`font-semibold ${isOver ? "text-danger" : "text-accent"}`}>
            {formatCurrency(isOver ? overAmount : remaining, countryCode)}
          </span>
        </div>
      </div>
    </div>
  );
}
