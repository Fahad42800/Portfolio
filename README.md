# Fahad Bin Mansoor — Portfolio (React + TypeScript + Express)

- `client/` Vite + React + TypeScript front end
- `server/` Express + TypeScript API (profile, projects, contact form with email)

## Run locally
```
cd server && npm install && cp .env.example .env && npm run dev     # http://localhost:5000
cd client && npm install && npm run dev                              # http://localhost:5173 (proxies /api)
```
## Your photo
Put it at `client/public/profile.jpg` (initials show until then).

## Contact form email
In `server/.env` set `SMTP_USER` (Gmail address) and `SMTP_PASS` (Gmail App Password: Google Account > Security > 2-Step Verification > App passwords). Without them, messages are only logged in the server console.

If sending fails, read the server terminal: it prints `SMTP ready` or `SMTP login FAILED` at startup. `SMTP_PASS` must be the 16-character App Password (not your Gmail password, not the placeholder). Restart the server after editing `.env`.

## Deploy
1. Push to GitHub (`.gitignore` keeps `.env` private).
2. Server on Render: Root `server`, Build `npm install && npm run build`, Start `npm start`. Env vars: `CLIENT_ORIGIN` (your Vercel URL), `CONTACT_TO`, `RESEND_API_KEY` (Render free blocks SMTP, so use Resend; leave SMTP vars out).
3. Client on Vercel: Root `client`, env `VITE_API_URL` = your Render URL (no trailing slash). Redeploy after adding it.

Edit your content in `server/src/data.ts`.
