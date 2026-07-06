# OpenPath
OpenPath is a modern opportunity discovery platform that brings jobs, internships, scholarships, remote work, online courses, and training programs together in one place. With multilingual support, authentication, a CV builder, and full CRUD functionality, it provides a seamless experience for students, graduates, and job seekers.

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
- Save opportunities — bookmark for later, persisted in `localStorage`
- Full CRUD — create, read, **edit**, and delete opportunities
- Add / Edit form — one shared, fully validated form (React Hook Form + Zod) used for both creating and editing
- Authentication — login and registration; new accounts can sign in immediately after registering
- CV / Resume Builder — enter personal details, work experience, and education, see a live preview, and download a polished PDF résumé
- Deadline countdown — live days/hours/minutes/seconds countdown on each opportunity's details page
- Multi-language support — English, Dari, Arabic, French, Spanish, German — with full right-to-left (RTL) layout support
- Framer Motion animations throughout
- Dark mode (light/dark toggle, persisted)
- Fully responsive (mobile, tablet, desktop)
- Empty states, loading states, error states (404 page)


## Table of Contents

- [Problem It Solves](#problem-it-solves)
- [Target Users](#target-users)
- [Live Demo & Repository](#live-demo--repository)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts](#demo-accounts)
- [Available Scripts](#available-scripts)

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
git clone https://github.com/nargesyaghoubi/OpenPath
cd openpath
npm install
```

### Environment Setup

Create a `.env.local` file in the project root

Generate a secret and fill in `.env.local`:

```bash
npx auth secret
```

## Environment Variables

| Variable | Description |
|---|---|
| `AUTH_SECRET` | Secret used by next-auth to sign session tokens. Generate with `npx auth secret`. |
| `AUTH_URL` | Base URL of the app (e.g. `http://localhost:3000` in dev). |
| `NEXT_PUBLIC_DEMO_MODE` | Set to `true` to show demo-mode notices in the UI. |

```env
AUTH_SECRET=your_generated_secret
AUTH_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/en`.


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

## Contact
For any inquiries, please contact:
- nargesyaghoubi2001@gmail.com

## Links
### Narges Yaghoubi
[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://nargesyaghoubi-ygh.github.io/My-portfolio/)

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/narges-yaghoubi-656a28243/)


