# How We Used IBM Bob to Build FinWise AI

IBM Bob (the AI coding assistant inside IBM SkillsBuild) was involved in pretty much every part of building this project.

---

## Architecture and implementation plan

Before writing any code, Bob helped us write a full implementation plan which included:

- Which parts of the base repo to keep vs. replace
- The full page-by-page feature breakdown
- The country-to-currency-to-data pipeline
- The groq API system prompt design (how to inject student context into every AI call)
- The build order / sprint plan

Having this plan meant we weren't making architecture decisions on our own, we just got a lot of help in rethinking major frontend backend features.

---

## Building each feature

Almost every page and component in this project was built with Bob's help. Some examples:

**Server-side AI routing** — Bob wrote the `server/index.cjs` routes for `/api/finbot`, `/api/health-score`, `/api/monthly-review`, and `/api/discover-scholarships`. It handled both the IBM watsonx.ai call path and the Groq fallback, including token caching for IBM IAM authentication.

**Country data layer** — Bob generated the `src/lib/countries.js` file with real loan schemes and scholarship programs for 7+ countries, each with correct currency symbols and amounts.

**Dashboard** — Bob built the dashboard page with all its widgets: the AI health score gauge, budget ring donut chart, spending heatmap calendar, and the AI insight card. The health score calculation logic (both the IBM-powered version and the client-side fallback) was also written by Bob.

**FinBot chat interface** — Bob built the split-panel chat UI and the client-side fallback response logic that gives sensible answers even without an API key. It also designed the system prompt that injects the student's real profile data into every IBM/Groq call.

**PDF export** — Bob wrote the `pdfExport.js` utility using jsPDF and html2canvas, including layout for charts and the student info header.

**Firebase integration** — Bob set up the Firebase config, the Firestore helpers for saving/loading profile, expenses, budget, and chat history, and the auth flow that routes new users to onboarding and returning users to the dashboard.

**Onboarding wizard** — Bob built the 5-step wizard with validation, progress tracking, and the Granite-generated personalized welcome message on the final step.

---

## Debugging and iteration

Whenever something didn't work like a Firestore permission error, an API call returning the wrong shape, a chart not rendering, etc. we described the problem to Bob and it gave us a clear and concise way of fixing it by ourselves, and would fix it for us if we weren't able to do that.

---

## What we did ourselves

The visual design decisions(color palette, layout choices, which features to prioritize for the demo), the Firebase project setup and key generation, the groq API free setup, and the final integration testing were all done by the team. Bob built what we told it to build, the direction and product thinking were ours.
