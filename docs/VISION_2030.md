# CIMPLE — Product Vision & Capability Analysis (toward 2030)

_Prepared as lead product architect · 2026-07-06_

> **⚠️ Governing charter: `SCOPE.md` overrides this document.** CIMPLE's mission is fixed — an **incident management platform**, nothing broader. Every idea below must pass one test: _"Does this materially improve the management of an active incident?"_ Parts of this document that lean on **peacetime value, drills/readiness, compliance evidence, cross-sector learning, or commercial/market positioning are explicitly OUT of scope** — they are exploratory context only, not direction. When this document and `SCOPE.md` disagree, `SCOPE.md` wins. Do not use this document to justify platform expansion.

This is a strategy document, not a build spec. It evaluates twelve candidate capabilities against CIMPLE's seven governing principles, proposes missing capabilities, and sets a 2030 vision. Everything is filtered through one question: **what makes CIMPLE indispensable to a school in crisis — not to a generic enterprise?**

## The governing lens (why school ≠ enterprise)

Every idea below is judged against the reality of a school incident, which is structurally unlike a corporate one:

- **The commander is compromised.** The Incident Commander is usually the Principal — who also knows the child personally, will speak to the parents, and may be a witness. Roles are inherently double-hatted (small staff). The platform must protect a *stressed, conflicted, sleep-deprived human*, not coordinate a professional EOC.
- **The subjects are children.** Duty of care, mandatory reporting, custody/AVO complexity, reunification, safeguarding, and trauma aftercare are first-class concerns, not edge cases.
- **The "users" during the crisis are hundreds of parents** — anxious, phoning, and on social media within minutes.
- **The audience afterwards is a coroner, a regulator, an insurer, and the community.** Defensibility is existential. A school that cannot show *what it decided and why* loses inquests, registration, and trust.
- **Conditions are degraded by design.** Regional NSW: bushfire, flood, power and network loss. The tools that fail are exactly M365/Teams/WhatsApp — the ones schools rely on today.

The strategic thesis: **CIMPLE's moat is not features — it is defensible, child-safe execution of a plan nobody can read under pressure, in conditions where everything else is down.**

---

## Part 1 — Evaluation of the twelve candidate concepts

Priority key: **Now** (≤ next 2 build cycles, mostly no backend) · **Next** (post-backend or needs integration) · **Later** (strategic, heavy, or needs careful design).

### 1. Decision Log — _Now_ ★ flagship
**A. Purpose.** Record *decisions and their reasoning* — not just actions taken. Each entry: what was decided, by whom, the options considered, the evidence relied on, the assumptions, and a review point.
**B. Operational value.** In the moment it forces a half-second of deliberate thought under pressure; afterwards it is the single most valuable artefact in a coronial inquest, insurance claim, or regulator review.
**C. User stories.** _As a Principal, I record "held off calling parents for 12 min pending police advice — rationale: risk of contaminating a crime scene" so my judgement is defensible later._ _As a reviewer, I can see why a decision was reasonable given what was known at the time, not with hindsight._
**D. Data required.** Decision text, decider, timestamp, linked evidence (timeline entries, comms, roles), options considered, assumptions, review-by time, outcome.
**E. Risks.** Must not become a burden that stops people acting. Mitigate with AI-suggested decision framing and one-tap templates ("I decided X because Y"). Never AI-authored decisions — AI only structures the human's words.
**F. MVP.** A "Decision" entry type in the existing timeline capturing decision + rationale + review-by, visually distinct, always in the export.
**G. Advanced.** Decision review reminders; "what did we know at T?" reconstruction; linkage into PIR and Timeline Replay; pattern analysis across incidents ("we always delay parent comms — is that right?").
**H. School alignment.** Directly serves the defensibility principle that traditional EM software ignores; built for the inquest and the duty-of-care standard.
**I. Priority. Now.** Cheap, no backend, and the clearest philosophical differentiator.

### 2. Staff Cognitive Load Monitor — _Later_ (reframe)
**A. Purpose.** Help the commander notice fatigue, overload, and concentration risk in the response team and rebalance.
**B. Operational value.** Real — the classic failure mode is one person silently drowning while the commander is heads-down.
**C. User stories.** _As a commander after 3 hours, I see who has held a high-tempo role too long and rotate them._
**D. Data required.** Time-in-role, task volume per person, hours since incident start, self-reported status.
**E. Risks (significant).** AI "detecting" human fatigue from behaviour is surveillance, low-validity, and strains Principle 2 (AI must not infer consequential human states covertly) and staff privacy. Do **not** infer emotion or fatigue algorithmically.
**F. MVP.** A **commander-facing load board**: time-in-role + open-task count per person, with a manual "check on this person" nudge after threshold hours. Human reads it; the tool never diagnoses.
**G. Advanced.** Self-reported "I'm OK / stretched / need relief" one-tap check-ins; suggested rotations drawing on backups and the role-conflict engine.
**H. School alignment.** Fits the "protect the compromised commander" thesis, but only if it stays a visibility aid, not a judgement.
**I. Priority. Later.** Valuable but the temptation to over-claim AI makes it a reputational risk; do it after the core is trusted, and only in the reframed form.

### 3. Incident Forecasting — _Next_ (as scenario prompting, not prediction)
**A. Purpose.** Anticipate the *likely next stage* of an incident and recommend pre-staging (e.g., "medical → expect parent arrival surge → pre-stage front-office script and reunification point").
**B. Operational value.** Buys the one thing crises destroy: lead time.
**C. User stories.** _As a commander in a lockdown, I'm prompted "expect media within 30 min, expect parents at the gate — pre-draft holding statement now."_
**D. Data required.** Incident type playbooks, historical incident stage-progressions, current elapsed time and severity.
**E. Risks.** False confidence / anchoring. Must present as *"situations like this often next involve…"* scenario prompts with confidence and sources, never "this will happen" (Principle 2).
**F. MVP.** Rules-based, per-incident-type "next-stage checklist" surfaced at stage transitions — no ML, just codified expertise from the 110-page plan.
**G. Advanced.** Learns stage-progression patterns from CIMPLE's own incident corpus across schools; recommends pre-staging actions tied to Blind Spots.
**H. School alignment.** Encodes the plan's escalation logic as live foresight; deeply school-specific if built on TAC's own EMPs.
**I. Priority. Next.** The MVP (rules-based) could even be Now; the learning version needs a data corpus (multi-incident, likely multi-school).

### 4. Parent Pressure Gauge — _Next_ (reframe as comms-demand signal)
**A. Purpose.** Measure the *communication demand* a school is under — enquiry volume, channel load, time-since-last-update — so comms cadence keeps pace.
**B. Operational value.** The parent-communication tsunami is the defining school-crisis phenomenon and the most common reputational failure point.
**C. User stories.** _As a Comms Lead, I see enquiries spiking and "last parent update 40 min ago" and know to push an update now._
**D. Data required.** Inbound enquiry counts (front office, app, phone), time since last outbound update, open FAQ hits. **Not** sentiment scraping of individuals.
**E. Risks.** "Anxiety detection" would be creepy, low-validity, and safeguarding-fraught. Keep it demand/volume-based, not emotion-based.
**F. MVP.** A manual/assisted enquiry tally + "time since last update" clock + suggested next-update time.
**G. Advanced.** Integrations with DigiStorm/phone system for automatic volume; FAQ-gap detection ("30 parents asked about pickup — publish an answer").
**H. School alignment.** No enterprise tool models the parent body as the primary crisis audience; this is uniquely school-shaped.
**I. Priority. Next.** MVP is cheap; the value multiplies with DigiStorm integration (backend era).

### 5. Timeline Replay — _Next_ ★
**A. Purpose.** Reconstruct an incident minute-by-minute for training, governance, and PIRs — a "flight recorder" playback.
**B. Operational value.** Turns every real incident and drill into a reusable learning asset; makes governance review concrete.
**C. User stories.** _As a reviewer, I scrub the incident timeline and watch decisions, comms and role changes unfold._ _As a trainer, I replay a past incident (anonymised) as a teaching case._
**D. Data required.** The immutable timeline + decision log + comms + activation acks (all already captured), with timestamps.
**E. Risks.** Safeguarding — replays contain sensitive child data; must enforce redaction/anonymisation and access control.
**F. MVP.** A chronological scrub view of the existing timeline with layer filters (decisions / comms / roles / tasks).
**G. Advanced.** Side-by-side "planned vs actual" against the EMP; anonymised training library; export to governance packs.
**H. School alignment.** Serves the learning loop and defensibility; drills become evidence for Child Safe Standards / AISNSW.
**I. Priority. Next.** Builds directly on the immutable log; low technical risk, high recurring value.

### 6. Blind Spots ("What are we forgetting?") — _Now_ ★ flagship
**A. Purpose.** Continuous, incident-type-aware gap detection against the plan: the platform quietly asks "given this is a Missing Student at 14:20, have you… checked CCTV / notified police / assigned a searcher / contacted parents?"
**B. Operational value.** This is the core promise — it makes the unreadable 110-page plan *execute itself* as prompts, catching the omissions that hindsight punishes.
**C. User stories.** _As a Principal mid-incident, a calm panel shows "3 expected actions not yet done for this incident type" without nagging._
**D. Data required.** Per-incident-type expected-action templates (the plan, encoded), current task/role/comms state, elapsed time.
**E. Risks.** Alarm fatigue and false "gaps." Must be quiet, high-precision, dismissible, and never block the human (Principle 1, 4).
**F. MVP.** Static per-type checklists diffed against current incident state → "not yet done" list. (Much of the data model already exists via default tasks/roles.)
**G. Advanced.** AI reads the live timeline and infers gaps beyond the static list ("you mentioned a sibling — have you checked their welfare?"); time-sensitive prompts; learns from PIRs.
**H. School alignment.** It *is* the operationalisation of the school's own plan — the whole reason CIMPLE exists.
**I. Priority. Now.** MVP is a natural extension of existing tasks/roles; the flagship differentiator.

### 7. Dynamic Role Replacement — _Now_
**A. Purpose.** When a role-holder is absent, overloaded, or conflicted, recommend the best alternate and manage the swap — extending the existing role-conflict + backup engine.
**B. Operational value.** In hour one the truth is "half the people in the plan aren't here today." This closes that gap instantly.
**C. User stories.** _As a commander, the Wellbeing Lead is off-site; CIMPLE suggests the qualified, available, non-conflicted alternate and re-notifies them._
**D. Data required.** Staff directory with qualifications, availability, current-day roster, role-conflict rules (all partly exist).
**E. Risks.** Suggestions only; the human confirms (Principle 1). Availability data must be current (ties to M8 90-day checks — and to daily rostering).
**F. MVP.** "Suggest alternate" on any role using qualifications + availability + conflict rules; one-tap reassign + re-notify (activation already supports failover).
**G. Advanced.** Live roster/absence integration (iCHRIS/SEQTA) so "who's on site today" is real; auto-flag when a chosen person is double-hatted into conflict.
**H. School alignment.** Directly answers the small-staff, double-hatting reality the PRD §13 already flags.
**I. Priority. Now.** Largely an extension of shipped capability.

### 8. Live Lessons Learned Capture — _Now_
**A. Purpose.** Capture "we should change X" observations *during* the incident, when they're vivid, instead of trying to remember them at the PIR days later.
**B. Operational value.** The best improvement insights evaporate within hours; capturing them live dramatically improves the learning loop.
**C. User stories.** _As a warden, I flag "the C-Block door key didn't work" in two taps mid-incident; it lands in the PIR automatically._
**D. Data required.** A lightweight "observation" entry type, author, timestamp, category, links to the moment.
**E. Risks.** Must be near-zero friction or it won't be used under load.
**F. MVP.** An "Observation / improvement" quick-capture that feeds the PIR's "what could improve" and corrective actions.
**G. Advanced.** AI clusters observations into themes across incidents; auto-proposes plan amendments.
**H. School alignment.** Powers continuous improvement of the school's own plan and drills.
**I. Priority. Now.** Tiny extension of the timeline + PIR already built.

### 9. Media Exposure Radar — _Later_
**A. Purpose.** Assess real-time reputational exposure — is this incident on social media, local news, parent group chats — and gauge escalation.
**B. Operational value.** Reputational survival is real for schools; getting ahead of a story matters enormously.
**C. User stories.** _As a Principal, I'm alerted that the incident is being discussed publicly, so I bring forward the holding statement._
**D. Data required.** External monitoring feeds (news, permitted social APIs), keyword/entity matching.
**E. Risks (significant).** Cannot scrape private groups (legal/ethical); child-safeguarding limits on monitoring minors; false positives; vendor cost. Easy to do badly.
**F. MVP.** Manual "exposure level" flag the Comms Lead sets, tied to escalating the media holding statement.
**G. Advanced.** Automated public-source monitoring with careful scoping and human triage; links to Parent Pressure Gauge.
**H. School alignment.** School reputation is community trust; relevant, but must respect safeguarding constraints tightly.
**I. Priority. Later.** High care, external dependencies, better once core trust is established.

### 10. Recovery Readiness Score — _Next_ (M5 companion)
**A. Purpose.** Quantify capability to return to normal operations — are critical functions restored, staff available, facilities safe, students supported.
**B. Operational value.** The recovery phase is chronically under-managed; a readiness score makes "can we reopen Monday?" evidence-based.
**C. User stories.** _As a Principal, a readiness score shows teaching (70%), facilities (40%), wellbeing (90%) so I decide on a staged return._
**D. Data required.** Critical-function register + RTO status (M5), staff availability, facilities status, wellbeing caseload.
**E. Risks.** A single score can oversimplify; show the components, not just the number.
**F. MVP.** A checklist across recovery domains → composite readiness view (pairs with the M5 build).
**G. Advanced.** Live-updating from function/RTO timers and supplier status; scenario modelling ("if X supplier fails…").
**H. School alignment.** "Reopen decision" is a distinctly school judgement (parents, board, duty of care).
**I. Priority. Next.** Build alongside M5.

### 11. Red Folder Mode — _Now_ ★ flagship
**A. Purpose.** A radically stripped interface for peak stress: only the current severity, the next 3 actions, who to call, and the one-tap declare/comms — nothing else.
**B. Operational value.** Embodies Principle 4 (simplicity under pressure). Under acute stress, cognitive bandwidth collapses; feature-rich screens become unusable. This is the anti-feature that wins.
**C. User stories.** _As a Principal in the first five minutes of a lockdown, one giant screen tells me exactly the next three things to do and the one number to call._
**D. Data required.** Current incident state, next-actions (from Blind Spots), emergency contacts — all already present.
**E. Risks.** Hiding information can also hide something needed; the mode must be one tap away from full detail.
**F. MVP.** A toggle that switches the dashboard to a high-contrast, large-type, 3-action view.
**G. Advanced.** Auto-engages at L4; voice-driven ("what's next?"); works fully offline on a phone.
**H. School alignment.** Built for the lone, panicking staff member — the opposite of an enterprise EOC wall of dashboards.
**I. Priority. Now.** Pure front-end; a signature demo moment and a true differentiator.

### 12. Incident Intelligence Graph — _Later / Next_ ★ (the moat)
**A. Purpose.** A relationship graph across students, families, staff, contractors, governors and community — so the platform *knows* that the missing Year 7 has a sibling in Year 9, a custody order naming one parent, an asthma plan, and a bus contractor connection.
**B. Operational value.** Converts scattered school data into instant situational awareness: "who is affected, who must not be contacted, who else is at risk."
**C. User stories.** _As a commander in a Missing Student incident, the graph surfaces the sibling to check, the custody flag on the father, and the medical alert — before I think to ask._
**D. Data required.** Deep, sensitive integration: SEQTA/Synergetic (students, families, medical, custody/AVO flags), staff directory, contractor register, governance list. **The hardest and most sensitive data problem in the platform.**
**E. Risks (highest).** Child-safeguarding and privacy are paramount (Principle 7). Custody/AVO/medical data demands strict access control, purpose limitation, retention policy, and consent/governance sign-off. Get this wrong and it's a catastrophe, not a feature.
**F. MVP.** Manual, per-incident "linked people" (sibling, contacts, medical, do-not-contact flags) attached to the incident — no live integration yet.
**G. Advanced.** Live, permissioned graph from school systems with safeguarding flags, powering Blind Spots ("check the sibling"), Reunification, and Forecasting.
**H. School alignment.** This is the deepest school-specific moat — impossible for a generic EM vendor to replicate without a school's own data model and safeguarding posture.
**I. Priority. Later (MVP could be Next).** The strategic long-term differentiator, but gated on backend + integrations + a serious data-governance framework.

---

## Part 2 — Capabilities missing from the candidate list

These are, in my assessment, as important as anything above — and more school-specific. Several outrank the weaker candidates.

- **Reunification & Custody-Safe Release — _Now/Next_ ★.** After an evacuation/lockdown, reuniting hundreds of children with the *correct, authorised* adult is a distinct, safeguarding-critical workflow no enterprise tool has: verify identity, check custody/AVO/do-not-release flags, log chain-of-custody (which child released to which adult, when, by whom). This is arguably the highest-value missing capability. Legally and morally, releasing a child to the wrong person is the worst-case failure.
- **Real-time Accountability / Roll-Call Engine — _Next_ ★.** The first question in any evacuation is "is everyone accounted for?" A live who-is-where for students, staff, visitors and contractors — accounted / evacuated / missing / off-site — integrating attendance (SEQTA) and the visitor/contractor sign-in. First-hour critical; currently unaddressed.
- **Statutory Obligations & Mandatory-Reporting Engine — _Next_.** Schools have hard legal notification duties (Reportable Conduct, mandatory reporting to DCJ, WHS notifiable incidents to SafeWork, notifying AISNSW/AngliSchools, the Board, insurers) each with statutory clocks. An engine that detects when an incident triggers an obligation, routes it to the right body, and tracks the deadline is uniquely valuable and defensibility-critical.
- **Wellbeing Aftercare / Long-Tail Tracking — _Next_.** School incidents don't end at "all clear." Grief, trauma, anniversary reactions, and staff wellbeing play out over months. Tracking affected students/staff for follow-up, counsellor caseload, and check-ins is the long tail enterprises never model — and where schools carry the deepest duty of care.
- **Drill & Readiness Simulator (compliance evidence) — _Next_.** Run any incident type in exercise mode, score the response, and auto-generate the compliance evidence (Child Safe Standards, AISNSW registration, insurer requirements). Turns preparation into an auditable asset and drives adoption between incidents (the "peacetime" value that keeps the platform in daily life).
- **Emergency-Services Handoff Pack — _Now/Next_.** A one-tap pack for arriving police/ambulance/fire: site maps, access points, assembly areas, affected-student medical summary, current status. The moment of handover to responders is chaotic and under-supported.
- **Cross-Incident Pattern & Safeguarding Early-Warning — _Later_.** Across time, detect recurring precursors (same location, same cohort, repeated near-misses) feeding safeguarding early-warning — the platform learns the school's risk landscape.
- **Offline "Grab-Bag" / Degraded-Mode Mirror — _Next_.** A phone-resident mirror of the active incident and the plan that works with zero connectivity and syncs on reconnect — the literal embodiment of Principle 3, and the answer to "what if the network is the casualty?"

---

## Part 3 — The five strategic questions

### Q1 · Greatest competitive advantage (top 5)
Hard-to-copy because they are defensibility- and school-data-specific:
1. **Incident Intelligence Graph** — the deepest moat; a generic vendor cannot replicate a school's own relationship + safeguarding data model.
2. **Decision Log** — built for the inquest; the clearest philosophical break from enterprise EM tools.
3. **Blind Spots** — makes the school's *own* 110-page plan execute itself; the core promise.
4. **Reunification & Custody-Safe Release** (from Part 2) — a legally critical, uniquely school workflow nobody else has.
5. **Red Folder Mode** — simplicity as a feature; the anti-enterprise UX that wins hearts in a demo and in the first five minutes.

### Q2 · Greatest value in the first hour of a crisis (top 5)
1. **Red Folder Mode** — usable when cognitive bandwidth has collapsed.
2. **Blind Spots** — catches the omissions that hindsight punishes.
3. **Real-time Accountability / Roll-Call** (Part 2) — "is everyone safe?" is question one.
4. **Dynamic Role Replacement** — fills the "half the plan isn't here today" gap instantly.
5. **Decision Log** — captures rationale while it's fresh and defensible (and Incident Forecasting's rules-based next-stage prompts are a close sixth).

### Q3 · Greatest long-term strategic value
**The learning loop** — Live Lessons + Timeline Replay + PIR + Drill Simulator feeding amendments back into the plan and Blind Spots. Individually modest; together they turn CIMPLE from an incident tool into **"the plan that learns"** — the thing that compounds in value every year and every drill, and the reason a school can never leave. The Intelligence Graph is the deepest *moat*; the learning loop is the deepest *lock-in*.

### Q4 · What makes CIMPLE fundamentally different from traditional EM software
**The Decision Log, paired with Red Folder Mode.** Enterprise EM software is a dashboard for a professional operations centre. CIMPLE is built for a lone, emotionally-involved Principal making defensible decisions about children in degraded conditions. Recording *reasoning for the coroner* and *stripping the interface to three actions for the panicking human* are both unthinkable in enterprise EM and exactly right for schools. That is the identity.

### Q5 · Entirely new concepts missing from the list
See Part 2 in full. The standouts: **Reunification & Custody-Safe Release**, **Real-time Accountability/Roll-Call**, **Statutory Obligations & Mandatory-Reporting Engine**, **Wellbeing Aftercare (long tail)**, and the **Drill & Readiness Simulator** (peacetime adoption + compliance evidence). Reunification in particular is a glaring omission given it is one of the highest-consequence workflows a school will ever run.

---

## Part 4 — Future-state vision: CIMPLE in 2030

**By 2030, CIMPLE is the operating system for school crisis management — the standard K-12 schools around the world are measured against.** Not because it has the most features, but because it changed what the category is for.

**It is the plan, alive.** Schools no longer maintain a 110-page document nobody reads. They maintain CIMPLE. The plan lives as executable playbooks, and every drill and real incident refines it automatically. "Updating the plan" and "using the platform" are the same act. Blind Spots means the plan runs itself as calm, timely prompts; the binder in the cupboard is a museum piece.

**It is defensible by design.** Every incident produces, automatically, a decision log, a minute-by-minute replayable record, a statutory-obligations trail, and a governance pack. When the coroner, the regulator or the insurer asks "what did you decide, when, and why?", the school answers in minutes with evidence — because CIMPLE was built for that question first. This is why boards and insurers *require* it.

**It is unbreakable.** CIMPLE works when the school is on fire, flooded, or offline. The active incident and the plan live on every responder's phone in degraded mode and reconcile on reconnect. Activation reaches people over independent channels that don't depend on the systems that just failed. "The tool that's still working when everything else is down" is its reputation.

**It is child-safe to its core.** The Intelligence Graph gives commanders instant, permissioned awareness of siblings, custody flags, medical needs and do-not-contact orders — and Reunification guarantees every child goes home with the right adult, logged. Safeguarding isn't a setting; it's the architecture. This is the moat no enterprise vendor can cross.

**It is calm under pressure.** Red Folder Mode and voice interaction mean a terrified first-year-out teacher who opens CIMPLE in the worst five minutes of their career is told exactly the next three things to do. Simplicity is the headline feature.

**It earns its keep in peacetime.** Between incidents, CIMPLE runs the drill calendar, scores readiness, tracks wellbeing aftercare, manages the 90-day data-currency checks, and generates the compliance evidence schools are required to produce anyway. It is in daily use, not waiting in a drawer — which is why it's there, ready, when the day comes.

**It learns across the sector.** With appropriate governance, anonymised patterns across the CIMPLE network make every school's foresight sharper: "incidents like this often next involve…" is informed by thousands of real responses, not one school's memory. A near-miss at one school quietly hardens the playbooks at all of them.

The competitive position in one line: **traditional emergency-management software coordinates professionals in a control room; CIMPLE protects a compromised human, defends a school's future, and keeps children safe — in the dark, with the power out, in the worst hour of someone's career.** That is a different product, for a market the incumbents were never built to serve.

---

## Appendix — Priority roll-up

| Concept | Priority | Backend needed? |
|---|---|---|
| Decision Log | **Now** ★ | No |
| Blind Spots | **Now** ★ | No (MVP) |
| Red Folder Mode | **Now** ★ | No |
| Dynamic Role Replacement | **Now** | No (deeper w/ roster) |
| Live Lessons Learned | **Now** | No |
| Reunification & Custody-Safe Release ⁽ⁿᵉʷ⁾ | **Now/Next** ★ | Partial (graph later) |
| Emergency-Services Handoff Pack ⁽ⁿᵉʷ⁾ | **Now/Next** | No (MVP) |
| Timeline Replay | **Next** ★ | No |
| Incident Forecasting | **Next** | No (MVP) / Yes (learning) |
| Parent Pressure Gauge | **Next** | Yes (DigiStorm) |
| Recovery Readiness Score | **Next** (w/ M5) | Partial |
| Real-time Accountability / Roll-Call ⁽ⁿᵉʷ⁾ | **Next** ★ | Yes (SEQTA) |
| Statutory Obligations Engine ⁽ⁿᵉʷ⁾ | **Next** | Partial |
| Wellbeing Aftercare ⁽ⁿᵉʷ⁾ | **Next** | Yes |
| Drill & Readiness Simulator ⁽ⁿᵉʷ⁾ | **Next** | Partial |
| Offline Grab-Bag / Degraded Mirror ⁽ⁿᵉʷ⁾ | **Next** | Yes |
| Incident Intelligence Graph | **Later** ★ | Yes + governance |
| Media Exposure Radar | **Later** | Yes (feeds) |
| Cross-Incident Pattern / Early-Warning ⁽ⁿᵉʷ⁾ | **Later** | Yes |
| Staff Cognitive Load Monitor | **Later** (reframed) | Partial |

★ = highest strategic leverage. ⁽ⁿᵉʷ⁾ = added in Part 2.
