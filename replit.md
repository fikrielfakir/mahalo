# Homzen / Mahalo Immobilier

A premium real estate marketplace platform for Morocco, featuring property listings for sale and rent, new development projects, agent profiles, AI-powered features, and a full admin panel.

## Architecture

- **Frontend:** React 18 + Vite, served via a custom Express SSR server (`frontend/server.mjs`) on port 5000
- **Backend API:** External Laravel 13 API hosted at `https://api.mahalo.ma` (proxied through the frontend server)
- **No local backend** — all API calls are proxied to the external Laravel API

## How it runs

The workflow starts `frontend/server.mjs` which:
1. Installs frontend npm dependencies
2. Starts the Express server on port 5000 (mapped to external port 80)
3. Proxies all `/api/*` and `/storage/*` requests to `https://api.mahalo.ma`
4. Serves the React app with SSR support for bots (OG tags, prerendering)

## Key environment variables (set in .replit [userenv])

- `API_BACKEND_URL` — the external Laravel API URL (currently `https://api.mahalo.ma`)
- `INTERNAL_API` — same as above, used for server-side SSR data fetching

## Key files

- `frontend/server.mjs` — Express SSR server entry point
- `frontend/vite.config.js` — Vite config with API proxy rules
- `frontend/src/api/client.js` — Axios API client
- `frontend/src/context/UserAuthContext.jsx` — Auth state management (token-based via Laravel Sanctum)
- `frontend/src/admin/` — Admin panel (isolated from public site)

## User preferences

- Keep the existing project structure and do not rewrite from scratch
