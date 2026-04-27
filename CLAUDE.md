# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Sinergia Security** — Angular 17 website for an executive security services company in Ecuador. It features a marketing frontend with service pages, an interactive contact/quotation system, and a Node.js/Express backend that saves submissions to Google Sheets and sends Gmail notifications via OAuth2.

---

## Commands

### Frontend (Angular)
```bash
npm start        # Dev server at http://localhost:4200
npm run build    # Production build → dist/sinergia-security/
npm run watch    # Build in watch mode (development config)
npm test         # Run unit tests (Karma)
```

### Backend (Node.js/Express)
```bash
cd src/app/sinergia-backend
npm start        # node server.js → port 3000
npm run dev      # nodemon server.js (hot reload)
```

Both servers must run simultaneously for the full app to work locally.

---

## Architecture

### Frontend

**Angular 17 standalone components** — no `NgModule`, uses `app.config.ts` with `provideRouter`, `provideHttpClient`, `provideAnimations`.

All routes in [src/app/app.routes.ts](src/app/app.routes.ts) use `loadComponent()` for lazy loading. The root `/` route eagerly loads `HomeComponent`.

Route structure:
- `/` — `HomeComponent` (main landing page)
- `/servicios/*` — 6 service pages (proteccion-ejecutiva, seguridad-minera, transporte-valores, crisis-kr, academy, app)
- `/empresa`, `/cobertura`, `/casos`, `/equipo`, `/contacto` — informational pages

**Services:**
- [src/app/services/service.ts](src/app/services/service.ts) — `ContactService.enviarSolicitud()` → `POST http://localhost:3000/api/contact`
- [src/app/services/cotizacion.service.ts](src/app/services/cotizacion.service.ts) — `CotizacionService.enviarCotizacionCompleta()` → `POST http://localhost:3000/api/cotizacion`

**Contact form** ([src/app/pages/contacto/](src/app/pages/contacto/)) reads `?servicio=` and `?tipo=` query params to pre-fill fields.

### Backend

Single file: [src/app/sinergia-backend/server.js](src/app/sinergia-backend/server.js) (~765 lines).

**API endpoints:**
- `POST /api/contact` — validates, sends emails (team + client), appends row to Google Sheets "Solicitudes" tab. Rate-limited: 10 requests / 15 min.
- `POST /api/cotizacion` — same flow for quotation data.

**Google Sheets integration:** Uses `googleapis` v4 with OAuth2 refresh token. Appends to a spreadsheet defined by `GOOGLE_SPREADSHEET_ID` in `.env`.

**Email:** Gmail OAuth2 via `nodemailer`. Sends HTML-formatted emails to both the team (`NOTIFICATION_EMAIL`) and the submitting user.

**Backend `.env`** (at `src/app/sinergia-backend/.env`):
```
PORT, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI,
GOOGLE_REFRESH_TOKEN, GMAIL_USER, NOTIFICATION_EMAIL,
GOOGLE_SPREADSHEET_ID, ALLOWED_ORIGINS, NODE_ENV
```

### Styling

Global styles in [src/styles.scss](src/styles.scss). Component styles are per-component `.scss` files.

Color tokens used throughout:
- Gold/Primary: `#E5C643`
- Dark background: `#1A1D23`
- Blue accent: `#487FC0`

Breakpoints: mobile `< 768px`, tablet `768–1023px`, laptop `1024–1919px`, desktop `1920px+`.

---

## Key Constraints

- Phone validation expects 10-digit Ecuador format (`/^[0-9]{10}$/`).
- Production build budget: 500 KB initial (error at 1 MB); 20 KB component styles (error at 40 KB). Keep lazy loading intact to stay within budget.
- No unit tests exist yet — `ng test` is configured (Karma) but test files are absent.
