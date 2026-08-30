# FinWise AI — Financial Literacy Lab for Students

> An AI-powered money mentor built for college students. Budget smarter, understand loans, find scholarships, and chat with an AI that actually knows your financial context.

**Hackathon Track:** IBM SkillsBuild — Students for AI · AI for Financial Literacy  
**AI Engine:** IBM watsonx.ai (Granite) with Groq as fallback  
**Stack:** React 18 · Vite · Tailwind CSS · Express.js · Firebase · Recharts

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in real values (see "Environment variables" below)
cp .env.example .env

# 3. Run frontend and backend together
npm run dev:full
```

This starts:
- Vite dev server at `http://localhost:5173`
- Express API server at `http://localhost:3001`

Vite automatically proxies `/api/*` requests to the backend, so you only need to open `localhost:5173`.

You can also run them separately in two terminals:

```bash
npm run dev      # frontend
npm run server   # backend
```

---

## Environment variables

Copy `.env.example` to `.env` and fill in real values — `.env` is gitignored and was never committed to this repo.

| Variable | Required for | Notes |
|---|---|---|
| `GROQ_API_KEY` | AI chat & recommendations | Free tier, no card required — generate at [console.groq.com/keys](https://console.groq.com/keys) |
| `WATSONX_API_KEY` | IBM watsonx.ai / Granite | Optional — when set, the app automatically uses real Granite instead of the Groq fallback |
| `WATSONX_PROJECT_ID` | IBM watsonx.ai / Granite | From your watsonx.ai project settings |
| `WATSONX_URL` | IBM watsonx.ai / Granite | Defaults to `https://us-south.ml.cloud.ibm.com` |
| `VITE_FIREBASE_API_KEY` | Auth & data persistence | From your Firebase project settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth & data persistence | |
| `VITE_FIREBASE_PROJECT_ID` | Auth & data persistence | |
| `VITE_FIREBASE_STORAGE_BUCKET` | Auth & data persistence | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Auth & data persistence | |
| `VITE_FIREBASE_APP_ID` | Auth & data persistence | |

**The app still works without IBM or Firebase keys** — it gracefully falls back to Groq (for AI) and local state (for data). You just won't have persistent login or real Granite responses.

If you're deploying (Vercel, Render, etc.), set these in the hosting platform's environment variable settings — `.env` does not travel with a deployment.

---

## Features

### Landing page
Public marketing page with a hero section, feature highlights, and a "Get Started" CTA. No login required to view it.

### Authentication
Google Sign-In via Firebase Auth. First-time users are sent to onboarding; returning users go straight to the dashboard.

### Onboarding wizard (5 steps)
- **Step 1 — Country:** Pick your country from a searchable dropdown. This auto-assigns your currency, relevant loan schemes, and scholarship list for the rest of the app.
- **Step 2 — Personal info:** Name, university, course, and year of study.
- **Step 3 — Income:** Monthly income in your local currency.
- **Step 4 — Goals:** Choose from options like "Graduate debt-free", "Build emergency fund", etc.
- **Step 5 — AI welcome:** Granite generates a personalized first message and financial tip based on your country, income, and goals.

Profile is saved to Firestore so it's available across sessions.

### Dashboard
Main hub after login. Shows:
- **AI Financial Health Score** — IBM/Groq scores you 0–100 based on budget adherence, savings rate, and expense patterns. Graded A–D.
- **Budget Ring** — Donut chart of monthly spend vs. remaining budget.
- **AI Insight Card** — A fresh daily tip generated from your actual data.
- **Spending Heatmap** — Calendar grid showing days you spent more vs. less.
- **Quick Actions** — One-click shortcuts to Add Expense, Ask FinBot, Check Loans, or Find Scholarships.
- **Upcoming Scholarship Deadlines** — Countdown to deadlines you've saved.
- **Savings Goal Progress** — Track how close you are to a savings target.

### AI Chat — FinBot
The core of the product. A split-panel interface:
- **Left:** Chat with FinBot. Ask anything financial — it knows your country, currency, income, expenses, and goals.
- **Right:** Dynamic visual panel that updates with charts, scholarship cards, or loan breakdowns depending on the last response.
- **Suggested prompts** so you don't have to think of questions: "Can I afford this?", "Where am I overspending?", "Explain my loan options", etc.

FinBot uses IBM Granite (or Groq as fallback) with a system prompt that injects your real profile data — so answers are always relevant to you, not generic.

### Expense Analyzer
- Add expenses with category, amount, date, and a note.
- AI auto-suggests the category as you type.
- Charts: 30-day spending trend (line), category breakdown (donut), week-over-week (bar).
- IBM/Groq summary: tells you where you overspent and how to cut it.
- Export to PDF — includes charts, summary, your name, and the date.

### Loan Advisor
- Country-scoped loan schemes pre-loaded. Examples:
  - 🇮🇳 India: SBI Education Loan, Vidya Lakshmi, Canara Vidya
  - 🇺🇸 USA: Federal Stafford, PLUS Loan, Perkins
  - 🇬🇧 UK: Student Finance England, Postgraduate Loan
  - And more for AU, CA, DE, SG
- EMI calculator: input loan amount, interest rate, and tenure → get monthly repayment, total interest, and an amortization chart.
- AI assessment: tells you if the loan is manageable given your income.
- Side-by-side loan comparison.
- Glossary: click any financial term → AI explains it in plain English.

### Scholarship Finder
- Country-scoped scholarships filtered from your onboarding country.
- Filter by course, year, GPA range, income bracket, and scholarship type (merit/need/STEM/sports).
- IBM/Groq ranks scholarships by best fit to your profile.
- Each card shows: name, amount, deadline, eligibility, and apply link.
- Browser notification when a scholarship deadline is approaching.

### Budget Planner
- Add multiple income sources (salary, pocket money, part-time, stipend, etc.).
- Allocate budget per category using sliders or percentages.
- AI suggests a split based on your income (e.g. 50% needs / 30% wants / 20% savings).
- Real-time overspend alert if a category goes over.
- Savings projection: "At this rate, you'll save X in 6 months."
- Export to PDF.

### Monthly Report
- Auto-generated monthly summary with spending breakdown and AI commentary.
- Exportable as a PDF.

---

## Project structure

```
/
├── index.html
├── vite.config.js           Proxies /api → :3001
├── tailwind.config.js
├── package.json
├── .env.example             Copy this to .env and fill in keys
│
├── src/
│   ├── main.jsx
│   ├── App.jsx              Routing + auth state
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── AuthPage.jsx
│   │   ├── OnboardingPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ChatPage.jsx
│   │   ├── ExpensesPage.jsx
│   │   ├── LoansPage.jsx
│   │   ├── ScholarshipsPage.jsx
│   │   ├── BudgetPage.jsx
│   │   └── MonthlyReportPage.jsx
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── HealthScoreGauge.jsx
│   │   ├── AIInsightCard.jsx
│   │   ├── BudgetRing.jsx
│   │   ├── ChatBubble.jsx
│   │   ├── ScholarshipCard.jsx
│   │   └── LoanCard.jsx
│   └── lib/
│       ├── firebase.js       Firebase init + Firestore helpers
│       ├── countries.js      Country → currency, loans, scholarships data
│       └── pdfExport.js      jsPDF export logic
│
└── server/
    └── index.cjs             Express — /api/finbot, /api/health-score,
                              /api/monthly-review, /api/advise,
                              /api/discover-scholarships, /api/discover-loans
```

---

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server only |
| `npm run server` | Start Express API server only |
| `npm run dev:full` | Start both together (uses `concurrently`) |
| `npm run build` | Build for production |
| `npm run serve` | Build then start Express (production preview) |

---

## License

MIT
