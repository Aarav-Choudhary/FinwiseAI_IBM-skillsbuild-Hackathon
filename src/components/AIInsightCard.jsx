import { Sparkles, RefreshCw } from "lucide-react";

export default function AIInsightCard({ tip, loading = false, onRefresh }) {
  return (
    <div className="glass glass-hover p-4 rounded-2xl"
      style={{ borderColor: "rgba(108,99,255,0.2)", background: "linear-gradient(135deg, rgba(108,99,255,0.08), rgba(0,217,163,0.04))" }}>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6C63FF, #9B87FF)" }}>
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">AI Insight</span>
        </div>
        {onRefresh && (
          <button onClick={onRefresh}
            className="p-1.5 rounded-lg hover:bg-white/5 text-textSecondary hover:text-primary transition-all"
            title="Get new insight">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="shimmer h-4 w-full rounded" />
          <div className="shimmer h-4 w-4/5 rounded" />
          <div className="shimmer h-4 w-2/3 rounded" />
        </div>
      ) : (
        <p className="text-sm text-textPrimary leading-relaxed">{tip || "Loading your personalised insight..."}</p>
      )}

      <div className="mt-3 flex items-center gap-1.5">
        <Sparkles size={10} className="text-primary" />
        <span className="text-[10px] text-textSecondary">Grok AI</span>
      </div>
    </div>
  );
}
