# CIMPLE

**Critical Incident Management Platform for Learning Environments**

A web-based platform for managing critical incidents in schools — guided workflows aligned with NSW / VIC / QLD Department of Education requirements.

## What it does

- Multi-incident dashboard with severity (L1–L4), live timer, presence
- 14 incident types across student / school-wide / external / death categories
- Auto-assigned roles, EMP references, and tasks per incident type
- Guided 5-question triage that creates incidents with recommended severity
- Full timeline with notes, actions, communications
- Student profile cards (read-only)
- Policy & EMP browser with AI summaries
- Audit-ready export pack
- Close & reopen with audit trail

## Data

Stored in your browser's localStorage. Each visitor gets their own private sandbox. No login, no backend.

## Built with

Vite + React + lucide-react. No backend — pure frontend, hosted on Vercel.

## Roadmap

- Sandbox training mode (PRD §15)
- Multi-user shared workspace (real backend)
- Decision tree engine (PRD §11)
- Post-incident review module (PRD §19)
- Re-enable AI communications drafting
