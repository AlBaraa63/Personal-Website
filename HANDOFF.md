# Trackr — Job Application Tracker: Handoff

## What this is
A full-stack SaaS job application tracker built for the UAE job market.
React 19 + TypeScript + Vite + Tailwind + Framer Motion + Supabase + Claude API.

**GitHub repo:** https://github.com/AlBaraa63/job-tracker
(Source was pushed to `job-tracker-source` branch of Personal-Website repo, then needs to be moved to job-tracker repo — see Setup below)

---

## Current State: DONE

### Frontend (fully built, 0 TS errors, production build passes)
- `src/App.tsx` — root, auth gate
- `src/hooks/useAuth.ts` — Supabase auth (sign in / sign up / sign out)
- `src/hooks/useApplications.ts` — CRUD + realtime subscription via Supabase channel
- `src/types/index.ts` — all types + STATUS_CONFIG (colors/labels per stage)
- `src/lib/supabase.ts` — Supabase client
- `src/lib/ai.ts` — calls Supabase Edge Functions for AI features
- `src/components/auth/AuthPage.tsx` — login + signup screen
- `src/components/kanban/Board.tsx` — kanban board container
- `src/components/kanban/Column.tsx` — single pipeline column
- `src/components/kanban/Card.tsx` — application card
- `src/components/ApplicationModal.tsx` — add/edit modal with 3 tabs: Details, Job Description, Cover Letter
- `src/components/StatsBar.tsx` — response rate, interview count, funnel bar
- `src/components/ui/Modal.tsx` — reusable animated modal
- `src/components/ui/Button.tsx` — reusable button (4 variants)
- `src/components/ui/Badge.tsx` — status badge
- `src/pages/Dashboard.tsx` — main app: header, search, stats, kanban

### Backend
- `supabase/migrations/001_initial.sql` — full schema with RLS
  - `profiles` table (extends auth.users) — has `plan` ('free'|'pro'), `resume_text`, `stripe_customer_id`, `stripe_subscription_id`
  - `applications` table — company, role, status, url, description, notes, salary_range, location, remote, applied_at, follow_up_at, contact_name, contact_email, cover_letter, ai_parsed (jsonb)
  - RLS policies: users only see/edit their own rows
  - Trigger: auto-create profile on signup, auto-update `updated_at`
- `supabase/functions/parse-job/index.ts` — Edge Function → Claude API, parses job description into structured JSON
- `supabase/functions/generate-cover-letter/index.ts` — Edge Function → Claude API, writes tailored cover letter

### Kanban Pipeline Stages
`wishlist` → `applied` → `phone_screen` → `interview` → `offer` → `rejected`

### Tier Logic
- Free: 10 applications max
- Pro: unlimited + AI cover letter generation
- `plan` column on `profiles` table controls access
- To test Pro locally: set `plan = 'pro'` directly in Supabase dashboard

---

## Setup (first time)

```bash
# Get code
git clone -b job-tracker-source https://github.com/AlBaraa63/Personal-Website.git job-tracker
cd job-tracker
git remote set-url origin https://github.com/AlBaraa63/job-tracker.git
git push -u origin main

# Install
npm install
cp .env.example .env
```

Fill `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Run the SQL migration in Supabase SQL editor (`supabase/migrations/001_initial.sql`).

Deploy edge functions:
```bash
supabase functions deploy parse-job
supabase functions deploy generate-cover-letter
```

Add secret in Supabase Edge Functions settings:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Run locally:
```bash
npm run dev
```

---

## What's NOT built yet (next steps in priority order)

### 1. Stripe billing (most important for SaaS)
- Add Stripe Checkout flow: "Upgrade to Pro" button → Stripe hosted page
- Create a Supabase Edge Function `stripe-webhook` to receive `checkout.session.completed` and update `profiles.plan = 'pro'`
- Packages needed: `@stripe/stripe-js` is already installed
- Env vars to add: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `VITE_STRIPE_PUBLISHABLE_KEY`
- The "Upgrade to Pro" button in `Dashboard.tsx` is a placeholder (no onClick handler yet)

### 2. Settings page
- Resume text input (stored in `profiles.resume_text`) — used to personalize AI cover letters
- Update name/email
- Billing management (Stripe customer portal link)
- Route: `/settings`

### 3. Deploy to Vercel
- Connect GitHub repo to Vercel
- Add env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Should work out of the box (standard Vite app)

### 4. Landing page
- Currently the app shows auth screen to unauthenticated users
- Add a proper landing page at `/` with features, pricing, CTA
- Move app to `/dashboard`
- Add `react-router-dom` routes (it's already installed, just not wired up)

### 5. Email reminders (nice to have)
- Supabase cron job that checks `follow_up_at` dates
- Send reminder emails via Resend API
- Package: `resend` (not installed yet)

---

## Key technical decisions made
- AI calls go through Supabase Edge Functions (not directly from client) — keeps API key server-side
- Realtime updates via Supabase channel subscription in `useApplications.ts`
- No drag-and-drop on kanban yet — status changes happen via dropdown in the modal
- `@tanstack/react-query` is installed but not used yet — worth migrating to for caching
- `axios` and `react-router-dom` are installed but not used yet

---

## Tech stack versions
- React 19, TypeScript 6, Vite 8, Tailwind 3
- Supabase JS v2
- Framer Motion 12
- Claude model used in edge functions: `claude-sonnet-4-6`
