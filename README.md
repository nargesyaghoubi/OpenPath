# 🌍 OpenPath

**A modern opportunity-finder platform** that helps students, graduates, and job seekers discover jobs, internships, scholarships, online courses, remote work, and training programs all in one place.

---
## Live Demo: 

## Screenshots

---
## Features

- Search & filter — by title, category, location, remote/on-site, sorted by newest / deadline / title
- Dynamic details page (`/opportunities/[id]`) — full opportunity info, requirements, tags, and a **live countdown timer** to the deadline
- Save opportunities — bookmark for later, persisted in `localStorage`
- Full CRUD — create, read, **edit**, and delete opportunities (React Context + `localStorage`)
- Add / Edit form — one shared, fully validated form (React Hook Form + Zod) used for both creating and editing
- Authentication — login and registration; new accounts can sign in immediately after registering (see [Known Limitations](#known-limitations-read-this))
- CV / Resume Builder (`/cv-builder`) — enter personal details, work experience, and education, see a live preview, and download a polished PDF résumé (built client-side with `@react-pdf/renderer`)
- Deadline countdown — live days/hours/minutes/seconds countdown on each opportunity's details page
- Multi-language support — English, Dari, Arabic, French, Spanish, German — with full right-to-left (RTL) layout support
- Framer Motion animations throughout
- Dark mode (light/dark toggle, persisted)
- Fully responsive (mobile, tablet, desktop)
- Empty states, loading states, error states (404 page)


## Table of Contents

- [Problem It Solves](#problem-it-solves)
- [Target Users](#target-users)
- [Live Demo](#live-demo)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts](#demo-accounts)
- [Available Scripts](#available-scripts)
- [Future Improvements](#future-improvements)

---

## Problem It Solves

Opportunities jobs, internships, scholarships, online courses, and remote work are scattered across dozens of different websites, Facebook groups, and Telegram channels. This makes it hard for students and job seekers to find what's relevant to them in one place. **OpenPath** solves this by giving people a single, searchable, filterable platform where opportunities can be browsed, saved, and submitted.

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
| Styling | Tailwind CSS |
| Forms & validation | React Hook Form + Zod |
| Auth | next-auth (Credentials provider) |
| i18n / RTL | next-intl |
| Charts | Recharts |
| Animation | Framer Motion |
| PDF generation | @react-pdf/renderer |
| State & persistence | React Context API + localStorage |
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
      layout.tsx        → auth guard for this group
    opportunities/
      page.tsx           → /opportunities
      [id]/page.tsx       → /opportunities/[id]
    about/
    contact/
    page.tsx              → home page
    layout.tsx             → providers, navbar, footer
  api/auth/[...nextauth]/route.ts

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
  auth/
    LoginForm.tsx / RegisterForm.tsx / LogoutButton.tsx / UserMenu.tsx

context/
  OpportunitiesContext.tsx   → CRUD state (localStorage)
  SavedContext.tsx           → saved/bookmarked opportunities

data/
  opportunities.ts            → seed/demo data

lib/
  utils.ts                    → formatting, category colors/icons, RTL helper
  users-store.ts               → in-memory user store (login + register)
  i18n/routing.ts, navigation.ts

types/
  index.ts                     → Opportunity, Category, etc.

messages/
  en.json, fa.json, ar.json, fr.json, es.json, de.json

auth.ts        → next-auth configuration
proxy.ts        → locale + auth middleware (protected route guard)
```

## Getting Started

### Prerequisites
- Node.js 18.18+ (or 20+)
- npm

### Installation

```bash
git clone <your-repo-url>
cd openpath
npm install
```

### Environment setup

```bash
cp .env.example .env.local
```

Then generate a secret and fill in `.env.local`:

```bash
npx auth secret
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en`.

## Environment Variables

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Secret used by next-auth to sign session tokens. Generate with `npx auth secret`. |
| `AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000` in dev). |
| `NEXT_PUBLIC_DEMO_MODE` | Set to `true` to show demo-mode notices in the UI. |

See `.env.example` for a template.

## Demo Accounts

| Role | Email | Password |
|---|---|---|
| User | `user@example.com` | `user123` |
| Admin | `admin@example.com` | `admin123` |

You can also create a new account from `/register` — it becomes usable immediately (auto sign-in after registering).

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm run start` | Start the production build |
| `npm run lint` | Run ESLint |


## Future Improvements

- Replace `localStorage` / in-memory storage with a real database (e.g. PostgreSQL + Prisma) so data persists across restarts and devices
- Hash passwords with bcrypt and move auth to a proper users table
- Admin approval workflow for user-submitted opportunities
- Real email delivery for the contact form and deadline-reminder notifications
- Per-user saved opportunities tied to an account instead of `localStorage`
- Automated tests (unit + e2e)

