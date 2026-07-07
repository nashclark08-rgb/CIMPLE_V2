# CIMPLE — Backend decision brief (Supabase vs Firebase)

_2026-07-07 · governed by `SCOPE.md` · decides the platform for Increment D_

## The question
CIMPLE is a single-user localStorage prototype. Everything that makes it a *team* tool during a live incident is blocked on a backend:
- **Real multi-user acknowledgement** — a responder ack'ing a role from *their own* device (the prototype can only simulate this locally).
- **Real notifications** — email / SMS / push actually dispatched, not `simulateNotification()`.
- **Shared, immutable audit log** — one timeline every device sees, tamper-evident.
- **Auth + RBAC** — staff sign in; Incident Commander sees more than a Floor Warden.

This brief picks the backend so that build can start.

## The decisive constraint: it must work when the network doesn't
CIMPLE is a **critical-incident** tool. The CIBCM PRD makes resilience/offline a hard NFR — a lockdown, a fire, a regional power/network outage is *exactly* when connectivity degrades, and that is *exactly* when the tool has to keep working. This reframes the whole decision: the backend isn't just "where the data lives," it's "does the Team Board still update on a phone with two bars in a stairwell."

## Head-to-head on what CIMPLE actually needs

| Need | Firebase | Supabase | Edge |
|---|---|---|---|
| **Offline-first client cache** (reads/writes queue locally, auto-sync on reconnect) | First-class in the Firestore SDK — built for this | Not a first-class client feature; you build/queue it yourself | **Firebase — decisively** |
| **Push notifications** (web + mobile) | FCM — native, free, best-in-class | No native push; you bolt on FCM/OneSignal anyway | **Firebase** |
| **Real-time multi-user** (live Team Board / acks) | Firestore realtime listeners | Supabase Realtime | Even |
| **Auth** (staff logins, SSO later) | Firebase Auth — mature, Google/Microsoft SSO | Supabase Auth — also solid | Even |
| **Append-only audit log / querying** | Works, but querying is document-shaped | Postgres + SQL + RLS — nicer for an auditable ledger | **Supabase** |
| **SMS** | Twilio via a serverless function | Twilio via an edge function | Even (neither native) |
| **Fits Nash's existing stack** | House standard — Assessment Scheduler, Work Flow, HomeBase, PoolDeck, MarketIntel all Firebase | Only Counsel Intel uses it | **Firebase** |

## Why Counsel Intel chose Supabase — and why CIMPLE is different
Counsel Intel is an **append-only analytical ledger**: lots of rows, SQL aggregation, GitHub-Actions batch collection. Postgres is the right shape for that. CIMPLE is the opposite: a small number of live documents (one incident, ~8 roles, a rolling timeline) that **many devices watch in real time and must keep reading offline**. Different problem, different tool. Using Supabase here just because Counsel does would optimise for the wrong axis.

## Recommendation: **Firebase**
For CIMPLE specifically, three things decide it:
1. **Firestore offline persistence** is the single best answer to the resilience NFR — and it's free and built-in, not a project of its own.
2. **FCM** gives real push on web and mobile with no third dependency; you'd end up adding it to a Supabase build anyway.
3. **It's the house standard**, so the auth pattern, env-var setup, deploy flow, and (importantly) the AI-assistant mental model all carry over from Nash's other tools.

Supabase would be the better call *only* if the audit-log/reporting side were the dominant requirement. It isn't — the dominant requirement is "works live, on many devices, when the network is bad."

## What Firebase unlocks — Increment D, in build order
1. **Auth** — Firebase Auth; staff sign in (email link or Microsoft SSO to the TAC tenant later). Seed from the existing roster.
2. **Data migration** — lift the localStorage shape (`incidents`, `staff`, `incident_roles`, `activations`, `notifications`, `timeline`) into Firestore collections. The Increment-C schema was deliberately designed as normalized, append-only records that map 1:1 to collections — so this is a lift, not a redesign.
3. **Real-time Team Board** — swap the local read for a Firestore listener; every device sees the same activation states live.
4. **Real acknowledgements** — the assignee ack/declines from their own device; it writes an event, the board updates everywhere.
5. **RBAC** — Firestore Security Rules keyed to role; enforce read/write scope server-side.
6. **Real notifications** — swap `simulateNotification()` for the provider interface already abstracted: **FCM** (push) + a **Cloud Function → Twilio** (SMS) + email. The abstraction means this is a provider swap, not a rewrite.
7. **Offline hardening** — enable Firestore persistence, test the degraded-network path deliberately (it's a feature, so test it like one).

## Risks / things to hold in view
- **Cost** — trivial at one-school scale (Firebase free/Spark tier likely covers it; Blaze only for Cloud Functions/Twilio, pay-per-use).
- **Security Rules are the real work** — RBAC lives in Firestore Rules; budget proper time to write and test them (this is the defensibility surface).
- **Don't let the backend expand the charter** — it enables command/coordination/notification/audit. It is not an invitation to add HR, BI, or student-management. `SCOPE.md` still governs.
- **SSO timing** — email-link auth is fine to launch; wire Microsoft/TAC-tenant SSO when Adrian's team can provision it. Don't block Increment D on it.

## Bottom line
**Go Firebase.** It's the only option that answers the resilience NFR out of the box, gives real push for free, and reuses the stack Nash (and his AI assistants) already know. The Increment-C schema was built for this migration, so Increment D is mostly wiring, not redesign.
