# CIMPLE — Staff & Roles → Incident Command System (design)

_Lead product architect · 2026-07-06 · governed by `SCOPE.md`_

**Goal:** make Staff & Roles behave like a real Incident Command System — bulk roster, role-preference model, auto-allocation during triage, conflict/escalation engine, activation workflow, notifications, briefing packs, and a Role Status Board — while staying strictly in-charter (an incident *response roster*, **not** HR).

**Charter guard:** `department` and `jobTitle` exist only to *identify and contact* a responder, never for org management. Everything here serves activation, coordination, accountability, and response.

## What already exists (reuse, don't rebuild)
- Staff CRUD (`listStaff`, `newStaffMember`, `qualifiedFor[]`, `available`, `verifiedAt`).
- Role definitions (`ROLE_DEFINITIONS`: description, reportsTo, typicallyHeldBy) + per-type responsibilities (`responsibilitiesFor`).
- Per-type role templates (`rolesForIncidentType`) + default tasks (`tasksForIncidentType`).
- Conflict rules (`ROLE_CONFLICTS`, `detectRoleConflicts`) and recommendation (`suggestStaffForRole`, `recommendAlternate`).
- Activation + acknowledgement (M2): `incident.activation`, per-role `notify {status: sent|acked|no_response, viaBackup}`, failover-to-backup.

The redesign **extends** these; it does not replace them.

---

## 1 & 2 & 3. Data model — Staff schema & Role schema

### Staff (enhanced) — `incident-response roster` record
```
{
  id,
  firstName, lastName,
  name,                 // derived "First Last" — back-compat with existing code
  initials,
  email, mobile,
  jobTitle, department, // identification/contact only
  availabilityStatus,   // "available" | "unavailable" | "offsite"  (available:bool kept, derived)
  primaryRole,          // roleId — normally fills this
  secondaryRoles,       // [roleId] — backups
  otherQualifiedRoles,  // [roleId] — additional
  qualifiedFor,         // DERIVED = [primary, ...secondary, ...other] — keeps existing engine working
  verifiedAt, notes
}
```
- **Back-compat is the migration strategy:** keep `qualifiedFor[]` as a *derived* field so `suggestStaffForRole` / `recommendAlternate` / `rolesForIncidentType` keep working untouched. A one-time migration maps existing flat `qualifiedFor` → `primaryRole = qualifiedFor[0]`, rest → `otherQualifiedRoles`.
- **Preference rank** (drives allocation): primary = 0, secondary = 1, other = 2.

### Role (add precedence)
Roles already have definitions; add a **priority/precedence** so escalation is deterministic:
```
ROLE_PRIORITY = { "Incident Commander":1, "Deputy Commander":2, "Police Liaison":3,
                  "Search Coordinator":3, "Wellbeing Lead":4, "Communications Lead":4,
                  "Family Liaison":5, "First Aid":5, "Headcount Officer":6,
                  "Floor Wardens":6, "Front Office Lead":6, "Documenter":7,
                  "Counsellor (External)":8 }   // lower number = higher priority
```
Escalation pathway = the `reportsTo` chain already in `ROLE_DEFINITIONS`.

### Per-incident role assignment (enhanced activation states)
Evolve the M2 `notify` into a fuller lifecycle on each incident role:
```
role.activation = {
  state,        // "pending" | "notified" | "acknowledged" | "declined" | "reassigned"
  assignedAt, notifiedAt, acknowledgedAt, declinedAt,
  channels: [ "app", "email", "sms" ],
  viaBackup: bool
}
```
Map from M2: `sent → notified`, `acked → acknowledged`; add `pending` (assigned, not yet notified), `declined`, `reassigned`. This is append-friendly (each transition stamped) → audit-ready.

---

## 4. Allocation engine
`autoAllocate(typeId, severity, staffPool)` → proposed assignments for review:
1. **Required roles** = `rolesForIncidentType(typeId)`, plus severity add-ons (e.g. Deputy Commander + Communications Lead at L3+, per a `SEVERITY_ROLE_ADDONS` map).
2. **Order roles by `ROLE_PRIORITY`** (highest first) — so the most critical role claims the best person first.
3. **For each role**, rank candidates: available AND qualified, preferring **primaryRole match → secondaryRoles → otherQualifiedRoles**, then contact-currency, then name. Exclude anyone already allocated (processing high→low makes this automatic) and anyone with a `ROLE_CONFLICTS` clash.
4. Return `{role, proposedStaff, reason, conflictFlag}[]` for the **commander to approve or override** (human-in-command).

## 5. Conflict-resolution / escalation algorithm
**Invariant:** no person holds two active roles unless the IC explicitly approves.

- **At allocation:** processing roles high→low priority guarantees a person lands in their *highest-priority needed* role; lower roles fall to the next candidate. No extra logic needed.
- **Mid-incident promotion** (`promoteToRole(incident, staffId, newRoleId)`): the requested case —
  ```
  1. If staff S already holds role R_low and is promoted to higher-priority R_high:
  2.   vacate R_low  → state: reassigned
  3.   assign S to R_high → state: notified (re-notify if activated)
  4.   backfill R_low via recommendAlternate() → next qualified, available, non-conflicted person
  5.   log all three moves to the timeline (auditable)
  ```
- **Conflict override:** `ROLE_CONFLICTS` still flags forbidden pairs; the IC may override with an explicit `approvedOverride` flag stored on the assignment (recorded for defensibility).

## 6. Notification architecture (prototype AND production)
A **provider abstraction** so no prototype assumption is hard-coded:
```
notify(recipient, payload) → dispatched via configured channels
  payload = { incidentId, title, role, severity, location, action }
```
- **Prototype providers:** `SimulatedEmail`, `SimulatedPush` → write to an **activation log** + set state `notified` + timeline entry. Clearly labelled "simulated".
- **Production providers (swap-in, same interface):** Email (SMTP/SendGrid), SMS (Twilio), Web Push (PWA/VAPID), Mobile push (FCM/APNs).
- Every send is an **append-only notification record** `{roleId, channel, sentAt, result}` → becomes a DB table later.

## 7. Activation workflow
```
Triage/New → determine required roles → AUTO-ALLOCATE → review & override
   → APPROVE & ACTIVATE
      → per role: state=notified, notify() sent, briefing pack available
      → recipient ACKNOWLEDGES or DECLINES
      → on decline / no-ack within window → escalate to backup (recommendAlternate) → reassigned
```

## 8. Role briefing pack (mostly assembled from existing data)
On opening an activation, compose a read-only pack — **no new schema**:
- Incident summary (existing incident fields)
- Assigned role + description + reporting line (`ROLE_DEFINITIONS`)
- Immediate responsibilities (`responsibilitiesFor(role, type)`)
- Assigned tasks (incident tasks owned by the role)
- Escalation pathway (`reportsTo` chain)

## 8b. UI — Role Status Board (a primary command view)
Promote roles from a side rail to a first-class board:
```
INCIDENT TEAM
✅ Incident Commander   Adrian Johnson        (acknowledged)
✅ Police Liaison       Michael Smith         (acknowledged)
🟡 Family Liaison       Pending acknowledgement (notified)
🔴 Search Coordinator   Unassigned
⚪ Documenter           Reassigned → J. Okafor
```
Status colour = activation state. Also feeds Red Folder ("Key contacts") and Blind Spots (unfilled/ unacked rules already exist).

---

## 9. Future backend readiness (design principles)
- **Normalized records** that map 1:1 to tables/collections: `staff`, `incident_roles`, `activations`, `notifications`. No blobs that resist querying.
- **Append-only events** for every state change (assigned/notified/acknowledged/declined/reassigned) → the audit log is a natural byproduct.
- **Provider abstraction** for notifications (above) → real dispatch is a config swap.
- **Actor + timestamp on every mutation** → multi-user & RBAC ready; never assume a single user.
- **Acknowledgement = an event created by the assignee**, not the commander → in production it arrives from *their* device; in prototype it's simulated locally.
- Maps cleanly to **Supabase** (Postgres tables + RLS + realtime) or **Firebase** (Firestore collections + FCM).

## 10. Implementation plan

**Increment A — Roster & preference model (no backend): ✅ SHIPPED 2026-07-06.** enhanced staff schema (primary/secondary/other, email/mobile/jobTitle/department, availabilityStatus) with `qualifiedFor` derived (`normalizeStaff`) for back-compat; **bulk CSV import** (`parseStaffImport`/`bulkImportStaff`, preview + warnings, append-dedupe/replace, template + file/paste); reworked staff editor; safe migration (normalize on read + on `saveStaff`). _(Excel/.xlsx deferred — needs SheetJS; CSV covers the need.)_

**Increment B — Auto-allocation in triage/new-incident (no backend): ✅ SHIPPED 2026-07-06.** `ROLE_PRIORITY` + `SEVERITY_ROLE_ADDONS` → `requiredRolesFor()`; `autoAllocate()` (priority-first, prefers primary>secondary>other, no double-booking, excludes unavailable, backups); step-3 **Review team** screen in `NewIncident` with per-role override dropdowns; `createIncident({roles})`. Verified end-to-end.

**Increment C — Escalation & activation states (no backend): ✅ SHIPPED 2026-07-06.** `promoteToRole()` (vacate + backfill, verified) + `reassignRoleToAlternate()`; 5-state board (`roleBoardState`/`ROLE_BOARD_STATE`: unassigned/assigned/notified/acknowledged/declined); **Team Status Board** drawer ("Team" command view) with assign-replace (runs the conflict engine), notify/ack/decline/escalate; **role briefing pack** (summary + description + reporting line + responsibilities + tasks + escalation pathway); `simulateNotification()` provider abstraction.

**Increment D — Production (after backend):** real email/SMS/push providers; real-time multi-user acknowledgements from assignees' own devices; shared immutable audit log; RBAC.

---

## Final answers

**A. Does this materially improve active incident management?**
**Yes — decisively.** Allocation, activation, accountability, notification and briefing are the core of incident command. This moves CIMPLE from a manual assignment tool to a real ICS, and every part serves an in-charter function (command, activation, coordination, accountability, communications). It is not HR.

**B. Build immediately (no backend):**
- Increment A — bulk CSV import + primary/secondary/other role model + bulk edit
- Increment B — auto-allocation with review/override in triage
- Increment C — escalation/conflict engine, 5-state activation, Role Status Board, briefing pack, *simulated* notifications
All run on the current localStorage prototype.

**C. Wait until the backend exists:**
- **Real** email/SMS/PWA-push dispatch (simulated until then)
- **Real** multi-user acknowledgements (the assignee acking from their own device — a prototype can only simulate this)
- Cross-device shared audit log + RBAC

**D. Risks / complexity to weigh first:**
- **Migration:** existing staff use flat `qualifiedFor[]` — mitigate by deriving it from the new fields (no breakage).
- **Data quality:** auto-allocation is only as good as the roster; always keep human override (human-in-command).
- **Excel parsing** adds a heavy dependency (SheetJS) — start with CSV.
- **Escalation churn:** promotion cascades must be transparent, logged, and reversible; cap re-allocation depth.
- **Conflict vs override:** IC always has final say; record overrides for defensibility.
- **Simulated ≠ real:** notifications must be unmistakably labelled "simulated" so no one believes an alert was sent.
- **Charter drift:** keep `department`/`jobTitle` for contact/identity only — do not grow org-management features.
