# Asphalt Armour — PRD

## Original Problem Statement
Build a website for an asphalt sealing company (Asphalt Armour) where customers can request free quotes, view services, and contact the company.

## User Choices
- Quote handling: save to DB + admin dashboard
- Services: Driveway Sealcoating + Crack Filling
- Visual style: Clean & professional (executed as dark industrial Swiss/high-contrast per design agent)
- Auth: JWT email/password (admin only)
- Logo: text wordmark "ASPHALT ARMOUR" (user to upload image later)

## Architecture
- Backend: FastAPI + MongoDB (Motor), JWT auth via httpOnly cookies (samesite=none, secure)
- Frontend: React Router, axios w/ withCredentials, sonner toasts, @phosphor-icons/react
- All API routes prefixed `/api`

## Personas
- Visitor / Customer (anonymous) → browse, request quote, contact
- Admin → view & manage quotes and contact messages

## Core Requirements (static)
- Home, Services, Quote, Contact pages
- Free quote form (name, email, phone, address, service type, property type, sqft, notes)
- Contact form (name, email, phone, message)
- Admin login + dashboard listing quotes & messages with status management

## Implemented (2026-02)
- Auth: login / logout / me, admin auto-seed on startup, bcrypt hashing, JWT
- Quotes: POST (public), GET (admin), PATCH status (admin)
- Contacts: POST (public), GET (admin), PATCH read (admin)
- Frontend: 6 pages built (Home, Services, Quote, Contact, AdminLogin, AdminDashboard)
- Design: dark theme, Anton wordmark, yellow #facc15 accent, sharp corners
- Tested: 16/16 backend pytest passing, frontend e2e validated

## Backlog
P1
- Email notifications on new quote (Resend / SendGrid)
- Logo upload (user to provide image)
- Replace placeholder phone/email/address with real company info
- Photo gallery / before-after slider

P2
- Reviews / testimonials section with avg rating
- Service area map
- Multi-admin support, password reset

## Test Credentials
See /app/memory/test_credentials.md
