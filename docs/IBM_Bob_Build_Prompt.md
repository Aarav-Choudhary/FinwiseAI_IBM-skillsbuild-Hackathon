# Forge — Build Spec (Phase 2)

## Status
Phase 1 is complete and verified: Vite + React + Tailwind scaffold, the full
red/black/gold design system, Budget Workbench, Investment Simulator (bank,
stocks, crypto, loan types), Recommendations rule engine, Learn/Glossary,
and an Express backend stubbing watsonx/Granite responses. `/api/health` and
`/api/advise` both confirmed working end to end.

**Do not restyle the existing design system, fonts, or layout structure —
only extend it.** Read `src/App.jsx` and `server/index.cjs` fully before
changing anything.

This phase focuses on making the app teach through *interaction*, not just
display simulated numbers — realistic market behavior, real instrument data,
guardrails against nonsense input, and richer AI explanations.

Work through the items below in order. If budget runs low partway through,
stop after finishing a numbered item cleanly rather than leaving one
half-done. Make reasonable assumptions throughout and summarize them at the
end instead of asking clarifying questions mid-build.

---

## 1. Fix simulation realism
Rebalance `monthlyReturn` vs `volFactor` in the growth calculation so
volatility is visible at normal chart scale — down months should genuinely
happen, not just smaller up months. For stocks and crypto specifically, add
a small random chance (~5% per month) of a sharper negative shock ("market
correction") so users see real drawdowns, not monotonic growth.

## 2. Real calendar months
Replace the `M0, M1, M2…` labels everywhere (dashboard chart, investment
chart, loan schedule) with actual calendar months + year, starting from the
current real month — e.g. "Aug 2026", "Sep 2026".

## 3. Dashboard portfolio breakdown
Add a stacked area or stacked bar chart showing each simulation's individual
contribution over time, using the existing `TYPE_META` colors, alongside the
current combined-growth chart — so the combined total is explained, not just
displayed.

## 4. Budget Workbench guardrails
When adding an income or expense, warn (don't silently accept) if the number
is implausibly large relative to existing entries — require confirmation
before adding. Add a persistent ember-red banner when net monthly cash flow
goes negative, explaining in one plain sentence what that means.

## 5. Tie investing to real available cash
In the Investment Simulator's "New Simulation" form, warn if the entered
principal exceeds the user's current net worth / available cash as tracked
in Budget Workbench state. Warn, don't hard-block.

## 6. Replace free-text asset naming with real instrument data
- Add `dukascopy-node` as a backend dependency (Node-native, matches the
  existing Express stack — do not introduce Python). On server startup or
  via a one-time build script, fetch the stock instrument list and cache it
  to a static JSON file; serve it via `GET /api/instruments/stocks`.
  Frontend: replace the Stocks Name field with a searchable dropdown backed
  by this endpoint.
- For crypto, replace the Name field with a searchable dropdown backed by
  CoinGecko's free public search API (no key required).
- Add a small disclaimer near the form: "Instrument data via Dukascopy Bank
  SA / CoinGecko, for educational simulation only."
- Add small inline tooltips next to APR, Expected Return, and Volatility
  fields explaining each term in one plain sentence, reusing existing
  glossary content from `LearnView`.

## 7. Upgrade Granite explanations
Rewrite the six stub explanations in `server/index.cjs` in plain English
with one small concrete worked example each (real numbers, not abstract
language). On the frontend, restyle the "Granite says" block into a short
takeaway line + a highlighted example line, with a small relevant icon per
rule type. Keep the existing source citation.

## 8. Expandable "learn by doing" glossary cards
Make each Learn/Glossary card clickable/expandable (accordion or modal) to
reveal a short worked example specific to that term — e.g. Compounding:
₹10,000 growing over 5 years at 8%, with a tiny inline `recharts` visual.
Reuse `recharts`; keep each visual small and simple.

## 9. "Can I afford this?" panel (new)
Build the panel described in the original spec section 4.5: item name +
price input, checked against current cash-flow/emergency-fund status via the
existing rule engine pattern, returning a Yes/Caution/No verdict card styled
like the Recommendations cards, including one small supporting visual (e.g.
a before/after bar showing cash position with vs without the purchase).

## 10. Real citation links
Turn the existing plain-text source labels in Recommendation cards (CFPB,
SEC/Investor.gov, FINRA) into clickable links to their actual public
guidance pages.

---

## Next steps after this phase (not in scope now)
- Real IBM watsonx.ai / Granite API key wiring (`WATSONX_API_KEY` env var)
- Supabase/Firebase auth + user persistence
- Persist simulation history to DB on Advance Month
- Withdraw / Deposit action per simulation
- Rolling 6-month budget history chart