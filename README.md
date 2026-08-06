# OpenPath
OpenPath is a modern opportunity discovery platform that brings jobs, internships, scholarships, remote work, online courses, and training programs together in one place. With multilingual support, real authentication, an admin moderation workflow, a CV builder, and full CRUD functionality backed by a real database, it provides a seamless experience for students, graduates, and job seekers.

---
## Live Demo & Repository

| | |
|---|---|
| **Live Demo** |https://open-path-one.vercel.app/en|
| **GitHub Repository** | https://github.com/nargesyaghoubi/OpenPath |


## Screenshots
<div align="center">
  <table align="center">
    <tr align="center">
      <td align="center">
        <h3>Home</h3>
        <a href="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/home.png">
          <img src="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/home.png?raw=true" height="400px">
        </a>
      </td>
      <td align="center">
        <h3>Opportunities</h3>
        <a href="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/opportunities.png">
          <img src="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/opportunities.png?raw=true" height="400px">
        </a>
      </td>
      <td align="center">
        <h3>About</h3>
        <a href="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/about.png">
          <img src="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/about.png?raw=true" height="400px">
        </a>
      </td>
      <td align="center">
        <h3>Add Opportunity</h3>
        <a href="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/add-opportunity.png">
          <img src="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/add-opportunity.png?raw=true" height="400px">
        </a>
      </td>
    </tr>
  </table>
</div>
<div align="center">
  <table align="center">
    <tr align="center">
      <td align="center">
        <h3>Contact</h3>
        <a href="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/contact.png">
          <img src="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/contact.png?raw=true" height="400px">
        </a>
      </td>
      <td align="center">
        <h3>Register</h3>
        <a href="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/register.png">
          <img src="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/register.png?raw=true" height="400px">
        </a>
      </td>
      <td align="center">
        <h3>CV Builder</h3>
        <a href="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/cv.png">
          <img src="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/cv.png?raw=true" height="400px">
        </a>
      </td>
      <td align="center">
        <h3>Dashboard</h3>
        <a href="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/dashboard.png">
          <img src="https://github.com/nargesyaghoubi/OpenPath/blob/main/public/dashboard.png?raw=true" height="400px">
        </a>
      </td>
    </tr>
  </table>
</div>


## Features

- Search & filter — by title, category, location, remote/on-site, sorted by newest / deadline / title
- Dynamic details page — full opportunity info, requirements, tags, and a **live countdown timer** to the deadline
- Save opportunities — bookmark for later; the saved list always reflects each opportunity's **live, current status**, not a stale snapshot
- Full CRUD — create, read, **edit**, and delete opportunities, backed by a real **PostgreSQL** database (via Prisma)
- Add / Edit form — one shared, fully validated form (React Hook Form + Zod) used for both creating and editing
- **Admin moderation workflow** — opportunities submitted by regular users stay `PENDING` until an admin approves or rejects them at `/admin/opportunities`; opportunities submitted by an admin are auto-approved
- **Ownership-based permissions** — only the original submitter or an admin can edit or delete an opportunity
- Authentication — real accounts stored in PostgreSQL, passwords hashed with **bcrypt**; new accounts can sign in immediately after registering
- CV / Resume Builder — enter personal details, work experience, and education, see a live preview, and download a polished PDF résumé
- Deadline countdown — live days/hours/minutes/seconds countdown on each opportunity's details page
- Multi-language support — English, Dari, Arabic, French, Spanish, German — with full right-to-left (RTL) layout support, including the admin panel
- Framer Motion animations throughout
- Dark mode (light/dark toggle, persisted)
- Fully responsive (mobile, tablet, desktop)
- Empty states, loading states, error states (404 page, with a friendly "pending review" message for a submitter's own unapproved item)
- **Automated tests** — unit tests (Vitest) for validation/hashing/utility logic, and end-to-end tests (Playwright) covering the full submit → review → approve → public flow


## Table of Contents

- [Problem It Solves](#problem-it-solves)
- [Target Users](#target-users)
- [Live Demo & Repository](#live-demo--repository)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Data & Moderation Flow](#data--moderation-flow)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts](#demo-accounts)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Deploying to Vercel](#deploying-to-vercel)
- [Future Improvements](#future-improvements)

---

## Problem It Solves

Opportunities jobs, internships, scholarships, online courses, and remote work are scattered across dozens of different websites, Facebook groups, and Telegram channels. This makes it hard for students and job seekers to find what's relevant to them in one place. **OpenPath** solves this by giving people a single, searchable, filterable platform where opportunities can be browsed, saved, and submitted — with admin moderation to keep listings trustworthy.

## Target Users

- Students & fresh graduates
- Job seekers
- People looking for remote work
- People searching for scholarships or internships
- Organizations that want to share opportunities with a wider audience

## Technologies Used

| Category | Tech |
|---|---|
| Framework | Next.js (App Router), React, TypeScript |
| Database | PostgreSQL (via [Neon](https://neon.tech)) |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Forms & validation | React Hook Form + Zod |
| Auth | next-auth (Credentials provider) + bcrypt password hashing |
| i18n / RTL | next-intl |
| Charts | Recharts |
| Animation | Framer Motion |
| PDF generation | @react-pdf/renderer |
| State & persistence | React Context API, backed by real API routes + PostgreSQL |
| Testing | Vitest (unit) · Playwright (end-to-end) |
| Icons | lucide-react |
| Deployment | Vercel |

## Project Structure

```
app/
  [locale]/
    (auth)/
      login/            → /login
      register/         → /register
    (protected)/         → routes that require authentication
      add-opportunity/
      edit-opportunity/[id]/
      cv-builder/
      dashboard/
      saved/
      admin/opportunities/  → admin-only moderation queue
      layout.tsx        → auth guard for this group
    opportunities/
      page.tsx           → /opportunities
      [id]/page.tsx       → /opportunities/[id]
    about/
    contact/
    page.tsx              → home page
    layout.tsx             → providers, navbar, footer
  api/
    auth/[...nextauth]/route.ts
    opportunities/
      route.ts             → GET (public feed) / POST (submit)
      [id]/route.ts         → GET / PUT / DELETE (ownership-checked)
      mine/route.ts          → current user's own submissions
    admin/
      opportunities/route.ts        → GET (moderation queue, admin-only)
      opportunities/[id]/route.ts    → PATCH approve/reject (admin-only)

components/
  OpportunityCard.tsx
  OpportunityForm.tsx      → shared Add/Edit form
  SearchFilter.tsx
  DashboardCard.tsx / DashboardCharts.tsx / DashboardContent.tsx
  CVBuilder.tsx
  CountdownTimer.tsx
  EmptyState.tsx / Modal.tsx
  Navbar.tsx / NavbarClient.tsx / NavbarServer.tsx / Footer.tsx
  ThemeProvider.tsx / ClientLayout.tsx
  providers/AuthSessionProvider.tsx   → enables useSession() in client components
  auth/
    LoginForm.tsx / RegisterForm.tsx / LogoutButton.tsx / UserMenu.tsx

context/
  OpportunitiesContext.tsx   → public opportunities, fetched live from the API
  SavedContext.tsx           → saved/bookmarked opportunity ids (localStorage) + live data

data/
  opportunities.ts            → original mock data, now only used to seed the database

lib/
  utils.ts                    → formatting, category colors/icons, RTL helper
  prisma.ts                    → Prisma client singleton
  password.ts                  → bcrypt hashing helpers
  users-store.ts                → user queries (PostgreSQL via Prisma)
  opportunities-store.ts         → opportunity queries + moderation logic (PostgreSQL via Prisma)
  opportunity-schema.ts           → Zod schema shared by the API routes
  i18n/routing.ts, navigation.ts

prisma/
  schema.prisma                 → User & Opportunity models
  migrations/                    → applied database migrations
  seed.ts                         → seeds demo accounts + original mock opportunities

types/
  index.ts                     → Opportunity, Category, OpportunityStatus, etc.

messages/
  en.json, fa.json, ar.json, fr.json, es.json, de.json

tests/
  unit/                         → Vitest tests (validation, hashing, utils)
  e2e/                           → Playwright tests (auth, submit-review-approve flow)

auth.ts        → next-auth configuration (bcrypt-based credentials login)
proxy.ts        → locale + auth middleware (protected + admin route guard)
```

## Data & Moderation Flow

1. A signed-in user submits an opportunity → stored with `status: PENDING`
2. It does **not** appear in the public listing yet, but shows up in that user's dashboard with its status
3. An admin reviews it at `/admin/opportunities` and approves or rejects it (with an optional reason)
4. Once approved, it becomes publicly visible
5. Editing an already-approved opportunity resets it to `PENDING` for re-review — unless the editor is an admin, in which case the change goes live immediately
6. Opportunities submitted directly by an admin are auto-approved, skipping the queue

## Getting Started

### Prerequisites
- Node.js 18.18+ (or 20+)
- npm
- A PostgreSQL database (this project is built and tested against [Neon](https://neon.tech)'s free tier)

### 1. Clone & install

```bash
git clone https://github.com/nargesyaghoubi/OpenPath
cd OpenPath
npm install
```

### 2. Create your database

Go to [console.neon.tech](https://console.neon.tech) → **Create project** → pick a name and the region closest to you.

Once created, open your project → **Connect** → select the **Prisma** tab → click **Show secret**. You'll see two ready-to-use lines, `DATABASE_URL` and `DIRECT_URL` — copy both. This is the only place you need to look; you don't need to build the connection string by hand.

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and paste in the two lines from step 2, then add:

```env
AUTH_SECRET="run: npx auth secret"
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
```

Generate `AUTH_SECRET` with:

```bash
npx auth secret
```

**Only use `.env`.** Don't also create a `.env.local` with different values — having both is the most common source of "it worked a second ago" bugs, since the Prisma CLI (migrate, seed) only reads `.env`, while Next.js prefers `.env.local` if both exist.

### 4. Set up the database

```bash
npm run db:migrate   # creates the users and opportunities tables (name it "init" when asked)
npm run db:seed       # optional — creates demo accounts + sample opportunities
```

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en`.

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Pooled PostgreSQL connection string, used by the running app. |
| `DIRECT_URL` | Direct (non-pooled) PostgreSQL connection string, used by Prisma Migrate. |
| `AUTH_SECRET` | Secret used by next-auth to sign session tokens. Generate with `npx auth secret`. |
| `AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000` in dev). |
| `NEXT_PUBLIC_DEMO_MODE` | Set to `true` to show demo-mode notices in the UI. |

```env
DATABASE_URL=postgresql://user:pass@ep-xxxx-pooler.region.aws.neon.tech/dbname?sslmode=require
DIRECT_URL=postgresql://user:pass@ep-xxxx.region.aws.neon.tech/dbname?sslmode=require
AUTH_SECRET=your_generated_secret
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
```

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| User | `user@example.com` | `user123` |
| Admin | `admin@example.com` | `admin123` |

Created by `npm run db:seed`. You can also create a new account from `/register` — it becomes usable immediately (auto sign-in after registering) and starts as a regular user.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production build |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Apply Prisma migrations to the database |
| `npm run db:seed` | Seed demo accounts and sample opportunities |
| `npm test` | Run unit tests (Vitest) |
| `npm run test:e2e` | Run end-to-end tests (Playwright) |
| `npx prisma studio` | Open a GUI to browse the database |

## Testing

```bash
npm test          # unit tests — pure functions, no database needed
npm run db:seed   # required once, so the demo accounts exist
npm run test:e2e  # full flow: submit → pending → admin approves → public
```

Unit tests cover password hashing, input validation, and utility functions. End-to-end tests drive a real browser against a running dev server and a real database, covering login/registration and the full submit-review-approve moderation workflow.

## Troubleshooting

**`Environment variable not found: DATABASE_URL`**
`.env` is missing or empty. Confirm it's named exactly `.env` (not `.env.example`) and sits next to `package.json`. Restart `npm run dev` after editing it — Next.js only reads env files on startup.

**`Authentication failed against database server`**
The password in `DATABASE_URL`/`DIRECT_URL` is wrong, missing, or you left a placeholder in there instead of the real value. Re-copy both lines fresh from Neon's Prisma tab rather than editing them by hand.

**`Can't reach database server at ...`**
Neon's free tier suspends the database after a few idle minutes. Open the Neon console, run any query in the SQL Editor to wake it up, wait a few seconds, and retry.

**`The table 'public.users' does not exist`**
You connected successfully, but haven't run `npm run db:migrate` yet.

**`prisma:error Error in PostgreSQL connection: Error { kind: Closed }`**
Same idle-suspend issue as above — just retry the request. This happens more on local dev than on Vercel.

**Two `.env` variants, unsure which is real**
Delete `.env.local` entirely and keep only `.env`. If you're not sure which values are current, throw both away and re-copy fresh from Neon's Connect → Prisma tab.

**`Foreign key constraint violated on the constraint: opportunities_submittedBy_fkey`**
The signed-in user's id doesn't exist in the database being used. This usually means the session/account was created against a different database than the one the app is currently connected to (e.g. a local account while pointed at production, or vice versa). Log out, sign in (or register) fresh against the environment you're testing, and confirm `DATABASE_URL` matches between environments if data is expected to be shared.

## Deploying to Vercel

1. Import the GitHub repo into Vercel
2. On the project's **Storage** tab, click **Create Database** → choose **Neon** (or connect an existing Neon project) — Vercel adds the correct `DATABASE_URL`/`DIRECT_URL` to your project's environment variables automatically, no copy-pasting required
3. Manually add `AUTH_SECRET` (a fresh one — don't reuse your local one) and `AUTH_URL` (your production domain, e.g. `https://your-app.vercel.app`) in **Settings → Environment Variables**
4. Deploy — Prisma Client generates automatically during `npm install` as part of the build
5. Run the migration against the production database once, from your machine:
   ```bash
   vercel env pull .env.production.local
   npx prisma migrate deploy
   ```

Each environment (local, preview, production) can have its own database — make sure the account you test with was created against the same database the environment you're viewing is actually connected to.

## Future Improvements

- Real email delivery for the contact form and deadline-reminder notifications
- Keep the previous approved version visible while an edit is under re-review, instead of unpublishing immediately
- Docker setup for a fully local, zero-account development environment

## Contact
For any inquiries, please contact:
- nargesyaghoubi2001@gmail.com

## Links
### Narges Yaghoubi
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://portfolio-ooss.vercel.app/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/narges-yaghoubi-656a28243/)
