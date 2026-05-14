# Asphaltiq — PRD

## Original Problem Statement
Marketing website for an asphalt sealing company with free quote form, services page, contact page, and admin dashboard.

## Brand
- Name: **Asphaltiq** (formerly "Asphalt Armour")
- Wordmark: `ASPHALT` + amber `IQ`
- Tagline: "Smarter Asphalt Care" / "Entretien intelligent de l'asphalte"
- Phone: (438) 496-7111
- Email displayed: `info@asphaltiq.ca` (placeholder until domain owned)
- Service area: Montreal West Island / Ouest-de-l'Île de Montréal

## Architecture
- Backend: FastAPI + MongoDB + JWT (httpOnly cookies) + Resend email
- Frontend: React Router, axios withCredentials, sonner, @phosphor-icons/react
- API routes prefixed `/api`

## Pages
- `/` Home, `/services` Services, `/quote` Free Quote, `/contact` Contact
- `/admin/login` Admin Login, `/admin` Admin Dashboard (protected)

## Features Implemented
- Free quote + contact form submission with admin dashboard management
- Email notifications via Resend on every quote and contact submission (fire-and-forget background tasks)
- Admin JWT auth (auto-seed on startup), bcrypt hashing
- **Light/Dark theme toggle** — bottom-left widget, persisted in localStorage
- **EN/FR language toggle** — bottom-left widget, full French translation across all public pages
- Logo: shield image with transparent background, served from `/logo.png`, inverted on light surfaces
- Clickable service preview cards on home → navigate to /services
- Service area, hours, phone, email translated/displayed throughout
- Resend integration delivering to `eugencretu24@gmail.com` (interim, until `.ca` domain verified)

## Design
- Default theme: light (zinc-100 / white surfaces, amber-600 accent)
- Dark theme: full override via `html.dark` class
- Hero retains dark photo bg regardless of theme (high contrast brand moment)
- Yellow CTA band kept in both themes
- Admin console stays dark (workspace aesthetic)

## Key Files
- Backend: `/app/backend/server.py`, `/app/backend/emailer.py`, `/app/backend/.env`
- Frontend pages: `/app/frontend/src/pages/{Home,Services,Quote,Contact,AdminLogin,AdminDashboard}.jsx`
- Components: `/app/frontend/src/components/{Header,Footer,ProtectedRoute,SettingsWidget}.jsx`
- Providers: `/app/frontend/src/lib/{auth,i18n,theme}.jsx`, `api.js`
- Logo: `/app/frontend/public/logo.png` (transparent)
- Styles: `/app/frontend/src/index.css`

## Credentials
- Admin: `admin@asphaltiq.ca` / `admin123` (also `admin@asphaltarmour.com` still seeded from earlier)
- Resend API key in `/app/backend/.env`
- Resend sender currently `onboarding@resend.dev` (testing mode)
- Notification email currently `eugencretu24@gmail.com` (Resend testing limit)

## Pending / Next Tasks
P0 — When user returns
- Verify `asphaltiq.ca` domain in Resend → flip `SENDER_EMAIL` to `info@asphaltiq.ca` + `NOTIFICATION_EMAIL` to `info@asphaltiq.ca`
- Set up Cloudflare Email Routing to receive at `info@asphaltiq.ca` (forward to gmail)

P1
- Customer auto-reply on quote/contact submission (EN/FR aware based on user's lang choice)
- Photo gallery / before-after slider on Services
- Translate quote-notification email templates to recipient's language (if customer was in FR, include both)

P2
- Reviews/testimonials section
- Service area map embed
- Multi-admin support, password reset
- French translation for admin dashboard (currently EN-only)
