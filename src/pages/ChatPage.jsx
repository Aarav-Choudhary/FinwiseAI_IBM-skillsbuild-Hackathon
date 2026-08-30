import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, PieChart, GraduationCap, Building2, HelpCircle } from "lucide-react";
import ChatBubble from "../components/ChatBubble";
import { formatCurrency, getScholarshipsForCountry, getLoansForCountry } from "../lib/countries";
import { getChatHistory, saveMessage } from "../lib/firebase";

const SUGGESTED_PROMPTS = [
  "Can I afford a new laptop?",
  "Where am I overspending this month?",
  "Explain my student loan options",
  "Find me top scholarships for my field",
  "How do I build an emergency fund?",
  "What is my current financial health score?",
];

function generateClientFallback(query, profile, expenses = [], budget) {
  const msg = (query || "").toLowerCase();
  const symbol = profile?.countryData?.symbol || "₹";
  const income = profile?.income || 15000;
  const country = profile?.countryData?.name || "your country";
  const course = profile?.course || "your course";
  const totalSpent = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);

  if (msg.includes("laptop") || msg.includes("afford") || msg.includes("buy")) {
    const recommended = Math.round(income * 2.5);
    return `Based on your monthly income of ${symbol}${income.toLocaleString()}, buying a student laptop around ${symbol}${recommended.toLocaleString()} to ${symbol}${(recommended * 1.5).toLocaleString()} is feasible if you save 20% (${symbol}${Math.round(income * 0.2).toLocaleString()}/month) for 6–8 months or check student developer discounts.`;
  }

  if (msg.includes("overspending") || msg.includes("spending") || msg.includes("expenses")) {
    const topExpense = [...expenses].sort((a, b) => Number(b.amount) - Number(a.amount))[0];
    if (topExpense) {
      return `You have spent ${symbol}${totalSpent.toLocaleString()} so far. Your highest expense category is **${topExpense.category}** (${symbol}${topExpense.amount.toLocaleString()}). Try capping discretionary outings to save 15–20% more each month.`;
    }
    return `Your recorded expenses total ${symbol}${totalSpent.toLocaleString()} against an income of ${symbol}${income.toLocaleString()}. Following the 50/30/20 rule, keep non-essential 'Wants' under ${symbol}${Math.round(income * 0.3).toLocaleString()}.`;
  }

  if (msg.includes("loan") || msg.includes("interest") || msg.includes("debt")) {
    return `For students studying ${course} in ${country}, government education loan schemes provide subsidized interest rates during study moratoriums. Aim to keep future monthly repayments under 20% of your projected entry salary.`;
  }

  if (msg.includes("scholarship") || msg.includes("grant")) {
    return `Top scholarship opportunities in ${country} prioritize merit, STEM/humanities majors, and need-based applicants. Applying 2–3 months prior to semester deadlines increases acceptance rates significantly.`;
  }

  if (msg.includes("emergency") || msg.includes("save")) {
    const target = Math.round(income * 2.5);
    return `Target an emergency cushion of 2 to 3 months of basic expenses (~${symbol}${target.toLocaleString()}). Setting aside ${symbol}${Math.round(income * 0.15).toLocaleString()} monthly into a dedicated savings account will build this safely before graduation.`;
  }

  if (msg.includes("score") || msg.includes("health")) {
    const score = Math.min(95, Math.max(50, Math.round(((income - totalSpent) / (income || 1)) * 50 + 40)));
    return `Your calculated Financial Health Score is around **${score}/100**. Maintaining your essential spending below 50% and keeping an active savings rate will raise your score towards Grade A.`;
  }

  return `Based on your profile as a ${course} student in ${country} with a monthly income of ${symbol}${income.toLocaleString()}, I recommend keeping essentials under ${symbol}${Math.round(income * 0.5).toLocaleString()} (50%) and building your emergency buffer. What specific area (budget, loans, or scholarships) would you like help with?`;
}

export default function ChatPage({ user, profile, expenses = [], budget }) {
  const countryCode = profile?.country || "IN";
  const currencySymbol = profile?.countryData?.symbol || "₹";
  const activeUid = user?.uid || "guest_user";

  const defaultGreeting = {
    role: "bot",
    content: `Hello ${profile?.name || "there"}! I'm FinBot, your Grok AI financial mentor. I can analyze your spending in ${profile?.countryData?.name || "your region"}, suggest budgets, explain student loans, or match scholarships. What would you like to explore today?`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    model: "grok-ai",
  };

  const [messages, setMessages] = useState([defaultGreeting]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const history = await getChatHistory(activeUid);
        if (history && history.length > 0) {
          setMessages(history);
        } else {
          setMessages([defaultGreeting]);
        }
      } catch (err) {
        console.warn("Could not load chat history:", err);
      }
    }
    loadHistory();
  }, [activeUid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const queryText = (typeof textToSend === "string" ? textToSend : input).trim();
    if (!queryText || loading) return;

    const userMsg = {
      role: "user",
      content: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      await saveMessage(activeUid, userMsg);
    } catch (_) {}

    const systemPrompt = `You are FinBot, a friendly, expert financial advisor for college students in ${profile?.countryData?.name || "India"}. 
Always reference amounts in ${currencySymbol} (${profile?.currency || "INR"}). 
Keep your advice clear, encouraging, structured, and under 200 words. 
Student Context: Income: ${currencySymbol}${profile?.income || 0}, Course: ${profile?.course || "Student"}, Goals: ${(profile?.goals || []).join(", ") || "General financial growth"}.`;

    try {
      const res = await fetch("/api/finbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          systemPrompt,
          history: messages,
          studentContext: {
            currencySymbol,
            income: profile?.income || 15000,
            countryName: profile?.countryData?.name || "India",
            course: profile?.course || "Student",
          },
        }),
      });

      const data = await res.json();
      const botMsg = {
        role: "bot",
        content: data.reply || generateClientFallback(queryText, profile, expenses, budget),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || "ibm/granite-13b-chat-v2",
      };
      setMessages((prev) => [...prev, botMsg]);
      await saveMessage(activeUid, botMsg);
    } catch {
      const fallbackReply = generateClientFallback(queryText, profile, expenses, budget);
      const fallbackMsg = {
        role: "bot",
        content: fallbackReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: "ibm/granite-13b-chat-v2 (offline/demo)",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
      await saveMessage(activeUid, fallbackMsg);
    } finally {
      setLoading(false);
    }
  };

  const topScholarships = getScholarshipsForCountry(countryCode).slice(0, 2);
  const topLoans = getLoansForCountry(countryCode).slice(0, 2);

  return (
    <div className="h-full flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden bg-bg">
      {/* ── Left Chat Panel ──────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col h-full min-h-0 border-r border-border bg-bg overflow-hidden">
        {/* Chat Messages List (Scrollable Area) */}
        <div className="flex-1 min-h-0 p-4 md:p-6 overflow-y-auto space-y-4 scroll-smooth">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-textSecondary p-2 bg-surface/50 rounded-xl border border-border/50 w-fit animate-pulse">
              <Sparkles size={14} className="animate-spin text-primary" />
              <span>FinBot is analyzing your finances...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips (Fixed Above Input) */}
        <div className="px-4 py-2 border-t border-border/40 overflow-x-auto flex gap-2 no-scrollbar bg-surface/30 shrink-0">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full text-textSecondary hover:text-textPrimary hover:border-primary/50 whitespace-nowrap transition-all shadow-sm"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form (Fixed at Bottom) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-border bg-surface flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask FinBot anything about your ${currencySymbol} budget or loans...`}
            className="input-field flex-1 text-xs sm:text-sm py-2.5"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary p-2.5 sm:p-3 rounded-xl flex items-center justify-center disabled:opacity-50 shadow-md shadow-primary/20 shrink-0"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* ── Right Dynamic Context Panel ──────────────────── */}
      <div className="w-72 p-4 md:p-5 bg-surface border-t md:border-t-0 border-border overflow-y-auto space-y-6 hidden lg:block flex-shrink-0 h-full min-h-0">
        <div>
          <h3 className="text-xs font-semibold text-textSecondary uppercase tracking-wider mb-3">Student Context</h3>
          <div className="glass p-4 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-textSecondary">Country</span>
              <span className="font-medium text-textPrimary">{profile?.countryData?.flag} {profile?.countryData?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textSecondary">Monthly Income</span>
              <span className="font-medium text-accent">{formatCurrency(profile?.income || 0, countryCode)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-textSecondary">Course</span>
              <span className="font-medium text-textPrimary">{profile?.course || "General"}</span>
            </div>
          </div>
        </div>

        {/* Top Scholarships Quick Panel */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider mb-3">
            <GraduationCap size={14} />
            <span>Scholarship Match</span>
          </div>
          <div className="space-y-2">
            {topScholarships.map((s) => (
              <div key={s.id} className="p-3 rounded-xl glass text-xs space-y-1">
                <p className="font-semibold text-textPrimary line-clamp-1">{s.name}</p>
                <p className="text-[10px] text-accent font-bold">{formatCurrency(s.amount, countryCode)} / yr</p>
              </div>
            ))}
          </div>
        </div>

        {/* Loan Quick Reference */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-warning uppercase tracking-wider mb-3">
            <Building2 size={14} />
            <span>Country Loan Schemes</span>
          </div>
          <div className="space-y-2">
            {topLoans.map((l) => (
              <div key={l.id} className="p-3 rounded-xl glass text-xs space-y-1">
                <p className="font-semibold text-textPrimary line-clamp-1">{l.name}</p>
                <p className="text-[10px] text-textSecondary">{l.interestRate}% interest · {l.provider}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
