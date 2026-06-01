# LeadProsper Solar Lead Form

Campaign #34866 | Supplier #114935

## Project structure

```
leadform/
├── api/
│   └── submit.js      ← Vercel serverless function (backend proxy)
├── public/
│   └── index.html     ← Lead capture frontend
├── vercel.json        ← Routing config
└── package.json
```

## Deploy to Vercel (3 steps)

### Option A — Vercel CLI

```bash
npm install -g vercel
cd leadform
vercel --prod
```

Follow the prompts. Your live URL will be printed at the end.

### Option B — GitHub + Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new
3. Import the repo → click **Deploy**

That's it. Vercel auto-detects the `api/` folder and deploys `submit.js` as a serverless function.

## How it works

```
Browser (index.html)
  ↓  POST /api/submit  (JSON, no credentials)
Vercel serverless (api/submit.js)
  ↓  POST https://api.leadprosper.io/ingest  (with lp_key injected server-side)
LeadProsper API
  ↓  JSON response { status, lead_id, message }
Browser
```

The `lp_key` lives only in the server function — never exposed to the browser.

## Local dev

```bash
npm install
npx vercel dev
# opens http://localhost:3000
```
