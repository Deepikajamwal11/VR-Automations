Server (Backend)
=================

This folder contains the backend API and server-side application.

**What it is**

- Node.js + Express application with EJS views and API routes.
- Server entry: `app.js`.

**Prerequisites**

- Node.js and npm (or yarn)

**Common commands**

Install dependencies and start the server:

```powershell
cd server
npm install
npm start
```

If there is a development script using `nodemon`, use:

```powershell
cd server
npm run dev
```

**Folder structure (important items)**

- `app.js` — application bootstrap (Express configuration)
- `routes/` — route definitions (`index.js`, `users.js`)
- `controller/` — request handlers and business logic (`adminController.js`)
  - `controller/cron/` — scheduled job(s), e.g. `crmsync.js`
- `models/` — data models (e.g. `users.js`)
- `public/` — static assets served by Express
- `views/` — EJS view templates (`index.ejs`, `error.ejs`)

**Environment variables**

Create a `.env` file or configure environment variables required by the project. Common variables:

- `PORT` — port the server listens on
- `NODE_ENV` — `development` or `production`
- `DATABASE_URL`, `SESSION_SECRET`, `JWT_SECRET` — if your app uses DB or auth

**Notes**

- Check `package.json` for exact scripts available (some projects define `start`, `dev`, `test`).
- The server includes a `views/` directory with EJS templates — it can render server-side pages in addition to JSON APIs.
