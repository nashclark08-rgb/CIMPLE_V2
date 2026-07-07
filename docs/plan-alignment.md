# CIMPLE ⇄ TAC CIM & BCP — Alignment analysis & revised direction

_2026-07-07 · source: **TAC Critical Incident & Business Continuity Management Plan, V0.3, 15 June 2026** (author: Bounce Readiness). This document is now CIMPLE's **backbone**. CIMPLE must become a living, digital instrument of this plan — not a parallel invention._

---

## 1. Headline verdict

CIMPLE is a **well-built tool aimed slightly off-centre**. Its command features (decision log, risk register, timeline, PIR, export, activation, blind spots, comms) are the right *kinds* of things — but its **core model was invented from a generic emergency-services template, not derived from TAC's actual plan.** The result: right instincts, wrong vocabulary, wrong role structure, and a whole third of the plan (Business Continuity) missing.

The fix is not a rebuild — it is a **re-basing**. Keep the engine; replace the content model with the plan's own structure, roles, checklists, and language so that using CIMPLE *is* executing the plan.

---

## 2. The central reframe — CIMPLE is a **CIMT** tool, not an **ECO** tool

The single most important finding. The plan draws a hard line (page 1, verbatim):

> _"This plan does not replace Trinity Anglican College Emergency Response Plan… The Emergency Response Plan has been specifically designed for use by the **Emergency Control Organisation** to protect life and preserve property."_

There are **two distinct teams**:
- **ECO / Warden Team** (Chief Warden, Floor Wardens, headcount, evacuation) → governed by the **Emergency Response Plan (ERP)** — the on-the-ground, protect-life layer.
- **CIMT / Critical Incident Management Team** (Critical Incident Leader + Coordinators, in a control room) → governed by **this plan** — the manage-the-whole-incident layer.

**CIMPLE today conflates the two.** It has "Floor Wardens", "Headcount Officer", "Search Coordinator", "Police Liaison" as internal roles — but those are **ECO roles**, not CIMT roles. They belong to the ERP, which the plan explicitly says it does not replace.

**➡ Direction:** CIMPLE must model the **CIMT** — the coordination/management layer that runs from the Control Room. The ECO/warden team becomes an **external actor CIMPLE liaises with** (a source of headcount/scene facts), not a set of roles inside CIMPLE. This is the reframe everything else follows from. It also cleanly matches what the plan already calls for in the Control Room setup checklist: _"Set up incident management program / software"_ — **CIMPLE is that software.** Its job is to be the CIMT's digital control room, complementing Teams + WhatsApp + the physical Boardroom, not competing with them.

---

## 3. What the plan actually is (the structure CIMPLE must mirror)

**A. CIMT roles (13)** — with named primary + alternate holders and mobiles:
Critical Incident Leader (Adrian Johnson) · Support Coordinator (Jessica Sevil) · Planning Coordinator (Annika Fairley) · Staff Coordinator (Stephanie Gardiner) · Student Wellbeing Services Coordinator (Stephanie Kiesel) · Student Coordinator (Simon Fairall) · College Services (Sharon Finlay) · Facilities (Matt Everon) · Communications Coordinator (Megan Whitsed) · Recovery Coordinator (Annika Fairley) · Recovery–IT (Scott Barlow) · Recovery–Curriculum (Nash Clark) · Recovery–Co-Curriculum (Jarrod Monaghan). Full alternate bench listed in the plan.

**B. Incident lifecycle (phases)** — the master checklist runs:
**Assessment → Activation → Response → Business Recovery → Business Resumption → Stand Down.** Each phase is a checklist of _Action · Responsible role · Reference · ✓_.

**C. Control Room** — Primary: Boardroom (Admin building); on-campus alt: Library; off-campus alt: CSU. A physical Resource Kit (ERP + CIMP copies, whiteboards, 5G dongle, encrypted password DB, etc.). Coordination via **Microsoft Teams** (channel per incident) + **WhatsApp** (initial CIMT stand-by alert).

**D. Role checklists (8 detailed)** — each role has a concrete responsibility list (these are the real "playbook tasks").

**E. Response procedures (17)** — specific action checklists for: Active Armed Offender · Asbestos · Bushfire · Chemical Release · Child Safety Incident · Civil Unrest · Construction Accident · Cyber Attack · Fire/Enviro/Bio/Radiological/Chemical · Health/Disease Outbreak · Lost Person or Group · Mass Evacuation/Relocation · Missing Student · Natural Disaster · Off-Campus Incident · Sabotage of Critical Facility · Suicide/Attempted Suicide/Death in the Community. **Crucially the plan states: most incidents use the general Escalation Checklist; the specific procedures only add unique steps.**

**F. Communications framework** — Comms exposure Levels 1–4; phases **Assess → Stabilise → Remedy**; the 5 strategic questions; a stakeholder × channel matrix; and ready scripts (Holding Statement, Parent Email, Parent SMS/App ×3, Supplier, Media Statement, Website, On-Hold). FAQ maintained as a timestamped "single source of truth".

**G. Business Continuity (Section Three)** — 5 Recovery Strategies (Loss of Key People · Loss of Campus Access · Loss of IT · Loss of Supplier · Loss of Utilities [water/electricity/gas]), each a **time-phased** checklist (Pre-disruption / 0–2h / 2–4h / 4–6h / 12–24h / Daily / 1wk+ / Ongoing). Plus Critical Business Functions with **RTOs**, Impact & Issues Assessment, staff/student Relocation Plans, alternate sites.

**H. Instruments / forms (appendices)** — Call Taker Form (intake) · Incident Log · **IAP / Briefing (SMEAC-style: Situation·Mission·Execution·Admin·Command/Comms·Safety)** · **SITREP** (per functional area → Planning Coordinator) · Debrief / PIR Template + structured PIR elements · CIMT Meeting Agendas · **Visual Boards (Facts · Assumptions · Issues · Actions)** · **People at Risk Log** · Counselling Centre Activation · Media Staging · Insurance Register.

---

## 4. Alignment scorecard

| Plan element | CIMPLE today | Verdict | Action |
|---|---|---|---|
| **CIMT role model (13 named roles + alternates)** | Generic ECO-style roles (Commander, Wardens, Liaisons) | ❌ Wrong model | **Replace** with the 13 CIMT roles + seed real roster |
| **ECO/warden separation** | Wardens live *inside* CIMPLE | ❌ Conflated | **Externalise** — ECO is a liaison input, not a CIMPLE role |
| **Phase lifecycle (Assess→Activate→Respond→Recover→Resume→Stand Down)** | Loose single flow | ⚠ Partial | **Restructure** incident around the 6 phases |
| **Master escalation checklist (per phase)** | Ad-hoc task list | ❌ Missing | **Build** as the spine; specific procedures layer on top |
| **Role checklists (task content)** | Invented `PLAYBOOK_TASKS` (my NSW-validated set) | ⚠ Good but not the plan's | **Re-base** onto plan's checklists; keep my statutory hooks as an *enrichment layer* |
| **17 response procedures** | 19 invented types | ⚠ Overlap, wrong taxonomy | **Remap** to the plan's 17 + note "most use the general checklist" |
| **Comms framework (levels, Assess/Stabilise/Remedy, matrix, scripts)** | Comms module w/ MWHI, channels, AI draft | ⚠ Partially aligned | **Adopt** the plan's exact scripts, levels, stakeholder matrix, FAQ-SSOT |
| **Business Continuity (recovery strategies, CBF/RTO, relocation)** | None | ❌ Entirely missing | **New module** (charter decision — see §6) |
| **Call Taker intake** | Triage flow | ⚠ Close | Re-shape triage to the Call Taker questions |
| **IAP / SITREP** | Briefing packs | ⚠ Partial | Add SMEAC IAP + per-role SITREP |
| **Visual Boards (Facts/Assumptions/Issues/Actions)** | Scattered across drawers | ❌ Missing as a board | **Build** the four-quadrant live board |
| **People at Risk Log** | None | ❌ Missing | **Build** (affected persons, condition, NoK) — core to plan |
| **Incident Log / timeline** | Timeline exists | ✅ Aligned | Map fields to plan's log |
| **Decision Log** | Exists | ✅ Bonus (plan implies, doesn't template) | Keep |
| **Risk / Watch Register** | Exists | ✅ Bonus | Keep |
| **PIR / Debrief** | Exists (AI-drafted) | ⚠ Re-map | Align to the plan's PIR elements + "within 7 days" |
| **Export pack** | PDF/JSON | ✅ Strong | Re-target to produce the plan's document set |
| **Activation / notification cascade** | Simulated 2-channel | ✅ Right idea | Align to Teams/WhatsApp reality; real sends need backend (D2) |
| **Escalation contacts (Council Chair, AngliSchools CEO, AISNSW)** | Generic "head office" | ❌ Missing | Hard-wire the real escalation chain |
| **Control Room (Boardroom/Library/CSU) + Resource Kit** | None | ❌ Missing | Add Control-Room activation checklist + kit |

**Net:** ~40% aligned in spirit, but the two load-bearing pillars — the **role model** and the **phase/checklist spine** — need re-basing, and **Business Continuity is absent**.

---

## 5. Revised direction — the pivots

**Pivot 0 · Reposition.** CIMPLE = "the CIMT's digital control room / the incident-management software the plan calls for." Separate CIMT (CIMPLE) from ECO (ERP). Relabel/replace warden roles as ECO-liaison inputs.

**Pivot 1 · Roles & roster.** Replace the role model with the 13 CIMT roles; seed the real primary + alternate roster (names, positions, mobiles) from the plan. Auto-allocation now allocates *real people*. (Contact numbers are sensitive — store per the backend/RBAC work, not hard-coded in the repo.)

**Pivot 2 · Phase-driven workflow.** Restructure the incident around Assessment → Activation → Response → Business Recovery → Business Resumption → Stand Down. Each phase presents the plan's master checklist (Action · Responsible · Reference · ✓), auto-owned by the responsible CIMT role.

**Pivot 3 · Checklists as the task engine.** The plan's **role checklists** + **17 response-procedure action lists** become CIMPLE's task source of truth (superseding the invented `PLAYBOOK_TASKS`). Keep my NSW-validated statutory hooks (SafeWork 13 10 50, DCJ 132 111, OCG, ACSC 1300 CYBER1, OAIC, Hazards Near Me, etc.) as an **enrichment layer** that annotates the plan's steps — the plan is deliberately thin on some statutory specifics, so this makes CIMPLE *more* useful without contradicting it.

**Pivot 4 · Communications alignment.** Adopt the plan's comms Levels 1–4, Assess/Stabilise/Remedy phases, the stakeholder × channel matrix, and the **exact scripts** (Holding Statement, Parent Email/SMS, Supplier, Media, Website, On-Hold). FAQ as timestamped single-source-of-truth. This supersedes CIMPLE's invented templates (which were already partly right — MWHI, Vivi, DigiStorm/App).

**Pivot 5 · Instruments.** Digitise the plan's tools as living forms: Call Taker intake · SMEAC IAP · per-role SITREP · **Visual Boards (Facts/Assumptions/Issues/Actions)** · **People at Risk Log** · CIMT Meeting Agendas · Debrief/PIR mapped to the plan's PIR elements. Export pack assembles the plan's full document set.

**Pivot 6 · Business Continuity module** _(needs the charter decision in §6)._ Add Section Three: the 5 time-phased Recovery Strategies, Critical Business Functions + RTOs, Impact & Issues Assessment, Relocation Plans. This is the largest new build and the current single biggest gap.

**Governance · Rewrite `SCOPE.md`.** CIMPLE's north star becomes: _"Faithfully operationalise the TAC CIM & BCP so that using CIMPLE is executing the plan."_ New test for every feature: **"Does this help the CIMT execute the plan?"** Plus a **fidelity rule**: CIMPLE must never invent procedure that contradicts the plan; where the plan has `[insert]` placeholders (it has many — it's V0.3), CIMPLE surfaces them as fields for TAC to complete rather than fabricating content.

---

## 6. Charter reconciliation — the one decision (Business Continuity)

There is a real tension to resolve. The existing scope charter ([[feedback_cimple_scope_charter]]) says CIMPLE is an **incident-management platform ONLY — explicitly NOT a business-continuity or resilience platform.** But the backbone document is the _"Critical Incident **and Business Continuity** Management Plan"_ and treats Response → Recovery → Resumption as **one continuum**.

These can be reconciled: the earlier charter was guarding against *inventing* out-of-scope scope. Here the scope comes **from the authoritative plan itself** — which is different. If CIMPLE is to be "a living artefact of this document," Business Continuity is in-scope **because the plan defines it as part of critical-incident management.**

**Recommendation:** Absorb Business Continuity, but **phased last** (Pivot 6), after the incident-management re-basing (Pivots 0–5) which is higher-frequency and higher-value. This keeps CIMPLE faithful to the whole plan without stalling the core.

**This is Nash's call** and it updates the charter memory either way.

---

## 7. Fidelity principles (new, permanent)

1. **The plan is the source of truth.** CIMPLE's content is derived from it, versioned against it (currently V0.3), and never contradicts it.
2. **CIMT, not ECO.** CIMPLE manages the incident; the ERP/warden team protects life. CIMPLE liaises with the ECO; it does not contain it.
3. **Enrich, don't override.** Statutory/best-practice detail may *annotate* the plan's steps; it may not replace them.
4. **Surface placeholders, don't fabricate.** Where the plan says `[insert]`, CIMPLE prompts TAC to complete it.
5. **Complement the toolchain.** CIMPLE sits alongside Teams, WhatsApp, Vivi, the App, SEQTA and the Boardroom — it is the structured control-room record, not a replacement for them.

---

## Progress (live)

- ✅ **Pivot 0 · Reframe** — CIMT-not-ECO reframe locked; `SCOPE.md` v2 (plan-fidelity charter). _2026-07-07_
- ✅ **Pivot 1 · Roles & roster** — 13 CIMT roles replace the generic ones; real 25-person TAC roster seeded (names/positions, no mobiles); auto-allocation fills real people + backups; CIMT role checklists (§4.2–4.9) are the baseline task source. _2026-07-07_
- ✅ **Pivot 2 · Phase lifecycle** — 6-phase spine (Assessment→…→Stand Down) with the plan's 57-item master checklist (Action · responsible role · reference · mandatory); PhaseStepper + PhaseDrawer in the Dashboard. _2026-07-07_
- ✅ **Pivot 3 · Checklists as task engine** — `RESPONSE_PROCEDURES` (plan §5.x type-specific steps + NSW statutory hooks) mapped to CIMT roles for all 19 types; task board + role responsibilities compose type-specific + baseline; legacy `PLAYBOOK_TASKS`/`ROLE_RESPONSIBILITIES` deleted. _2026-07-07_
- ✅ **Pivot 4 · Communications** — **COMPLETE** _2026-07-07_ (fuses CIM & BCP §6–10 + Megan Whitshed's Crisis Communications Plan). 4A: exposure Levels 1–4, comms phases, spokesperson/media-handling protocol + reception script + social guardrails, extended stakeholder×channel model, MW's phase-tagged script library. 4B: Media Q&A / FAQ builder (5 categories / 35 journalist questions → FAQ single-source-of-truth). See `docs/pivot4-comms-integration.md`.
- 🟡 **Pivot 5 · Instruments** — **core SHIPPED** _2026-07-07_: Instruments hub (§16) with **Visual Boards** (Facts/Assumptions/Issues/Actions), **People at Risk Log** (+ Blind Spots critical rule for unaccounted persons), **SITREP**, and the **SMEAC Incident Action Plan**; all in the export pack. **Remaining (lighter):** Call Taker intake, CIMT Meeting Agendas, PIR re-mapped to the plan's PIR elements.
- ✅ **Pivot 6 · Business Continuity** — **SHIPPED** _2026-07-07_: Continuity drawer with the 5 time-phased recovery strategies (§11), the Critical Business Functions register + RTOs (§13, from the BIA), and the 6-dimension Impact Assessment (§12); Blind Spots REC-03 (recovery phase, no strategy) + export coverage.

**Re-basing complete** — CIMPLE is now a living instrument of the TAC CIM & BCP across the whole incident lifecycle (command · phases · procedures · communications · instruments · continuity). Small remainder: the 3 lighter Pivot-5 instruments (Call Taker intake, CIMT Meeting Agendas, PIR re-mapped to §16.4 elements).

## 8. Recommended sequence

1. **Agree the reframe** (Pivot 0) + the BC charter decision (§6).
2. **Pivot 1 (roles/roster)** and **Pivot 2 (phases)** together — they are the structural spine; everything hangs off them.
3. **Pivot 3 (checklists)** — port the plan's role checklists + response procedures.
4. **Pivot 4 (comms)** + **Pivot 5 (instruments)** — high-value, mostly content + forms.
5. **Pivot 6 (Business Continuity)** — the new module, if in scope.
6. **Rewrite `SCOPE.md`** to the plan-fidelity charter at step 1 so all subsequent work is governed by it.

This re-bases CIMPLE from "an impressive generic incident tool" to "the digital form of TAC's own plan" — which is exactly the pivot Nash has asked for. The Increment-D Firebase backend already in flight is *more* justified now: a CIMT running from a control room across many devices, mirroring Teams, needs real multi-user + audit, not localStorage.
