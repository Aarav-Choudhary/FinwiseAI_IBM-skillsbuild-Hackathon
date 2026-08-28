import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, PieChart, GraduationCap, Building2, HelpCircle } from "lucide-react";
import ChatBubble from "../components/ChatBubble";
import { formatCurrency, getScholarshipsForCountry, getLoansForCountry } from "../lib/countries";

const SUGGESTED_PROMPTS = [
  "Can I afford a new laptop?",
  "Where am I overspending this month?",
  "Explain my student loan options",
  "Find me top scholarships for my field",
  "How do I build an emergency fund?",
  "What is my current financial health score?",
];

export default function ChatPage({ profile, expenses = [], budget }) {
  const countryCode = profile?.country || "IN";
  const currencySymbol = profile?.countryData?.symbol || "₹";

  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: `Hello ${profile?.name || "there"}! I'm FinBot, your IBM watsonx AI financial mentor. I can analyze your spending in ${profile?.countryData?.name || "your region"}, suggest budgets, explain student loans, or match scholarships. What would you like to explore today?`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: "ibm/granite-13b-chat-v2",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const queryText = textToSend || input;
    if (!queryText.trim() || loading) return;

    const userMsg = {
      role: "user",
      content: queryText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

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
        }),
      });

      const data = await res.json();
      const botMsg = {
        role: "bot",
        content: data.reply || "I'm sorry, I couldn't generate a response right now. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: data.model || "ibm/granite-13b-chat-v2",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const fallbackMsg = {
        role: "bot",
        content: `Based on your profile in ${profile?.countryData?.name || "your country"}, I recommend focusing on keeping essential costs below 50% of your ${currencySymbol}${profile?.income || 0} budget. Ask me specifically about expenses, loans, or scholarships!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: "ibm/granite-13b-chat-v2 (offline)",
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const topScholarships = getScholarshipsForCountry(countryCode).slice(0, 2);
  const topLoans = getLoansForCountry(countryCode).slice(0, 2);

  return (
    <div className="h-[calc(100vh-65px)] flex flex-col md:flex-row overflow-hidden">
      {/* ── Left Chat Panel ──────────────────────────────── */}
      <div className="flex-1 min-w-0 flex flex-col h-full border-r border-border bg-bg">
        {/* Chat Messages List */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <ChatBubble key={index} message={msg} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-xs text-textSecondary p-2">
              <Sparkles size={14} className="animate-spin text-primary" />
              <span>FinBot is thinking with IBM watsonx...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompt Chips */}
        <div className="px-4 py-2 border-t border-border/40 overflow-x-auto flex gap-2 no-scrollbar">
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full text-textSecondary hover:text-textPrimary hover:border-primary/50 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-4 border-t border-border bg-surface flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask FinBot anything about your ${currencySymbol} budget or loans...`}
            className="input-field flex-1"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="btn-primary p-3 rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* ── Right Dynamic Context Panel ──────────────────── */}
      <div className="w-72 p-4 md:p-5 bg-surface border-t md:border-t-0 border-border overflow-y-auto space-y-6 hidden md:block flex-shrink-0">
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
