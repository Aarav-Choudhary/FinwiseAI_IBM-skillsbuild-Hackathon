import { Calendar, ExternalLink, Award, Bell } from "lucide-react";
import { formatCurrency } from "../lib/countries";

export default function ScholarshipCard({ scholarship, countryCode = "IN", onSave, isSaved }) {
  return (
    <div className="glass glass-hover p-5 rounded-2xl flex flex-col justify-between space-y-4">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <span className="badge badge-accent">
            <Award size={12} /> {scholarship.type}
          </span>
          {scholarship.field && (
            <span className="text-xs text-textSecondary bg-surface px-2.5 py-1 rounded-full border border-border">
              {scholarship.field}
            </span>
          )}
        </div>

        <h3 className="font-semibold text-textPrimary text-base line-clamp-1 mb-1" title={scholarship.name}>
          {scholarship.name}
        </h3>
        <p className="text-xs text-textSecondary mb-3">{scholarship.provider}</p>

        <p className="text-xs text-textPrimary/80 line-clamp-2 leading-relaxed mb-4">
          {scholarship.description}
        </p>

        <div className="space-y-2 py-3 border-t border-b border-border/60 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-textSecondary">Amount</span>
            <span className="font-bold text-accent text-sm">
              {formatCurrency(scholarship.amount, countryCode)}
              {scholarship.amountPerYear ? " / yr" : ""}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-textSecondary flex items-center gap-1">
              <Calendar size={12} /> Deadline
            </span>
            <span className="font-medium text-warning">{scholarship.deadline}</span>
          </div>
        </div>

        {scholarship.eligibility && (
          <div className="mt-3">
            <p className="text-[11px] text-textSecondary font-medium">Eligibility:</p>
            <p className="text-[11px] text-textPrimary/70 line-clamp-2">{scholarship.eligibility}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        <a
          href={scholarship.link}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-xs py-2"
        >
          <span>Apply Now</span>
          <ExternalLink size={14} />
        </a>

        {onSave && (
          <button
            onClick={() => onSave(scholarship)}
            className={`p-2.5 rounded-xl border transition-colors ${
              isSaved
                ? "bg-accent/20 border-accent text-accent"
                : "glass border-border text-textSecondary hover:text-textPrimary"
            }`}
            title={isSaved ? "Saved to Reminders" : "Save Deadline Reminder"}
          >
            <Bell size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
