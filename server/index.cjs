/**
 * Forge — Express backend
 *
 * Endpoints:
 *   POST /api/advise                    — mocked watsonx/Granite explanations (Item 7)
 *   GET  /api/instruments/stocks?q=     — stock instrument search (Item 6)
 *   GET  /api/instruments/crypto?q=     — CoinGecko crypto search proxy (Item 6)
 *   GET  /api/health
 */

const express = require("express");
const https   = require("https");
const fs      = require("fs");
const path    = require("path");

const app = express();
app.use(express.json());

/* ------------------------------------------------------------------ */
/*  Item 6 — Stock instrument list                                    */
/*  Dukascopy publishes a static JSON instrument list at a known URL. */
/*  We fetch it once on startup (or use the cache file if present),   */
/*  then filter it in-memory for the search endpoint.                 */
/* ------------------------------------------------------------------ */
const CACHE_PATH = path.join(__dirname, "instruments-cache.json");

let stockInstruments = []; // loaded below

function fetchDukascopyInstruments() {
  return new Promise((resolve) => {
    // Dukascopy public instrument list (no auth required)
    const url = "https://freeserv.dukascopy.com/2.0/?path=chart/instruments&v=2";
    https.get(url, { timeout: 8000 }, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(raw);
          // Dukascopy returns an array of instrument objects with name, description, etc.
          // Normalise to { symbol, label } for the frontend.
          const list = Array.isArray(parsed)
            ? parsed.map((item) => ({
                symbol: item.name || item.symbol || "",
                label:  item.description || item.name || "",
              }))
            : [];
          resolve(list);
        } catch {
          resolve([]);
        }
      });
      res.on("error", () => resolve([]));
    }).on("error", () => resolve([])).on("timeout", () => resolve([]));
  });
}

async function loadInstruments() {
  if (fs.existsSync(CACHE_PATH)) {
    try {
      stockInstruments = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8"));
      console.log(`  Loaded ${stockInstruments.length} stock instruments from cache`);
      return;
    } catch { /* fall through to fetch */ }
  }

  console.log("  Fetching Dukascopy instrument list…");
  stockInstruments = await fetchDukascopyInstruments();

  if (stockInstruments.length === 0) {
    // Fallback: a small curated list of popular Indian + global instruments
    // so the UI is always functional even without network access.
    stockInstruments = [
      { symbol: "RELIANCE",  label: "Reliance Industries (NSE)" },
      { symbol: "TCS",       label: "Tata Consultancy Services (NSE)" },
      { symbol: "INFY",      label: "Infosys (NSE)" },
      { symbol: "HDFCBANK",  label: "HDFC Bank (NSE)" },
      { symbol: "ICICIBANK", label: "ICICI Bank (NSE)" },
      { symbol: "WIPRO",     label: "Wipro (NSE)" },
      { symbol: "AAPL",      label: "Apple Inc. (NASDAQ)" },
      { symbol: "MSFT",      label: "Microsoft Corporation (NASDAQ)" },
      { symbol: "GOOGL",     label: "Alphabet / Google (NASDAQ)" },
      { symbol: "AMZN",      label: "Amazon.com (NASDAQ)" },
      { symbol: "TSLA",      label: "Tesla Inc. (NASDAQ)" },
      { symbol: "NIFTY50",   label: "Nifty 50 Index" },
      { symbol: "SENSEX",    label: "BSE Sensex Index" },
      { symbol: "GOLDBEES",  label: "Nippon India Gold ETF (NSE)" },
      { symbol: "LIQUIDBEES",label: "Nippon India Liquid ETF (NSE)" },
    ];
  }

  try { fs.writeFileSync(CACHE_PATH, JSON.stringify(stockInstruments)); }
  catch { /* non-fatal */ }
  console.log(`  Loaded ${stockInstruments.length} stock instruments`);
}

/* ------------------------------------------------------------------ */
/*  GET /api/instruments/stocks?q=<query>                             */
/* ------------------------------------------------------------------ */
app.get("/api/instruments/stocks", (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.json({ instruments: [] });
  const matches = stockInstruments.filter(
    (i) => i.symbol.toLowerCase().includes(q) || i.label.toLowerCase().includes(q)
  ).slice(0, 10);
  res.json({ instruments: matches });
});

/* ------------------------------------------------------------------ */
/*  GET /api/instruments/crypto?q=<query>                             */
/*  Server-side proxy to CoinGecko free search API (no key required). */
/*  Proxying avoids CORS issues and keeps future key usage server-side.*/
/* ------------------------------------------------------------------ */
app.get("/api/instruments/crypto", (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.json({ coins: [] });

  const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`;
  https.get(url, { timeout: 6000 }, (upstream) => {
    let raw = "";
    upstream.on("data", (c) => (raw += c));
    upstream.on("end", () => {
      try {
        const data = JSON.parse(raw);
        const coins = (data.coins || []).slice(0, 10).map((c) => ({
          symbol: c.symbol?.toUpperCase() || "",
          name: c.name || "",
          label: c.name || "",
        }));
        res.json({ coins });
      } catch {
        res.json({ coins: [] });
      }
    });
    upstream.on("error", () => res.json({ coins: [] }));
  }).on("error", () => res.json({ coins: [] }));
});

/* ------------------------------------------------------------------ */
/*  Item 7 — Upgraded Granite stub explanations                       */
/*  Each entry now has:                                                */
/*    explanation — plain-language summary of why the rule fired      */
/*    example     — one concrete worked example with real numbers      */
/* ------------------------------------------------------------------ */
const STUB_RESPONSES = {
  spending_exceeds_income: {
    explanation:
      "When you spend more than you earn every month, the shortfall has to come from somewhere — existing savings, selling assets, or taking on debt. " +
      "The CFPB's budgeting guidance flags this as the single most urgent cash-flow problem because compound interest on debt works against you just as powerfully as it works for investors. " +
      "Audit your discretionary line items first: subscriptions, dining, and entertainment are the easiest to trim without affecting essentials.",
    example:
      "If you earn ₹11,000/mo and spend ₹14,000/mo, your deficit is ₹3,000/mo. " +
      "After 12 months that's ₹36,000 drawn from savings — nearly 4 months of a ₹10,000 emergency fund gone. " +
      "Cutting ₹500 from three discretionary categories erases the gap entirely.",
  },
  build_a_bigger_emergency_buffer: {
    explanation:
      "The CFPB recommends holding 3–6 months of expenses in liquid, low-risk savings before investing in volatile assets. " +
      "This buffer is a circuit-breaker: without it, an unexpected expense (medical bill, job loss, car repair) forces you to liquidate investments — often at a loss — or borrow at high interest. " +
      "Your bank simulations currently hold less than 3 months of your expenses.",
    example:
      "Monthly expenses: ₹25,000. Target buffer: ₹75,000 (3 months). " +
      "If your savings account holds ₹40,000 and the stock market drops 20% the same month you need ₹20,000 for a repair, you'd be forced to sell stocks at a loss. " +
      "With ₹75,000 in cash you cover the repair without touching investments.",
  },
  crypto_allocation_is_high: {
    explanation:
      "FINRA's crypto risk disclosures note that digital assets are uninsured, unregulated, and have experienced 70–90% drawdowns in past cycles. " +
      "When crypto exceeds 30% of a simulated portfolio, a single market event can erase a third of your total simulated wealth. " +
      "Rebalancing 10–15% into diversified equities or cash materially reduces this tail risk.",
    example:
      "Portfolio: ₹1,00,000 — 40% crypto (₹40,000), 60% stocks/bank (₹60,000). " +
      "A 60% crypto crash (common in bear cycles) wipes ₹24,000. " +
      "Rebalancing to 20% crypto: same crash costs only ₹12,000 — portfolio finishes at ₹88,000 vs ₹76,000.",
  },
  diversify_across_asset_types: {
    explanation:
      "SEC's Investor.gov diversification guide explains that different asset classes respond differently to the same economic event. " +
      "When all your simulations are the same type, one downturn affects every position simultaneously with no offset. " +
      "Adding even one non-correlated asset — e.g. a bank/savings simulation alongside stocks — dampens overall portfolio swings.",
    example:
      "₹1,00,000 all in stocks: a 20% market correction → ₹80,000. " +
      "Same ₹1,00,000 split 50% stocks / 50% bank: the bank portion barely moves, so the portfolio falls to only ₹90,000 — half the damage.",
  },
  start_your_first_simulation: {
    explanation:
      "The SEC's Saving and Investing guide emphasises that time in the market is the single most powerful factor for student-age investors. " +
      "Starting small is fine; starting early is essential. " +
      "A bank or index-fund simulation with a modest principal gives you a hands-on feel for how compounding works before you commit to higher-volatility vehicles.",
    example:
      "₹5,000 invested at 8%/yr: after 10 years it becomes ₹10,795 with zero additional contributions. " +
      "Wait 5 years to start instead and the same ₹5,000 over the remaining 5 years is worth only ₹7,347. " +
      "The 5 years of inaction cost you ₹3,448.",
  },
  looking_balanced: {
    explanation:
      "Your current simulated budget and portfolio pass every rule in Forge's engine — drawn from CFPB, FINRA, and SEC guidance. " +
      "This is a positive snapshot, not a permanent guarantee. " +
      "Keep advancing months to watch how volatility, compounding, and cash flow interact as your simulations grow.",
    example:
      "A portfolio that looks balanced today can drift: if stocks grow 40% over 12 months and bank stays flat, what was a 50/50 split becomes 65/35. " +
      "Advance a few more months and revisit the Recommendations panel to catch any new imbalances.",
  },
};

const DEFAULT_RESPONSE = {
  explanation:
    "Based on the cited source for this rule, the pattern detected in your simulation warrants attention. " +
    "Review the specific figures in your budget and portfolio against the thresholds described in the source guidance. " +
    "Small corrective actions taken early compound in your favour over a student-length time horizon.",
  example: null,
};

/* ------------------------------------------------------------------ */
/*  POST /api/advise                                                   */
/* ------------------------------------------------------------------ */
app.post("/api/advise", (req, res) => {
  const { ruleCode = "", facts = {} } = req.body ?? {};

  setTimeout(() => {
    const resp = STUB_RESPONSES[ruleCode] ?? DEFAULT_RESPONSE;
    res.json({
      explanation: resp.explanation,
      example:     resp.example,
      model:       "ibm/granite-13b-instruct-v2",
      ruleCode,
      source:      facts.source ?? "Forge rule engine",
      _stub:       true,
    });
  }, 600);
});

/* ------------------------------------------------------------------ */
/*  GET /api/health                                                    */
/* ------------------------------------------------------------------ */
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

/* ------------------------------------------------------------------ */
/*  Startup                                                            */
/* ------------------------------------------------------------------ */
const PORT = process.env.PORT ?? 3001;

loadInstruments().then(() => {
  app.listen(PORT, () => {
    console.log(`Forge API listening on http://localhost:${PORT}`);
    console.log(`  POST /api/advise               — mocked watsonx/Granite advisor`);
    console.log(`  GET  /api/instruments/stocks   — Dukascopy stock search`);
    console.log(`  GET  /api/instruments/crypto   — CoinGecko crypto search proxy`);
    console.log(`  GET  /api/health               — health check`);
  });
});
