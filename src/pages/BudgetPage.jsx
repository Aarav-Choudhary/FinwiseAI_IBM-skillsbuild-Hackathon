import { useState, useEffect } from "react";
import { PiggyBank, Sparkles, Plus, Trash2, Edit2, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../lib/countries";

export default function BudgetPage({ profile, budget, setBudget }) {
  const countryCode = profile?.country || "IN";
  const symbol = profile?.countryData?.symbol || "₹";

  const [incomeSources, setIncomeSources] = useState(
    budget?.incomeSources || [
      { id: "1", label: "Monthly Allowance", amount: profile?.income || 15000 },
    ]
  );

  const [newLabel, setNewLabel] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editLabel, setEditLabel] = useState("");
  const [editAmount, setEditAmount] = useState("");

  const [allocations, setAllocations] = useState(
    budget?.allocations || {
      Needs: 50, // 50%
      Wants: 30, // 30%
      Savings: 20, // 20%
    }
  );

  const [aiSuggestion, setAiSuggestion] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Sync if budget prop updates from storage
  useEffect(() => {
    if (budget?.incomeSources && budget.incomeSources.length > 0) {
      setIncomeSources(budget.incomeSources);
    }
    if (budget?.allocations) {
      setAllocations(budget.allocations);
    }
  }, [budget]);

  const totalIncome = incomeSources.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const persistBudgetChanges = (updatedSources, updatedAllocations) => {
    const total = updatedSources.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const updated = {
      ...budget,
      total,
      incomeSources: updatedSources,
      allocations: updatedAllocations,
    };
    if (setBudget) {
      setBudget(updated);
    }
  };

  const handleSaveEdit = (id) => {
    if (!editLabel || !editAmount || Number(editAmount) <= 0) return;
    const updated = incomeSources.map((s) =>
      s.id === id ? { ...s, label: editLabel, amount: Number(editAmount) } : s
    );
    setIncomeSources(updated);
    persistBudgetChanges(updated, allocations);
    setEditingId(null);
  };

  const handleAddSource = (e) => {
    e.preventDefault();
    if (!newLabel || !newAmount) return;
    const updated = [
      ...incomeSources,
      { id: Date.now().toString(), label: newLabel, amount: Number(newAmount) },
    ];
    setIncomeSources(updated);
    persistBudgetChanges(updated, allocations);
    setNewLabel("");
    setNewAmount("");
  };

  const handleDeleteSource = (id) => {
    if (incomeSources.length <= 1) return; // Keep at least one source
    const updated = incomeSources.filter((s) => s.id !== id);
    setIncomeSources(updated);
    persistBudgetChanges(updated, allocations);
  };

  const handleSliderChange = (cat, value) => {
    const updated = { ...allocations, [cat]: Number(value) };
    setAllocations(updated);
    persistBudgetChanges(incomeSources, updated);
  };

  const handleGetAiBudget = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/finbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Recommend an optimal student monthly budget split for total income ${formatCurrency(totalIncome, countryCode)} in ${profile?.countryData?.name || "India"}.`,
          systemPrompt: "You are a financial planner for college students. Give a 2-sentence breakdown using the 50/30/20 rule.",
          studentContext: {
            currencySymbol: profile?.countryData?.symbol || "₹",
            income: totalIncome,
            countryName: profile?.countryData?.name || "India",
          },
        }),
      });
      if (!res.ok) throw new Error("Budget suggestion API unavailable");
      const data = await res.json();
      setAiSuggestion(data.reply || `Allocate 50% (${formatCurrency(totalIncome * 0.5, countryCode)}) for Needs, 30% (${formatCurrency(totalIncome * 0.3, countryCode)}) for Wants, and 20% (${formatCurrency(totalIncome * 0.2, countryCode)}) for Savings.`);
    } catch {
      setAiSuggestion(`For an income of ${formatCurrency(totalIncome, countryCode)}, aim to keep core essentials under ${formatCurrency(totalIncome * 0.5, countryCode)} and save at least ${formatCurrency(totalIncome * 0.2, countryCode)} monthly.`);
    } finally {
      setLoadingAi(false);
    }
  };

  const needsAmount = (totalIncome * allocations.Needs) / 100;
  const wantsAmount = (totalIncome * allocations.Wants) / 100;
  const savingsAmount = (totalIncome * allocations.Savings) / 100;
  const totalAllocatedPct = allocations.Needs + allocations.Wants + allocations.Savings;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-textPrimary">Budget Planner</h1>
          <p className="text-xs text-textSecondary">
            Set income streams, allocate 50/30/20 budget targets, and project savings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Income Sources Form */}
        <div className="glass p-6 rounded-2xl border border-border space-y-4">
          <h2 className="text-sm font-semibold text-textPrimary flex items-center gap-2">
            <PiggyBank size={16} className="text-primary" /> Income Sources
          </h2>

          <div className="space-y-2">
            {incomeSources.map((src) => {
              if (editingId === src.id) {
                return (
                  <div key={src.id} className="p-3 rounded-xl bg-surface border border-primary/40 space-y-2.5 text-xs">
                    <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Editing Income Source</p>
                    <div>
                      <label className="block text-[10px] text-textSecondary mb-1">Source Name</label>
                      <input
                        type="text"
                        value={editLabel}
                        onChange={(e) => setEditLabel(e.target.value)}
                        placeholder="e.g. Monthly Allowance"
                        className="input-field text-xs w-full py-1.5 px-3"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-textSecondary mb-1">Amount ({symbol})</label>
                      <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        placeholder="e.g. 15000"
                        className="input-field text-xs w-full py-1.5 px-3"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleSaveEdit(src.id)}
                        className="btn-primary flex-1 py-1.5 text-[11px] font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="btn-ghost flex-1 py-1.5 text-[11px]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                );
              }

              return (
                <div key={src.id} className="p-3 rounded-xl bg-surface border border-border flex justify-between items-center text-xs">
                  <div>
                    <span className="text-textPrimary font-medium">{src.label}</span>
                    <span className="block font-bold text-accent">{formatCurrency(src.amount, countryCode)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(src.id);
                        setEditLabel(src.label);
                        setEditAmount(src.amount);
                      }}
                      className="p-1.5 rounded text-textSecondary hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit source"
                    >
                      <Edit2 size={13} />
                    </button>
                    {incomeSources.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteSource(src.id)}
                        className="p-1.5 rounded text-textSecondary hover:text-danger hover:bg-danger/10 transition-colors"
                        title="Delete source"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleAddSource} className="space-y-2 pt-2 border-t border-border">
            <input
              type="text"
              placeholder="Source (Part-time, Stipend...)"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="input-field text-xs"
            />
            <input
              type="number"
              placeholder={`Amount (${symbol})`}
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              className="input-field text-xs"
            />
            <button type="submit" className="btn-primary w-full py-2 text-xs flex items-center justify-center gap-1">
              <Plus size={14} /> Add Source
            </button>
          </form>
        </div>

        {/* Allocations & Sliders */}
        <div className="glass p-6 rounded-2xl border border-border md:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold text-textPrimary">Category Allocations</h2>
            <button
              onClick={handleGetAiBudget}
              disabled={loadingAi}
              className="btn-ghost text-xs flex items-center gap-1.5 py-1 px-3"
            >
              <Sparkles size={14} className="text-primary" />
              <span>{loadingAi ? "Thinking..." : "Grok 50/30/20 Suggestion"}</span>
            </button>
          </div>

          {aiSuggestion && (
            <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 text-xs text-textPrimary leading-relaxed">
              <span className="font-semibold text-primary block mb-1">Grok AI Suggestion:</span>
              {aiSuggestion}
            </div>
          )}

          {/* Sliders */}
          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-textSecondary">Needs (Rent, Food, Tuition): {allocations.Needs}%</span>
                <span className="font-bold text-primary">{formatCurrency(needsAmount, countryCode)}</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={allocations.Needs}
                onChange={(e) => handleSliderChange("Needs", e.target.value)}
                className="w-full accent-primary"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-textSecondary">Wants (Outing, Outfits): {allocations.Wants}%</span>
                <span className="font-bold text-warning">{formatCurrency(wantsAmount, countryCode)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={allocations.Wants}
                onChange={(e) => handleSliderChange("Wants", e.target.value)}
                className="w-full accent-warning"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-textSecondary">Savings & Investments: {allocations.Savings}%</span>
                <span className="font-bold text-accent">{formatCurrency(savingsAmount, countryCode)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={allocations.Savings}
                onChange={(e) => handleSliderChange("Savings", e.target.value)}
                className="w-full accent-accent"
              />
            </div>
          </div>

          {/* Allocation Warning / Success */}
          {totalAllocatedPct !== 100 ? (
            <div className="p-3 rounded-xl bg-warning/15 border border-warning/30 text-warning text-xs flex items-center gap-2">
              <AlertCircle size={16} />
              <span>Total allocations equal {totalAllocatedPct}%. Adjust sliders so they equal 100%.</span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-accent/15 border border-accent/30 text-accent text-xs flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Perfect! Your budget allocation totals 100%.</span>
            </div>
          )}

          {/* 6-Month Projection */}
          <div className="p-4 rounded-xl bg-surface border border-border flex justify-between items-center text-xs">
            <div>
              <p className="text-textSecondary font-medium">6-Month Projected Savings</p>
              <p className="text-lg font-bold text-accent">{formatCurrency(savingsAmount * 6, countryCode)}</p>
            </div>
            <p className="text-[11px] text-textSecondary text-right max-w-xs">
              Saving {formatCurrency(savingsAmount, countryCode)}/mo builds a reliable emergency fund by graduation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
