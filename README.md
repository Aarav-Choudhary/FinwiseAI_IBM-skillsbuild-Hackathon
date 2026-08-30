# Forge — Financial Literacy Lab

> Teach college students financial independence through interactive simulation.

## Quick start

```bash
# 1. Install frontend deps
npm install

# 2. Install backend dep (Express is a runtime dep, kept separate)
npm install --save express

# 3. Start the Vite dev server + backend in two terminals:
npm run dev        # → http://localhost:5173  (Vite proxies /api → :3001)
npm run server     # → http://localhost:3001  (Express stub)
```

Or run both with a single command if you have `concurrently`:
```bash
npx concurrently "npm run dev" "npm run server"
```


## Structure

```
/
├── index.html            Vite entry
├── vite.config.js        proxies /api → :3001
├── tailwind.config.js
├── postcss.config.js
├── package.json
├── src/
│   ├── main.jsx          React root
│   ├── index.css         Tailwind directives + global resets
│   └── App.jsx           Full Forge app (moved from forge-app.jsx)
└── server/
    └── index.cjs         Express stub — POST /api/advise
```

## Implemented in this scaffold

| Feature | Status |
|---|---|
| Vite + React + Tailwind wiring | ✅ |
| `src/App.jsx` from `forge-app.jsx` | ✅ identical structure & styles |
| Loan simulation type (principal, APR, term) | ✅ with full amortization math |
| Loan card with progress bar + interest breakdown | ✅ |
| `Advance Month` steps loans through pre-computed schedule | ✅ |
| Express `/api/advise` (mocked Granite responses) | ✅ |
| "Ask Granite to explain →" button in Recommendations | ✅ |

## Next steps (from BOB_BUILD_SPEC.md)

- [ ] Wire real IBM watsonx.ai / Granite API key (`WATSONX_API_KEY` env var)
- [ ] Add Supabase/Firebase auth + user persistence
- [ ] Persist simulation history to DB on Advance Month
- [ ] "Can I afford this?" quick-check panel
- [ ] Rolling 6-month budget history chart
- [ ] Withdraw / Deposit action per simulation
