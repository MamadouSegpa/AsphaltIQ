# Asphalt Armour — PRD

## Original Problem Statement
Build a website for an asphalt sealing company (Asphalt Armour) where customers can request free quotes, view services, and contact the company.

## User Choices
- Quote handling: save to DB + admin dashboard + **email notifications via Resend**
- Services: Driveway Sealcoating + Crack Filling
- Visual style: Clean & professional (executed as dark industrial Swiss/high-contrast)
- Auth: JWT email/password (admin only)
- Logo: shield logo provided by user, background removed (served from `/logo.png`)
- Service area: Montreal West Island
- Phone: (438) 496-7111
- Email: info@asphaltarmour.com (placeholder — domain not yet owned)

## Architecture
- Backend: FastAPI + MongoDB (Motor), JWT auth via httpOnly cookies, Resend for transactional email
- Frontend: React Router, axios withCredentials, sonner toasts, @phosphor-icons/react
- All API routes prefixed `/api`

## Implemented (2026-02)
- Auth: login / logout / me, admin auto-seed on startup, bcrypt hashing, JWT
- Quotes: POST (public), GET/PATCH (admin)
- Contacts: POST (public), GET/PATCH (admin)
- 6 pages: Home, Services, Quote, Contact, AdminLogin, AdminDashboard
- Email notifications wired (Resend) on quote AND contact submissions — fire-and-forget background tasks
- Currently sends to `eugencretu24@gmail.com` (until custom domain verified)
- Logo with transparent bg in header, footer, admin login, admin dashboard
- Copy updated: removed all "experience" claims (Est. 2014, 10+ years, 2.4k driveways, 98% repeat clients, crew-owned, hot rubberized sealant). Replaced with longevity + satisfaction guarantee messaging
- Services list updated per user feedback (removed edge cut-in by hand, two spray-applied coats)

## Tested
- 16/16 backend pytest passing
- Frontend e2e validated (login → dashboard → status updates → logout)
- Email send confirmed (Resend ID returned, gmail inbox delivery)

## Pending / Next Tasks
P0 — When user comes back
- Verify `asphaltearmure.ca` domain in Resend (DNS records: SPF, DKIM)
- Once verified, flip `SENDER_EMAIL` and `NOTIFICATION_EMAIL` in `/app/backend/.env` to `info@asphaltearmure.ca`
- Swap all `info@asphaltarmour.com` references in footer + contact page to `.ca` domain

P1
- Customer auto-reply email on quote/contact submission ("Thanks, we got your request")
- Photo gallery / before-after slider on Services page
- Set up Cloudflare Email Routing for inbox at `info@asphaltearmure.ca`

P2
- Reviews / testimonials section with avg rating
- Service area map embed
- Multi-admin support, password reset flow

## Key Files
- Backend: `/app/backend/server.py`, `/app/backend/emailer.py`, `/app/backend/.env`
- Frontend pages: `/app/frontend/src/pages/{Home,Services,Quote,Contact,AdminLogin,AdminDashboard}.jsx`
- Frontend components: `/app/frontend/src/components/{Header,Footer,ProtectedRoute}.jsx`
- Auth context: `/app/frontend/src/lib/auth.jsx`
- API client: `/app/frontend/src/lib/api.js`
- Logo: `/app/frontend/public/logo.png` (transparent background)

## Test Credentials
See `/app/memory/test_credentials.md`
- Admin: `admin@asphaltarmour.com` / `admin123`

## Integrations & Keys (saved in `/app/backend/.env`)
- `RESEND_API_KEY` — configured
- `SENDER_EMAIL` = `onboarding@resend.dev` (will become `info@asphaltearmure.ca` after domain verification)
- `NOTIFICATION_EMAIL` = `eugencretu24@gmail.com` (interim — will become `info@asphaltearmure.ca`)
- `JWT_SECRET` — configured
