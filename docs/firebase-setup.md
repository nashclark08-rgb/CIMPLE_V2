# CIMPLE — Firebase setup (the one manual step)

_Increment D foundation is built and in the code. CIMPLE runs today in **local mode** (localStorage, no sign-in) and will keep doing so until the six env vars are set. This is the click-path to switch on the real backend. It takes ~10 minutes and only you can do it (it needs your Google login)._

## 1. Create the project
1. Go to <https://console.firebase.google.com> and sign in.
2. **Add project** → name it e.g. `cimple` → you can disable Google Analytics (not needed) → **Create**.

## 2. Enable Authentication
1. Left menu → **Build → Authentication → Get started**.
2. **Sign-in method** tab → enable **Email/Password** → Save.
3. (Later, optional) add Microsoft SSO to the TAC tenant — not needed to launch.

## 3. Enable Firestore
1. Left menu → **Build → Firestore Database → Create database**.
2. Choose location **australia-southeast1 (Sydney)** → Next.
3. Start in **production mode** (we ship real Security Rules in the next step, D2) → Enable.

## 4. Register the web app + copy the config
1. Project **⚙ Settings → General → Your apps → </> (Web)**.
2. Nickname `cimple-web` → **Register app** (skip Hosting).
3. Copy the `firebaseConfig` values. You'll map them to the env vars below.

## 5. Set the env vars
**In Vercel** (Project → Settings → Environment Variables), add these for Production + Preview:

| Env var | From firebaseConfig |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

**For local dev** (optional): copy `.env.example` → `.env.local` and paste the same values.

Then redeploy. On next load CIMPLE will show the **sign-in screen** instead of going straight in.

## 6. Create the first user
Firebase console → **Authentication → Users → Add user** → your email + a password. That's your first sign-in. (In D2 we'll seed users from the staff roster.)

## Safety notes
- These `VITE_FIREBASE_*` values are **not secrets** — Firebase web config is public by design; security is enforced by Firestore **Security Rules** (built in D2), not by hiding the config.
- `.env.local` is git-ignored, so nothing here gets committed.
- Cost at one-school scale is effectively nil (Spark free tier; Blaze pay-per-use only kicks in for Cloud Functions/Twilio later).

---

### What happens after this
Once the project exists and env vars are set, the next build increment (**D2**) can:
1. Migrate the localStorage data shape into Firestore collections.
2. Write the Security Rules (RBAC).
3. Make the Team Board real-time and acknowledgements real (from responders' own devices).
4. Swap `simulateNotification()` for FCM push + a Cloud Function → Twilio for SMS.

The Increment-C data model was deliberately built as normalized, append-only records that map 1:1 to Firestore collections — so D2 is mostly wiring, not redesign.
