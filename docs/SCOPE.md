# CIMPLE — Scope Charter

_The single test every feature must pass. Set by Nash Clark (product owner), 2026-07-06._

## Purpose

CIMPLE exists for one purpose:

> **To help Trinity Anglican College manage a critical incident from detection through recovery.**

## The command test (the core screen's job)

When an incident occurs, a staff member opening CIMPLE must **immediately** know:

1. **What is happening?**
2. **Who is responsible?**
3. **What needs to happen next?**
4. **Who has been notified?**
5. **What decisions have been made?**
6. **What communications have been approved?**
7. **What risks remain?**
8. **How the incident is progressing toward resolution.**

These eight questions are the specification for the incident command workspace. Every screen and feature should help answer one of them faster.

## The scope test (apply to every proposed feature)

> **"Does this materially improve the management of an active incident?"**

- **Yes →** in scope.
- **No →** out of scope. No exceptions dressed up as "it also helps incidents."

CIMPLE is an **incident management platform** — the system TAC staff open when a critical incident occurs. Its mission is fixed and must not be redefined.

### What CIMPLE is NOT
CIMPLE is **not**, and will not drift into becoming:
- a broader school **operations** platform
- a **student management** platform
- a **wellbeing** platform
- a **compliance** platform
- a **resilience / readiness** platform

Features that primarily serve administration, compliance, analytics, student management, HR, or general operations are **out of scope**. When a feature has an out-of-scope version and a genuine in-incident sliver, build **only the in-incident sliver** — and only if that sliver passes the test on its own.

### Priorities (what we build for)
1. Incident command
2. Decision support
3. Activation
4. Communications
5. Accountability
6. Coordination
7. Situational awareness
8. Recovery management
9. Post-incident review

Avoid feature creep and platform expansion beyond incident management.

## Current coverage of the eight questions

| Question | Feature | Status |
|---|---|---|
| What is happening? | Incident overview, severity, live timeline | Built |
| Who is responsible? | Roles rail (assign / confirm / conflicts) | Built |
| What needs to happen next? | Tasks → Crisis Copilot (gap detection) | Partial — Copilot not built |
| Who has been notified? | Activation & acknowledgements (M2) | Built (simulated) |
| What decisions have been made? | Decision Log | **Built** (2026-07-06) |
| What comms have been approved? | Communications (M4) | Built (simulated) |
| What risks remain? | **Risk / Watch register** | **Not built** |
| Progress to resolution | Status + Recovery Readiness | Partial |

Remaining unbuilt in-charter gap: the **Risk / Watch register**. (Decision Log shipped 2026-07-06.)

## Capability classification (from VISION_2030.md, re-cut through this charter)

**In scope**
- Decision Log · Crisis Copilot · Red Folder Mode · Dynamic Role Replacement
- Reunification & Custody-Safe Release · Real-time Roll-Call / Accountability · Emergency-Services Handoff Pack
- Incident Forecasting (live next-stage decision support) · Recovery Readiness Score
- Incident Intelligence Graph — **in-incident slice only** ("who is affected / who not to contact")
- Risk / Watch register

**Borderline — build only the in-incident sliver**
- Parent Pressure Gauge → comms-demand signal only (not anxiety analytics)
- Media Exposure Radar → risk/decision input only (not reputational analytics)
- Live Lessons Learned → capture is cheap but payoff is post-incident; defer
- Staff Cognitive Load Monitor → commander time-in-role visibility only; low priority

**Out of scope (unless a direct in-incident justification emerges)**
- Timeline Replay (training/governance) · Statutory Obligations / Mandatory-Reporting Engine (compliance; only the "notify now" sliver lives inside Activation)
- Wellbeing Aftercare / long-tail welfare · Drill & Readiness Simulator (peacetime) · Cross-Incident Pattern / Early-Warning (analytics)
- General M8 administration, except the parts that feed an active incident (staff directory currency, role-conflict rules)

## Consequence for the roadmap

The highest-leverage in-scope, no-backend builds are:
1. **Decision Log** — fills question 5; the defensibility spine.
2. **Risk / Watch register** — fills question 7; currently absent.
3. **Crisis Copilot (MVP)** — completes question 3.
4. **Red Folder Mode** — makes all eight answerable under peak stress.

Backend-gated in-scope capabilities (Roll-Call, Reunification at scale, Intelligence Graph, live Parent-demand) wait behind the backend decision — but each still answers one of the eight questions, so they remain on-charter.
