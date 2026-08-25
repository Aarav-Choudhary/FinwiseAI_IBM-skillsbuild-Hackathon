/**
 * FinWise AI — Express backend
 *
 * Endpoints:
 *   POST /api/finbot        — IBM watsonx.ai Granite chat (FinBot)
 *   POST /api/health-score  — IBM AI Financial Health Score (0-100)
 *   POST /api/advise        — legacy compatibility stub
 *   GET  /api/health        — health check
 */

const express = require("express");
const https   = require("https");
const http    = require("http");
const fs      = require("fs");
const path    = require("path");

// Load .env if present (development)
try {
  const dotenv = require("dotenv");
  dotenv.config({ path: path.join(__dirname, "../.env") });
} catch (_) { /* dotenv optional */ }

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

/* ─────────────────────────────────────────────────────────── */
/*  IBM watsonx.ai helper                                      */
/* ─────────────────────────────────────────────────────────── */
const WATSONX_URL        = process.env.WATSONX_URL        || "https://us-south.ml.cloud.ibm.com";
const WATSONX_API_KEY    = process.env.WATSONX_API_KEY    || "";
const WATSONX_PROJECT_ID = process.env.WATSONX_PROJECT_ID || "";

let ibmAccessToken    = null;
let ibmTokenExpiry    = 0;

async function getIBMToken() {
  if (ibmAccessToken && Date.now() < ibmTokenExpiry) return ibmAccessToken;
  if (!WATSONX_API_KEY) return null;

  return new Promise((resolve) => {
    const body = `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${encodeURIComponent(WATSONX_API_KEY)}`;
    const options = {
      hostname: "iam.cloud.ibm.com",
      path: "/identity/token",
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body) },
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", c => raw += c);
      res.on("end", () => {
        try {
          const json = JSON.parse(raw);
          ibmAccessToken = json.access_token;
          ibmTokenExpiry = Date.now() + (json.expires_in - 60) * 1000;
          resolve(ibmAccessToken);
        } catch { resolve(null); }
      });
    });
    req.on("error", () => resolve(null));
    req.write(body);
    req.end();
  });
}

async function callGranite(systemPrompt, userMessage, maxTokens = 800) {
  const token = await getIBMToken();
  if (!token) return null; // will fall back to stub

  const payload = JSON.stringify({
    model_id: "ibm/granite-13b-chat-v2",
    input: `<|system|>\n${systemPrompt}\n<|user|>\n${userMessage}\n<|assistant|>`,
    parameters: {
      decoding_method: "greedy",
      max_new_tokens:  maxTokens,
      min_new_tokens:  10,
      repetition_penalty: 1.1,
      stop_sequences: ["<|user|>", "<|endoftext|>"],
    },
    project_id: WATSONX_PROJECT_ID,
  });

  const urlObj = new URL(`${WATSONX_URL}/ml/v1/text/generation?version=2023-05-29`);

  return new Promise((resolve) => {
    const options = {
      hostname: urlObj.hostname,
      path:     urlObj.pathname + urlObj.search,
      method:   "POST",
      headers:  {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${token}`,
        "Content-Length": Buffer.byteLength(payload),
      },
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", c => raw += c);
      res.on("end", () => {
        try {
          const json = JSON.parse(raw);
          const text = json.results?.[0]?.generated_text?.trim() || null;
          resolve(text);
        } catch { resolve(null); }
      });
    });
    req.on("error", () => resolve(null));
    req.write(payload);
    req.end();
  });
}

/* ─────────────────────────────────────────────────────────── */
/*  POST /api/finbot                                           */
/*  Main FinBot chat endpoint — IBM Granite with student ctx  */
/* ─────────────────────────────────────────────────────────── */
const FINBOT_STUB_RESPONSES = [
  "That's a great question! Based on your budget, I'd suggest reviewing your top spending categories first. Students often find the most savings in food and entertainment expenses.",
  "Looking at typical student finances, I recommend following the 50/30/20 rule — 50% for needs, 30% for wants, and 20% for savings. Start small and build consistency.",
  "For scholarship opportunities in your region, make sure to check the national portal regularly and set up alerts for deadlines. Early applications always have a better success rate!",
  "When considering a student loan, calculate your debt-to-income ratio first. A good rule of thumb: your total loan repayments shouldn't exceed 20% of your expected first-year salary.",
  "Building an emergency fund is your first financial priority as a student — aim for 1-3 months of expenses. Keep it in a high-yield savings account for easy access.",
];

app.post("/api/finbot", async (req, res) => {
  const { message, systemPrompt, history = [] } = req.body || {};
  if (!message) return res.status(400).json({ error: "message is required" });

  const sysPrompt = systemPrompt || `You are FinBot, a friendly financial advisor for college students. 
Give concise, actionable advice in plain English. Be encouraging but honest. 
Keep responses under 200 words.`;

  // Build conversation context from history
  let contextPrompt = sysPrompt;
  if (history.length > 0) {
    const recentHistory = history.slice(-6); // last 3 exchanges
    contextPrompt += "\n\nConversation so far:";
    recentHistory.forEach(h => {
      contextPrompt += `\n${h.role === "user" ? "Student" : "FinBot"}: ${h.content}`;
    });
  }

  try {
    const ibmResponse = await callGranite(contextPrompt, message, 600);

    if (ibmResponse) {
      return res.json({ reply: ibmResponse, model: "ibm/granite-13b-chat-v2", _real: true });
    }

    // Fallback stub
    const stub = FINBOT_STUB_RESPONSES[Math.floor(Math.random() * FINBOT_STUB_RESPONSES.length)];
    res.json({ reply: stub, model: "ibm/granite-13b-chat-v2 (demo)", _stub: true });
  } catch (err) {
    const stub = FINBOT_STUB_RESPONSES[0];
    res.json({ reply: stub, model: "demo", _stub: true });
  }
});

/* ─────────────────────────────────────────────────────────── */
/*  POST /api/health-score                                     */
/*  IBM AI Financial Health Score 0-100                       */
/* ─────────────────────────────────────────────────────────── */
app.post("/api/health-score", async (req, res) => {
  const { profile, expenses, budget } = req.body || {};

  const country     = profile?.country  || "India";
  const currency    = profile?.currency || "INR";
  const income      = profile?.income   || 0;
  const totalSpent  = (expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
  const monthlyBudget = budget?.total || income;

  const systemPrompt = `You are a financial health analyst for students. 
Respond ONLY with a JSON object in this exact format:
{"score": <number 0-100>, "grade": "<A|B|C|D>", "summary": "<1 sentence>", "tips": ["<tip1>", "<tip2>", "<tip3>"]}

Score guidelines:
- 80-100 (A): Excellent — savings > 20%, spending < budget, has emergency fund
- 60-79 (B): Good — savings 10-20%, slight overspend in 1-2 categories  
- 40-59 (C): Fair — no savings habit, frequently over budget
- 0-39 (D): Needs help — spending > income, debt reliant`;

  const userMessage = `Student profile:
Country: ${country}
Currency: ${currency}
Monthly Income: ${income} ${currency}
Total Spent This Month: ${totalSpent} ${currency}
Monthly Budget: ${monthlyBudget} ${currency}
Goals: ${(profile?.goals || []).join(", ") || "Not set"}

Calculate financial health score and give 3 specific tips.`;

  try {
    const ibmResponse = await callGranite(systemPrompt, userMessage, 300);

    if (ibmResponse) {
      // Extract JSON from response
      const jsonMatch = ibmResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        return res.json({ ...data, _real: true });
      }
    }

    // Fallback calculation
    const savingsRate = income > 0 ? Math.max(0, (income - totalSpent) / income) : 0;
    const score = Math.round(Math.min(100, Math.max(0,
      (savingsRate * 50) + (totalSpent <= monthlyBudget ? 30 : 10) + 20
    )));
    const grade = score >= 80 ? "A" : score >= 60 ? "B" : score >= 40 ? "C" : "D";

    res.json({
      score,
      grade,
      summary: `Your financial health score is ${score}/100 — ${grade === "A" ? "excellent work!" : grade === "B" ? "good progress!" : "room for improvement."}`,
      tips: [
        "Track every expense, even small ones — they add up fast",
        "Set up automatic savings transfer on your payday",
        "Review your subscriptions and cancel unused ones",
      ],
      _stub: true,
    });
  } catch {
    res.json({ score: 65, grade: "B", summary: "Good progress on your financial journey!", tips: ["Track expenses daily", "Save before you spend", "Review your budget weekly"], _stub: true });
  }
});

/* ─────────────────────────────────────────────────────────── */
/*  POST /api/advise  (legacy compatibility)                   */
/* ─────────────────────────────────────────────────────────── */
app.post("/api/advise", async (req, res) => {
  const { ruleCode = "", facts = {} } = req.body || {};
  const country  = facts.country  || "your country";
  const currency = facts.currency || "local currency";

  const systemPrompt = `You are FinBot, a financial advisor for students in ${country}. 
Give a brief explanation (2-3 sentences) about the financial rule being triggered, 
then a concrete example with numbers in ${currency}.
Format: {"explanation": "...", "example": "..."}`;

  const userMessage = `Explain this financial rule for a student: ${ruleCode.replace(/_/g, " ")}`;

  const ibmResponse = await callGranite(systemPrompt, userMessage, 300);
  if (ibmResponse) {
    const jsonMatch = ibmResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const data = JSON.parse(jsonMatch[0]);
        return res.json({ ...data, model: "ibm/granite-13b-chat-v2", ruleCode, _real: true });
      } catch (_) {}
    }
    return res.json({ explanation: ibmResponse, example: null, model: "ibm/granite-13b-chat-v2", ruleCode, _real: true });
  }

  res.json({
    explanation: "This financial pattern warrants attention. Review your budget and spending habits relative to your income.",
    example: null,
    model: "ibm/granite-13b-chat-v2 (demo)",
    ruleCode,
    _stub: true,
  });
});

/* ─────────────────────────────────────────────────────────── */
/*  GET / (Root API info page)                                 */
/* ─────────────────────────────────────────────────────────── */
app.get("/", (_req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>FinWise AI Backend API</title>
        <style>
          body { background: #0B0B0D; color: #ECE7DD; font-family: sans-serif; padding: 40px; }
          a { color: #6C63FF; text-decoration: none; }
          .badge { background: #17171A; border: 1px solid #2A2A2E; padding: 4px 12px; border-radius: 20px; color: #00D9A3; }
          code { background: #17171A; padding: 2px 6px; border-radius: 4px; color: #6C63FF; }
        </style>
      </head>
      <body>
        <h1>🚀 FinWise AI Backend API Server</h1>
        <p><span class="badge">Status: Running on Port 3001</span></p>
        <p>This is the Express backend API for FinWise AI.</p>
        <h3>Available API Endpoints:</h3>
        <ul>
          <li><code>GET /api/health</code> — <a href="/api/health">Check Health JSON</a></li>
          <li><code>POST /api/finbot</code> — IBM watsonx Granite Chat</li>
          <li><code>POST /api/health-score</code> — AI Financial Health Score (0-100)</li>
        </ul>
        <p>👉 To access the full UI web application, open <a href="http://localhost:5173" target="_blank">http://localhost:5173</a></p>
      </body>
    </html>
  `);
});

/* ─────────────────────────────────────────────────────────── */
/*  GET /api/health                                            */
/* ─────────────────────────────────────────────────────────── */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    ibm_configured: !!(WATSONX_API_KEY && WATSONX_PROJECT_ID),
  });
});


/* ─────────────────────────────────────────────────────────── */
/*  Startup                                                    */
/* ─────────────────────────────────────────────────────────── */
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🚀 FinWise AI API on http://localhost:${PORT}`);
  console.log(`   POST /api/finbot        — FinBot (IBM watsonx Granite)`);
  console.log(`   POST /api/health-score  — AI Financial Health Score`);
  console.log(`   POST /api/advise        — legacy compatibility`);
  console.log(`   GET  /api/health        — health check`);
  if (!WATSONX_API_KEY) {
    console.log(`\n⚠️  IBM API key not set — running in demo mode`);
    console.log(`   Set WATSONX_API_KEY and WATSONX_PROJECT_ID in .env\n`);
  } else {
    console.log(`\n✅ IBM watsonx.ai connected (${WATSONX_URL})\n`);
  }
});
