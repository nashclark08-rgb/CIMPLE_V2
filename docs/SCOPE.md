# CIMPLE — Scope Charter (v2, plan-fidelity)

_The single test every feature must pass. Set by Nash Clark (product owner). v1 2026-07-06 (incident-management-only). **v2 2026-07-07 — re-based onto the TAC Critical Incident & Business Continuity Management Plan (CIM & BCP V0.3, 15 June 2026), which is now CIMPLE's backbone.** See `docs/plan-alignment.md` for the full analysis behind this rewrite._

## Purpose (north star)

CIMPLE exists to **operationalise the TAC Critical Incident & Business Continuity Management Plan** — to be its living, digital form.

> **Using CIMPLE *is* executing the plan.**

CIMPLE is the **CIMT's digital control room**: the incident-management software the plan itself calls for (Control Room activation step: _"set up incident management program / software"_). It sits alongside Microsoft Teams, WhatsApp, the Trinity App, Vivi, SEQTA and the physical Boardroom — it structures and records the CIMT's work; it does not replace those tools.

## The one reframe that governs everything — CIMT, not ECO

The plan is explicit (page 1): it **does not replace the Emergency Response Plan (ERP)**, which governs the **Emergency Control Organisation (ECO / warden team)** — the on-the-ground, protect-life layer.

- **CIMPLE models the CIMT** — the Critical Incident Leader + Coordinators who *manage* the whole incident.
- **The ECO / wardens are an external actor** CIMPLE *liaises with* (a source of headcount/scene facts) — **not** roles inside CIMPLE.

Any feature that pulls CIMPLE down into warden/evacuation/on-the-ground execution is out of scope: that is the ERP's job.

## The scope test (apply to every proposed feature)

> **"Does this help the CIMT execute the TAC CIM & BCP?"**

- **Yes →** in scope.
- **No →** out of scope — even if it "would be useful."

## Fidelity principles (permanent)

1. **The plan is the source of truth.** CIMPLE's roles, phases, checklists, procedures, scripts and forms are *derived from the plan*, versioned against it (currently V0.3), and must never contradict it.
2. **CIMT, not ECO** (see above).
3. **Enrich, don't override.** Statutory / best-practice detail (SafeWork 13 10 50, DCJ 132 111, OCG reportable conduct, ACSC 1300 CYBER1, OAIC, Hazards Near Me, Poisons 13 11 26, safe-messaging, etc.) may *annotate* the plan's steps where the plan is thin — it may not replace or reorder them.
4. **Surface placeholders, don't fabricate.** The plan is V0.3 with many `[insert]` gaps and some template residue (e.g. Victorian contacts). Where the plan is incomplete, CIMPLE presents a field for TAC to complete — it never invents authoritative content.
5. **Complement the toolchain.** CIMPLE is the structured control-room record, not a competitor to Teams/WhatsApp/App/Vivi/SEQTA.

## Scope boundary — now that the backbone is the CIM & BCP

**In scope** — everything the plan covers as part of critical-incident management:
- The full **incident lifecycle**: Assessment → Activation → Response → Business Recovery → Business Resumption → Stand Down.
- **Business Continuity (Section Three)** — recovery strategies, Critical Business Functions + RTOs, relocation, resumption. _This is now IN SCOPE_ because the plan defines it as integral to critical-incident management. (This supersedes v1's "not a business-continuity platform" exclusion — v1 was guarding against *inventing* scope; here the scope comes from the authoritative plan.) **Sequencing: built LAST, after the incident-management re-basing (Pivots 0–5).**

**Still out of scope** — anything the plan does not treat as CIMT work:
- ECO / warden / evacuation execution (that is the ERP).
- Peacetime school **operations, student management, HR, general compliance, analytics/BI** that do not serve an active incident or the plan's recovery phases.
- Training/drill simulators, cross-incident analytics, long-tail wellbeing aftercare — unless a direct in-incident or plan-recovery justification exists.

When a feature has an out-of-scope version and a genuine in-plan sliver, build **only** the in-plan sliver.

## The re-basing roadmap (the pivots — see `docs/plan-alignment.md`)

1. **Pivot 0 · Reframe** — CIMPLE = CIMT digital control room; ECO externalised. _(This charter.)_
2. **Pivot 1 · Roles & roster** — replace generic roles with the plan's **13 CIMT roles** + real primary/alternate roster (names, positions, mobiles — contacts stored under the backend/RBAC work, not hard-coded).
3. **Pivot 2 · Phase lifecycle** — restructure the incident around the 6 phases, each driven by the plan's master checklist (Action · Responsible role · Reference · ✓).
4. **Pivot 3 · Checklists as task engine** — the plan's role checklists + 17 response procedures become the task source of truth (superseding the invented `PLAYBOOK_TASKS`; keep the NSW statutory hooks as an enrichment layer).
5. **Pivot 4 · Communications** — adopt the plan's comms Levels 1–4, Assess/Stabilise/Remedy, stakeholder × channel matrix, and exact scripts; FAQ as timestamped single-source-of-truth.
6. **Pivot 5 · Instruments** — Call Taker intake · SMEAC IAP · SITREP · Visual Boards (Facts/Assumptions/Issues/Actions) · People at Risk Log · CIMT Meeting Agendas · Debrief/PIR mapped to the plan's PIR elements · Export = the plan's document set.
7. **Pivot 6 · Business Continuity** — the 5 time-phased recovery strategies, Critical Business Functions + RTOs, Impact & Issues Assessment, relocation. _Built last._

## The command test (retained as a UX heuristic, subordinate to plan fidelity)

The plan's control-room "visual boards" (Facts · Assumptions · Issues · Actions) plus the phase checklists must let a CIMT member opening CIMPLE immediately know: what is happening · who is responsible (which CIMT role) · what the plan says to do next · who has been notified · what decisions/comms are approved · what risks/impacts remain · progress through the phases. These are now *answered through the plan's own instruments*, not invented widgets.

## What already aligns (keep)

Decision Log, Risk/Watch Register, live timeline (= Incident Log), Activation/notification cascade, PIR/export, the comms module (partly aligned — MWHI/Vivi/App), Blind Spots, Red Folder Mode. These are retained and re-mapped onto the plan's structure rather than discarded. The Increment-D **Firebase backend** (in flight) is *more* justified under this charter: a CIMT running from a control room across many devices, mirroring Teams, needs real multi-user + audit, not localStorage.
