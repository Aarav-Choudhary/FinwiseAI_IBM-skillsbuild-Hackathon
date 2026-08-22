import React, { useState, useMemo } from "react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  LayoutDashboard, Wallet, TrendingUp, Lightbulb, Plus, Trash2,
  PlayCircle, Flame, Bitcoin, Landmark, Briefcase, Coins, BookOpen,
  ShieldAlert, ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/*  bg      #0B0B0D  near-black, warm                                  */
/*  panel   #17171A  card surface                                      */
/*  line    #2A2A2E  hairline borders                                  */
/*  ember   #C81E3A  red accent (alerts / CTA)                         */
/*  gold    #D4AF37  primary metal accent                              */
/*  goldHi  #F2C94C  bright gold highlight / glow                      */
/*  ink     #ECE7DD  primary text (warm off-white)                     */
/*  inkDim  #9B968C  secondary text                                    */
/* ------------------------------------------------------------------ */

const TYPE_META = {
  bank:    { label: "Bank / Cash",   icon: Landmark,   color: "#8FA6B2" },
  stocks:  { label: "Stocks",        icon: TrendingUp, color: "#D4AF37" },
  crypto:  { label: "Crypto",        icon: Bitcoin,     color: "#C81E3A" },
  business:{ label: "Business",      icon: Briefcase,   color: "#4FA37B" },
};

function currency(n) {
  return n.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

/* ------------------------------- LOGO -------------------------------- */
function ForgeLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2C94C" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <rect x="2" y="30" width="44" height="8" rx="2" fill="#1E1E22" stroke="#D4AF37" strokeWidth="1" />
      <path d="M14 30 L18 14 L30 14 L34 30 Z" fill="url(#goldGrad)" opacity="0.9" />
      <path d="M24 4 C 20 12, 27 13, 24 20 C 30 17, 32 8, 24 4 Z" fill="#C81E3A" />
      <path d="M24 10 C 22 15, 26 15, 24 19 C 27 17, 27 12, 24 10 Z" fill="#F2C94C" />
      <circle cx="24" cy="34" r="2.4" fill="#0B0B0D" />
    </svg>
  );
}

/* ---------------------------- FORGE GAUGE ----------------------------- */
function ForgeGauge({ score }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;
  const zoneColor = pct < 35 ? "#C81E3A" : pct < 70 ? "#D4AF37" : "#4FA37B";

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="150" height="150" viewBox="0 0 130 130" className="-rotate-90">
        <circle cx="65" cy="65" r={r} stroke="#2A2A2E" strokeWidth="10" fill="none" />
        <circle
          cx="65" cy="65" r={r} stroke={zoneColor} strokeWidth="10" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${zoneColor}aa)`, transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <Flame size={20} color="#F2C94C" />
        <span className="text-2xl font-bold" style={{ color: "#ECE7DD", fontFamily: "'IBM Plex Mono', monospace" }}>
          {Math.round(pct)}
        </span>
        <span className="text-[10px] tracking-widest uppercase" style={{ color: "#9B968C" }}>Forge Score</span>
      </div>
    </div>
  );
}

/* ------------------------------ SIDEBAR ------------------------------- */
function Sidebar({ active, setActive }) {
  const items = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "budget", label: "Budget Workbench", icon: Wallet },
    { id: "invest", label: "Investment Simulator", icon: TrendingUp },
    { id: "recs", label: "Recommendations", icon: Lightbulb },
    { id: "learn", label: "Learn / Glossary", icon: BookOpen },
  ];
  return (
    <aside className="w-64 shrink-0 h-full border-r flex flex-col" style={{ background: "#0B0B0D", borderColor: "#2A2A2E" }}>
      <div className="flex items-center gap-3 px-5 py-6 border-b" style={{ borderColor: "#2A2A2E" }}>
        <ForgeLogo />
        <div>
          <div className="font-bold tracking-wide" style={{ color: "#ECE7DD", fontFamily: "'IBM Plex Serif', serif" }}>FORGE</div>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: "#9B968C" }}>Financial Literacy Lab</div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((it) => {
          const Icon = it.icon;
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => setActive(it.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
              style={{
                background: isActive ? "linear-gradient(90deg, #C81E3A22, transparent)" : "transparent",
                color: isActive ? "#F2C94C" : "#9B968C",
                borderLeft: isActive ? "2px solid #D4AF37" : "2px solid transparent",
              }}
            >
              <Icon size={17} />
              {it.label}
            </button>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t text-[11px]" style={{ borderColor: "#2A2A2E", color: "#6E6A62" }}>
        Simulated data only. Not financial advice.
      </div>
    </aside>
  );
}

/* ----------------------------- STAT CARD ------------------------------ */
function StatCard({ icon: Icon, label, value, delta, accent = "#D4AF37" }) {
  const positive = delta >= 0;
  return (
    <div className="rounded-lg p-4 border" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wide" style={{ color: "#9B968C" }}>{label}</span>
        <Icon size={16} color={accent} />
      </div>
      <div className="text-xl font-bold" style={{ color: "#ECE7DD", fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div>
      {delta !== undefined && (
        <div className="flex items-center gap-1 text-xs mt-1" style={{ color: positive ? "#4FA37B" : "#C81E3A" }}>
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(delta).toFixed(1)}% this month
        </div>
      )}
    </div>
  );
}

/* ---------------------------- DASHBOARD VIEW --------------------------- */
function DashboardView({ incomes, expenses, simulations, netWorth, score, chartData }) {
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="rounded-lg p-6 border flex items-center gap-6" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
          <ForgeGauge score={score} />
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: "#ECE7DD", fontFamily: "'IBM Plex Serif', serif" }}>
              Welcome back, builder.
            </h2>
            <p className="text-sm max-w-sm" style={{ color: "#9B968C" }}>
              Your Forge Score blends savings rate, diversification, and cash-flow health across every simulation you're running.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1">
          <StatCard icon={Coins} label="Net Worth (sim)" value={currency(netWorth)} accent="#D4AF37" />
          <StatCard icon={ArrowUpRight} label="Monthly Income" value={currency(totalIncome)} accent="#4FA37B" />
          <StatCard icon={ArrowDownRight} label="Monthly Expenses" value={currency(totalExpense)} accent="#C81E3A" />
          <StatCard icon={TrendingUp} label="Active Simulations" value={simulations.length} accent="#8FA6B2" />
        </div>
      </div>

      <div className="rounded-lg p-5 border" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
        <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: "#9B968C" }}>Combined Portfolio Growth</h3>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
            <XAxis dataKey="month" stroke="#6E6A62" fontSize={11} />
            <YAxis stroke="#6E6A62" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: "#0B0B0D", border: "1px solid #2A2A2E", color: "#ECE7DD" }} formatter={(v) => currency(v)} />
            <Area type="monotone" dataKey="total" stroke="#D4AF37" fill="url(#goldFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ---------------------------- BUDGET VIEW ------------------------------ */
function EditableList({ items, setItems, kind }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const accent = kind === "income" ? "#4FA37B" : "#C81E3A";

  const add = () => {
    if (!name || !amount) return;
    setItems([...items, { id: Date.now(), name, amount: Number(amount) }]);
    setName(""); setAmount("");
  };
  const remove = (id) => setItems(items.filter((i) => i.id !== id));

  return (
    <div className="rounded-lg p-5 border flex-1" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
      <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: "#9B968C" }}>
        {kind === "income" ? "Income Sources" : "Monthly Expenses"}
      </h3>
      <div className="space-y-2 mb-4 max-h-52 overflow-y-auto pr-1">
        {items.length === 0 && <p className="text-xs" style={{ color: "#6E6A62" }}>Nothing added yet.</p>}
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between px-3 py-2 rounded-md" style={{ background: "#0B0B0D" }}>
            <span className="text-sm" style={{ color: "#ECE7DD" }}>{i.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono" style={{ color: accent }}>{currency(i.amount)}</span>
              <button onClick={() => remove(i.id)}><Trash2 size={14} color="#6E6A62" /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
          className="flex-1 px-3 py-2 rounded-md text-sm outline-none" style={{ background: "#0B0B0D", color: "#ECE7DD", border: "1px solid #2A2A2E" }} />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₹" type="number"
          className="w-24 px-3 py-2 rounded-md text-sm outline-none" style={{ background: "#0B0B0D", color: "#ECE7DD", border: "1px solid #2A2A2E" }} />
        <button onClick={add} className="px-3 rounded-md" style={{ background: accent }}>
          <Plus size={16} color="#0B0B0D" />
        </button>
      </div>
    </div>
  );
}

function BudgetView({ incomes, setIncomes, expenses, setExpenses }) {
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const net = totalIncome - totalExpense;
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <EditableList items={incomes} setItems={setIncomes} kind="income" />
        <EditableList items={expenses} setItems={setExpenses} kind="expense" />
      </div>
      <div className="rounded-lg p-5 border flex items-center justify-between" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
        <span className="text-sm uppercase tracking-wide" style={{ color: "#9B968C" }}>Net Monthly Cash Flow</span>
        <span className="text-2xl font-bold font-mono" style={{ color: net >= 0 ? "#4FA37B" : "#C81E3A" }}>
          {net >= 0 ? "+" : ""}{currency(net)}
        </span>
      </div>
    </div>
  );
}

/* -------------------------- INVESTMENT VIEW ---------------------------- */
function SimCard({ sim, onRemove }) {
  const meta = TYPE_META[sim.type];
  const Icon = meta.icon;
  const latest = sim.history[sim.history.length - 1]?.value ?? sim.principal;
  const growth = ((latest - sim.principal) / sim.principal) * 100;
  return (
    <div className="rounded-lg p-4 border" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} color={meta.color} />
          <span className="text-sm font-medium" style={{ color: "#ECE7DD" }}>{sim.name}</span>
        </div>
        <button onClick={() => onRemove(sim.id)}><Trash2 size={14} color="#6E6A62" /></button>
      </div>
      <div className="text-lg font-bold font-mono mb-1" style={{ color: "#ECE7DD" }}>{currency(latest)}</div>
      <div className="text-xs" style={{ color: growth >= 0 ? "#4FA37B" : "#C81E3A" }}>
        {growth >= 0 ? "+" : ""}{growth.toFixed(1)}% since start
      </div>
      <div className="text-[11px] mt-2" style={{ color: "#6E6A62" }}>
        {meta.label} · {sim.expectedReturn}% expected annual return · {sim.volatility}% volatility
      </div>
    </div>
  );
}

function InvestmentView({ simulations, setSimulations, chartData }) {
  const [form, setForm] = useState({ type: "stocks", name: "", principal: "", monthlyContribution: "", expectedReturn: "8", volatility: "12" });

  const addSim = () => {
    if (!form.name || !form.principal) return;
    setSimulations([...simulations, {
      id: Date.now(),
      type: form.type,
      name: form.name,
      principal: Number(form.principal),
      monthlyContribution: Number(form.monthlyContribution) || 0,
      expectedReturn: Number(form.expectedReturn),
      volatility: Number(form.volatility),
      history: [{ month: 0, value: Number(form.principal) }],
    }]);
    setForm({ ...form, name: "", principal: "", monthlyContribution: "" });
  };

  const removeSim = (id) => setSimulations(simulations.filter((s) => s.id !== id));

  const advanceMonth = () => {
    setSimulations(simulations.map((s) => {
      const monthlyReturn = s.expectedReturn / 100 / 12;
      const volFactor = (Math.random() - 0.5) * 2 * (s.volatility / 100 / 12);
      const last = s.history[s.history.length - 1];
      const newValue = Math.max(0, last.value * (1 + monthlyReturn + volFactor) + s.monthlyContribution);
      return { ...s, history: [...s.history, { month: last.month + 1, value: Math.round(newValue) }] };
    }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg p-5 border" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
        <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: "#9B968C" }}>New Simulation</h3>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-3 py-2 rounded-md text-sm" style={{ background: "#0B0B0D", color: "#ECE7DD", border: "1px solid #2A2A2E" }}>
            {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
          <input placeholder="Name (e.g. Nifty Index Fund)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="px-3 py-2 rounded-md text-sm flex-1 min-w-[160px]" style={{ background: "#0B0B0D", color: "#ECE7DD", border: "1px solid #2A2A2E" }} />
          <input placeholder="Principal ₹" type="number" value={form.principal} onChange={(e) => setForm({ ...form, principal: e.target.value })}
            className="w-28 px-3 py-2 rounded-md text-sm" style={{ background: "#0B0B0D", color: "#ECE7DD", border: "1px solid #2A2A2E" }} />
          <input placeholder="Monthly add ₹" type="number" value={form.monthlyContribution} onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })}
            className="w-28 px-3 py-2 rounded-md text-sm" style={{ background: "#0B0B0D", color: "#ECE7DD", border: "1px solid #2A2A2E" }} />
          <input placeholder="Return %/yr" type="number" value={form.expectedReturn} onChange={(e) => setForm({ ...form, expectedReturn: e.target.value })}
            className="w-24 px-3 py-2 rounded-md text-sm" style={{ background: "#0B0B0D", color: "#ECE7DD", border: "1px solid #2A2A2E" }} />
          <input placeholder="Volatility %" type="number" value={form.volatility} onChange={(e) => setForm({ ...form, volatility: e.target.value })}
            className="w-24 px-3 py-2 rounded-md text-sm" style={{ background: "#0B0B0D", color: "#ECE7DD", border: "1px solid #2A2A2E" }} />
          <button onClick={addSim} className="px-4 py-2 rounded-md flex items-center gap-1 text-sm font-medium" style={{ background: "#D4AF37", color: "#0B0B0D" }}>
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {simulations.length > 0 && (
        <button onClick={advanceMonth} className="flex items-center gap-2 px-5 py-3 rounded-md font-medium text-sm"
          style={{ background: "linear-gradient(90deg,#C81E3A,#8f1428)", color: "#ECE7DD" }}>
          <PlayCircle size={18} /> Advance 1 Month — run all {simulations.length} simulation{simulations.length > 1 ? "s" : ""} together
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {simulations.map((s) => <SimCard key={s.id} sim={s} onRemove={removeSim} />)}
      </div>

      {simulations.length > 0 && (
        <div className="rounded-lg p-5 border" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
          <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: "#9B968C" }}>Per-Simulation Trajectory</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2E" />
              <XAxis dataKey="month" stroke="#6E6A62" fontSize={11} />
              <YAxis stroke="#6E6A62" fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: "#0B0B0D", border: "1px solid #2A2A2E", color: "#ECE7DD" }} formatter={(v) => currency(v)} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#9B968C" }} />
              {simulations.map((s) => (
                <Line key={s.id} type="monotone" dataKey={s.name} stroke={TYPE_META[s.type].color} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ------------------------- RECOMMENDATIONS VIEW ------------------------ */
function computeRecommendations(incomes, expenses, simulations) {
  const recs = [];
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const bankSims = simulations.filter((s) => s.type === "bank");
  const bankTotal = bankSims.reduce((s, x) => s + (x.history.at(-1)?.value ?? x.principal), 0);
  const portfolioTotal = simulations.reduce((s, x) => s + (x.history.at(-1)?.value ?? x.principal), 0);
  const cryptoTotal = simulations.filter((s) => s.type === "crypto").reduce((s, x) => s + (x.history.at(-1)?.value ?? x.principal), 0);

  if (totalIncome && totalExpense > totalIncome) {
    recs.push({ severity: "high", title: "Spending exceeds income", body: "Your simulated monthly expenses are higher than income. Consider trimming discretionary categories or increasing income sources before adding new investments.", source: "CFPB — Budgeting & spending plans" });
  }
  if (totalExpense && bankTotal < totalExpense * 3) {
    recs.push({ severity: "medium", title: "Build a bigger emergency buffer", body: "Most guidance suggests keeping 3–6 months of expenses in low-volatility cash/bank simulations before taking on market risk.", source: "CFPB — Emergency savings guidance" });
  }
  if (portfolioTotal > 0 && cryptoTotal / portfolioTotal > 0.3) {
    recs.push({ severity: "medium", title: "Crypto allocation is high", body: "Over 30% of your simulated portfolio is in crypto, one of the most volatile asset classes. Regulators generally flag concentrated crypto exposure as high risk.", source: "FINRA — Cryptocurrency risk disclosures" });
  }
  if (simulations.length >= 2) {
    const types = new Set(simulations.map((s) => s.type));
    if (types.size === 1) {
      recs.push({ severity: "low", title: "Diversify across asset types", body: "All your simulations are the same asset type. Spreading across bank, stocks, and other categories reduces the impact of any single simulation underperforming.", source: "Investor.gov — Diversification basics (SEC)" });
    }
  }
  if (simulations.length === 0) {
    recs.push({ severity: "low", title: "Start your first simulation", body: "Try a small, low-risk bank simulation first to see how compounding works before adding stocks or crypto.", source: "SEC — Saving and Investing guide" });
  }
  if (recs.length === 0) {
    recs.push({ severity: "good", title: "Looking balanced", body: "Your simulated budget and portfolio don't trip any of our basic risk rules right now. Keep tracking as your simulations evolve.", source: "Forge internal rule engine" });
  }
  return recs;
}

const SEVERITY_META = {
  high: { color: "#C81E3A", icon: ShieldAlert },
  medium: { color: "#D4AF37", icon: AlertTriangle },
  low: { color: "#8FA6B2", icon: Lightbulb },
  good: { color: "#4FA37B", icon: ShieldCheck },
};

function RecommendationsView({ incomes, expenses, simulations }) {
  const recs = useMemo(() => computeRecommendations(incomes, expenses, simulations), [incomes, expenses, simulations]);
  return (
    <div className="space-y-5">
      <div className="rounded-lg p-4 border text-xs leading-relaxed" style={{ background: "#17171A", borderColor: "#2A2A2E", color: "#9B968C" }}>
        These suggestions come from a rule engine cross-checked against cited financial-literacy sources — not free-form AI opinion.
        In production, this panel calls watsonx.ai / Granite for the natural-language explanation, constrained to reason only over
        the same curated source set shown below each card, so the model explains the rule rather than inventing one.
      </div>
      {recs.map((r, idx) => {
        const meta = SEVERITY_META[r.severity];
        const Icon = meta.icon;
        return (
          <div key={idx} className="rounded-lg p-4 border" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
            <div className="flex items-start gap-3">
              <Icon size={18} color={meta.color} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1" style={{ color: "#ECE7DD" }}>{r.title}</h4>
                <p className="text-sm mb-2" style={{ color: "#9B968C" }}>{r.body}</p>
                <span className="text-[11px] uppercase tracking-wide px-2 py-1 rounded" style={{ background: "#0B0B0D", color: meta.color, border: `1px solid ${meta.color}44` }}>
                  Source: {r.source}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ LEARN VIEW ----------------------------- */
const GLOSSARY = [
  { term: "APR (Annual Percentage Rate)", body: "The yearly cost of borrowing money, including interest and most fees, expressed as a percentage." },
  { term: "Compounding", body: "Earning returns not just on your original money, but also on the returns it already made — growth builds on growth over time." },
  { term: "Diversification", body: "Spreading money across different asset types so one bad investment doesn't sink your whole portfolio." },
  { term: "Credit vs Debit", body: "A debit card spends money you already have; a credit card spends borrowed money you must repay, usually with interest if unpaid." },
  { term: "Emergency Fund", body: "Cash set aside — commonly 3–6 months of expenses — kept liquid and low-risk for unexpected costs." },
  { term: "Volatility", body: "How much an investment's value swings up and down over time; higher volatility means higher risk and reward potential." },
];

function LearnView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {GLOSSARY.map((g) => (
        <div key={g.term} className="rounded-lg p-4 border" style={{ background: "#17171A", borderColor: "#2A2A2E" }}>
          <h4 className="text-sm font-semibold mb-1" style={{ color: "#F2C94C" }}>{g.term}</h4>
          <p className="text-sm" style={{ color: "#9B968C" }}>{g.body}</p>
        </div>
      ))}
    </div>
  );
}

/* --------------------------------- APP ---------------------------------- */
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [incomes, setIncomes] = useState([{ id: 1, name: "Part-time job", amount: 8000 }, { id: 2, name: "Scholarship", amount: 3000 }]);
  const [expenses, setExpenses] = useState([{ id: 1, name: "Rent", amount: 6000 }, { id: 2, name: "Food", amount: 4000 }]);
  const [simulations, setSimulations] = useState([
    { id: 1, type: "bank", name: "Savings Account", principal: 20000, monthlyContribution: 1000, expectedReturn: 4, volatility: 1, history: [{ month: 0, value: 20000 }, { month: 1, value: 21070 }, { month: 2, value: 22145 }] },
    { id: 2, type: "stocks", name: "Index Fund", principal: 15000, monthlyContribution: 1500, expectedReturn: 10, volatility: 15, history: [{ month: 0, value: 15000 }, { month: 1, value: 16620 }, { month: 2, value: 17900 }] },
  ]);

  const netWorth = simulations.reduce((s, x) => s + (x.history.at(-1)?.value ?? x.principal), 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const savingsRate = totalIncome ? Math.max(0, (totalIncome - totalExpense) / totalIncome) : 0;
  const types = new Set(simulations.map((s) => s.type));
  const diversificationScore = Math.min(1, types.size / 3);
  const score = Math.round((savingsRate * 50 + diversificationScore * 30 + Math.min(1, netWorth / 100000) * 20));

  const maxMonths = Math.max(0, ...simulations.map((s) => s.history.length - 1));
  const combinedChart = Array.from({ length: maxMonths + 1 }, (_, m) => {
    const row = { month: `M${m}` };
    let total = 0;
    simulations.forEach((s) => {
      const point = s.history.find((h) => h.month === m);
      const val = point ? point.value : s.history.at(-1)?.value ?? s.principal;
      row[s.name] = val;
      total += val;
    });
    row.total = total;
    return row;
  });

  const views = {
    dashboard: <DashboardView incomes={incomes} expenses={expenses} simulations={simulations} netWorth={netWorth} score={score} chartData={combinedChart} />,
    budget: <BudgetView incomes={incomes} setIncomes={setIncomes} expenses={expenses} setExpenses={setExpenses} />,
    invest: <InvestmentView simulations={simulations} setSimulations={setSimulations} chartData={combinedChart} />,
    recs: <RecommendationsView incomes={incomes} expenses={expenses} simulations={simulations} />,
    learn: <LearnView />,
  };

  const titles = {
    dashboard: "Dashboard", budget: "Budget Workbench", invest: "Investment Simulator",
    recs: "Recommendations", learn: "Learn / Glossary",
  };

  return (
    <div className="flex h-full min-h-[700px]" style={{ background: "#0B0B0D", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #2A2A2E; border-radius: 4px; }
      `}</style>
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-xl font-bold mb-6" style={{ color: "#ECE7DD", fontFamily: "'IBM Plex Serif', serif" }}>
          {titles[active]}
        </h1>
        {views[active]}
      </main>
    </div>
  );
}
