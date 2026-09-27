# Render Free deployment

Deploy the repository's root `render.yaml`, using branch `codex/clean-homepage`.
This provisions only a Free Node web service. It creates no paid resource and no database.
Auto-deploy is off so later branch pushes do not automatically replace the backend.

## Required configuration

Provide DATABASE_URL for the existing PostgreSQL database reachable from Render.
The local backup points to localhost and is not a production connection string.
Preserve the existing JWT_SECRET and SESSION_SECRET when migrating an existing app.
Enter production secrets directly into Render's protected environment settings; never commit them.

The build installs development tools, generates Prisma, and compiles TypeScript.
The start command is `npm start`, intentionally bypassing the existing Fly startup
script's destructive `db push --accept-data-loss` fallback. Verify the existing schema
before cutover. This repository has no checked-in Prisma migration history.

Configure these integrations separately using the existing credentials:
- Google: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL. Add the new
  Render callback URL ending `/api/auth/google/callback` to Google's authorized redirect URIs.
- Photos: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
- Payments: PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY (test keys during verification).
- Email: the current SMTP transport is incompatible with Render Free's blocked SMTP
  ports. Switch to an HTTPS email API before relying on password-reset or booking emails.

## Verify before switching the frontend

1. `/health` returns 200 (this checks the process, not the database).
2. `/api/providers` successfully queries the existing database.
3. Confirm frontend CORS, Socket.IO, account login, availability, photo uploads and OAuth.
4. Change Vercel's VITE_API_URL to the Render URL plus `/api`, and VITE_SOCKET_URL to
   the Render origin, then redeploy the frontend only after those checks pass.
5. Keep Fly intact until cutover is confirmed; moving does not settle its invoice.

Free services sleep after 15 idle minutes and may take about a minute to wake.
Render's free PostgreSQL database expires after 30 days; it is not a durable free
replacement for the existing database. Use external image storage, not the ephemeral disk.
