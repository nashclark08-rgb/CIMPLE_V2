# CIMPLE — Task Library: sources & grounding

_Design-time research, 2026-07-06. The task library (`PLAYBOOK_TASKS` in `src/data.js`) is CIMPLE's **permanent offline knowledge base**. It is NOT fetched live during an incident — the source of truth during an incident remains TAC's Critical Incident & Business Continuity Plan and EMPs. This document records the authoritative guidance used to build and validate the incident playbooks. **All 19 incident types are now covered**; the 6 priority types (Missing Student, Child Protection, Medical, Lockdown, Death On Campus, Cyber) were validated in depth against the sources below, and the remaining 13 reuse the same statutory hooks and structure._

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

_Terminology note: AIIMS uses **Incident Controller**; CIMPLE uses "Incident Commander" for the same role. "Risk of Significant Harm (ROSH)", "notifiable incident", "eligible/notifiable data breach", and "reportable death" are the exact statutory phrases._
