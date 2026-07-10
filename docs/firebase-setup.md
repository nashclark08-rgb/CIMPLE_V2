# CIMPLE — Firebase setup (status)

_The backend project is **created and wired**. Project: **`cimple-v2-tac`**. This doc records what's done and the one console click still outstanding._

## Done (automated, 2026-07-10)
- ✅ **Firebase project created** — `cimple-v2-tac` (console: <https://console.firebase.google.com/project/cimple-v2-tac/overview>).
- ✅ **Web app registered** + SDK config captured.
- ✅ **Firestore database** created in **australia-southeast1 (Sydney)** — AU data residency for a tool handling child/incident data.
- ✅ **Security rules deployed** (`firestore.rules`) — authenticated users only; the public gets nothing.
- ✅ **Identity Toolkit API enabled** (the API behind Auth).
- ✅ **Local config** written to `.env.local` (gitignored) — running `npm run dev` locally now starts in **connected mode**.
- ✅ **Production kept in local mode on purpose** — the Vercel **production** env vars are deliberately NOT set, so the live prototype (cimple-v2.vercel.app) stays sign-in-free during the Annika trial.

## Outstanding — the one console click (needs your Google login)
**Enable the Email/Password sign-in provider.** The API is on, but the provider toggle only initialises cleanly from the console (doing it via the raw API risks provisioning the paid Identity Platform product, which I won't do on your account):

1. Go to <https://console.firebase.google.com/project/cimple-v2-tac/authentication>
2. Click **Get started**
3. Select **Email/Password** → toggle **Enable** → **Save**

That's it. Tell me when it's done and I'll create the first sign-in user and verify connected mode end-to-end.

## The env var values (already in `.env.local`)
| Env var | Value |
|---|---|
| `VITE_FIREBASE_API_KEY` | `AIzaSyBfZzLpV7n6WDImIvXEV3c5NiNI2IBYrHw` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `cimple-v2-tac.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `cimple-v2-tac` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `cimple-v2-tac.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `278695974250` |
| `VITE_FIREBASE_APP_ID` | `1:278695974250:web:58f42eb2b89212e8b6c113` |

(The web `apiKey` is **not a secret** — Firebase web config is public by design; access is controlled by the Security Rules + Auth, not by hiding it.)

## What comes next (the real build — D2)
This turn stood up the **infrastructure**. The functional multi-user backend is the next build, and it will be done on a **`firebase-connected` branch → Vercel Preview URL** so production stays safe until you deliberately flip it:
1. Migrate the localStorage data shape into Firestore collections (incidents, roster, timeline…).
2. Real-time Team Board + real acknowledgements from responders' own devices.
3. Per-user sign-in seeded from the CIMT roster; RBAC in the rules.
4. Swap `simulateNotification()` for FCM push (+ later a Cloud Function → Twilio for SMS).

Only when that's tested on the preview URL do we add the six env vars to Vercel **Production** and flip the live site to connected mode.
