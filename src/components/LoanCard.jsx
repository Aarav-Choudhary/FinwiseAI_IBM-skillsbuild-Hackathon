import { Building2, Percent, Calendar, ExternalLink, Calculator } from "lucide-react";
import { formatCurrency } from "../lib/countries";

export default function LoanCard({ loan, countryCode = "IN", onSelect }) {
  return (
    <div className="glass glass-hover p-5 rounded-2xl flex flex-col justify-between space-y-4">
      <div>
        <div className="flex justify-between items-start gap-2 mb-2">
          <span className="badge badge-primary">
            <Building2 size={12} /> {loan.provider}
          </span>
          <span className="text-xs text-accent font-semibold flex items-center gap-0.5 bg-accent/10 px-2 py-0.5 rounded-full border border-accent/20">
            <Percent size={12} /> {loan.interestRate}% p.a.
          </span>
        </div>

        <h3 className="font-semibold text-textPrimary text-base line-clamp-1 mb-1" title={loan.name}>
          {loan.name}
        </h3>

        <p className="text-xs text-textPrimary/80 line-clamp-2 leading-relaxed mb-4">
          {loan.description}
        </p>

        <div className="space-y-2 py-3 border-t border-b border-border/60 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-textSecondary">Amount Range</span>
            <span className="font-semibold text-textPrimary">
              {formatCurrency(loan.minAmount, countryCode)} - {formatCurrency(loan.maxAmount, countryCode)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-textSecondary flex items-center gap-1">
              <Calendar size={12} /> Max Tenure
            </span>
            <span className="font-medium text-textPrimary">{loan.tenure ? `${loan.tenure / 12} yrs` : "Flexible"}</span>
          </div>
        </div>

        {loan.eligibility && (
          <div className="mt-3">
            <p className="text-[11px] text-textSecondary font-medium">Eligibility:</p>
            <p className="text-[11px] text-textPrimary/70 line-clamp-2">{loan.eligibility}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-2">
        {onSelect && (
          <button
            onClick={() => onSelect(loan)}
            className="btn-primary flex-1 flex items-center justify-center gap-1.5 text-xs py-2"
          >
            <Calculator size={14} />
            <span>Calculate EMI</span>
          </button>
        )}

        {loan.link && (
          <a
            href={loan.link}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost flex items-center justify-center p-2.5 rounded-xl"
            title="Official Website"
          >
            <ExternalLink size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
