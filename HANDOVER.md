# CIMPLE — Project Handover & Working Notes

_Last updated: 2026-07-06_

This document is the **backbone brief** for anyone (human or AI) picking up CIMPLE. Read it before making changes.

> **Read `docs/SCOPE.md` first — it is the governing charter.** CIMPLE is an **incident management platform** and that mission is fixed. Every feature must pass one test: _"Does this materially improve the management of an active incident?"_ If no, it is out of scope. Do not expand CIMPLE into a school-operations, student-management, wellbeing, compliance, or resilience platform. `docs/VISION_2030.md` is exploratory only and is subordinate to `SCOPE.md`.

---

## 1. What CIMPLE is

**CIMPLE** = _Critical Incident Management Platform for Learning Environments_.

A web app to run **Trinity Anglican College's (TAC)** critical-incident and business-continuity response. It operationalises TAC's existing ~110-page paper plan (CIMP/BCP v0.2, 28 Oct 2025) — the plan is mature on paper but the _operational layer_ fails under stress (manual coordination, WhatsApp/Teams/M365 that may be down during the very incident, blank `[insert]` fields, page-number cross-refs, double-hatted roles). CIMPLE is the tool that fixes the operational layer.

**Current status:** working **single-user prototype** for demos and stakeholder feedback. It is _not_ the target architecture — see §6.

- **Live:** https://cimple-v2.vercel.app/ (Vercel project `cimple-v2`, auto-deploys on push to `main`)
- **Repo:** https://github.com/nashclark08-rgb/CIMPLE_V2
- **Local clone:** `C:\Users\nash.clark\CIMPLE\CIMPLE_V2\`
- **Owner/commissioner:** Nash Clark (TAC staff; commissions internal tools, not a hands-on dev)

---

## 2. Source-of-truth documents

The PRD **dictates scope** — the prototype evolves _toward_ it, never caps it.

| Document | Location | What it is |
|---|---|---|
| **CIBCM Platform PRD (Draft 1.0, May 2026)** | `C:\Users\nash.clark\CIMPLE\TAC_CIBCM_Platform_PRD.docx` | The spec. 8 modules, NFRs, AI guardrails, phased roadmap. |
| Annika's reviewed copy (31 comments) | `C:\Users\nash.clark\Downloads\TAC_CIBCM_Platform_PRD.docx` | Product-owner feedback — see §7. |
| Ransomware Risk Assessment | `C:\Users\nash.clark\CIMPLE\TAC Final Ransomware Risk Assessment.docx` | Related continuity/risk doc. |
| Source institutional plans | `C:\Users\nash.clark\Trinity Anglican College\...` | The 2023–24 "Critical Incident & Business Continuity Plan" DRAFTs + AISNSW guide the PRD builds on. |

**Stakeholders:** Sponsor — Adrian Johnson (Principal, Critical Incident Leader). Proposed product owner — Annika Fairley (Risk & Compliance Officer). Marketing — Megan Whitshed ("MWHI"; has holding statements drafted).

---

## 3. The 8 PRD modules & build status

| # | Module | Status in prototype |
|---|---|---|
| **M1** | Intake & Triage | ✅ Prototyped — guided new-incident + 5-question triage, 14 incident types, recommended severity |
| **M2** | Activation & Notification | ✅ Prototyped (**SIMULATED**) — one-tap declare, cascade to assigned roles over 2 channels, ack tracking, failover to backup |
| **M3** | Incident Command Workspace | ✅ Prototyped — roles, interactive tasks (due-times), immutable timeline/auto-log, per-role responsibilities |
| **M4** | Communications | ✅ Prototyped (**SIMULATED**) — template library (incl. MWHI holding statements), draft→approve→dispatch, AI drafting, channel picker |
| **M5** | Business Continuity & Recovery | ❌ Not started |
| **M6** | Situational Awareness | ❌ Not started |
| **M7** | Post-Incident & Learning | ✅ Prototyped — PIR drawer: auto-assembled record → AI-drafted review (summary/worked/improve/plan-updates) → corrective-action tracker → finalise; plus audit-ready PDF/JSON export |
| **M8** | Administration & Readiness | ⚠️ Partial — staff directory, role-conflict detection, contact-currency (90-day) checks, drill mode |

**"SIMULATED" is the critical caveat:** M2 and M4 look complete but nothing actually sends. Acks are toggled by hand; dispatch just logs. Making them _real_ is the backend decision (§6).

---

## 4. Tech stack & architecture

- **Vite + React 18 + lucide-react + jspdf.** No TypeScript.
- **No backend, no auth, no database.** All state in `localStorage` (key `cimple-v2-state`) via `src/data.js`.
- **Hash-based router** in `src/App.jsx` (`#/`, `#/incident/:id`, `#/new`, `#/triage`, `#/sandbox`, `#/admin`).
- **One serverless function:** `api/draft.js` (Vercel) → Anthropic API for AI comms drafting. Needs env `ANTHROPIC_API_KEY`; **gracefully falls back to template text if absent** (honours PRD §9.2 graceful-absence).
- **Each browser is its own sandbox** — deliberate, for demos. Every visitor gets private data.

### File map (`src/`)
| File | Role |
|---|---|
| `App.jsx` | Router + top-level layout |
| `shared.jsx` | `PALETTE`, `GlobalStyles`, `TopBarShell`, footer, date helpers |
| `data.js` | **All data layer.** localStorage CRUD, types, role/task templates, role definitions & responsibilities, role-conflict detection, comms (v5), activation (v6) |
| `Home.jsx` | Incident list / landing |
| `Dashboard.jsx` | **The main incident screen** (~1700 lines). CommandStrip, LeftRail (roles), CenterColumn (timeline+tasks), RightRail (severity/student/policy), and all drawers (student, policy, export, **comms**, **activation**, role-assign) |
| `NewIncident.jsx` | New incident flow |
| `Triage.jsx` | Guided triage |
| `Admin.jsx` | Staff management, role conflicts |

### Key data shapes (in `data.js`)
- `SEVERITY` — L1–L4 with labels/colours/tone.
- `INCIDENT_TYPES` — 14 types, each with `category`, `emp`, `defaultSeverity`.
- An **incident** object: `{ id, title, type, severity, status, isDrill, startedAt, closedAt, location, empSection, policies[], student, roles[], timeline[], tasks[], comms[]?, activation? }`.
- **Comms (v5):** `COMMS_CHANNELS`, `COMMS_AUDIENCES`, `COMMS_TEMPLATES` (holding statements attributed to MWHI), `COMMS_CATEGORIES`, `COMMS_STATUS`; helpers `templatesForIncidentType`, `fillTemplate`, `newComm`. A comm: `{ id, ts, templateId, name, audienceId, channels[], body, status: draft|approved|dispatched, approvedBy, approvedAt, dispatchedAt }`.
- **Activation (v6):** `ACTIVATION_CHANNELS` (Trinity App push + out-of-band SMS), `NOTIFY_STATUS` (sent|acked|no_response), `roleIsAssigned()`. State: `incident.activation = { declaredAt, declaredBy, channels[] }` + per-role `role.notify = { status, sentAt, ackedAt, viaBackup }`.
- **PIR (v7):** `PIR_STATUS` (draft|final), `newPIR()`, `newCorrectiveAction()`, `pirFacts(incident)` (auto-assembled stats). State: `incident.pir = { createdAt, status, summary, whatWorked, whatImprove, planUpdates, correctiveActions[] }`. AI draft via `api/draft.js` with `kind:"pir"` (returns JSON), graceful local fallback.
- **Decision Log (v8):** `DECISION_STATUS` (open|reviewed), `newDecision()`. State: `incident.decisions[] = { id, ts, decidedBy, decision, rationale, options, evidence, reviewBy, reviewedAt, outcome, status }`. "Decisions" drawer records immutable decisions with rationale/options/what-was-known + review point; logs a `decision` timeline entry; in Export pack. Answers "what decisions have been made?" (Phase 2.1, built 2026-07-06).
- **Red Folder Mode (Phase 2.4):** full-screen stress view — `redFolder` state in `Dashboard`; `RedFolderView` composes situation + critical actions (Copilot findings + open tasks, tappable) + active risks + latest decisions + key contacts. Pure composition of existing data — **no new schema**. Entered from the crimson "Red Folder" command-strip button; "Full detail" exits. (Built 2026-07-06.)
- **Crisis Copilot (v10):** `COPILOT_SEVERITY` (critical/important/advisory), `buildCopilotContext(incident,now)` (flat facts), `COPILOT_RULES[]` (17 declarative rules, each with id + `evaluate(ctx)`), `runCopilot(incident,now)` → findings `{ruleId, category, severity, issue, why, evidence, target}` sorted by severity. Rules-based, recommends only — never decides. Copilot drawer + command-strip count + COPILOT FINDINGS export section. **Future AI = append an AI rule to `COPILOT_RULES` over the same ctx; no schema change.** (Phase 2.3, built 2026-07-06.)
- **Risk/Watch Register (v9):** `RISK_CATEGORIES`, `RISK_SEVERITY` (low/medium/high/critical w/ rank), `RISK_STATUS` (watch/active/escalated/resolved), `newRisk()`, and helpers `riskIsOpen()` / `openRisks()` / `riskCounts()`. State: `incident.risks[] = { id, createdAt, updatedAt, title, description, category, severity, status, owner, reviewBy, resolvedAt, resolutionNotes }`. "Risks" drawer (watch→active→escalate→resolve) + **main-screen RightRail panel** (`RiskSummaryPanel`) + command-strip open count + `risk` timeline entries + RISKS export section. Answers "what risks remain?" (Phase 2.2, built 2026-07-06). **`openRisks()`/`riskCounts()` are the ready-made feeds for Red Folder Mode + Crisis Copilot — reuse, don't re-derive.**

---

## 5. Non-negotiables from the PRD (apply to all work)

- **Defining NFR:** must work when M365/power/network are down — offline mode, independent SMS gateway, **≥2 independent activation channels**. _"A tool unavailable during the incident it was built for is a failed tool."_
- **AI guardrails (§9.2):** human-in-command (every AI output is a _draft_, nothing auto-sent/auto-decided); separate facts from assumptions with sources; child-safeguarding exclusion (never used for training); prefer zero-retention/no-training providers; graceful absence (manual mode always works); transparency & override.
- Keep UI copy in **plain English, no finance/tech jargon** (general Nash preference across his tools).

---

## 6. The backend decision (the current fork)

Everything single-user works today. **M2 (activation) and M4 (dispatch) are the modules that most demand a real backend** — real alerts to real phones, multi-device acknowledgement, an immutable shared audit log, RBAC. That backend + an **SMS gateway** is the "architectural cliff."

**Choice, still open:**
- **Supabase** — Postgres + realtime + row-level security maps cleanly to the append-only audit log and RBAC the PRD wants.
- **Firebase** — consistency with the rest of Nash's TAC stack (most of his other tools use it).

_Decision deferred on purpose_ — build the backend once, after Annika's requirements (§7) firm up. Until then, keep prototyping breadth for the demo.

---

## 7. Annika's PRD feedback (product-owner review, June 2026)

31 comments, all clarifying questions or facts. **Dominant theme: real-world system integration.** Her biggest single concern: **SEQTA requires formal authorisation/documentation to integrate** (raised twice) — so **SEQTA integration is scoped as a SECONDARY priority, not a Phase 1 dependency.**

Facts she gave (now baked into the prototype's channel notes):
- **DigiStorm** is TAC's parent channel; parent mobile numbers live there.
- **Website** holding page is **built but hidden**, ready to publish.
- **Vivi** screens currently hold only evacuation/lockdown messaging — **not** critical-incident levels.
- **MWHI (Megan Whitshed)** already has holding statements drafted → seeded into M4 templates.
- **Planning Coordinator** initiates at incident start; **Recovery Coordinator** only at recovery — supports the PRD §13 role-deconfliction work.

**15 open questions were sent back to Annika** (email drafted this session) — these are hers to answer and unblock the build: SEQTA go/no-go & who owns authorisation; DigiStorm confirmation & number access; Vivi CI-level messaging; website go-live triggers; Teams vs platform; **incident-level (1–4) thresholds** (her call); escalation/assessment path; task oversight; role directory; access scope (all staff?); language data for translation; media/social monitoring; comms approval chain; the "Bounce" follow-up. **Several build decisions depend on her answers + on integration feasibility.**

---

## 8. Local workflow & gotchas

```bash
cd C:\Users\nash.clark\CIMPLE\CIMPLE_V2
npm install         # uses local .npmrc for SSL — see gotcha below
npm run dev         # http://localhost:5173
npm run build       # verify before pushing
git add ... && git commit -m "..." && git push   # Vercel deploys cimple-v2 (~90s)
```

- **SSL gotcha:** TAC's corporate network does SSL inspection — `npm install` fails with `SELF_SIGNED_CERT_IN_CHAIN`. A gitignored project-local `.npmrc` with `strict-ssl=false` works around it. **Don't delete it locally.**
- **Deploy = push to `main`.** No PR flow; `main` is the deploy branch.
- **Do NOT reference `cimple-dun.vercel.app`** — retired/abandoned project. The live URL is `cimple-v2.vercel.app`.
- To enable live AI drafting: set `ANTHROPIC_API_KEY` in the Vercel project env (Settings → Environment Variables). Model used: `claude-sonnet-5`.

---

## 9. Recommended next steps (in priority order)

1. **Get Annika's answers** to the 15 questions (§7) — especially incident-level thresholds and DigiStorm/SEQTA feasibility. Several builds are blocked on these.
2. **Decide the backend** (Supabase vs Firebase, §6) — the gate to making M2/M4 real.
3. **If prototyping breadth first (recommended before backend):** build the **PIR module (M7)** — AI-drafted post-incident review from the timeline — and/or **incident-level escalation logic (M1)** as a framework with placeholder thresholds for Annika to fill.
4. **Then** cross the backend cliff and wire M2/M4 to real dispatch + SMS gateway.

**Guiding principle:** the prototype is a UX/feedback tool. Don't let its current (localStorage, single-user, simulated) scope cap the PRD's scope. Build breadth to win stakeholder buy-in; build the backend once, when requirements are firm.
