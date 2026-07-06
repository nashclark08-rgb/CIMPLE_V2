# CIMPLE — Capability Assessment & Roadmap

_Lead product architect · 2026-07-06 · governed by `SCOPE.md`_

Single test applied to everything below: **"Does this materially improve the management of an active incident?"** Scope verdicts: **Core** (directly answers one of the nine "immediately know" questions / is command-critical), **Supporting** (helps an in-scope function but is secondary), **Out of Scope** (fails the test).

---

## Capability assessments

### 1. Decision Log — **CORE**
- **A. Purpose.** Capture leadership decisions with rationale, evidence, options considered, and a review point — decisions, not just actions.
- **B. Incident-management value.** Answers *"What decisions have been made?"* Forces a half-second of deliberate judgement under pressure; becomes the defensibility record afterwards.
- **C. User story.** _As Principal, I record "held parent notification 12 min pending police advice — rationale: avoid contaminating a crime scene" so my judgement is defensible later._
- **D. Data required.** Decision text, decider, timestamp, options considered, evidence links (timeline/comms/roles), assumptions, review-by time, outcome.
- **E. Complexity.** Low. No backend (new timeline entry type + fields).
- **F. Risks.** Friction under load — keep to two taps; must be immutable; AI may *structure* wording but must never author the decision (Principle 2).
- **G. MVP.** A "Decision" entry type in the existing timeline: decision + rationale + review-by, visually distinct, always in the export.
- **H. Future.** Review-by reminders; "what did we know at T?" reconstruction; decisions surfaced in PIR and Red Folder; cross-incident decision patterns (in-incident support only).
- **I. Scope.** **Core** — decision-making + accountability + defensibility; fills an unbuilt "immediately know" gap.

### 2. Risk / Watch Register — **CORE**
- **A. Purpose.** Track unresolved risks, emerging concerns, and active monitoring items, each with an owner and status.
- **B. Incident-management value.** Answers *"What risks remain?"* Keeps live threats visible so nothing quietly festers; core situational awareness.
- **C. User story.** _As commander, I log "Year 7 sibling unaccounted" and "weather deteriorating" as watch items with owners; they stay visible until cleared._
- **D. Data required.** Risk text, simple severity/likelihood, owner, status (open / monitoring / closed), timestamp, linked actions.
- **E. Complexity.** Low. No backend.
- **F. Risks.** List bloat; needs a crisp close/escalate path; resist over-engineering a formal risk matrix.
- **G. MVP.** A Risks panel on the incident: add / assign / close risk items; open count in the command strip; included in export.
- **H. Future.** Link risks → tasks/decisions; escalate a risk into a severity change; Blind Spots suggests likely risks by incident type.
- **I. Scope.** **Core** — situational awareness; fills an unbuilt "immediately know" gap.

### 3. Blind Spots — **CORE**
- **A. Purpose.** Context-aware assistant that flags likely omissions and incomplete expected actions for the incident type. Recommends, never decides.
- **B. Incident-management value.** Answers *"What needs to happen next?"* Catches the omissions hindsight punishes; decision support at the point of action.
- **C. User story.** _As Principal in a Missing Student incident, a quiet panel notes "CCTV not checked, police not notified" — I act on it or dismiss it._
- **D. Data required.** Per-incident-type expected-action templates (already exist via `DEFAULT_TASKS`/role templates), current task/role/comms/activation state, elapsed time.
- **E. Complexity.** Medium. MVP is rules-based and needs no backend; the timeline-reading version comes later.
- **F. Risks.** Alarm fatigue and false gaps — must be quiet, high-precision, dismissible, and never block the human; must never appear to make the decision.
- **G. MVP.** Static per-type expected-action list diffed against current incident state → "not yet done" + time-sensitive nudges.
- **H. Future.** AI reads the live timeline to infer gaps beyond the static list ("you mentioned a sibling — welfare checked?"); learns from PIRs; consumes the Risk Register.
- **I. Scope.** **Core** — decision support; the operationalisation of the plan itself.

### 4. Red Folder Mode — **CORE**
- **A. Purpose.** A stress-optimised interface showing only: current situation, key contacts, critical actions, latest decisions, active risks.
- **B. Incident-management value.** Makes the entire command picture graspable and actionable when cognitive bandwidth collapses; command and control distilled.
- **C. User story.** _As Principal in the first five minutes of a lockdown, one high-contrast screen shows the next three actions and the one number to call._
- **D. Data required.** Current incident state, next-actions (Blind Spots), key contacts, latest decisions (Decision Log), active risks (Risk Register) — all in-app.
- **E. Complexity.** Low–Medium (front-end composition). No backend. **Depends on Decision Log + Risk Register for its content.**
- **F. Risks.** Hiding information can hide something needed — full detail must be one tap away; picking the right five elements is the whole design.
- **G. MVP.** A toggle switching the dashboard to a large-type, high-contrast, five-block view.
- **H. Future.** Auto-engages at L4; voice ("what's next?"); works fully offline on a phone.
- **I. Scope.** **Core** — incident command; the signature C2 surface.

### 5. Dynamic Role Replacement — **SUPPORTING**
- **A. Purpose.** Recommend qualified, available, non-conflicted alternates when key personnel are unavailable.
- **B. Incident-management value.** Answers *"Who is responsible?"* when the plan's named people aren't on site; coordination.
- **C. User story.** _As commander, the Wellbeing Lead is off-site; CIMPLE suggests the best alternate and re-notifies them._
- **D. Data required.** Staff directory (qualifications, availability), current-day roster, role-conflict rules (partly exist).
- **E. Complexity.** Low (extends the existing conflict + backup + failover engine). Live-roster version needs backend/integration.
- **F. Risks.** Suggestions only, human confirms; availability data must be current.
- **G. MVP.** "Suggest alternate" on any role from qualifications + availability + conflict rules; one-tap reassign + re-notify.
- **H. Future.** Live roster/absence integration (SEQTA/iCHRIS) so "who's on site today" is real.
- **I. Scope.** **Supporting** — enhances coordination; core role assignment already exists.

### 6. Media Exposure Radar — **SUPPORTING** (MVP only; automated version borderline)
- **A. Purpose.** Track media interest and communication risk during the incident.
- **B. Incident-management value.** Informs comms timing and decisions (bring the holding statement forward); situational awareness feeding communications.
- **C. User story.** _As Comms Lead, I mark exposure rising and escalate the media holding statement._
- **D. Data required.** MVP: a manually-set exposure level. Future: external news / permitted social feeds.
- **E. Complexity.** MVP Low; automated High + backend + external feeds + cost.
- **F. Risks.** Cannot scrape private groups or monitor minors (safeguarding/legal); false positives; **scope-drift toward reputational analytics** — keep it strictly an in-incident comms/risk input.
- **G. MVP.** Manual exposure level (none / emerging / active / high) tied to comms escalation and a linked risk item.
- **H. Future.** Permissioned public-source monitoring with human triage.
- **I. Scope.** **Supporting** for the manual MVP. The automated build is **Out of Scope unless** it remains purely an in-incident comms decision input (not a reputational BI dashboard).

### 7. Parent Communication Demand Monitor — **SUPPORTING**
- **A. Purpose.** Monitor communication load — enquiry volume and time-since-last-update — to support incident comms decisions. Not sentiment analysis.
- **B. Incident-management value.** Paces the parent-communication effort (the most common school-crisis failure point); communications.
- **C. User story.** _As Comms Lead, enquiries spike and "last update 40 min ago" tells me to push an update now._
- **D. Data required.** Inbound enquiry counts (front office / app / phone), time since last outbound update, FAQ hits. **Not** individual sentiment.
- **E. Complexity.** MVP Low (manual tally + clock); automated Medium–High + DigiStorm/phone integration (backend).
- **F. Risks.** Must not drift into anxiety/sentiment surveillance — keep it volume/demand-based.
- **G. MVP.** Manual enquiry tally + last-update clock + suggested next-update time.
- **H. Future.** Automatic volume from DigiStorm/phone; FAQ-gap detection ("30 parents asked about pickup — publish an answer").
- **I. Scope.** **Supporting** — a communications decision aid.

### 8. Live Lessons Capture — **SUPPORTING** (weakest; defensible to exclude)
- **A. Purpose.** Capture lessons/observations during the incident for later PIR generation.
- **B. Incident-management value.** Feeds the in-scope PIR (M7). Honestly: it does **not** improve the *active* response itself — it is the weakest candidate against the single test.
- **C. User story.** _As a warden, I flag "C-Block key didn't work" in two taps mid-incident; it lands in the PIR automatically._
- **D. Data required.** An "observation" entry type, author, timestamp, category, links.
- **E. Complexity.** Low (extends the timeline + the already-built PIR). No backend.
- **F. Risks.** Must be near-zero friction or it won't be used; must not distract from the response.
- **G. MVP.** An "observation / improvement" quick-capture feeding the PIR's "what could improve" and corrective actions.
- **H. Future.** Cluster observations into themes; propose plan amendments — kept incident-linked, never a training platform.
- **I. Scope.** **Supporting**, lowest priority. It earns a place only because it cheaply feeds the in-scope PIR; being ruthless, it is defensible to defer until PIR use proves demand.

---

## Out of scope (confirmed excluded)

Per charter, and reconfirmed here: student management, custody management (beyond an in-incident "linked people/do-not-contact" flag), long-term wellbeing programs, compliance automation, drill/training platforms, readiness scoring, organisational performance analytics, school administration, general-purpose workflow. Timeline Replay (training/governance) and cross-incident analytics are also out.

---

## Final questions

**1. Which capability should be built next, and why?**
**Decision Log.** It fills an unbuilt Core "immediately know" gap (*what decisions have been made?*), is Low complexity with no backend, carries the highest defensibility payoff, and is a **content prerequisite** for Red Folder Mode ("latest decisions"). It also strengthens the M7 review already shipped. Build **Risk/Watch Register** immediately after — together they supply the two data streams Red Folder and Blind Spots both consume.

**2. Highest operational value with no backend?**
**Blind Spots (rules-based MVP).** It actively changes what gets done in the incident by catching missed critical actions — the highest operational lift achievable with zero backend, using data the app already holds. (Red Folder Mode is a very close second for usability value.)

**3. Best support for the Principal in the first 60 minutes?**
**Red Folder Mode.** In the acute phase, cognitive bandwidth collapses; a stripped, high-contrast view of situation + contacts + critical actions + latest decisions + active risks is exactly what a lone, overwhelmed Principal can actually use.

**4. Best support for post-incident defensibility?**
**Decision Log.** Recording decisions *with rationale and what was known at the time* is the single most valuable artefact in a coronial inquest, insurance claim, or regulator review — precisely what traditional records omit.

**5. Which most improves command and control?**
**Blind Spots.** Command and control fails through omission and loss of grip; a quiet assistant that keeps the response complete and maintains momentum most directly improves the *control* of an unfolding incident. (Red Folder most improves the *exercise* of command under stress; the two are complementary.)

**6. Strategic value ranking (highest → lowest).**
1. **Decision Log** — foundational, defensibility, no backend, feeds Red Folder.
2. **Blind Spots** — highest decision-support ceiling and differentiation.
3. **Red Folder Mode** — signature command-and-control surface.
4. **Risk / Watch Register** — core situational awareness; fills a gap.
5. **Dynamic Role Replacement** — coordination; extends shipped capability.
6. **Parent Communication Demand Monitor** — communications decision aid.
7. **Media Exposure Radar** — comms/risk input; external-data and drift risk.
8. **Live Lessons Capture** — feeds PIR; weakest on the active-incident test.

_(Build order differs from strategic rank because Risk Register and Red Folder are cheap and/or unblock others — see roadmap.)_

---

## Recommended roadmap

### Phase 1 — Current prototype _(done)_
Incident creation · triage · role assignment (with conflict detection) · task management · immutable timeline · Communications drafting/approval/dispatch (M4, simulated) · Activation & acknowledgement (M2, simulated) · Post-incident review (M7) · audit-ready export. _No backend, no real dispatch, no shared audit log._

### Phase 2 — Before backend _(all no-backend; ships on the current prototype)_
Sequenced by value, dependency, and complexity:
1. **Decision Log** _(Core)_ — the decision + accountability spine. ✅ **Shipped 2026-07-06.**
2. **Risk / Watch Register** _(Core)_ — the "what risks remain?" stream. ✅ **Shipped 2026-07-06.**
3. **Blind Spots — rules-based MVP** _(Core)_ — gap detection from existing per-type templates. ✅ **Shipped 2026-07-06.**
4. **Red Folder Mode** _(Core)_ — composes situation + contacts + actions + latest decisions + active risks into one stress-proof view. ✅ **Shipped 2026-07-06.**
5. **Dynamic Role Replacement — MVP** _(Supporting)_ — extends the existing conflict/backup/failover engine. ✅ **Shipped 2026-07-06.**
6. **Live Lessons Capture** _(Supporting, optional)_ — cheap feed into the built PIR; only if it proves wanted. _(deferred — build only if PIR use proves demand)_

**Phase 2 COMPLETE (2026-07-06).** All nine "immediately know" questions are answerable on one prototype, no backend required. Next: the backend decision (Supabase vs Firebase) gates Phase 3.

### Phase 3 — After backend _(shared audit log, real dispatch, multi-user, integrations)_
- **Shared, multi-user immutable audit log** — makes the Decision Log, timeline and Risk Register legally real across devices and users (the true defensibility unlock).
- **Real activation dispatch + acknowledgement** — push + independent SMS gateway; M2 stops being simulated.
- **Blind Spots — advanced** — reasons over the live multi-user timeline; infers gaps beyond the static list.
- **Parent Communication Demand Monitor — integrated** — live volume from DigiStorm/phone; FAQ-gap detection.
- **Media Exposure Radar — automated** — permissioned public-source monitoring with human triage (only as an in-incident comms input).
- **Dynamic Role Replacement — advanced** — live roster/absence integration (SEQTA/iCHRIS).

Everything in Phase 3 still answers one of the nine questions — nothing here expands CIMPLE beyond incident management.
