# CIMPLE — Task Library: sources & grounding

_Design-time research, 2026-07-06 (validation extended 2026-07-07). The task library (`PLAYBOOK_TASKS` in `src/data.js`) is CIMPLE's **permanent offline knowledge base**. It is NOT fetched live during an incident — the source of truth during an incident remains TAC's Critical Incident & Business Continuity Plan and EMPs. This document records the authoritative guidance used to build and validate the incident playbooks. **All 19 incident types are now covered and validated against primary sources** — the original 6 priority types plus the remaining 13, each checked against NSW authorities on 2026-07-07 (corrections folded in; see changelog below)._

## Important context: independent school
Trinity Anglican College is an **independent** school. NSW Department of Education *internal* mechanisms (e.g. the DoE Incident Report & Support Hotline **1800 811 523**, DoE policy codes) do **not** bind TAC — its critical-incident support body is **AISNSW**. All **statutory** obligations below apply regardless of sector.

## Key statutory numbers (hard-coded into the library)
| Purpose | Contact / timeframe |
|---|---|
| Emergency | **000** |
| Child protection — Risk of Significant Harm (ROSH) | **DCJ Child Protection Helpline 132 111**, as soon as practicable |
| Reportable Conduct (allegation vs staff) | **Office of the Children's Guardian — within 7 business days** (+ 30-day entity report) |
| Serious injury / death (work health & safety) | **SafeWork NSW 13 10 50** immediately; preserve scene |
| Notifiable disease / outbreak | **NSW Health Public Health Unit 1300 066 055** |
| Data breach of personal information | **OAIC — Notifiable Data Breaches scheme**: assess ≤30 days (max), notify OAIC + individuals as soon as practicable |
| Cyber incident | **ReportCyber (cyber.gov.au)**; ransom-payment 72-hr report under Cyber Security Act 2024 (if turnover threshold met) |
| Reportable death | **Coroner (via NSW Police)** — reportable/examinable deaths |

## Design rules baked in
- **Child protection: report, don't investigate.** No role questions the child, confronts/warns the alleged person, or gathers "proof." Standing a staff member down is a *risk-management* step, not a disciplinary finding.
- **Two child-protection schemes are distinct and can run in parallel:** ROSH (DCJ 132 111) vs Reportable Conduct (OCG, 7 business days).
- **SafeWork scene preservation** allows still aiding the injured and making the area safe.
- **Data breach:** the 30 days is for *assessment*; notification is "as soon as practicable" once there are reasonable grounds.
- **Death / suspected suicide:** next-of-kin notified in person, coordinated with Police; public/internal messaging follows safe-messaging (Mindframe — no method/location/detail).
- **Lockdown:** instruct families **not to attend or phone**; account for visitors/contractors; only Police confront an intruder.
- **Missing student:** confirm the student arrived at all (roll cross-check); check custody/AVO flags before calling a parent; preserve gate CCTV; escalate to Police early on any welfare concern (no arbitrary wait).

## Sources
- Child Protection — Mandatory reporting & the Mandatory Reporter Guide (MRG) — NSW Dept of Education / DCJ
- DCJ Child Protection Helpline (132 111)
- Reportable Conduct Scheme — NSW Office of the Children's Guardian (Children's Guardian Act 2019); OCG Fact Sheet 13 (Police interface)
- Incident notification & notifiable incidents — SafeWork NSW (13 10 50)
- Notifiable Data Breaches (NDB) scheme, Part 4 — OAIC (Privacy Act 1988)
- Report a cyber security incident — ASD/ACSC (cyber.gov.au); Cyber Security Act 2024 (ransomware-payment reporting)
- Reporting a notifiable disease — NSW Health; Public Health Unit 1300 066 055 (Public Health Act 2010)
- When a death must be reported to the Coroner — Coroners Court of NSW
- Critical incident guidelines / Crisis & Issues Management — AISNSW (the relevant support body for TAC)
- AIIMS (Australasian Inter-Service Incident Management System, AFAC) & AIDR Knowledge Hub — incident-command structure (Control/Planning/Operations/Logistics; single Incident Controller; span of control)
- Emergency warnings — **Hazards Near Me NSW** (NSW RFS app, renamed from "Fires Near Me" Feb 2023); NSW SES (132 500); Bureau of Meteorology
- Hazardous materials — evacuate upwind/uphill/upstream (NSW RFS / ANZ Emergency Response Guidebook); **Poisons Information Centre 13 11 26**
- Gas emergencies — Australian Gas Networks (AGN) Albury distribution network: **1800 GAS LEAK (1800 427 532)** (NOT Jemena — Jemena covers Sydney/other NSW, not Albury)
- School-notifiable diseases & exclusion periods — NSW Health ("Reporting notifiable diseases – schools and child care facilities"; "School exclusion periods")
- Ban Notice / barring a person from school grounds — **Inclosed Lands Protection Act 1901 (NSW)** s4 (written, principal-signed, served; retain proof of service)
- Armed/active-offender response — **"Escape. Hide. Tell."** (NSW Police) — escape-first when a safe route exists
- Bus/transport safety occurrences — **OTSI Duty Officer 1800 677 766** (immediate) + Transport for NSW (within 3 days); duty sits on the bus operator
- Suicide postvention & safe-messaging — Mindframe/Everymind; headspace Suicide Postvention Toolkit for schools; Delphi postvention guidelines (no whole-school assembly, no glamorising memorials, identify at-risk students, include help-seeking info, do not state cause of death)

## Changelog — 2026-07-07 validation pass (remaining 13 types)
Four parallel research agents checked all 13 non-priority playbooks against the primary sources above. Corrections folded into `PLAYBOOK_TASKS`:
- **natural_disaster:** "Fires Near Me" → "Hazards Near Me NSW".
- **infrastructure:** added gas-leak safe sequence (no switches/phones/flames; ventilate; evacuate) + site-correct gas line 1800 GAS LEAK (1800 427 532); added SafeWork 13 10 50 dangerous-incident duty.
- **hazmat:** exclusion zone now "upwind AND uphill"; added Poisons Information Centre 13 11 26; added SafeWork 13 10 50 dangerous-incident duty.
- **evacuation:** added SafeWork 13 10 50 notification for death/serious injury/dangerous incident.
- **disease_outbreak:** scoped the school's notify duty to the NSW Health school-notifiable list (+2 linked gastro cases), "as soon as possible"; added exclusion-period enforcement step.
- **parent_aggression:** "trespass notice" → written, principal-signed **Ban Notice** (ILPA 1901); added record-service-of-notice step.
- **external_threat:** named the **Escape. Hide. Tell.** doctrine (escape-first when safe).
- **transport:** broadened SafeWork trigger (notifiable incident arising from the school's activity, covers students/public + dangerous incidents, immediate); added OTSI 1800 677 766 + Transport for NSW 3-day bus duty.
- **excursion:** added the missing SafeWork 13 10 50 notification (present in transport, omitted here).
- **mental_health:** "risk of harm" → exact statutory **Risk of Significant Harm (ROSH)**; added safe-messaging caveat (don't broadcast method).
- **behavioural:** added a ROSH determination/report step (was absent); reframed evidence-gathering tasks to welfare/observation ("manage, don't investigate").
- **bullying:** confirmed NO standalone statutory reporting duty (correct as built); reframed "interview others involved / record all parties" so we don't investigate an alleged party where it may be a child-protection/Police matter.
- **death_offcampus:** added "do not state/speculate cause of death (Coroner's role)", help-seeking info in comms, no-whole-school-assembly, non-glamorising memorials, and identify/monitor at-risk students beyond close friends/siblings.

_Terminology note: AIIMS uses **Incident Controller**; CIMPLE uses "Incident Commander" for the same role. "Risk of Significant Harm (ROSH)", "notifiable incident", "eligible/notifiable data breach", and "reportable death" are the exact statutory phrases._
