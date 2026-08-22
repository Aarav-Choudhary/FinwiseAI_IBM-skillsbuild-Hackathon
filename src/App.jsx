import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  LayoutDashboard, Wallet, TrendingUp, Lightbulb, Plus, Trash2,
  PlayCircle, Flame, Bitcoin, Landmark, Briefcase, Coins, BookOpen,
  ShieldAlert, ShieldCheck, AlertTriangle, ArrowUpRight, ArrowDownRight,
  CreditCard, Info, ShoppingCart, ChevronDown, ChevronUp, Search,
  DollarSign, Percent, Calendar,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DESIGN TOKENS                                                      */
/* ------------------------------------------------------------------ */
const T = {
  bg: "#0B0B0D",
  panel: "#17171A",
  line: "#2A2A2E",
  ember: "#C81E3A",
  gold: "#D4AF37",
  goldHi: "#F2C94C",
  ink: "#ECE7DD",
  inkDim: "#9B968C",
  inkFaint: "#6E6A62",
  green: "#4FA37B",
  blue: "#8FA6B2",
  copper: "#B87333",
};

const TYPE_META = {
  bank:    { label: "Bank / Cash",  icon: Landmark,   color: T.blue },
  stocks:  { label: "Stocks",       icon: TrendingUp, color: T.gold },
  crypto:  { label: "Crypto",       icon: Bitcoin,    color: T.ember },
  business:{ label: "Business",     icon: Briefcase,  color: T.green },
  loan:    { label: "Loan",         icon: CreditCard, color: T.copper },
};

/* ------------------------------------------------------------------ */
/*  CITATION LINKS (Item 10)                                           */
/* ------------------------------------------------------------------ */
const SOURCE_LINKS = {
  "CFPB — Budgeting & spending plans":         "https://www.consumerfinance.gov/consumer-tools/budgeting/",
  "CFPB — Emergency savings guidance":          "https://www.consumerfinance.gov/an-cfpb-guide-to-emergency-savings/",
  "FINRA — Cryptocurrency risk disclosures":    "https://www.finra.org/investors/insights/cryptocurrency",
  "Investor.gov — Diversification basics (SEC)":"https://www.investor.gov/additional-resources/information/youth/teachers-classroom-resources/what-diversification",
  "SEC — Saving and Investing guide":           "https://www.sec.gov/investor/pubs/sec-guide-to-savings-and-investing.pdf",
  "Forge internal rule engine":                 null,
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
function currency(n) {
  return Number(n).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

/** Convert a zero-based month index to "Mon YYYY" using the real current date */
function monthLabel(idx) {
  const base = new Date();
  base.setDate(1);
  base.setMonth(base.getMonth() + idx);
  return base.toLocaleString("en-IN", { month: "short", year: "numeric" });
}

/* ------------------------------------------------------------------ */
/*  LOGO (unchanged)                                                   */
/* ------------------------------------------------------------------ */
function ForgeLogo({ size = 34 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2C94C" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
      <rect x="2" y="30" width="44" height="8" rx="2" fill="#1E1E22" stroke={T.gold} strokeWidth="1" />
      <path d="M14 30 L18 14 L30 14 L34 30 Z" fill="url(#goldGrad)" opacity="0.9" />
      <path d="M24 4 C 20 12, 27 13, 24 20 C 30 17, 32 8, 24 4 Z" fill={T.ember} />
      <path d="M24 10 C 22 15, 26 15, 24 19 C 27 17, 27 12, 24 10 Z" fill={T.goldHi} />
      <circle cx="24" cy="34" r="2.4" fill={T.bg} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  FORGE GAUGE (unchanged)                                            */
/* ------------------------------------------------------------------ */
function ForgeGauge({ score }) {
  const r = 54;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const offset = c - (pct / 100) * c;
  const zoneColor = pct < 35 ? T.ember : pct < 70 ? T.gold : T.green;
  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="150" height="150" viewBox="0 0 130 130" className="-rotate-90">
        <circle cx="65" cy="65" r={r} stroke={T.line} strokeWidth="10" fill="none" />
        <circle
          cx="65" cy="65" r={r} stroke={zoneColor} strokeWidth="10" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${zoneColor}aa)`, transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <Flame size={20} color={T.goldHi} />
        <span className="text-2xl font-bold" style={{ color: T.ink, fontFamily: "'IBM Plex Mono', monospace" }}>
          {Math.round(pct)}
        </span>
        <span className="text-[10px] tracking-widest uppercase" style={{ color: T.inkDim }}>Forge Score</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FIELD TOOLTIP (Item 6 — inline help text on hover)                */
/* ------------------------------------------------------------------ */
function FieldTooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        className="outline-none"
        tabIndex={0}
        aria-label="Help"
      >
        <Info size={13} color={T.inkFaint} />
      </button>
      {show && (
        <span
          className="absolute z-50 bottom-6 left-0 w-52 text-[11px] leading-relaxed p-2 rounded-md pointer-events-none"
          style={{ background: T.panel, border: `1px solid ${T.line}`, color: T.inkDim }}
        >
          {text}
        </span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  SIDEBAR — adds "afford" nav item (Item 9)                         */
/* ------------------------------------------------------------------ */
function Sidebar({ active, setActive }) {
  const items = [
    { id: "dashboard", label: "Dashboard",            icon: LayoutDashboard },
    { id: "budget",    label: "Budget Workbench",     icon: Wallet },
    { id: "invest",    label: "Investment Simulator", icon: TrendingUp },
    { id: "recs",      label: "Recommendations",      icon: Lightbulb },
    { id: "afford",    label: "Can I Afford This?",   icon: ShoppingCart },
    { id: "learn",     label: "Learn / Glossary",     icon: BookOpen },
  ];
  return (
    <aside className="w-64 shrink-0 h-full border-r flex flex-col" style={{ background: T.bg, borderColor: T.line }}>
      <div className="flex items-center gap-3 px-5 py-6 border-b" style={{ borderColor: T.line }}>
        <ForgeLogo />
        <div>
          <div className="font-bold tracking-wide" style={{ color: T.ink, fontFamily: "'IBM Plex Serif', serif" }}>FORGE</div>
          <div className="text-[10px] uppercase tracking-widest" style={{ color: T.inkDim }}>Financial Literacy Lab</div>
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
                background: isActive ? "linear-gradient(90deg,#C81E3A22,transparent)" : "transparent",
                color: isActive ? T.goldHi : T.inkDim,
                borderLeft: isActive ? `2px solid ${T.gold}` : "2px solid transparent",
              }}
            >
              <Icon size={17} />
              {it.label}
            </button>
          );
        })}
      </nav>
      <div className="px-5 py-4 border-t text-[11px]" style={{ borderColor: T.line, color: T.inkFaint }}>
        Simulated data only. Not financial advice.
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  STAT CARD (unchanged)                                              */
/* ------------------------------------------------------------------ */
function StatCard({ icon: Icon, label, value, delta, accent = T.gold }) {
  const positive = delta >= 0;
  return (
    <div className="rounded-lg p-4 border" style={{ background: T.panel, borderColor: T.line }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wide" style={{ color: T.inkDim }}>{label}</span>
        <Icon size={16} color={accent} />
      </div>
      <div className="text-xl font-bold" style={{ color: T.ink, fontFamily: "'IBM Plex Mono', monospace" }}>{value}</div>
      {delta !== undefined && (
        <div className="flex items-center gap-1 text-xs mt-1" style={{ color: positive ? T.green : T.ember }}>
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {Math.abs(delta).toFixed(1)}% this month
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DASHBOARD — adds stacked breakdown chart (Item 3)                 */
/* ------------------------------------------------------------------ */
function DashboardView({ incomes, expenses, simulations, netWorth, score, chartData }) {
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);

  // Non-loan sims only for stacked breakdown
  const investSims = simulations.filter((s) => s.type !== "loan");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="rounded-lg p-6 border flex items-center gap-6" style={{ background: T.panel, borderColor: T.line }}>
          <ForgeGauge score={score} />
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: T.ink, fontFamily: "'IBM Plex Serif', serif" }}>
              Welcome back, builder.
            </h2>
            <p className="text-sm max-w-sm" style={{ color: T.inkDim }}>
              Your Forge Score blends savings rate, diversification, and cash-flow health across every simulation you're running.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 flex-1">
          <StatCard icon={Coins}       label="Net Worth (sim)"     value={currency(netWorth)}        accent={T.gold} />
          <StatCard icon={ArrowUpRight} label="Monthly Income"     value={currency(totalIncome)}     accent={T.green} />
          <StatCard icon={ArrowDownRight} label="Monthly Expenses" value={currency(totalExpense)}    accent={T.ember} />
          <StatCard icon={TrendingUp}  label="Active Simulations"  value={simulations.length}        accent={T.blue} />
        </div>
      </div>

      {/* Combined growth chart */}
      <div className="rounded-lg p-5 border" style={{ background: T.panel, borderColor: T.line }}>
        <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: T.inkDim }}>Combined Portfolio Growth</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="goldFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={T.gold} stopOpacity={0.45} />
                <stop offset="100%" stopColor={T.gold} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={T.line} />
            <XAxis dataKey="label" stroke={T.inkFaint} fontSize={11} />
            <YAxis stroke={T.inkFaint} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
            <Tooltip contentStyle={{ background: T.bg, border: `1px solid ${T.line}`, color: T.ink }} formatter={(v) => currency(v)} />
            <Area type="monotone" dataKey="total" stroke={T.gold} fill="url(#goldFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Portfolio breakdown stacked bar (Item 3) */}
      {investSims.length > 1 && (
        <div className="rounded-lg p-5 border" style={{ background: T.panel, borderColor: T.line }}>
          <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: T.inkDim }}>Portfolio Breakdown — Per Simulation</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} stackOffset="none">
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} />
              <XAxis dataKey="label" stroke={T.inkFaint} fontSize={11} />
              <YAxis stroke={T.inkFaint} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: T.bg, border: `1px solid ${T.line}`, color: T.ink }} formatter={(v) => currency(v)} />
              <Legend wrapperStyle={{ fontSize: 11, color: T.inkDim }} />
              {investSims.map((s) => (
                <Bar key={s.id} dataKey={s.name} stackId="portfolio" fill={TYPE_META[s.type]?.color ?? T.gold} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  BUDGET VIEW — guardrails (Item 4)                                  */
/* ------------------------------------------------------------------ */
function EditableList({ items, setItems, kind }) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [pendingItem, setPendingItem] = useState(null); // confirmation state
  const accent = kind === "income" ? T.green : T.ember;

  const IMPLAUSIBLE_MULTIPLIER = 10; // warn if new entry > 10× the existing average

  const tryAdd = () => {
    if (!name || !amount) return;
    const num = Number(amount);
    if (num <= 0) return;

    if (items.length > 0) {
      const avg = items.reduce((s, i) => s + i.amount, 0) / items.length;
      if (avg > 0 && num > avg * IMPLAUSIBLE_MULTIPLIER) {
        setPendingItem({ name, amount: num });
        return;
      }
    }
    commitAdd(name, num);
  };

  const commitAdd = (n, a) => {
    setItems((prev) => [...prev, { id: Date.now(), name: n, amount: a }]);
    setName(""); setAmount(""); setPendingItem(null);
  };

  const remove = (id) => setItems(items.filter((i) => i.id !== id));

  return (
    <div className="rounded-lg p-5 border flex-1" style={{ background: T.panel, borderColor: T.line }}>
      <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: T.inkDim }}>
        {kind === "income" ? "Income Sources" : "Monthly Expenses"}
      </h3>

      {/* Implausible-value confirmation banner */}
      {pendingItem && (
        <div className="mb-3 p-3 rounded-md text-xs leading-relaxed" style={{ background: "#1f1408", border: `1px solid ${T.ember}`, color: T.ink }}>
          <span style={{ color: T.goldHi }}>Heads up — </span>
          {currency(pendingItem.amount)} is {IMPLAUSIBLE_MULTIPLIER}× larger than your other entries. Add it anyway?
          <div className="flex gap-2 mt-2">
            <button onClick={() => commitAdd(pendingItem.name, pendingItem.amount)}
              className="px-3 py-1 rounded text-[11px] font-medium" style={{ background: T.ember, color: T.ink }}>
              Yes, add it
            </button>
            <button onClick={() => setPendingItem(null)}
              className="px-3 py-1 rounded text-[11px]" style={{ background: T.line, color: T.inkDim }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4 max-h-52 overflow-y-auto pr-1">
        {items.length === 0 && <p className="text-xs" style={{ color: T.inkFaint }}>Nothing added yet.</p>}
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between px-3 py-2 rounded-md" style={{ background: T.bg }}>
            <span className="text-sm" style={{ color: T.ink }}>{i.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono" style={{ color: accent }}>{currency(i.amount)}</span>
              <button onClick={() => remove(i.id)}><Trash2 size={14} color={T.inkFaint} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"
          className="flex-1 px-3 py-2 rounded-md text-sm outline-none" style={{ background: T.bg, color: T.ink, border: `1px solid ${T.line}` }} />
        <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₹" type="number"
          className="w-24 px-3 py-2 rounded-md text-sm outline-none" style={{ background: T.bg, color: T.ink, border: `1px solid ${T.line}` }} />
        <button onClick={tryAdd} className="px-3 rounded-md" style={{ background: accent }}>
          <Plus size={16} color={T.bg} />
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
      {/* Negative cash-flow persistent banner (Item 4) */}
      {net < 0 && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-md text-sm" style={{ background: "#200810", border: `1px solid ${T.ember}`, color: T.ink }}>
          <AlertTriangle size={16} color={T.ember} className="mt-0.5 shrink-0" />
          <span>
            <span style={{ color: T.ember }} className="font-semibold">Negative cash flow: </span>
            you're spending {currency(Math.abs(net))} more than you earn each month — your savings will shrink and you can't invest sustainably until this gap closes.
          </span>
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        <EditableList items={incomes} setItems={setIncomes} kind="income" />
        <EditableList items={expenses} setItems={setExpenses} kind="expense" />
      </div>
      <div className="rounded-lg p-5 border flex items-center justify-between" style={{ background: T.panel, borderColor: T.line }}>
        <span className="text-sm uppercase tracking-wide" style={{ color: T.inkDim }}>Net Monthly Cash Flow</span>
        <span className="text-2xl font-bold font-mono" style={{ color: net >= 0 ? T.green : T.ember }}>
          {net >= 0 ? "+" : ""}{currency(net)}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  AMORTIZATION (unchanged)                                           */
/* ------------------------------------------------------------------ */
function buildAmortizationHistory(principal, apr, termMonths) {
  const monthlyRate = apr / 100 / 12;
  const payment = monthlyRate === 0
    ? principal / termMonths
    : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

  const history = [{ month: 0, value: Math.round(principal), interestPaid: 0, principalPaid: 0 }];
  let balance = principal;
  for (let m = 1; m <= termMonths; m++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(payment - interest, balance);
    balance = Math.max(0, balance - principalPaid);
    history.push({ month: m, value: Math.round(balance), interestPaid: Math.round(interest), principalPaid: Math.round(principalPaid) });
  }
  return history;
}

/* ------------------------------------------------------------------ */
/*  INSTRUMENT SEARCH DROPDOWN (Item 6)                               */
/* ------------------------------------------------------------------ */
function InstrumentSearch({ type, value, onChange }) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  const search = useCallback((q) => {
    if (!q || q.length < 2) { setResults([]); return; }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        if (type === "stocks") {
          const res = await fetch(`/api/instruments/stocks?q=${encodeURIComponent(q)}`);
          const data = await res.json();
          setResults((data.instruments || []).slice(0, 8));
        } else if (type === "crypto") {
          const res = await fetch(`/api/instruments/crypto?q=${encodeURIComponent(q)}`);
          const data = await res.json();
          setResults((data.coins || []).slice(0, 8));
        }
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
  }, [type]);

  useEffect(() => { search(query); }, [query, search]);

  const select = (label) => {
    setQuery(label);
    onChange(label);
    setOpen(false);
    setResults([]);
  };

  return (
    <div className="relative flex-1 min-w-[180px]">
      <div className="flex items-center gap-1 px-3 py-2 rounded-md text-sm"
        style={{ background: T.bg, border: `1px solid ${T.line}` }}>
        <Search size={13} color={T.inkFaint} />
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 160)}
          placeholder={type === "stocks" ? "Search stocks…" : "Search crypto…"}
          className="flex-1 bg-transparent outline-none text-sm"
          style={{ color: T.ink }}
        />
        {loading && <span className="text-[10px]" style={{ color: T.inkFaint }}>…</span>}
      </div>
      {open && results.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1 rounded-md overflow-hidden shadow-xl"
          style={{ background: T.panel, border: `1px solid ${T.line}` }}>
          {results.map((r, i) => (
            <li key={i}
              onMouseDown={() => select(r.label || r.name || r)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-[#1e1e22]"
              style={{ color: T.ink, borderBottom: `1px solid ${T.line}` }}>
              <span style={{ color: T.gold }}>{r.symbol || r.ticker || ""}</span>
              {(r.symbol || r.ticker) ? " — " : ""}
              {r.label || r.name || r}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  SIM CARD (unchanged except month labels now use monthLabel)        */
/* ------------------------------------------------------------------ */
function SimCard({ sim, onRemove }) {
  if (sim.type === "loan") return <LoanCard sim={sim} onRemove={onRemove} />;
  const meta = TYPE_META[sim.type];
  const Icon = meta.icon;
  const latest = sim.history[sim.history.length - 1]?.value ?? sim.principal;
  const growth = ((latest - sim.principal) / sim.principal) * 100;
  return (
    <div className="rounded-lg p-4 border" style={{ background: T.panel, borderColor: T.line }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} color={meta.color} />
          <span className="text-sm font-medium" style={{ color: T.ink }}>{sim.name}</span>
        </div>
        <button onClick={() => onRemove(sim.id)}><Trash2 size={14} color={T.inkFaint} /></button>
      </div>
      <div className="text-lg font-bold font-mono mb-1" style={{ color: T.ink }}>{currency(latest)}</div>
      <div className="text-xs" style={{ color: growth >= 0 ? T.green : T.ember }}>
        {growth >= 0 ? "+" : ""}{growth.toFixed(1)}% since start
      </div>
      <div className="text-[11px] mt-2" style={{ color: T.inkFaint }}>
        {meta.label} · {sim.expectedReturn}% expected annual return · {sim.volatility}% volatility
      </div>
    </div>
  );
}

function LoanCard({ sim, onRemove }) {
  const meta = TYPE_META.loan;
  const Icon = meta.icon;
  const currentMonth = sim.history.length - 1;
  const balance = sim.history[sim.history.length - 1]?.value ?? sim.principal;
  const totalInterest = sim.history.slice(1).reduce((s, h) => s + (h.interestPaid ?? 0), 0);
  const paidOff = balance === 0;
  const progress = ((sim.principal - balance) / sim.principal) * 100;
  return (
    <div className="rounded-lg p-4 border" style={{ background: T.panel, borderColor: T.line }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon size={16} color={meta.color} />
          <span className="text-sm font-medium" style={{ color: T.ink }}>{sim.name}</span>
        </div>
        <button onClick={() => onRemove(sim.id)}><Trash2 size={14} color={T.inkFaint} /></button>
      </div>
      <div className="text-lg font-bold font-mono mb-1" style={{ color: paidOff ? T.green : T.ink }}>
        {paidOff ? "PAID OFF" : currency(balance)}
      </div>
      <div className="text-xs mb-2" style={{ color: T.inkDim }}>
        remaining · {monthLabel(currentMonth)} · month {currentMonth} of {sim.termMonths}
      </div>
      <div className="w-full rounded-full h-1.5 mb-3" style={{ background: T.line }}>
        <div className="h-1.5 rounded-full transition-all"
          style={{ width: `${Math.min(100, progress)}%`, background: paidOff ? T.green : T.copper }} />
      </div>
      <div className="grid grid-cols-2 gap-x-4 text-[11px]" style={{ color: T.inkFaint }}>
        <span>APR: <span style={{ color: T.inkDim }}>{sim.apr}%</span></span>
        <span>Term: <span style={{ color: T.inkDim }}>{sim.termMonths} mo</span></span>
        <span>Principal: <span style={{ color: T.inkDim }}>{currency(sim.principal)}</span></span>
        <span>Interest paid: <span style={{ color: T.ember }}>{currency(totalInterest)}</span></span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  INVESTMENT VIEW — realism (1), calendar months (2), cash warn (5),*/
/*  instrument search (6), tooltips (6)                               */
/* ------------------------------------------------------------------ */
function InvestmentView({ simulations, setSimulations, chartData, netCashFlow }) {
  const [form, setForm] = useState({
    type: "stocks", name: "", principal: "", monthlyContribution: "",
    expectedReturn: "8", volatility: "12", apr: "12", termMonths: "24",
  });

  const isLoan = form.type === "loan";
  const isStocks = form.type === "stocks";
  const isCrypto = form.type === "crypto";
  const useInstrumentSearch = isStocks || isCrypto;

  // Item 5: warn if principal > available net cash
  const principalNum = Number(form.principal) || 0;
  const cashWarning = principalNum > 0 && netCashFlow > 0 && principalNum > netCashFlow * 6;

  const addSim = () => {
    if (!form.name || !form.principal) return;
    if (isLoan) {
      const principal = Number(form.principal);
      const apr = Number(form.apr);
      const termMonths = Number(form.termMonths);
      if (!termMonths || !apr) return;
      setSimulations([...simulations, {
        id: Date.now(), type: "loan", name: form.name, principal, apr, termMonths,
        monthlyContribution: 0, expectedReturn: 0, volatility: 0,
        history: buildAmortizationHistory(principal, apr, termMonths),
      }]);
    } else {
      setSimulations([...simulations, {
        id: Date.now(), type: form.type, name: form.name,
        principal: Number(form.principal),
        monthlyContribution: Number(form.monthlyContribution) || 0,
        expectedReturn: Number(form.expectedReturn),
        volatility: Number(form.volatility),
        history: [{ month: 0, value: Number(form.principal) }],
      }]);
    }
    setForm({ ...form, name: "", principal: "", monthlyContribution: "" });
  };

  const removeSim = (id) => setSimulations(simulations.filter((s) => s.id !== id));

  /* Item 1: fixed realism — proper vol scaling + 5% correction shock */
  const advanceMonth = () => {
    setSimulations(simulations.map((s) => {
      if (s.type === "loan") {
        const currentIdx = s.history.length - 1;
        if (currentIdx >= s.termMonths) return s;
        const full = buildAmortizationHistory(s.principal, s.apr, s.termMonths);
        return { ...s, history: full.slice(0, currentIdx + 2) };
      }
      const monthlyReturn = s.expectedReturn / 100 / 12;
      // Volatility scaled monthly (annualVol / √12), direction ±1
      const monthlyVol = (s.volatility / 100) / Math.sqrt(12);
      const shock = (Math.random() - 0.5) * 2 * monthlyVol;
      // 5% chance of correction for stocks/crypto: extra -5% to -15% hit
      const correction = (s.type === "stocks" || s.type === "crypto") && Math.random() < 0.05
        ? -(0.05 + Math.random() * 0.10)
        : 0;
      const last = s.history[s.history.length - 1];
      const newValue = Math.max(0, last.value * (1 + monthlyReturn + shock + correction) + s.monthlyContribution);
      return { ...s, history: [...s.history, { month: last.month + 1, value: Math.round(newValue) }] };
    }));
  };

  const chartSims = simulations.filter((s) => s.type !== "loan");

  const inputStyle = { background: T.bg, color: T.ink, border: `1px solid ${T.line}` };

  return (
    <div className="space-y-6">
      <div className="rounded-lg p-5 border" style={{ background: T.panel, borderColor: T.line }}>
        <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: T.inkDim }}>New Simulation</h3>

        {/* Cash warning (Item 5) */}
        {cashWarning && (
          <div className="mb-3 flex items-start gap-2 px-3 py-2 rounded-md text-xs"
            style={{ background: "#1a1408", border: `1px solid ${T.gold}`, color: T.inkDim }}>
            <AlertTriangle size={13} color={T.gold} className="shrink-0 mt-0.5" />
            This principal is large relative to your available cash flow. Make sure you have enough liquidity before committing.
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-start">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-3 py-2 rounded-md text-sm self-center" style={inputStyle}>
            {Object.entries(TYPE_META).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>

          {/* Instrument search for stocks/crypto, plain text for others (Item 6) */}
          {useInstrumentSearch ? (
            <InstrumentSearch
              type={form.type}
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
            />
          ) : (
            <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="px-3 py-2 rounded-md text-sm flex-1 min-w-[160px]" style={inputStyle} />
          )}

          <input placeholder="Principal ₹" type="number" value={form.principal}
            onChange={(e) => setForm({ ...form, principal: e.target.value })}
            className="w-28 px-3 py-2 rounded-md text-sm" style={inputStyle} />

          {isLoan ? (
            <>
              <div className="flex items-center gap-1">
                <input placeholder="APR %" type="number" value={form.apr}
                  onChange={(e) => setForm({ ...form, apr: e.target.value })}
                  className="w-20 px-3 py-2 rounded-md text-sm" style={inputStyle} />
                <FieldTooltip text="Annual Percentage Rate — the yearly cost of this loan including interest, expressed as a percentage." />
              </div>
              <input placeholder="Term (months)" type="number" value={form.termMonths}
                onChange={(e) => setForm({ ...form, termMonths: e.target.value })}
                className="w-28 px-3 py-2 rounded-md text-sm" style={inputStyle} />
            </>
          ) : (
            <>
              <input placeholder="Monthly add ₹" type="number" value={form.monthlyContribution}
                onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })}
                className="w-28 px-3 py-2 rounded-md text-sm" style={inputStyle} />
              <div className="flex items-center gap-1">
                <input placeholder="Return %/yr" type="number" value={form.expectedReturn}
                  onChange={(e) => setForm({ ...form, expectedReturn: e.target.value })}
                  className="w-24 px-3 py-2 rounded-md text-sm" style={inputStyle} />
                <FieldTooltip text="Expected annual return — the average yearly gain you expect from this investment, before volatility." />
              </div>
              <div className="flex items-center gap-1">
                <input placeholder="Volatility %" type="number" value={form.volatility}
                  onChange={(e) => setForm({ ...form, volatility: e.target.value })}
                  className="w-24 px-3 py-2 rounded-md text-sm" style={inputStyle} />
                <FieldTooltip text="Volatility — how widely the value swings each year. Higher = bigger ups and downs, more risk." />
              </div>
            </>
          )}

          <button onClick={addSim}
            className="px-4 py-2 rounded-md flex items-center gap-1 text-sm font-medium self-center"
            style={{ background: T.gold, color: T.bg }}>
            <Plus size={15} /> Add
          </button>
        </div>

        {/* Item 6 disclaimer */}
        {useInstrumentSearch && (
          <p className="text-[10px] mt-3" style={{ color: T.inkFaint }}>
            Instrument data via Dukascopy Bank SA / CoinGecko, for educational simulation only.
          </p>
        )}
      </div>

      {simulations.length > 0 && (
        <button onClick={advanceMonth}
          className="flex items-center gap-2 px-5 py-3 rounded-md font-medium text-sm"
          style={{ background: "linear-gradient(90deg,#C81E3A,#8f1428)", color: T.ink }}>
          <PlayCircle size={18} /> Advance 1 Month — run all {simulations.length} simulation{simulations.length > 1 ? "s" : ""} together
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {simulations.map((s) => <SimCard key={s.id} sim={s} onRemove={removeSim} />)}
      </div>

      {chartSims.length > 0 && (
        <div className="rounded-lg p-5 border" style={{ background: T.panel, borderColor: T.line }}>
          <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: T.inkDim }}>Per-Simulation Trajectory</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.line} />
              <XAxis dataKey="label" stroke={T.inkFaint} fontSize={11} />
              <YAxis stroke={T.inkFaint} fontSize={11} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: T.bg, border: `1px solid ${T.line}`, color: T.ink }} formatter={(v) => currency(v)} />
              <Legend wrapperStyle={{ fontSize: 11, color: T.inkDim }} />
              {chartSims.map((s) => (
                <Line key={s.id} type="monotone" dataKey={s.name} stroke={TYPE_META[s.type].color} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  RECOMMENDATIONS — citation links (10) + restyled Granite (7)      */
/* ------------------------------------------------------------------ */
function computeRecommendations(incomes, expenses, simulations) {
  const recs = [];
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const bankSims = simulations.filter((s) => s.type === "bank");
  const bankTotal = bankSims.reduce((s, x) => s + (x.history.at(-1)?.value ?? x.principal), 0);
  const portfolioTotal = simulations.reduce((s, x) => s + (x.history.at(-1)?.value ?? x.principal), 0);
  const cryptoTotal = simulations.filter((s) => s.type === "crypto").reduce((s, x) => s + (x.history.at(-1)?.value ?? x.principal), 0);

  if (totalIncome && totalExpense > totalIncome)
    recs.push({ severity: "high", title: "Spending exceeds income", body: "Your simulated monthly expenses are higher than income. Trim discretionary categories or increase income before adding new investments.", source: "CFPB — Budgeting & spending plans" });
  if (totalExpense && bankTotal < totalExpense * 3)
    recs.push({ severity: "medium", title: "Build a bigger emergency buffer", body: "Most guidance suggests keeping 3–6 months of expenses in low-volatility cash/bank simulations before taking on market risk.", source: "CFPB — Emergency savings guidance" });
  if (portfolioTotal > 0 && cryptoTotal / portfolioTotal > 0.3)
    recs.push({ severity: "medium", title: "Crypto allocation is high", body: "Over 30% of your simulated portfolio is in crypto, one of the most volatile asset classes.", source: "FINRA — Cryptocurrency risk disclosures" });
  if (simulations.length >= 2 && new Set(simulations.map((s) => s.type)).size === 1)
    recs.push({ severity: "low", title: "Diversify across asset types", body: "All your simulations are the same asset type. Spreading across bank, stocks, and others reduces concentration risk.", source: "Investor.gov — Diversification basics (SEC)" });
  if (simulations.length === 0)
    recs.push({ severity: "low", title: "Start your first simulation", body: "Try a small, low-risk bank simulation first to see how compounding works before adding stocks or crypto.", source: "SEC — Saving and Investing guide" });
  if (recs.length === 0)
    recs.push({ severity: "good", title: "Looking balanced", body: "Your simulated budget and portfolio don't trip any of our basic risk rules right now. Keep tracking as your simulations evolve.", source: "Forge internal rule engine" });
  return recs;
}

const SEVERITY_META = {
  high:   { color: T.ember,  icon: ShieldAlert },
  medium: { color: T.gold,   icon: AlertTriangle },
  low:    { color: T.blue,   icon: Lightbulb },
  good:   { color: T.green,  icon: ShieldCheck },
};

/* Item 7: icon per rule type */
const RULE_ICONS = {
  spending_exceeds_income:       Wallet,
  build_a_bigger_emergency_buffer: Landmark,
  crypto_allocation_is_high:     Bitcoin,
  diversify_across_asset_types:  TrendingUp,
  start_your_first_simulation:   Flame,
  looking_balanced:              ShieldCheck,
};

function RecommendationsView({ incomes, expenses, simulations }) {
  const [advisorData, setAdvisorData] = useState({});
  const [loadingIdx, setLoadingIdx] = useState(null);
  const recs = useMemo(() => computeRecommendations(incomes, expenses, simulations), [incomes, expenses, simulations]);

  const fetchAdvice = async (rec, idx) => {
    setLoadingIdx(idx);
    try {
      const res = await fetch("/api/advise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleCode: rec.title.toLowerCase().replace(/\s+/g, "_"),
          facts: {
            totalIncome: incomes.reduce((s, i) => s + i.amount, 0),
            totalExpense: expenses.reduce((s, e) => s + e.amount, 0),
            simCount: simulations.length,
            source: rec.source,
          },
        }),
      });
      const data = await res.json();
      setAdvisorData((prev) => ({ ...prev, [idx]: data }));
    } catch {
      setAdvisorData((prev) => ({ ...prev, [idx]: { explanation: "Could not reach the advisor endpoint.", example: null } }));
    } finally { setLoadingIdx(null); }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg p-4 border text-xs leading-relaxed" style={{ background: T.panel, borderColor: T.line, color: T.inkDim }}>
        These suggestions come from a rule engine cross-checked against cited financial-literacy sources — not free-form AI opinion.
        The Granite explanation button phrases the rule's reasoning in plain language and cites only the source already attached to the card.
      </div>
      {recs.map((r, idx) => {
        const meta = SEVERITY_META[r.severity];
        const Icon = meta.icon;
        const ruleCode = r.title.toLowerCase().replace(/\s+/g, "_");
        const RuleIcon = RULE_ICONS[ruleCode];
        const sourceUrl = SOURCE_LINKS[r.source];
        const advice = advisorData[idx];

        return (
          <div key={idx} className="rounded-lg p-4 border" style={{ background: T.panel, borderColor: T.line }}>
            <div className="flex items-start gap-3">
              <Icon size={18} color={meta.color} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold mb-1" style={{ color: T.ink }}>{r.title}</h4>
                <p className="text-sm mb-2" style={{ color: T.inkDim }}>{r.body}</p>

                {/* Citation — clickable if URL exists (Item 10) */}
                {sourceUrl ? (
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="inline-block text-[11px] uppercase tracking-wide px-2 py-1 rounded transition-opacity hover:opacity-80"
                    style={{ background: T.bg, color: meta.color, border: `1px solid ${meta.color}44`, textDecoration: "none" }}>
                    ↗ Source: {r.source}
                  </a>
                ) : (
                  <span className="text-[11px] uppercase tracking-wide px-2 py-1 rounded"
                    style={{ background: T.bg, color: meta.color, border: `1px solid ${meta.color}44` }}>
                    Source: {r.source}
                  </span>
                )}

                {/* Granite block (Item 7 — restyled with takeaway + example) */}
                {advice ? (
                  <div className="mt-3 rounded-md overflow-hidden" style={{ border: `1px solid ${T.line}` }}>
                    <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#1a1612", borderBottom: `1px solid ${T.line}` }}>
                      {RuleIcon && <RuleIcon size={13} color={T.gold} />}
                      <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: T.gold }}>Granite explanation</span>
                      <span className="text-[10px] ml-auto" style={{ color: T.inkFaint }}>ibm/granite-13b-instruct-v2</span>
                    </div>
                    <div className="px-3 py-3 space-y-2" style={{ background: T.bg }}>
                      <p className="text-xs leading-relaxed" style={{ color: T.ink }}>{advice.explanation}</p>
                      {advice.example && (
                        <div className="px-3 py-2 rounded text-xs leading-relaxed" style={{ background: "#141008", border: `1px solid ${T.gold}33`, color: T.gold }}>
                          <span style={{ color: T.goldHi }} className="font-semibold">Example: </span>{advice.example}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fetchAdvice(r, idx)}
                    disabled={loadingIdx === idx}
                    className="mt-3 px-3 py-1 rounded text-[11px] font-medium"
                    style={{ background: T.line, color: loadingIdx === idx ? T.inkFaint : T.gold, border: `1px solid #3a3a3e` }}>
                    {loadingIdx === idx ? "Asking Granite…" : "Ask Granite to explain →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  LEARN VIEW — expandable accordion cards with mini-charts (Item 8) */
/* ------------------------------------------------------------------ */
const GLOSSARY = [
  {
    term: "APR (Annual Percentage Rate)",
    body: "The yearly cost of borrowing money, including interest and most fees, expressed as a percentage.",
    example: "On a ₹1,00,000 loan at 12% APR, you pay ₹12,000 in interest per year — roughly ₹1,000 per month on top of principal repayment.",
    chartType: "bar",
    chartData: [
      { label: "Yr 1", interest: 12000, principal: 20000 },
      { label: "Yr 2", interest: 9600, principal: 20000 },
      { label: "Yr 3", interest: 7200, principal: 20000 },
    ],
    chartKeys: [{ key: "interest", color: T.ember }, { key: "principal", color: T.blue }],
  },
  {
    term: "Compounding",
    body: "Earning returns not just on your original money, but also on the returns it already made — growth builds on growth over time.",
    example: "₹10,000 at 8%/yr: Year 1 → ₹10,800 · Year 3 → ₹12,597 · Year 5 → ₹14,693 · Year 10 → ₹21,589.",
    chartType: "area",
    chartData: Array.from({ length: 11 }, (_, i) => ({ label: `Yr ${i}`, value: Math.round(10000 * Math.pow(1.08, i)) })),
    chartKeys: [{ key: "value", color: T.gold }],
  },
  {
    term: "Diversification",
    body: "Spreading money across different asset types so one bad investment doesn't sink your whole portfolio.",
    example: "A ₹1,00,000 portfolio split 40% stocks / 40% bank / 20% bonds loses far less in a stock crash than one that is 100% stocks.",
    chartType: "bar",
    chartData: [
      { label: "All stocks", crash: -40 },
      { label: "Diversified", crash: -16 },
    ],
    chartKeys: [{ key: "crash", color: T.ember }],
  },
  {
    term: "Credit vs Debit",
    body: "A debit card spends money you already have; a credit card spends borrowed money you must repay, usually with interest if unpaid.",
    example: "If you carry a ₹50,000 credit-card balance at 36% APR for 12 months without paying, you owe ₹68,000 by year-end.",
    chartType: "area",
    chartData: Array.from({ length: 13 }, (_, i) => ({ label: `Mo ${i}`, value: Math.round(50000 * Math.pow(1.03, i)) })),
    chartKeys: [{ key: "value", color: T.ember }],
  },
  {
    term: "Emergency Fund",
    body: "Cash set aside — commonly 3–6 months of expenses — kept liquid and low-risk for unexpected costs.",
    example: "If you spend ₹25,000/month, a 3-month buffer = ₹75,000 kept in a savings account, not invested.",
    chartType: "bar",
    chartData: [
      { label: "Target (3 mo)", value: 75000 },
      { label: "Target (6 mo)", value: 150000 },
    ],
    chartKeys: [{ key: "value", color: T.green }],
  },
  {
    term: "Volatility",
    body: "How much an investment's value swings up and down over time; higher volatility means higher risk and reward potential.",
    example: "A 20% volatile ₹1,00,000 stock position could reasonably be worth anywhere from ₹80,000 to ₹1,20,000 in a single year.",
    chartType: "area",
    chartData: (() => {
      // Simulated volatile path
      let v = 100000;
      return Array.from({ length: 13 }, (_, i) => {
        v = Math.round(v * (1 + (Math.random() - 0.5) * 0.2));
        return { label: `Mo ${i}`, value: v };
      });
    })(),
    chartKeys: [{ key: "value", color: T.gold }],
  },
];

function GlossaryCard({ g }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border overflow-hidden" style={{ background: T.panel, borderColor: T.line }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-4 text-left"
      >
        <h4 className="text-sm font-semibold" style={{ color: T.goldHi }}>{g.term}</h4>
        {open ? <ChevronUp size={15} color={T.inkFaint} /> : <ChevronDown size={15} color={T.inkFaint} />}
      </button>
      <div className="px-4 pb-2" style={{ color: T.inkDim }}>
        <p className="text-sm">{g.body}</p>
      </div>
      {open && (
        <div className="px-4 pb-4 space-y-3">
          <div className="text-xs px-3 py-2 rounded-md leading-relaxed"
            style={{ background: "#141008", border: `1px solid ${T.gold}33`, color: T.gold }}>
            <span style={{ color: T.goldHi }} className="font-semibold">Example: </span>{g.example}
          </div>
          {/* Mini recharts visual */}
          <ResponsiveContainer width="100%" height={100}>
            {g.chartType === "area" ? (
              <AreaChart data={g.chartData}>
                <defs>
                  <linearGradient id={`fill_${g.term.slice(0, 4)}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={g.chartKeys[0].color} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={g.chartKeys[0].color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" stroke={T.inkFaint} fontSize={9} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: T.bg, border: `1px solid ${T.line}`, color: T.ink, fontSize: 11 }} formatter={(v) => currency(v)} />
                <Area type="monotone" dataKey={g.chartKeys[0].key} stroke={g.chartKeys[0].color}
                  fill={`url(#fill_${g.term.slice(0, 4)})`} strokeWidth={1.5} dot={false} />
              </AreaChart>
            ) : (
              <BarChart data={g.chartData}>
                <XAxis dataKey="label" stroke={T.inkFaint} fontSize={9} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: T.bg, border: `1px solid ${T.line}`, color: T.ink, fontSize: 11 }} formatter={(v) => currency(Math.abs(v))} />
                {g.chartKeys.map((ck) => (
                  <Bar key={ck.key} dataKey={ck.key} fill={ck.color} radius={[3, 3, 0, 0]} />
                ))}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

function LearnView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {GLOSSARY.map((g) => <GlossaryCard key={g.term} g={g} />)}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  "CAN I AFFORD THIS?" PANEL (Item 9)                               */
/* ------------------------------------------------------------------ */
function AffordView({ incomes, expenses, simulations }) {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [result, setResult] = useState(null);

  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const net = totalIncome - totalExpense;
  const bankTotal = simulations
    .filter((s) => s.type === "bank")
    .reduce((s, x) => s + (x.history.at(-1)?.value ?? x.principal), 0);
  const emergencyTarget = totalExpense * 3;

  const check = () => {
    const p = Number(price);
    if (!itemName || !p || p <= 0) return;

    const affordableOutright = p <= net * 3;       // covers ≤3 months surplus
    const hitsBelowEmergency = bankTotal - p < emergencyTarget;
    const largerThanMonthNet = p > net;

    let verdict, color, icon, body;

    if (net <= 0) {
      verdict = "No";
      color = T.ember;
      icon = ShieldAlert;
      body = `Your cash flow is already negative (${currency(Math.abs(net))}/mo deficit). Taking on ${currency(p)} would worsen that further — address income/expenses first.`;
    } else if (!affordableOutright || hitsBelowEmergency) {
      verdict = "Caution";
      color = T.gold;
      icon = AlertTriangle;
      body = `${currency(p)} is manageable but stretches your position. ${hitsBelowEmergency ? `It would push your emergency fund below the 3-month target (₹${Math.round(emergencyTarget).toLocaleString("en-IN")} needed). ` : ""}${!affordableOutright ? "This is more than 3 months of your surplus — consider saving for it over a few months instead." : ""}`;
    } else {
      verdict = "Yes";
      color = T.green;
      icon = ShieldCheck;
      body = `${currency(p)} is within reach. Your net monthly surplus is ${currency(net)}, and your emergency buffer stays healthy after this purchase.`;
    }

    const cashBefore = bankTotal;
    const cashAfter = Math.max(0, bankTotal - p);

    setResult({ verdict, color, icon, body, cashBefore, cashAfter, emergencyTarget });
  };

  const VerdictIcon = result?.icon;

  return (
    <div className="space-y-6 max-w-xl">
      <div className="rounded-lg p-5 border" style={{ background: T.panel, borderColor: T.line }}>
        <h3 className="text-sm uppercase tracking-wide mb-4" style={{ color: T.inkDim }}>Check an item</h3>
        <div className="space-y-3">
          <input value={itemName} onChange={(e) => setItemName(e.target.value)}
            placeholder="What is it? (e.g. New laptop)"
            className="w-full px-3 py-2 rounded-md text-sm outline-none"
            style={{ background: T.bg, color: T.ink, border: `1px solid ${T.line}` }} />
          <div className="flex gap-2">
            <input value={price} onChange={(e) => setPrice(e.target.value)} type="number"
              placeholder="Price ₹"
              className="flex-1 px-3 py-2 rounded-md text-sm outline-none"
              style={{ background: T.bg, color: T.ink, border: `1px solid ${T.line}` }} />
            <button onClick={check}
              className="px-5 py-2 rounded-md text-sm font-medium"
              style={{ background: T.gold, color: T.bg }}>
              Check
            </button>
          </div>
        </div>
        <div className="mt-4 text-xs space-y-1" style={{ color: T.inkFaint }}>
          <div>Monthly net cash flow: <span style={{ color: net >= 0 ? T.green : T.ember }}>{currency(net)}</span></div>
          <div>Emergency buffer: <span style={{ color: T.inkDim }}>{currency(bankTotal)}</span> (target {currency(emergencyTarget)})</div>
        </div>
      </div>

      {result && (
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: result.color + "88" }}>
          {/* Verdict header */}
          <div className="flex items-center gap-3 px-5 py-4"
            style={{ background: result.color + "22", borderBottom: `1px solid ${result.color}44` }}>
            <VerdictIcon size={22} color={result.color} />
            <div>
              <div className="text-lg font-bold" style={{ color: result.color, fontFamily: "'IBM Plex Serif', serif" }}>
                {result.verdict} — {itemName}
              </div>
              <div className="text-xs" style={{ color: T.inkDim }}>{currency(Number(price))}</div>
            </div>
          </div>

          <div className="px-5 py-4 space-y-4" style={{ background: T.panel }}>
            <p className="text-sm leading-relaxed" style={{ color: T.inkDim }}>{result.body}</p>

            {/* Before / After cash bar (Item 9 visual) */}
            <div>
              <div className="text-[11px] uppercase tracking-wide mb-2" style={{ color: T.inkFaint }}>
                Bank balance before / after purchase
              </div>
              <ResponsiveContainer width="100%" height={80}>
                <BarChart
                  layout="vertical"
                  data={[
                    { label: "Before", value: result.cashBefore },
                    { label: "After",  value: result.cashAfter },
                  ]}
                  margin={{ left: 40, right: 20 }}>
                  <XAxis type="number" hide domain={[0, Math.max(result.cashBefore, result.emergencyTarget) * 1.1]} />
                  <YAxis type="category" dataKey="label" stroke={T.inkFaint} fontSize={11} width={40} />
                  <Tooltip contentStyle={{ background: T.bg, border: `1px solid ${T.line}`, color: T.ink, fontSize: 11 }} formatter={(v) => currency(v)} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {[result.cashBefore, result.cashAfter].map((v, i) => (
                      <rect key={i} fill={i === 1 && v < result.emergencyTarget ? T.ember : T.green} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="text-[10px] mt-1" style={{ color: T.inkFaint }}>
                Dashed line = 3-month emergency target ({currency(result.emergencyTarget)})
              </div>
            </div>

            <span className="text-[11px] uppercase tracking-wide px-2 py-1 rounded"
              style={{ background: T.bg, color: T.blue, border: `1px solid ${T.blue}44` }}>
              Source: CFPB — Emergency savings guidance
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  APP ROOT                                                           */
/* ------------------------------------------------------------------ */
export default function App() {
  const [active, setActive] = useState("dashboard");
  const [incomes, setIncomes] = useState([
    { id: 1, name: "Part-time job", amount: 8000 },
    { id: 2, name: "Scholarship",   amount: 3000 },
  ]);
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Rent", amount: 6000 },
    { id: 2, name: "Food", amount: 4000 },
  ]);
  const [simulations, setSimulations] = useState([
    { id: 1, type: "bank",   name: "Savings Account", principal: 20000, monthlyContribution: 1000, expectedReturn: 4,  volatility: 1,  history: [{ month: 0, value: 20000 }, { month: 1, value: 21070 }, { month: 2, value: 22145 }] },
    { id: 2, type: "stocks", name: "Index Fund",       principal: 15000, monthlyContribution: 1500, expectedReturn: 10, volatility: 15, history: [{ month: 0, value: 15000 }, { month: 1, value: 16620 }, { month: 2, value: 17900 }] },
  ]);

  const netWorth = simulations.reduce((s, x) => s + (x.history.at(-1)?.value ?? x.principal), 0);
  const totalIncome  = incomes.reduce((s, i) => s + i.amount, 0);
  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const netCashFlow  = totalIncome - totalExpense;
  const savingsRate  = totalIncome ? Math.max(0, netCashFlow / totalIncome) : 0;
  const types        = new Set(simulations.map((s) => s.type));
  const diversScore  = Math.min(1, types.size / 3);
  const score        = Math.round(savingsRate * 50 + diversScore * 30 + Math.min(1, netWorth / 100000) * 20);

  /* Item 2: real calendar month labels for combined chart */
  const maxMonths = Math.max(0, ...simulations.map((s) => s.history.length - 1));
  const combinedChart = Array.from({ length: maxMonths + 1 }, (_, m) => {
    const row = { month: m, label: monthLabel(m) };
    let total = 0;
    simulations.forEach((s) => {
      if (s.type === "loan") return; // loans reduce to 0; exclude from growth chart
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
    budget:    <BudgetView    incomes={incomes} setIncomes={setIncomes} expenses={expenses} setExpenses={setExpenses} />,
    invest:    <InvestmentView simulations={simulations} setSimulations={setSimulations} chartData={combinedChart} netCashFlow={netCashFlow} />,
    recs:      <RecommendationsView incomes={incomes} expenses={expenses} simulations={simulations} />,
    afford:    <AffordView incomes={incomes} expenses={expenses} simulations={simulations} />,
    learn:     <LearnView />,
  };

  const titles = {
    dashboard: "Dashboard",
    budget:    "Budget Workbench",
    invest:    "Investment Simulator",
    recs:      "Recommendations",
    afford:    "Can I Afford This?",
    learn:     "Learn / Glossary",
  };

  return (
    <div className="flex h-full min-h-[700px]" style={{ background: T.bg, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #2A2A2E; border-radius: 4px; }
      `}</style>
      <Sidebar active={active} setActive={setActive} />
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-xl font-bold mb-6" style={{ color: T.ink, fontFamily: "'IBM Plex Serif', serif" }}>
          {titles[active]}
        </h1>
        {views[active]}
      </main>
    </div>
  );
}
