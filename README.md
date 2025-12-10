Project Frontend + Backend
==========================

This repository contains a separate frontend (client) and backend (server) application:

- `client/` — React-based frontend (single-page app).
- `server/` — Node.js + Express backend (EJS views and API routes).

This README provides a high-level overview and quick start commands. See the `client/README.md` and `server/README.md` files for folder-specific details.

**Prerequisites**

- Node.js (recommended v14+ or newer)
- npm or yarn

**Quick start (development)**

Open two terminals (one for server, one for client).

Client (frontend):

```powershell
cd client
npm install
npm start
```

Server (backend):

```powershell
cd server
npm install
# start the app (try `npm start`, or if available `npm run dev`)
npm start
```

If your repository has a task to run both concurrently, use that; otherwise run the two commands above in parallel.

**Build for production**

Frontend build:

```powershell
cd client
npm run build
```

Serve the built `client/build` (or `client/dist`) with any static server or integrate into the `server` static hosting.

**Environment variables**

If the server or client require environment variables, create a `.env` in the relevant folder. Common variables:

- `PORT` — port the backend will listen on
- `NODE_ENV` — `development` or `production`
- any database, API or secrets the app needs

**Project structure (high level)**

- `client/` — React app
  - `public/` — static assets
  - `src/` — React entry, components and pages

- `server/` — Node/Express app
  - `app.js` — Express app entry
  - `routes/`, `controller/`, `models/` — server-side code
  - `views/` — EJS templates

**Notes**

- Use `npm run build` in the client to produce production assets.
- Confirm scripts in each `package.json` (some projects use `dev`, `start`, or `serve`).

If you'd like, I can run the project's test scripts, adjust the server to serve the client build, or add a single command to start both apps concurrently.
