import { useState } from "react";
import { Plus, Download, Trash2, PieChart as PieIcon, TrendingUp, Sparkles } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { formatCurrency } from "../lib/countries";
import { exportToPDF } from "../lib/pdfExport";

const CATEGORIES = ["Food", "Transport", "Rent", "Entertainment", "Education", "Healthcare", "Other"];
const CATEGORY_COLORS = {
  Food: "#6C63FF",
  Transport: "#00D9A3",
  Rent: "#D4AF37",
  Entertainment: "#FF6584",
  Education: "#36A2EB",
  Healthcare: "#4BC0C0",
  Other: "#9966FF",
};

export default function ExpensesPage({ profile, expenses = [], setExpenses }) {
  const countryCode = profile?.country || "IN";

  const [category, setCategory] = useState("Food");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    const newExpense = {
      id: Date.now().toString(),
      category,
      amount: Number(amount),
      date,
      note,
    };

    setExpenses([newExpense, ...expenses]);
    setAmount("");
    setNote("");
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // Group by category for pie chart
  const categoryData = CATEGORIES.map((cat) => {
    const value = expenses
      .filter((e) => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return { name: cat, value, color: CATEGORY_COLORS[cat] };
  }).filter((c) => c.value > 0);

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const handleGenerateSummary = async () => {
    setLoadingAi(true);
    try {
      const topCat = categoryData.sort((a, b) => b.value - a.value)[0]?.name || "Food";
      const res = await fetch("/api/finbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Analyze these student expenses: Total spent is ${formatCurrency(totalSpent, countryCode)}. Top category is ${topCat}. Give 2 actionable tips to reduce spending.`,
          systemPrompt: "You are an expense analyst for students. Give a 2-sentence summary and 2 tips.",
        }),
      });
      const data = await res.json();
      setAiSummary(data.reply || "Review your top categories weekly to curb impulse buying.");
    } catch {
      setAiSummary("You are spending most on food and transport this month. Try preparing meals at home to cut costs by 20%.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" id="expenses-report">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Expense Analyzer</h1>
          <p className="text-xs text-textSecondary">Track, categorize, and optimize your monthly spending</p>
        </div>

        <button
          onClick={() => exportToPDF("expenses-report", "Expense-Report", { title: "Expense Analysis Report", studentName: profile?.name })}
          className="btn-ghost flex items-center gap-2 text-xs"
        >
          <Download size={14} />
          <span>Export PDF Report</span>
        </button>
      </div>

      {/* Grid: Form + Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <div className="glass p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-sm font-semibold text-textPrimary flex items-center gap-2">
            <Plus size={16} className="text-primary" /> Add New Expense
          </h2>

          <form onSubmit={handleAddExpense} className="space-y-3">
            <div>
              <label className="block text-xs text-textSecondary mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-textSecondary mb-1">Amount ({profile?.countryData?.symbol})</label>
              <input
                type="number"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="250"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs text-textSecondary mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs text-textSecondary mb-1">Note (Optional)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Books, Groceries, Bus ticket..."
                className="input-field"
              />
            </div>

            <button type="submit" className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-xs">
              <Plus size={16} /> Add Expense
            </button>
          </form>
        </div>

        {/* Category Breakdown Chart */}
        <div className="glass p-6 rounded-2xl border border-border md:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-textPrimary flex items-center gap-2">
              <PieIcon size={16} className="text-accent" /> Category Breakdown
            </h2>
            <span className="text-xs text-textSecondary font-medium">
              Total Spent: <span className="font-bold text-accent">{formatCurrency(totalSpent, countryCode)}</span>
            </span>
          </div>

          {categoryData.length > 0 ? (
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={4}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(value, countryCode)}
                    contentStyle={{ backgroundColor: "#17171A", borderColor: "#2A2A2E", borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-56 flex items-center justify-center text-textSecondary text-xs">
              No expenses recorded yet. Add your first expense on the left!
            </div>
          )}

          {/* AI Expense Insights Button */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <button
              onClick={handleGenerateSummary}
              disabled={loadingAi || expenses.length === 0}
              className="btn-ghost text-xs flex items-center gap-1.5 py-1.5"
            >
              <Sparkles size={14} className="text-primary" />
              <span>{loadingAi ? "Analyzing..." : "Generate IBM Expense Audit"}</span>
            </button>
            {aiSummary && <p className="text-xs text-textPrimary leading-tight flex-1 sm:ml-4">{aiSummary}</p>}
          </div>
        </div>
      </div>

      {/* Expense History Table */}
      <div className="glass p-6 rounded-2xl border border-border">
        <h2 className="text-sm font-semibold text-textPrimary mb-4">Expense History</h2>

        {expenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border text-textSecondary uppercase tracking-wider">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Note</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-surface/50">
                    <td className="py-3 px-3 text-textSecondary">{exp.date}</td>
                    <td className="py-3 px-3 font-medium text-textPrimary">
                      <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: CATEGORY_COLORS[exp.category] || "#6C63FF" }} />
                      {exp.category}
                    </td>
                    <td className="py-3 px-3 text-textSecondary">{exp.note || "—"}</td>
                    <td className="py-3 px-3 text-right font-bold text-textPrimary">{formatCurrency(exp.amount, countryCode)}</td>
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1 rounded text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-textSecondary text-center py-6">No expenses found.</p>
        )}
      </div>
    </div>
  );
}
