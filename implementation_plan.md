# FinWise AI — Full Implementation Plan

> **Hackathon Track**: FinTech + GenAI Advisory Tools  
> **AI Engine**: IBM watsonx.ai (Granite-13b-chat-v2)  
> **Goal**: Deployed live website, full flow, real IBM integration  
> **Country-first design**: Country selected at onboarding → drives currency, loans, and scholarships automatically  
> **Base repo**: `Forge_IBM-skillsbuild-Hackathon` — we use its infrastructure, replace its features

---

## 🔍 How We Use the Existing Repo

> [!IMPORTANT]
> We are **NOT rebuilding from scratch**. The friend's repo gives us a working Vite + React + Tailwind + Express setup — that's valuable. We just **swap out its features** for ours.

### ✅ What We KEEP from the existing repo
| What | Why |
|---|---|
| Vite + React 18 setup | Already configured, saves hours |
| Tailwind CSS v3 config | Already working |
| Recharts dependency | We need charts too |
| Lucide React icons | We use the same icons |
| Express.js server (`server/index.cjs`) | We add our API routes here |
| IBM Plex font loading | Keeps IBM brand feel |
| Dark theme design tokens (`#0B0B0D`, ember, gold) | Matches our premium dark UI plan |
| `/api/advise` endpoint structure | We **upgrade** this to call real IBM API |

### ❌ What We REMOVE / REPLACE
| What | Replaced With |
|---|---|
| Investment Simulator (stocks, crypto, bank sims) | Expense Analyzer |
| Advance Month feature | — (not relevant to our use case) |
| Dukascopy / CoinGecko instrument search | Scholarship + Loan country data |
| Stock/crypto instrument endpoints | `/api/finbot`, `/api/scholarships`, `/api/loans` |
| Forge branding | FinWise AI branding |
| Forge Score (portfolio-based) | AI Financial Health Score (budget-based, IBM-powered) |
| Recommendations (rule-based) | AI Chat — FinBot (IBM free-form + structured) |
| Sidebar items (invest, recs, learn) | Our sidebar: Dashboard, Chat, Expenses, Loans, Scholarships, Budget |

---

## 🧱 Tech Stack (Using Existing Repo)

| Layer | Choice | Status |
|---|---|---|
| **Frontend** | Vite + React 18 | ✅ Already set up |
| **Styling** | Tailwind CSS v3 | ✅ Already set up |
| **Charts** | Recharts | ✅ Already installed |
| **Icons** | Lucide React | ✅ Already installed |
| **Backend** | Express.js (`server/index.cjs`) | ✅ Already running — we add routes |
| **Auth** | Firebase Auth (Google Sign-In) | 🔧 To add |
| **Database** | Firebase Firestore | 🔧 To add |
| **AI** | IBM watsonx.ai (Granite-13b-chat-v2) | 🔧 Replace the mock stub |
| **Deployment** | Vercel | 🔧 To set up |
| **PDF Export** | jsPDF + html2canvas | 🔧 New dependency |
| **Notifications** | Browser Notification API | 🔧 No extra package |

---

## 🔑 IBM watsonx Setup (Do This First)

> [!IMPORTANT]
> Complete this before any IBM code is written.

1. Create IBM Cloud account → use your hackathon credits
2. Go to `dataplatform.cloud.ibm.com` → create a **watsonx.ai project**
3. **IAM → Create API Key** → copy it
4. **Project Settings → Project ID** → copy it
5. Choose model: `ibm/granite-13b-chat-v2`
6. Add to `.env` in the project root:
```
WATSONX_API_KEY=your_key_here
WATSONX_PROJECT_ID=your_project_id
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### How IBM is called:
- Frontend → Express route `/api/finbot` → IBM watsonx.ai REST API → response back to UI
- The existing `/api/advise` stub gets **upgraded** to call real Granite
- Every IBM call injects `{country}` and `{currency}` from the student profile into the system prompt

---

## 📁 Updated Project Structure

```
Forge_IBM-skillsbuild-Hackathon/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
├── .env                          ← Add IBM + Firebase keys here
│
├── src/
│   ├── main.jsx                  ← React root (unchanged)
│   ├── index.css                 ← Tailwind directives (unchanged)
│   │
│   ├── App.jsx                   ← REWRITE: new routing + sidebar for our pages
│   │
│   ├── pages/                    ← NEW: one file per page
│   │   ├── LandingPage.jsx       → Public hero / marketing page
│   │   ├── AuthPage.jsx          → Google Sign-In via Firebase
│   │   ├── OnboardingPage.jsx    → 5-step country-first wizard
│   │   ├── DashboardPage.jsx     → Main hub with widgets
│   │   ├── ChatPage.jsx          → AI Chat — FinBot (IBM watsonx)
│   │   ├── ExpensesPage.jsx      → Expense Analyzer
│   │   ├── LoansPage.jsx         → Loan Advisor (country-scoped)
│   │   ├── ScholarshipsPage.jsx  → Scholarship Finder (country-scoped)
│   │   └── BudgetPage.jsx        → Budget Planner
│   │
│   ├── components/               ← NEW: reusable UI pieces
│   │   ├── Sidebar.jsx           → Updated sidebar (our 6 nav items)
│   │   ├── TopBar.jsx            → Country/currency display + user avatar
│   │   ├── HealthScoreGauge.jsx  → IBM-powered 0–100 score (reuse ForgeGauge SVG)
│   │   ├── AIInsightCard.jsx     → Daily IBM tip card on dashboard
│   │   ├── BudgetRing.jsx        → Donut chart — spent vs remaining
│   │   ├── ChatBubble.jsx        → Individual chat message
│   │   ├── ScholarshipCard.jsx   → Scholarship display card
│   │   └── LoanCard.jsx          → Loan scheme display card
│   │
│   └── lib/                      ← NEW: utility logic
│       ├── firebase.js           → Firebase init + auth helpers
│       ├── countries.js          → Country → currency + loans + scholarships data
│       └── pdfExport.js          → jsPDF export logic
│
└── server/
    └── index.cjs                 ← MODIFY: add new routes, wire real IBM API
```

---

## 🗺️ Full User Flow

```
[Landing Page]  ← public, no login needed
    ↓ "Get Started"
[Auth Page]
    → Firebase Google Sign-In
    ↓ First time? → Onboarding  |  Returning? → Dashboard
[Onboarding — 5 steps]
    Step 1: Country selection → sets currency, loans, scholarships, IBM context
    Step 2: Name, University, Course, Year
    Step 3: Monthly income (shown in auto-assigned currency)
    Step 4: Financial goals
    Step 5: IBM generates personalized welcome + first tip
    ↓
[Dashboard]  ← always reachable from sidebar
    ├── [AI Chat — FinBot]      IBM watsonx.ai free-form chat
    ├── [Expense Analyzer]      Add + analyze spending
    ├── [Loan Advisor]          Country loan schemes + EMI calculator
    ├── [Scholarship Finder]    AI-matched country scholarships
    └── [Budget Planner]        Monthly budget builder
```

---

## 📄 Page-by-Page Feature Breakdown

### 1. 🏠 Landing Page
- Full-screen dark hero: tagline *"Your AI-powered money mentor. Built for students."*
- Typewriter animation cycling through: *"Can I afford this laptop?"*, *"What loans am I eligible for?"*, *"Find me scholarships in my field"*
- 3 feature cards: Budget Smarter · Find Scholarships · Understand Loans
- IBM watsonx badge + "Powered by Granite" label
- Mock student testimonials (3 cards)
- CTA button → Auth Page
- Footer with GitHub, team info

---

### 2. 🔐 Auth Page
- Google Sign-In button (Firebase)
- Email + Password fallback
- Split-screen layout: left = FinWise branding, right = form
- After sign-in: check if profile exists in Firestore
  - No profile → Onboarding
  - Has profile → Dashboard

---

### 3. 🎓 Onboarding (5-Step Wizard)
Progress bar at top. Data saved to Firestore on Step 5.

| Step | What |
|---|---|
| 1 | **Country** — Searchable dropdown with flags. Auto-assigns currency, loan list, scholarship list, IBM AI context |
| 2 | **Personal info** — Name, University, Course, Year of Study |
| 3 | **Finances** — Monthly income (displayed in country's currency) |
| 4 | **Goals** — checkboxes: Save for travel, Pay off loan, Build emergency fund, Graduate debt-free |
| 5 | **AI Welcome** — IBM Granite generates a personalized first message + tip based on country + income + goals |

> Country can be changed later in Settings with a warning: *"Changing country will reset your loan and scholarship recommendations."*

---

### 4. 📊 Dashboard
Main hub after login. Shows overview of everything.

| Widget | Details |
|---|---|
| **AI Health Score** | 0–100 gauge (reuse SVG from existing ForgeGauge). Score from IBM based on budget adherence, savings, expenses |
| **Budget Ring** | Donut — monthly budget spent vs. remaining |
| **AI Insight Card** | IBM-generated daily tip based on actual student data |
| **Spending Heatmap** | Month calendar grid, darker = more spent that day |
| **Quick Actions** | Add Expense · Ask FinBot · Check Loan · Find Scholarship |
| **Upcoming Deadlines** | Scholarship application deadlines with countdown |
| **Savings Progress** | Goal bar: *"₹4,200 of ₹10,000 saved for laptop"* |

---

### 5. 💬 AI Chat — FinBot (IBM watsonx Core)
The heart of the product. Split-panel layout.

**Left panel** — Chat interface:
- Message input + send button
- Conversation history with timestamps
- Suggested prompt chips (clickable):
  - *"Can I afford this?"*
  - *"Where am I overspending?"*
  - *"Explain my loan options"*
  - *"Find me scholarships"*
  - *"Build me a budget"*
  - *"What's my financial health?"*

**Right panel** — Dynamic visual output:
- Shows charts / scholarship cards / loan breakdowns based on what FinBot responds with
- Updates based on last AI response

**IBM System Prompt:**
> *"You are FinBot, a friendly financial advisor for college students in {country}. Always use simple, jargon-free language and refer to amounts in {currency}. Be encouraging but honest. Consider the student's budget ({budget}), expenses ({top_expense_categories}), goals ({goals}), and country-specific financial context. Give actionable advice relevant to {country}'s financial ecosystem."*

`{country}`, `{currency}`, `{budget}`, `{top_expense_categories}`, `{goals}` → all injected dynamically from Firestore profile.

---

### 6. 💸 Expense Analyzer
- **Add Expense form**: Category, Amount, Date, Note
  - Categories: Food, Transport, Rent, Entertainment, Education, Healthcare, Other
  - AI auto-suggests category as user types (IBM call)
- **Expense list**: Table with sort + filter
- **Charts**:
  - Line chart: 30-day spending trend
  - Donut chart: Category breakdown this month
  - Bar chart: Week-over-week comparison
- **IBM AI Summary**: *"You spent 38% more on food this month. Here's how to cut it."*
- **Export**: PDF report (charts + summary + student name + date)

---

### 7. 🏦 Loan Advisor
- **Country-scoped loan schemes** (pre-loaded from `countries.js`):

| Country | Pre-loaded Loans |
|---|---|
| 🇺🇸 USA | Federal Stafford Loan, PLUS Loan, Perkins Loan |
| 🇬🇧 UK | Student Finance England, Postgraduate Loan |
| 🇮🇳 India | SBI Education Loan, Vidya Lakshmi, Canara Vidya |
| 🇦🇺 Australia | HECS-HELP, FEE-HELP |
| 🇨🇦 Canada | OSAP, NSLSC Canada Student Loan |
| 🇩🇪 Germany | BAföG |
| 🇸🇬 Singapore | MOE Tuition Grant, MENDAKI Loan |

- Student can also add a **custom loan**
- **Calculator**: Loan amount, Interest rate %, Tenure (months)
- **Outputs**: Monthly repayment, Total interest, Total repayment, Amortization chart
- **IBM Assessment**: *"Is this loan manageable given your income?"* — benchmarked to country
- **Side-by-side loan comparison** (pick 2–3 schemes)
- **Glossary**: Click term → IBM explains in plain English

---

### 8. 🎓 Scholarship Finder
- **Country-scoped** — scholarships pre-filtered by country from onboarding
- **Filter form**: Course, Year, GPA range, Income bracket, Type (Merit / Need / STEM / Sports)
- **IBM AI matching**: Ranks scholarships best-fit to student profile
- **Scholarship cards**: Name, Amount (in student currency), Deadline, Eligibility, Apply link
- **Filter bar**: Amount, Deadline, Domestic vs. International
- **Deadline reminder**: Browser notification when student saves a scholarship
- **IBM tip**: Personalized application advice per scholarship

**Pre-loaded scholarships per country** (in `countries.js`):
| Country | Scholarships |
|---|---|
| 🇺🇸 USA | FAFSA, Gates Millennium, Fulbright, Pell Grant |
| 🇬🇧 UK | Chevening, Commonwealth, Rhodes, GREAT |
| 🇮🇳 India | PM Scholarship, NSP, Tata Trust, Inspire |
| 🇦🇺 Australia | Australia Awards, Destination Australia |
| 🇨🇦 Canada | Vanier CGS, Trudeau Scholarship |
| 🇩🇪 Germany | DAAD, Deutschlandstipendium |
| 🇸🇬 Singapore | PSC Scholarship, A*STAR |

---

### 9. 📈 Budget Planner
- **Income sources**: Add multiple (Salary, Pocket money, Part-time, Stipend, Freelance)
- **Category allocation**: Slider or % input per category
- **IBM suggestion**: *"For your income of {amount}, I recommend 50% Needs / 30% Wants / 20% Savings"* — adapted to student reality
- **Real-time overspend alert**: Red highlight if category goes over allocation
- **Savings projection**: *"At this rate, you'll save {amount} in 6 months"*
- **Export**: PDF budget plan

---

## 🌍 Country-First Currency System

- Country selected at **onboarding Step 1** — not a manual toggle
- Currency auto-assigned from country — no mismatch possible
- All amounts displayed in student's currency throughout the app
- IBM AI always speaks in student's currency
- Exchange rates via **Open Exchange Rates free API** for any cross-currency math

---

## ✨ Extra Features

### 📄 PDF Export
- Expense Analyzer, Budget Planner, Loan summary
- Client-side: jsPDF + html2canvas
- Branded: FinWise AI logo + student name + date generated

### 🔔 Notifications
- Browser Notification API
- Triggers: Scholarship deadline, budget 80% used, monthly budget review
- On/off toggle in settings

### 🏆 AI Financial Health Score
- IBM Granite scores student 0–100 based on: budget adherence, savings rate, expense patterns, loan load
- Grade: A (80+), B (60–79), C (40–59), D (<40)
- Displayed on Dashboard prominently
- Detailed breakdown available in Chat (*"Explain my health score"*)

---

## 🎨 Design System

> [!NOTE]
> We keep the existing dark theme tokens from the repo but add Indigo as primary (replaces ember red as the main brand colour for FinWise). Ember red is kept for warnings/danger only.

| Token | Value | Change? |
|---|---|---|
| Background | `#0B0B0D` | ✅ Keep (same as existing) |
| Surface / Panel | `#17171A` | ✅ Keep |
| Border | `#2A2A2E` | ✅ Keep |
| **Primary (Brand)** | `#6C63FF` Electric Indigo | 🔄 New (replaces ember as primary) |
| **Accent** | `#00D9A3` Emerald | 🔄 New |
| Warning | `#D4AF37` Gold | ✅ Keep (same gold) |
| Danger / Alert | `#C81E3A` Ember Red | ✅ Keep (now warning/danger only) |
| Text Primary | `#ECE7DD` | ✅ Keep |
| Text Secondary | `#9B968C` | ✅ Keep |
| Font | IBM Plex Sans / Serif / Mono | ✅ Keep |
| Glassmorphism | `backdrop-filter: blur(20px)` | 🔄 Add to cards |

---

## 🚀 Build Order (Sprint Plan)

### Phase 1 — Setup & IBM Wiring
- [ ] Copy repo to our working folder
- [ ] Set up Firebase project (Auth + Firestore)
- [ ] Set up IBM watsonx.ai account + test first real Granite API call
- [ ] Add `.env` with IBM + Firebase keys
- [ ] Upgrade `/api/advise` in `server/index.cjs` → real IBM call
- [ ] Create `src/lib/countries.js` — country → currency + loans + scholarships data

### Phase 2 — Core Structure
- [ ] Rewrite `App.jsx` — new routing + sidebar (Landing / Auth / Onboarding / Dashboard + pages)
- [ ] Update `Sidebar.jsx` — our 6 nav items
- [ ] Build `LandingPage.jsx` (hero + features + CTA)
- [ ] Build `AuthPage.jsx` (Firebase Google Sign-In)
- [ ] Build `OnboardingPage.jsx` (5-step wizard, save to Firestore)

### Phase 3 — Dashboard + AI Chat
- [ ] Build `DashboardPage.jsx` (all 7 widgets)
- [ ] Build `ChatPage.jsx` (FinBot — full IBM chat with visual panel)
- [ ] Wire IBM system prompt with dynamic student context injection

### Phase 4 — Feature Pages
- [ ] Build `ExpensesPage.jsx` (form + charts + IBM summary + PDF)
- [ ] Build `LoansPage.jsx` (country schemes + calculator + amortization + IBM)
- [ ] Build `ScholarshipsPage.jsx` (country cards + IBM matching + notifications)
- [ ] Build `BudgetPage.jsx` (income + sliders + IBM suggestion + PDF)

### Phase 5 — Polish + Deploy
- [ ] AI Health Score (IBM-powered, shown on Dashboard)
- [ ] Browser notifications for deadlines
- [ ] Mobile responsiveness pass
- [ ] Deploy to Vercel (connect GitHub repo)
- [ ] Final demo walkthrough + test full user flow

---

## ✅ Verification Plan

| Check | How |
|---|---|
| Real IBM API responds | Call `/api/finbot` from browser — must show Granite text, not stub |
| Country context injected | Change country in settings → AI references new country in response |
| Firebase saves profile | Check Firestore console after onboarding |
| Loans are country-scoped | Select USA → see Stafford Loan, select India → see SBI Edu Loan |
| Scholarships are country-scoped | Same as above |
| PDF export works | Download on desktop + mobile, check layout |
| Notifications fire | Set a test scholarship deadline, check browser notification triggers |
| Deployed site works | Share Vercel URL, test full flow on phone |

