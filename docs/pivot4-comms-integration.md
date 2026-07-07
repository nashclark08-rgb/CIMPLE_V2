# Pivot 4 — Communications: integrating the Crisis Communications Plan (MW)

_2026-07-07 · sources: TAC CIM & BCP V0.3 §6–10 (comms structure) + **Crisis Communications Plan – DRAFT (MW)** by Megan Whitshed, Marketing Manager (the operational comms content) + CIMPLE's existing M4 comms module._

## The reconciliation (done)
The CCP's **"Crisis Response Group (CRG)"** is not a new team — it is the CIMT's communications workstream. Mapped onto CIMPLE's roles:
- **CRG / Marketing Manager** (activates & runs comms) → **Communications Coordinator** (Megan Whitshed)
- **CRG Leader / sole spokesperson** → **Critical Incident Leader** (Adrian Johnson / Principal)
- **CRG** (the group) → the comms *workstream*, not a separate board.

CIMPLE does **not** introduce a competing "CRG" entity.

## 4A — Comms core · SHIPPED 2026-07-07
- **Media exposure Level 1–4** (CIM & BCP §7) — `COMMS_LEVELS`; picker + blurb in the Communications drawer; stored on `incident.commsLevel`; logged to the timeline.
- **Comms phases** (CCP: *At the start · If it persists · Recovery*, aligned to Assess→Stabilise→Remedy) — `COMMS_PHASES`; every template tagged with its phase.
- **Spokesperson & media-handling protocol** — `MEDIA_PROTOCOL` (single spokesperson = CIL; one voice; families before public; press-conference timing), `RECEPTION_SCRIPT` (don't comment / redirect / collect details / relay), `SOCIAL_RULES` (official message before any post; cancel scheduled posts; don't engage). Surfaced as a collapsible "Media handling & spokesperson" panel.
- **Extended stakeholder × channel model** — audiences add **ASC/AngliSchools, College Council, students, suppliers/contractors, neighbouring properties**; channels add **Facebook, Instagram, LinkedIn, phone/reception, newsletter, media release**.
- **Megan's script library** — folded into the template library, phase-tagged: Immediate alert · Holding (assessing) · Holding (families) · Parent email (avoid calling) · Media holding · Staff notice · Key messages (3 core) · Parent notification · All-clear. Approval now attributed to the actual Critical Incident Leader (spokesperson), not a placeholder.

## 4B — Media Q&A / FAQ builder · NEXT
- The CCP's **5 broad questions** (what happened · what caused it · what it means · who's responsible · what's being done to prevent recurrence) + **~35 specific journalist questions** → a live **Media Q&A prep tool**: the spokesperson drafts answers before facing media; becomes the **FAQ single-source-of-truth** referenced across channels.

## Cross-cutting (do NOT duplicate)
The CCP's "Working with families" / family-support-site / death-communication content overlaps with the Student Coordinator, Student Wellbeing Services Coordinator and the death procedures already built (Pivots 1 & 3). The **comms-specific** parts (families notified before media; liaison update flow) live in comms; the welfare/postvention logistics are referenced, not rebuilt.

## Draft-status caveat
The CCP is a DRAFT with MW's own placeholders ("not sure where it fits yet", "church? counselling", "St Philip's College doc"). Per the fidelity rule, CIMPLE surfaces these as fields to confirm rather than fabricating around them — flag for Megan's review.
