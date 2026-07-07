// ============================================================
// CIMPLE — Data Layer
// All localStorage CRUD + types + role templates per incident type.
// ============================================================

const STORAGE_KEY = "cimple-v2-state";

// ---------- Severity definitions ----------
export const SEVERITY = {
  1: { label: "L1 Minor", short: "L1", color: "#5B8C7C", bg: "#DEE9E4", tone: "No injury, low disruption" },
  2: { label: "L2 Moderate", short: "L2", color: "#B89460", bg: "#EFE6D0", tone: "Medical attention required, parent contact" },
  3: { label: "L3 Major", short: "L3", color: "#A85535", bg: "#EAD5C7", tone: "Emergency services involved, significant disruption" },
  4: { label: "L4 Critical", short: "L4", color: "#7A1820", bg: "#E4C8C9", tone: "Death, serious injury, major threat, media" },
};

// ---------- Incident types with metadata ----------
export const INCIDENT_TYPES = [
  { id: "medical", label: "Medical / Injury", category: "student", icon: "Heart", emp: "EMP §3.1 — Medical Emergency Response", defaultSeverity: 2 },
  { id: "mental_health", label: "Student Mental Health / Self-Harm", category: "student", icon: "Brain", emp: "EMP §4.3 — Student Mental Health Crisis Response", defaultSeverity: 3 },
  { id: "behavioural", label: "Behavioural / Violent Incident", category: "student", icon: "AlertTriangle", emp: "EMP §5.2 — Behavioural Crisis Response", defaultSeverity: 2 },
  { id: "missing", label: "Missing Student", category: "student", icon: "UserX", emp: "EMP §6.1 — Missing Student Procedure", defaultSeverity: 3 },
  { id: "bullying", label: "Bullying / Harassment", category: "student", icon: "Users", emp: "EMP §5.4 — Bullying Response", defaultSeverity: 2 },
  { id: "child_protection", label: "Child Protection / Serious Allegation", category: "student", icon: "ShieldCheck", emp: "EMP §2.2 — Child Protection Response", defaultSeverity: 3 },
  { id: "lockdown", label: "Lockdown", category: "school", icon: "Lock", emp: "EMP §1.1 — Lockdown Procedure", defaultSeverity: 4 },
  { id: "evacuation", label: "Fire / Evacuation", category: "school", icon: "Flame", emp: "EMP §1.2 — Evacuation Procedure", defaultSeverity: 3 },
  { id: "hazmat", label: "Hazardous Material", category: "school", icon: "AlertOctagon", emp: "EMP §1.4 — Hazmat Response", defaultSeverity: 3 },
  { id: "natural_disaster", label: "Natural Disaster", category: "school", icon: "CloudLightning", emp: "EMP §1.5 — Natural Disaster Response", defaultSeverity: 3 },
  { id: "disease_outbreak", label: "Disease Outbreak / Public Health", category: "school", icon: "Activity", emp: "EMP §12.1 — Public Health / Outbreak Response", defaultSeverity: 2 },
  { id: "cyber", label: "Cyber / Data Incident", category: "tech", icon: "ServerCrash", emp: "EMP §11.1 — Cyber & Data Incident Response", defaultSeverity: 3 },
  { id: "infrastructure", label: "Utilities / Infrastructure Failure", category: "tech", icon: "Zap", emp: "EMP §13.1 — Utilities & Infrastructure Failure", defaultSeverity: 2 },
  { id: "parent_aggression", label: "Parent / Visitor Aggression", category: "external", icon: "UserCheck", emp: "EMP §7.3 — Parent & Visitor Conflict Response", defaultSeverity: 2 },
  { id: "external_threat", label: "External Threat / Police", category: "external", icon: "Shield", emp: "EMP §1.3 — External Threat Response", defaultSeverity: 4 },
  { id: "transport", label: "Transport Accident", category: "external", icon: "Bus", emp: "EMP §8.2 — Transport Incident Response", defaultSeverity: 3 },
  { id: "excursion", label: "Excursion / Off-Site Incident", category: "external", icon: "Tent", emp: "EMP §8.4 — Off-Site / Excursion Incident", defaultSeverity: 3 },
  { id: "death_oncampus", label: "Death — On Campus", category: "death", icon: "AlertCircle", emp: "EMP §9.1 — Critical Incident: Death", defaultSeverity: 4 },
  { id: "death_offcampus", label: "Death — Off-Campus / Community Tragedy", category: "death", icon: "AlertCircle", emp: "EMP §9.2 — Off-Campus Death & Community Tragedy Response", defaultSeverity: 4 },
];

export const TYPE_CATEGORIES = {
  student: { label: "Student-Related", color: "#00305E" },
  school: { label: "School-Wide", color: "#B85C3C" },
  tech: { label: "Facilities & Technology", color: "#4F6D8F" },
  external: { label: "Community / External", color: "#C9A961" },
  death: { label: "Death", color: "#8B2E1A" },
};

// ---------- CIMT role templates per incident type ----------
// CIMPLE models the Critical Incident Management Team (CIMT) — the
// management/coordination layer — NOT the Emergency Control Organisation
// (warden team), which the Emergency Response Plan governs separately.
// The CIMT core (Leader + Support + Planning) is always activated; the
// Critical Incident Leader activates other coordinators as the incident
// requires. Templates below list the coordinators most likely needed.
const COMMON_ROLES = [
  { role: "Critical Incident Leader", required: true, isPrincipal: true },
  { role: "Support Coordinator", required: true },
  { role: "Planning Coordinator", required: true },
];

const ROLE_TEMPLATES = {
  medical: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "Student Wellbeing Services Coordinator", required: false },
    { role: "Communications Coordinator", required: false },
  ],
  mental_health: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "Student Wellbeing Services Coordinator", required: true },
    { role: "Communications Coordinator", required: false },
  ],
  behavioural: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "Student Wellbeing Services Coordinator", required: false },
  ],
  missing: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "College Services", required: true },
    { role: "Communications Coordinator", required: false },
  ],
  bullying: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "Student Wellbeing Services Coordinator", required: false },
  ],
  lockdown: [
    ...COMMON_ROLES,
    { role: "College Services", required: true },
    { role: "Facilities", required: false },
    { role: "Communications Coordinator", required: true },
  ],
  evacuation: [
    ...COMMON_ROLES,
    { role: "College Services", required: true },
    { role: "Facilities", required: true },
    { role: "Communications Coordinator", required: true },
  ],
  hazmat: [
    ...COMMON_ROLES,
    { role: "College Services", required: true },
    { role: "Facilities", required: true },
    { role: "Communications Coordinator", required: true },
  ],
  natural_disaster: [
    ...COMMON_ROLES,
    { role: "College Services", required: true },
    { role: "Facilities", required: true },
    { role: "Communications Coordinator", required: true },
    { role: "Recovery Coordinator", required: false },
  ],
  parent_aggression: [
    ...COMMON_ROLES,
    { role: "College Services", required: true },
    { role: "Communications Coordinator", required: false },
  ],
  external_threat: [
    ...COMMON_ROLES,
    { role: "College Services", required: true },
    { role: "Communications Coordinator", required: true },
  ],
  transport: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "Communications Coordinator", required: true },
  ],
  death_oncampus: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "Staff Coordinator", required: true },
    { role: "Student Wellbeing Services Coordinator", required: true },
    { role: "Communications Coordinator", required: true },
  ],
  death_offcampus: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "Staff Coordinator", required: true },
    { role: "Student Wellbeing Services Coordinator", required: true },
    { role: "Communications Coordinator", required: true },
  ],
  child_protection: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "Student Wellbeing Services Coordinator", required: false },
  ],
  disease_outbreak: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "College Services", required: false },
    { role: "Communications Coordinator", required: true },
  ],
  cyber: [
    ...COMMON_ROLES,
    { role: "Recovery – IT Coordinator", required: true },
    { role: "College Services", required: false },
    { role: "Communications Coordinator", required: true },
  ],
  infrastructure: [
    ...COMMON_ROLES,
    { role: "College Services", required: true },
    { role: "Facilities", required: true },
    { role: "Recovery Coordinator", required: false },
    { role: "Communications Coordinator", required: false },
  ],
  excursion: [
    ...COMMON_ROLES,
    { role: "Student Coordinator", required: true },
    { role: "Communications Coordinator", required: false },
  ],
};

export function rolesForIncidentType(typeId) {
  const template = ROLE_TEMPLATES[typeId] || COMMON_ROLES;
  // Defer suggestStaffForRole until call time so this works on first load
  const allStaff = (loadAll().staff || []);
  return template.map((t, i) => {
    const matches = allStaff
      .filter((s) => s.qualifiedFor?.includes(t.role) && s.available)
      .sort((a, b) => a.name.localeCompare(b.name));
    const primary = matches[0];
    const backup = matches[1];
    return {
      id: `r${Date.now()}-${i}`,
      role: t.role,
      required: t.required,
      isPrincipal: t.isPrincipal || false,
      staff: "—",
      initials: "—",
      status: "unassigned",
      suggestedStaffId: primary?.id || null,
      suggested: primary?.name || null,
      backupStaffId: backup?.id || null,
      backup: backup?.name || null,
    };
  });
}

// ---------- ID generator ----------
function nextIncidentId(existingIncidents) {
  const today = new Date();
  const datePart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;
  const todaysIncidents = existingIncidents.filter((i) => i.id.includes(datePart));
  const seq = String(todaysIncidents.length + 1).padStart(3, "0");
  return `INC-${datePart}-${seq}`;
}

// ---------- Default tasks per type ----------
const DEFAULT_TASKS = {
  medical: ["Administer first aid", "Contact parent / guardian", "Log treatment", "Notify Principal"],
  mental_health: ["Notify Wellbeing Lead within 15 min", "Document in Wellbeing Register", "Contact parent (unless reporting trigger)", "Maintain supervision"],
  behavioural: ["De-escalate situation", "Separate parties involved", "Notify parents", "Document witness accounts"],
  missing: ["Begin coordinated search", "Notify parents immediately", "Check CCTV", "Prepare description for police"],
  bullying: ["Separate parties", "Document accounts from all parties", "Notify wellbeing team", "Contact parents of involved students"],
  lockdown: ["Lock all doors", "Account for all students", "Silent until all-clear", "Police liaison communication"],
  evacuation: ["Sound alarm", "Lead to assembly point", "Headcount", "Brief emergency services on arrival"],
  hazmat: ["Evacuate affected zone", "Contain if possible (do not approach)", "Call 000", "Hazmat team coordination"],
  natural_disaster: ["Move students to safe zone", "Account for all", "Communications to families", "Monitor weather/event updates"],
  parent_aggression: ["De-escalate at front office", "Move children away from area", "Document incident", "Consider AVO if threatening"],
  external_threat: ["Initiate lockdown if needed", "Police liaison", "Account for all students", "Restrict information flow"],
  transport: ["Confirm welfare of all students", "Contact parents of affected students", "Document accident details", "Notify head office"],
  death_oncampus: ["Call 000 — confirm services en route", "Restrict area", "Notify head office immediately", "Designate spokesperson"],
  death_offcampus: ["Notify staff via wellbeing channel", "Prepare communications for community", "Coordinate counsellor support", "Family liaison"],
  child_protection: ["Ensure the child's immediate safety", "Notify Principal / Child Protection lead", "Limit who is told — protect information", "Determine reporting obligations (do not investigate)"],
  disease_outbreak: ["Isolate affected individual(s)", "Notify Public Health Unit if required", "Communicate with families", "Arrange enhanced cleaning of affected areas"],
  cyber: ["Isolate affected systems (disconnect, do not power off)", "Notify IT and Principal immediately", "Preserve evidence — do not delete anything", "Prepare holding communication for families"],
  infrastructure: ["Make the affected area safe", "Assess impact on operations", "Decide on relocation or closure", "Notify affected staff and families"],
  excursion: ["Confirm welfare and headcount of all students", "Contact base / Principal immediately", "Contact parents of affected students", "Coordinate with local emergency services if required"],
};

export function tasksForIncidentType(typeId) {
  const items = DEFAULT_TASKS[typeId] || ["Document incident", "Notify Principal"];
  return items.map((text, i) => ({
    id: `tk${Date.now()}-${i}`,
    text,
    owner: "—",
    done: false,
    priority: i === 0 ? "high" : i < 2 ? "med" : "low",
  }));
}

// ---------- Create new incident ----------
export function createIncident({ type, severity, title, location, isDrill = false, roles = null }) {
  const typeMeta = INCIDENT_TYPES.find((t) => t.id === type);
  const allIncidents = loadAll().incidents;
  const id = nextIncidentId(allIncidents);
  const effectiveRoles = roles || rolesForIncidentType(type);
  const settings = loadAll().settings || {};
  const opener = settings.principalName || "Critical Incident Leader";
  const openerInitials = settings.principalInitials || "CIL";

  return {
    id,
    title: title || typeMeta.label,
    type,
    typeLabel: typeMeta.label,
    typeCategory: typeMeta.category,
    severity: severity || typeMeta.defaultSeverity,
    status: "active",
    isDrill,
    startedAt: Date.now(),
    closedAt: null,
    location: location || "Location not specified",
    empSection: typeMeta.emp,
    policies: defaultPoliciesForType(type),
    student: null,
    phase: "assessment",
    phaseChecks: {},
    roles: effectiveRoles,
    timeline: [
      {
        id: `t${Date.now()}`,
        ts: Date.now(),
        actor: opener,
        actorInitials: openerInitials,
        type: "system",
        text: `Incident opened. Initial severity: ${SEVERITY[severity || typeMeta.defaultSeverity].label}.`,
      },
    ],
    tasks: generateIncidentTasks(type, effectiveRoles),
  };
}

function defaultPoliciesForType(typeId) {
  const policies = {
    medical: [
      { id: "p1", name: "First Aid Procedure", section: "§3.1", type: "policy" },
      { id: "p2", name: "Medical Emergency Response", section: "§3", type: "emp" },
    ],
    mental_health: [
      { id: "p1", name: "Mandatory Reporting Procedure", section: "§2.1", type: "policy" },
      { id: "p2", name: "Student Wellbeing Framework", section: "§4", type: "policy" },
      { id: "p3", name: "Family Communication Protocol", section: "§7.2", type: "emp" },
    ],
    lockdown: [
      { id: "p1", name: "Lockdown Procedure", section: "§1.1", type: "emp" },
      { id: "p2", name: "Communications Protocol", section: "§7", type: "emp" },
    ],
    evacuation: [
      { id: "p1", name: "Evacuation Procedure", section: "§1.2", type: "emp" },
      { id: "p2", name: "Assembly Point Map", section: "§1.2.1", type: "emp" },
    ],
    death_oncampus: [
      { id: "p1", name: "Critical Incident: Death", section: "§9.1", type: "emp" },
      { id: "p2", name: "Media & Communications", section: "§7.5", type: "policy" },
      { id: "p3", name: "Post-Incident Wellbeing", section: "§10", type: "emp" },
    ],
    child_protection: [
      { id: "p1", name: "Child Protection Response", section: "§2.2", type: "emp" },
      { id: "p2", name: "Mandatory Reporting Procedure", section: "§2.1", type: "policy" },
      { id: "p3", name: "Allegations Against Staff", section: "§2.4", type: "policy" },
    ],
    disease_outbreak: [
      { id: "p1", name: "Public Health / Outbreak Response", section: "§12.1", type: "emp" },
      { id: "p2", name: "Infection Control Guidelines", section: "§12.2", type: "policy" },
    ],
    cyber: [
      { id: "p1", name: "Cyber & Data Incident Response", section: "§11.1", type: "emp" },
      { id: "p2", name: "Data Breach Notification", section: "§11.3", type: "policy" },
      { id: "p3", name: "IT Disaster Recovery Plan", section: "§11.4", type: "emp" },
    ],
    infrastructure: [
      { id: "p1", name: "Utilities & Infrastructure Failure", section: "§13.1", type: "emp" },
      { id: "p2", name: "Business Continuity Plan", section: "§13.2", type: "policy" },
    ],
    excursion: [
      { id: "p1", name: "Off-Site / Excursion Incident", section: "§8.4", type: "emp" },
      { id: "p2", name: "Excursion Risk Management", section: "§8.5", type: "policy" },
    ],
  };
  return policies[typeId] || [
    { id: "p1", name: "General Incident Procedure", section: "§1", type: "emp" },
    { id: "p2", name: "Reporting Requirements", section: "§2", type: "policy" },
  ];
}

// ---------- Sample seeded incidents (the "Load samples" button) ----------
export function buildSampleIncidents() {
  const now = Date.now();
  const minutes = (n) => n * 60 * 1000;

  const samples = [];

  // 1. Active L3 mental health (the original demo, now 23m old)
  samples.push({
    id: "INC-2026-0427-001",
    title: "Year 9 student welfare concern — D-Block bathroom",
    type: "mental_health",
    typeLabel: "Student Mental Health / Self-Harm",
    typeCategory: "student",
    severity: 3,
    status: "active",
    isDrill: false,
    startedAt: now - minutes(23),
    closedAt: null,
    location: "D-Block, Level 1, Bathroom B",
    empSection: "EMP §4.3 — Student Mental Health Crisis Response",
    policies: defaultPoliciesForType("mental_health"),
    phase: "response",
    phaseChecks: { as1: { done: true }, as7: { done: true }, as8: { done: true }, ac1: { done: true }, ac6: { done: true }, re1: { done: true } },
    boards: {
      facts: [{ id: "bd-s1", text: "Year 9 student located in D-Block bathroom — distressed but safe", ts: now - minutes(21) }],
      assumptions: [{ id: "bd-s2", text: "No physical injury; Ventolin not required", ts: now - minutes(20) }],
      issues: [{ id: "bd-s3", text: "Student refusing to contact parent directly", ts: now - minutes(4) }],
      actions: [{ id: "bd-s4", text: "Counsellor en route; parent contact pending Leader approval", ts: now - minutes(6) }],
    },
    peopleAtRisk: [
      { id: "pr-s1", name: "M.T. (Year 9)", category: "Student", status: "safe", location: "D-Block — with Wellbeing", nok: "Mother — not yet contacted (awaiting approval)", notes: "History of anxiety", updatedAt: now - minutes(3) },
    ],
    student: {
      initials: "M.T.",
      yearLevel: "Year 9",
      medicalAlerts: ["Asthma — Ventolin in office"],
      behaviourPlan: "Active — see counsellor file",
      emergencyContacts: [
        { name: "Parent 1", relation: "Mother", phone: "0412 ••• 678" },
        { name: "Parent 2", relation: "Father", phone: "0419 ••• 221" },
      ],
      knownRisks: "History of anxiety; recent disclosure to wellbeing team (March)",
      supportNotes: "Prefers female counsellor. Year advisor: Ms Nguyen.",
    },
    roles: [
      { id: "r1", role: "Critical Incident Leader", staff: "Adrian Johnson", initials: "AJ", status: "confirmed", required: true, isPrincipal: true },
      { id: "r2", role: "Support Coordinator", staff: "Jessica Sevil", initials: "JS", status: "confirmed", required: true },
      { id: "r3", role: "Planning Coordinator", staff: "Annika Fairley", initials: "AF", status: "confirmed", required: true },
      { id: "r4", role: "Student Coordinator", staff: "Simon Fairall", initials: "SF", status: "pending", required: true, backup: "David Smith" },
      { id: "r5", role: "Student Wellbeing Services Coordinator", staff: "Stephanie Kiesel", initials: "SK", status: "confirmed", required: true },
      { id: "r6", role: "Communications Coordinator", staff: "—", initials: "—", status: "unassigned", required: false, suggested: "Megan Whitsed" },
    ],
    timeline: [
      { id: "t1", ts: now - minutes(23), actor: "Adrian Johnson", actorInitials: "AJ", type: "system", text: "Incident opened. Initial severity: L3 Major." },
      { id: "t2", ts: now - minutes(22), actor: "Adrian Johnson", actorInitials: "AJ", type: "action", text: "Activated EMP §4.3 — Student Mental Health Crisis Response. CIMT stood up." },
      { id: "t3", ts: now - minutes(21), actor: "Stephanie Kiesel", actorInitials: "SK", type: "note", text: "On site with student. Calm but distressed. No visible injury. Ventolin not required." },
      { id: "t4", ts: now - minutes(18), actor: "Stephanie Kiesel", actorInitials: "SK", type: "note", text: "Wellbeing assessment underway. Counselling Services activated; external counsellor on standby." },
      { id: "t5", ts: now - minutes(14), actor: "Annika Fairley", actorInitials: "AF", type: "note", text: "Impact assessment: contained, single student, no operational impact. Level confirmed L3." },
      { id: "t6", ts: now - minutes(9), actor: "Simon Fairall", actorInitials: "SF", type: "note", text: "Drafting parent communication for Leader approval. Will not send without sign-off." },
      { id: "t7", ts: now - minutes(4), actor: "Stephanie Kiesel", actorInitials: "SK", type: "note", text: "Student refusing to call parent directly. Has agreed to remain on site with counsellor." },
    ],
    tasks: [
      { id: "tk1", text: "Contact parents/guardians once Leader approves", owner: "SF", done: false, priority: "high" },
      { id: "tk2", text: "Document the disclosure factually in the incident log", owner: "SK", done: false, priority: "med" },
      { id: "tk3", text: "Determine whether a mandatory report is required (ROSH)", owner: "SK", done: true, priority: "high" },
      { id: "tk4", text: "Notify Chair of College Council / AngliSchools if escalates", owner: "AJ", done: false, priority: "high" },
      { id: "tk5", text: "Schedule student check-in for tomorrow AM", owner: "SK", done: false, priority: "low" },
    ],
  });

  // 2. Active L2 medical, fresh
  samples.push({
    id: "INC-2026-0427-002",
    title: "Year 7 sports injury — ankle fracture suspected",
    type: "medical",
    typeLabel: "Medical / Injury",
    typeCategory: "student",
    severity: 2,
    status: "active",
    isDrill: false,
    startedAt: now - minutes(8),
    closedAt: null,
    location: "Oval — Eastern Field",
    empSection: "EMP §3.1 — Medical Emergency Response",
    policies: defaultPoliciesForType("medical"),
    phase: "response",
    phaseChecks: { as1: { done: true }, as7: { done: true } },
    student: null,
    roles: [
      { id: "r1", role: "Critical Incident Leader", staff: "Adrian Johnson", initials: "AJ", status: "confirmed", required: true, isPrincipal: true },
      { id: "r2", role: "Support Coordinator", staff: "Jessica Sevil", initials: "JS", status: "confirmed", required: true },
      { id: "r3", role: "Planning Coordinator", staff: "Annika Fairley", initials: "AF", status: "confirmed", required: true },
      { id: "r4", role: "Student Coordinator", staff: "—", initials: "—", status: "unassigned", required: true, suggested: "Simon Fairall" },
    ],
    timeline: [
      { id: "t1", ts: now - minutes(8), actor: "Adrian Johnson", actorInitials: "AJ", type: "system", text: "Incident opened. Initial severity: L2 Moderate." },
      { id: "t2", ts: now - minutes(7), actor: "Annika Fairley", actorInitials: "AF", type: "note", text: "ECO first aider on scene (Oval). Student conscious, ankle swollen, painful on weight-bearing." },
      { id: "t3", ts: now - minutes(3), actor: "Annika Fairley", actorInitials: "AF", type: "action", text: "Splint applied by first aider. Awaiting parent collection / ambulance decision." },
    ],
    tasks: tasksForIncidentType("medical"),
  });

  // 3. Closed L1 minor (yesterday)
  samples.push({
    id: "INC-2026-0426-003",
    title: "Minor playground scuffle — Year 5",
    type: "behavioural",
    typeLabel: "Behavioural / Violent Incident",
    typeCategory: "student",
    severity: 1,
    status: "closed",
    isDrill: false,
    startedAt: now - minutes(60 * 26),
    closedAt: now - minutes(60 * 24),
    location: "Lower playground",
    empSection: "EMP §5.2 — Behavioural Crisis Response",
    policies: defaultPoliciesForType("behavioural"),
    student: null,
    roles: [
      { id: "r1", role: "Critical Incident Leader", staff: "Adrian Johnson", initials: "AJ", status: "confirmed", required: true, isPrincipal: true },
      { id: "r2", role: "Support Coordinator", staff: "Jessica Sevil", initials: "JS", status: "confirmed", required: true },
      { id: "r3", role: "Student Coordinator", staff: "Simon Fairall", initials: "SF", status: "confirmed", required: true },
      { id: "r4", role: "Student Wellbeing Services Coordinator", staff: "Stephanie Kiesel", initials: "SK", status: "confirmed", required: true },
    ],
    timeline: [
      { id: "t1", ts: now - minutes(60 * 26), actor: "Adrian Johnson", actorInitials: "AJ", type: "system", text: "Incident opened. Initial severity: L1 Minor." },
      { id: "t2", ts: now - minutes(60 * 26 - 5), actor: "Stephanie Kiesel", actorInitials: "SK", type: "note", text: "Two students separated and spoken with individually. No injuries." },
      { id: "t3", ts: now - minutes(60 * 25), actor: "Simon Fairall", actorInitials: "SF", type: "action", text: "Both sets of parents notified by phone." },
      { id: "t4", ts: now - minutes(60 * 24), actor: "Adrian Johnson", actorInitials: "AJ", type: "system", text: "Incident closed. Resolution: minor disagreement, both students reconciled, restorative conversation completed." },
    ],
    tasks: [
      { id: "tk1", text: "Restorative conversation with both students", owner: "SK", done: true, priority: "high" },
      { id: "tk2", text: "Notify both sets of parents", owner: "SF", done: true, priority: "high" },
      { id: "tk3", text: "Log in behaviour register", owner: "JS", done: true, priority: "med" },
    ],
  });

  // 4. Drill — recent evacuation
  samples.push({
    id: "INC-2026-0426-004",
    title: "Term 2 evacuation drill — whole school",
    type: "evacuation",
    typeLabel: "Fire / Evacuation",
    typeCategory: "school",
    severity: 1,
    status: "closed",
    isDrill: true,
    startedAt: now - minutes(60 * 30),
    closedAt: now - minutes(60 * 29),
    location: "Whole campus → Lower Oval assembly point",
    empSection: "EMP §1.2 — Evacuation Procedure",
    policies: defaultPoliciesForType("evacuation"),
    student: null,
    roles: [
      { id: "r1", role: "Critical Incident Leader", staff: "Adrian Johnson", initials: "AJ", status: "confirmed", required: true, isPrincipal: true },
      { id: "r2", role: "Support Coordinator", staff: "Jessica Sevil", initials: "JS", status: "confirmed", required: true },
      { id: "r3", role: "Planning Coordinator", staff: "Annika Fairley", initials: "AF", status: "confirmed", required: true },
      { id: "r4", role: "College Services", staff: "Matt Everon", initials: "ME", status: "confirmed", required: true },
      { id: "r5", role: "Facilities", staff: "Warwick Rolls", initials: "WR", status: "confirmed", required: true },
      { id: "r6", role: "Communications Coordinator", staff: "Megan Whitsed", initials: "MW", status: "confirmed", required: true },
    ],
    timeline: [
      { id: "t1", ts: now - minutes(60 * 30), actor: "Adrian Johnson", actorInitials: "AJ", type: "system", text: "Drill commenced. Type: Fire / Evacuation. ECO (warden team) leading the evacuation per the ERP; CIMT coordinating." },
      { id: "t2", ts: now - minutes(60 * 30 - 4), actor: "Annika Fairley", actorInitials: "AF", type: "note", text: "Chief Warden reports all 487 students accounted for at assembly point. Time: 4 min 12 sec." },
      { id: "t3", ts: now - minutes(60 * 29), actor: "Adrian Johnson", actorInitials: "AJ", type: "system", text: "Drill closed. Performance: Within target. Minor delay in C-Block staircase noted for review." },
    ],
    tasks: [
      { id: "tk1", text: "Confirm whole-site headcount from the Chief Warden", owner: "AF", done: true, priority: "high" },
      { id: "tk2", text: "Confirm assembly-area management and re-entry point", owner: "ME", done: true, priority: "high" },
      { id: "tk3", text: "Log drill in compliance register", owner: "JS", done: true, priority: "med" },
    ],
  });

  return samples;
}

// ---------- localStorage operations ----------
function defaultState() {
  return {
    incidents: [],
    staff: buildCimtRoster(),
    settings: {
      principalName: "Adrian Johnson",
      principalInitials: "AJ",
      schoolName: "Trinity Anglican College",
    },
    version: 3,
  };
}

// Seed the real TAC CIMT roster from the CIM & BCP (V0.3): primary
// role-holders + the alternate bench, mapped to the 13 CIMT roles.
// Names + positions only — personal contact numbers are intentionally
// NOT stored here; they are captured per-staff in-app (and, once the
// backend lands, under RBAC). Alternates carry their role as a backup
// (secondaryRoles) so they surface as failover candidates, not primaries.
function buildCimtRoster() {
  const P = (firstName, lastName, jobTitle, department, primaryRole, otherQualifiedRoles = []) =>
    newStaffMember({ firstName, lastName, jobTitle, department, primaryRole, otherQualifiedRoles });
  const A = (firstName, lastName, jobTitle, department, backupRole) =>
    newStaffMember({ firstName, lastName, jobTitle, department, primaryRole: "", secondaryRoles: [backupRole] });
  return [
    // --- Primary CIMT ---
    P("Adrian", "Johnson", "Principal", "Executive", "Critical Incident Leader"),
    P("Jessica", "Sevil", "Executive Assistant – Principal", "Executive", "Support Coordinator"),
    P("Annika", "Fairley", "Risk & Compliance Officer", "Operations", "Planning Coordinator", ["Recovery Coordinator"]),
    P("Stephanie", "Gardiner", "Human Resources Officer", "Operations", "Staff Coordinator"),
    P("Stephanie", "Kiesel", "Student Wellbeing Services Coordinator", "Wellbeing", "Student Wellbeing Services Coordinator"),
    P("Simon", "Fairall", "Head of Junior School", "Teaching", "Student Coordinator"),
    P("Sharon", "Finlay", "Business Manager", "Operations", "College Services"),
    P("Matt", "Everon", "Facilities Manager", "Facilities", "Facilities", ["College Services"]),
    P("Megan", "Whitsed", "Marketing Manager", "Marketing", "Communications Coordinator"),
    P("Scott", "Barlow", "IT Manager", "IT", "Recovery – IT Coordinator"),
    P("Nash", "Clark", "Director of Teaching & Learning", "Teaching", "Recovery – Curriculum", ["Recovery Coordinator"]),
    P("Jarrod", "Monaghan", "Dean of Activities", "Activities", "Recovery – Co-Curriculum"),
    // --- Alternate bench ---
    A("Kathy", "Fletcher", "Deputy Principal", "Executive", "Critical Incident Leader"),
    A("Sue", "James", "Senior School Attendance Officer", "Operations", "Support Coordinator"),
    A("Victoria", "Fordham", "Academic Admin Officer", "Operations", "Support Coordinator"),
    A("Angela", "Phillips", "Administration Assistant", "Operations", "Support Coordinator"),
    A("Natisha", "Harrison", "Payroll Officer", "Operations", "Staff Coordinator"),
    A("David", "Smith", "Head of Senior School", "Teaching", "Student Coordinator"),
    A("Lydia", "Billington", "Kindy Coordinator", "Teaching", "Student Coordinator"),
    A("Warwick", "Rolls", "Facilities & Groundsman", "Facilities", "Facilities"),
    A("Tegan", "Hull", "Marketing & Events Officer", "Marketing", "Communications Coordinator"),
    A("Sean", "Colemen", "IT Systems Administrator", "IT", "Recovery – IT Coordinator"),
    A("Stephanie", "Davis", "Dean of Studies Senior", "Teaching", "Recovery – Curriculum"),
    A("Lauren", "Naldrett", "Dean of Studies Junior", "Teaching", "Recovery – Curriculum"),
    A("Linda", "Jensen", "Activities Administration Officer", "Activities", "Recovery – Co-Curriculum"),
  ];
}

export function loadAll() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

export function saveAll(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Could not save state:", e);
  }
}

export function getIncident(id) {
  return loadAll().incidents.find((i) => i.id === id) || null;
}

export function saveIncident(incident) {
  const state = loadAll();
  const idx = state.incidents.findIndex((i) => i.id === incident.id);
  if (idx >= 0) {
    state.incidents[idx] = incident;
  } else {
    state.incidents.unshift(incident);
  }
  saveAll(state);
}

export function deleteIncident(id) {
  const state = loadAll();
  state.incidents = state.incidents.filter((i) => i.id !== id);
  saveAll(state);
}

export function loadSampleData() {
  const state = loadAll();
  const samples = buildSampleIncidents();
  // Don't duplicate
  const existingIds = new Set(state.incidents.map((i) => i.id));
  for (const s of samples) {
    if (!existingIds.has(s.id)) state.incidents.push(s);
  }
  // Seed the real CIMT roster if the directory is empty (existing installs).
  if (!state.staff || state.staff.length === 0) state.staff = buildCimtRoster();
  saveAll(state);
}

export function resetAll() {
  localStorage.removeItem(STORAGE_KEY);
}

export function listIncidents() {
  return loadAll().incidents;
}

// ============================================================
// v3 — STAFF MANAGEMENT, ROLE DEFINITIONS & RESPONSIBILITIES
// ============================================================

// Master list of all role types CIMPLE knows about.
// Each role has a description and reporting line.
// The 13 CIMT roles from the TAC Critical Incident & Business Continuity
// Management Plan (V0.3). Descriptions + reporting lines are the plan's.
export const ROLE_DEFINITIONS = {
  "Critical Incident Leader": {
    description: "Manages and coordinates the incident protocol and procedures. Assumes control, sets objectives, determines the incident level and which CIMT roles to activate, is the media spokesperson, and approves all external communications. Uses the Critical Incident Escalation Checklist to guide actions start to finish.",
    reportsTo: "Chair of College Council / CEO of AngliSchools (escalation)",
    typicallyHeldBy: "Principal (Adrian Johnson); alternate Deputy Principal",
  },
  "Support Coordinator": {
    description: "Supports the administrative functions of the CIMT: notifies members (WhatsApp/Teams), activates and runs the Critical Incident Control Room, initiates and maintains the incident log, establishes the visual boards (Facts/Assumptions/Issues/Actions) and CIMT meeting schedule.",
    reportsTo: "Critical Incident Leader",
    typicallyHeldBy: "Executive Assistant – Principal (Jessica Sevil)",
  },
  "Planning Coordinator": {
    description: "Intelligence gathering and impact assessment to guide CIMT planning. Confirms scene facts, maintains liaison with the Chief Warden and emergency services, conducts the impact & issues assessment, monitors sources (BOM, emergency services), and develops the Incident Action Plan.",
    reportsTo: "Critical Incident Leader",
    typicallyHeldBy: "Risk & Compliance Officer (Annika Fairley)",
  },
  "Staff Coordinator": {
    description: "Identifies staff at risk and manages ongoing staff wellbeing. Contacts families of injured staff, maintains contact with hospitalised staff, manages fatigue/trauma/IR issues, and arranges debriefing/EAP and counselling.",
    reportsTo: "Critical Incident Leader",
    typicallyHeldBy: "Human Resources Officer (Stephanie Gardiner)",
  },
  "Student Coordinator": {
    description: "Identifies students at risk and manages ongoing student wellbeing. Locates students (on/off campus), contacts parents/guardians of injured students, maintains the parent staging area, and arranges counselling and debriefing.",
    reportsTo: "Critical Incident Leader",
    typicallyHeldBy: "Head of Junior/Senior School (Simon Fairall)",
  },
  "Student Wellbeing Services Coordinator": {
    description: "Coordinates psychological and counselling support. Activates College Counselling Services, identifies at-risk students and staff, develops support plans, and coordinates internal and external counsellors (WWCC, code of conduct).",
    reportsTo: "Student Coordinator",
    typicallyHeldBy: "Student Wellbeing Services Coordinator (Stephanie Kiesel)",
  },
  "College Services": {
    description: "Establishes the operational plan for on-the-ground responses. Coordinates operations at the scene, oversees staging areas (Control Room, Assembly, Triage, Media, Counselling/Wellbeing Hub), containment, security, alternate-site activation, transport and physical resources.",
    reportsTo: "Critical Incident Leader",
    typicallyHeldBy: "Business Manager (Sharon Finlay)",
  },
  "Facilities": {
    description: "Supports College Services with facilities and grounds. Makes affected areas safe, monitors life-essential services, assists with barriers/signage/containment, considers utility shut-off (water/gas/power), and supports clean-up.",
    reportsTo: "College Services",
    typicallyHeldBy: "Facilities Manager (Matt Everon)",
  },
  "Communications Coordinator": {
    description: "Communicates to internal and external stakeholders. Drafts the holding statement for Leader approval, briefs reception, monitors media/social, assesses the comms exposure level (1–4), confirms the communications strategy, and prepares key messages and the FAQ single-source-of-truth. All comms route through this role before Leader sign-off.",
    reportsTo: "Critical Incident Leader",
    typicallyHeldBy: "Marketing Manager (Megan Whitsed)",
  },
  "Recovery Coordinator": {
    description: "Maintains critical business functions and determines incident-related expenditure for approval. Runs impact assessments on critical business functions, establishes workarounds for functions that can't meet their RTO, activates alternate sites/relocation, manages insurance, and facilitates phased resumption.",
    reportsTo: "Critical Incident Leader",
    typicallyHeldBy: "Risk & Compliance Officer (Annika Fairley); alternate Director of Teaching & Learning",
  },
  "Recovery – IT Coordinator": {
    description: "Leads IT recovery. Conducts the IT impact assessment, implements the IT Disaster Recovery Plan, approves back-up IT accesses, and reports status to the Recovery Coordinator.",
    reportsTo: "Recovery Coordinator",
    typicallyHeldBy: "IT Manager (Scott Barlow)",
  },
  "Recovery – Curriculum": {
    description: "Continuity of curriculum delivery. Reviews the impact on curriculum, establishes a continuity plan, decides timetable/scheduling changes, and communicates changes and event/excursion decisions to staff and students.",
    reportsTo: "Recovery Coordinator",
    typicallyHeldBy: "Director of Teaching & Learning (Nash Clark)",
  },
  "Recovery – Co-Curriculum": {
    description: "Continuity of co-curricular activities (sport, music, tours). Reviews the impact on co-curricular programs, contacts departments with out-of-hours responsibilities, and communicates changes to families and staff.",
    reportsTo: "Recovery Coordinator",
    typicallyHeldBy: "Dean of Activities (Jarrod Monaghan)",
  },
};

// ------------------------------------------------------------------
// CIMT ROLE CHECKLISTS — the plan's incident-agnostic role checklists
// (CIM & BCP V0.3 §4.2–4.9). These are each role's standing actions for
// ANY incident; the general Escalation Checklist covers most incidents,
// with type-specific response procedures adding unique steps (Pivot 3).
// Used as the baseline task/responsibility source for every CIMT role.
// { text, due (min), approval, mandatory }.
// ------------------------------------------------------------------
export const CIMT_ROLE_CHECKLISTS = {
  "Critical Incident Leader": [
    { text: "Assume control; use the Critical Incident Escalation Checklist to guide actions start to finish", due: 5 },
    { text: "Conduct an incident assessment and determine the incident level", due: 10 },
    { text: "Determine which CIMT members and roles are required", due: 10 },
    { text: "Formally declare a Critical Incident", due: 10 },
    { text: "Notify the Chair of College Council and CEO of AngliSchools", due: 20, mandatory: true },
    { text: "Assume responsibility as media spokesperson for the College", due: 20 },
    { text: "Approve the communications strategy and all external communications", due: 20, approval: true },
    { text: "Provide regular briefings to CIMT, Council, AngliSchools, media, parents, students", due: 30 },
    { text: "Arrange a Post-Incident Review within 7 days of the incident", due: 300 },
  ],
  "Support Coordinator": [
    { text: "When directed, notify CIMT members via WhatsApp and call out support personnel", due: 5 },
    { text: "Set up the incident Teams channel (incident name + date); copy templates from the General channel", due: 10 },
    { text: "Activate the Critical Incident Control Room (Boardroom) and confirm equipment is operational", due: 10 },
    { text: "Initiate and maintain the incident log", due: 10 },
    { text: "Establish the visual boards — Facts, Assumptions, Issues, Actions, CIMT structure, Impact", due: 15 },
    { text: "Establish the CIMT meeting schedule and shift rosters", due: 20 },
    { text: "For an extended disruption, organise food, water and accommodation", due: 120 },
  ],
  "Planning Coordinator": [
    { text: "Confirm the safe, orderly evacuation of staff, students and visitors from the affected site", due: 10 },
    { text: "Maintain liaison with the Chief Warden, emergency services and the Critical Incident Leader", due: 10 },
    { text: "Gather information: what/when/where, injuries, escalation, media, and source reliability", due: 10 },
    { text: "Conduct the impact & issues assessment to determine severity and the response procedure", due: 20 },
    { text: "Monitor sources of information (BOM, emergency-services websites)", due: 20 },
    { text: "Develop the Incident Action Plan / briefing", due: 30 },
  ],
  "Staff Coordinator": [
    { text: "Assess current and potential people risks; identify vulnerable staff and visitors", due: 10 },
    { text: "Contact families of injured staff; maintain contact with hospitalised staff", due: 15 },
    { text: "Manage fatigue, trauma awareness and any industrial-relations issues", due: 25 },
    { text: "Arrange debriefing/EAP for at-risk staff and counselling as needed", due: 30 },
    { text: "Monitor the wellbeing of staff", due: 45 },
  ],
  "Student Coordinator": [
    { text: "Identify the location of students (on campus / off campus)", due: 8 },
    { text: "Assess current and potential student risks; identify vulnerable students", due: 10 },
    { text: "Contact parents/guardians of injured students", due: 15, approval: true },
    { text: "Maintain contact with hospitalised students and their families", due: 20 },
    { text: "Maintain the parent liaison at the parent staging area", due: 30 },
    { text: "Arrange counselling and debriefing for at-risk students", due: 30 },
  ],
  "Student Wellbeing Services Coordinator": [
    { text: "Activate College Counselling Services", due: 10 },
    { text: "Identify students and staff at risk of trauma and develop support plans", due: 20 },
    { text: "Coordinate internal and external counsellors (WWCC, code of conduct)", due: 30 },
    { text: "Monitor at-risk individuals and any memorial sites over time", due: 60 },
  ],
  "College Services": [
    { text: "Develop operational objectives in line with the Leader's incident objectives", due: 10 },
    { text: "Coordinate operations at the incident scene and any responding staff", due: 10 },
    { text: "Oversee staging areas: Control Room, Assembly Area, Triage, Media, Counselling (Wellbeing Hub)", due: 15 },
    { text: "Contain the incident area (barriers, signage) and organise security", due: 15 },
    { text: "Activate alternate site(s); organise transport if required", due: 25 },
    { text: "Procure and maintain physical resources and materials", due: 25 },
  ],
  "Facilities": [
    { text: "Make affected areas safe; monitor life-essential services (e.g. smoke detectors)", due: 10 },
    { text: "Assist with barriers, signage and containment", due: 15 },
    { text: "Consider shutting down utilities (water/gas/power) if required", due: 15 },
    { text: "Support site clean-up and asset-register updates", due: 60 },
  ],
  "Communications Coordinator": [
    { text: "Draft a holding statement for the Critical Incident Leader to approve", due: 15, approval: true },
    { text: "Email all staff the holding statement + reminder to refer media on and not post to social media", due: 20, approval: true },
    { text: "Brief reception with a script for calls and enquiries", due: 20 },
    { text: "Allocate a team member to monitor social media", due: 20 },
    { text: "Assess the comms exposure level (1–4) and confirm the communications strategy", due: 25 },
    { text: "Prepare key messages and the FAQ single-source-of-truth for Leader approval", due: 30, approval: true },
    { text: "Coordinate the media staging area and spokesperson preparation", due: 35 },
  ],
  "Recovery Coordinator": [
    { text: "Conduct impact assessments to determine effects on critical business functions", due: 20 },
    { text: "Identify functions that cannot meet their RTO and establish workarounds", due: 30 },
    { text: "Activate alternate site(s) and staff/student relocation as needed", due: 30 },
    { text: "Manage insurance requirements during the incident", due: 45 },
    { text: "Facilitate the phased resumption of operations", due: 120 },
  ],
  "Recovery – IT Coordinator": [
    { text: "Conduct an IT impact assessment to determine the extent of disruption", due: 20 },
    { text: "Lead IT recovery and implement the IT Disaster Recovery Plan", due: 30 },
    { text: "Approve back-up IT accesses and privileges", due: 40 },
    { text: "Provide the Recovery Coordinator with regular status updates", due: 60 },
  ],
  "Recovery – Curriculum": [
    { text: "Review the impact on curriculum delivery and establish a continuity plan", due: 30 },
    { text: "Decide timetable/scheduling changes; coordinate assemblies and staff meetings", due: 40 },
    { text: "Communicate changes to staff and students; make event/excursion decisions", due: 45 },
  ],
  "Recovery – Co-Curriculum": [
    { text: "Review the impact on co-curricular activities (sport, music, tours)", due: 30 },
    { text: "Contact departments with out-of-hours responsibilities and advise of changes", due: 40 },
    { text: "Communicate co-curricular changes to families and staff", due: 45 },
  ],
};

// ------------------------------------------------------------------
// RESPONSE PROCEDURES — the plan's type-specific unique steps
// (CIM & BCP V0.3 §5.x), mapped to CIMT roles and enriched with the
// NSW statutory hooks validated 2026-07-07 (enrich-don't-override:
// the plan's procedures are thin on statutory specifics). The general
// escalation checklist (the phase model) covers most incidents; these
// add the unique, type-specific steps. Purely on-the-ground clinical /
// warden steps stay with the ECO (ERP) and are deliberately omitted.
// { text, responsible (a CIMT role in this type's template), due (min),
//   approval, mandatory }.
// ------------------------------------------------------------------
export const RESPONSE_PROCEDURES = {
  missing: [
    { text: "Escalate to Police (000) early on any welfare concern — do not impose an arbitrary wait; initial search max 10–15 min", responsible: "Critical Incident Leader", due: 15, mandatory: true },
    { text: "Confirm the student actually arrived today (cross-check the morning roll); check custody / AVO flags before contacting a parent", responsible: "Planning Coordinator", due: 8 },
    { text: "Direct an immediate, methodical search via the ECO/warden team — assign staff to zones; check bathrooms, sick bay, library, friends' classes", responsible: "College Services", due: 10 },
    { text: "Preserve gate/exit CCTV for the student's last movements before it overwrites; hand a description, recent photo and site map to Police", responsible: "College Services", due: 15 },
    { text: "Contact the parent/carer once authorised; ask about friends, habits or likely locations; provide a single College point of contact", responsible: "Student Coordinator", due: 15, approval: true },
  ],
  child_protection: [
    { text: "Ensure the child is safe and separated from any alleged source of harm; do NOT question the child, investigate, or warn the alleged person", responsible: "Critical Incident Leader", due: 5, mandatory: true },
    { text: "Assess Risk of Significant Harm (ROSH) using the Mandatory Reporter Guide; report suspected ROSH to the DCJ Child Protection Helpline (132 111) as soon as practicable", responsible: "Critical Incident Leader", due: 30, mandatory: true },
    { text: "If the allegation is against a staff member: stand them down from child-related duties (a risk step, not a finding) and notify the Office of the Children's Guardian within 7 business days (Reportable Conduct)", responsible: "Critical Incident Leader", due: 45, mandatory: true, approval: true },
    { text: "Report to NSW Police if a criminal offence is suspected; follow Police direction", responsible: "Planning Coordinator", due: 20, mandatory: true },
    { text: "Stay with the child; record only what the child said in their exact words; do not note details on SEQTA", responsible: "Student Wellbeing Services Coordinator", due: 15 },
    { text: "Consult Police/DCJ before contacting family (notification may be inappropriate if family are involved); provide a single point of contact", responsible: "Student Coordinator", due: 20, approval: true },
  ],
  medical: [
    { text: "Decide ambulance (000) vs parent transport on first-aid advice; brief arriving paramedics", responsible: "Critical Incident Leader", due: 10, approval: true },
    { text: "If serious injury or death, notify SafeWork NSW immediately (13 10 50) — notifiable incident; preserve the scene (you may still aid the injured)", responsible: "Critical Incident Leader", due: 20, mandatory: true },
    { text: "Contact the emergency contact; factual information only — do not speculate on diagnosis", responsible: "Student Coordinator", due: 10, approval: true },
    { text: "Support the on-ground first-aider and triage staging; escort paramedics on arrival", responsible: "Planning Coordinator", due: 15 },
  ],
  mental_health: [
    { text: "Confirm the student is safe, supervised and any means of harm is removed; decide whether 000 / medical is required", responsible: "Critical Incident Leader", due: 10, mandatory: true },
    { text: "Stay with the student; document the disclosure factually in their own words; when briefing family/staff describe in general terms — do NOT broadcast the method (safe-messaging)", responsible: "Student Wellbeing Services Coordinator", due: 15 },
    { text: "Determine whether the Risk of Significant Harm threshold is met (DCJ 132 111)", responsible: "Critical Incident Leader", due: 15, mandatory: true },
    { text: "Contact family once approved (involving parents is the norm for a student at risk)", responsible: "Student Coordinator", due: 20, approval: true },
  ],
  behavioural: [
    { text: "Direct de-escalation and separation of those involved; decide whether Police (000) are required", responsible: "Critical Incident Leader", due: 5 },
    { text: "Determine whether the incident meets Risk of Significant Harm — if so, report to DCJ (132 111)", responsible: "Critical Incident Leader", due: 15, mandatory: true },
    { text: "Check on each party's welfare individually — support, not interrogation; ensure any injured party gets first aid", responsible: "Student Wellbeing Services Coordinator", due: 15 },
    { text: "Record what staff directly observed, factually — do not run formal witness interviews (manage, don't investigate)", responsible: "Support Coordinator", due: 20 },
  ],
  bullying: [
    { text: "Decide the response pathway (restorative/disciplinary/report); determine if it is a child-protection or Police matter", responsible: "Critical Incident Leader", due: 20, approval: true },
    { text: "Support the affected student and document their account; if it may be a CP/Police matter, do NOT interview the alleged student(s)", responsible: "Student Wellbeing Services Coordinator", due: 20, mandatory: true },
    { text: "Contact the parents of the students involved separately; factual information and next steps", responsible: "Student Coordinator", due: 30, approval: true },
  ],
  lockdown: [
    { text: "Confirm the trigger and initiate the lockdown alert/PA; make the all-clear decision only when Police confirm it is safe", responsible: "Critical Incident Leader", due: 5, mandatory: true },
    { text: "Call 000: state 'school in lockdown', location, nature of threat, numbers on site, access points; relay Police instructions", responsible: "Planning Coordinator", due: 5, mandatory: true },
    { text: "Account for all visitors and contractors on site; confirm whole-site status via the ECO/wardens", responsible: "College Services", due: 15 },
    { text: "Instruct families NOT to attend or phone the College; hold all external comms until Leader sign-off", responsible: "Communications Coordinator", due: 20, approval: true },
  ],
  evacuation: [
    { text: "Authorise evacuation; call 000 (Fire & Rescue) if fire is confirmed; authorise re-entry only when services confirm it is safe", responsible: "Critical Incident Leader", due: 5, mandatory: true },
    { text: "If a death, serious injury/illness or dangerous incident, notify SafeWork NSW immediately (13 10 50)", responsible: "Critical Incident Leader", due: 25, mandatory: true },
    { text: "Confirm the whole-site reconciled headcount from the Chief Warden — incl. visitors and contractors", responsible: "Planning Coordinator", due: 20 },
    { text: "Prepare the parent notification and a 'do not come to the College' message — hold until approved", responsible: "Communications Coordinator", due: 25, approval: true },
  ],
  hazmat: [
    { text: "Call 000 (Fire & Rescue/Hazmat); establish an exclusion zone upwind AND uphill; provide the Safety Data Sheet to emergency services", responsible: "Critical Incident Leader", due: 5, mandatory: true },
    { text: "Consider shutting down utilities (water/gas/power) if required; where risk spreads beyond the boundary, notify neighbours and community", responsible: "College Services", due: 10 },
    { text: "An uncontrolled chemical release is a notifiable dangerous incident — notify SafeWork NSW immediately (13 10 50)", responsible: "Critical Incident Leader", due: 20, mandatory: true },
    { text: "For anyone exposed, call the Poisons Information Centre (13 11 26) for first-aid/decontamination advice; follow emergency-services direction", responsible: "College Services", due: 12 },
  ],
  natural_disaster: [
    { text: "Monitor official warnings (Hazards Near Me NSW / NSW SES 132 500 / Bureau of Meteorology); decide shelter-in-place vs evacuation vs early closure", responsible: "Critical Incident Leader", due: 5, mandatory: true, approval: true },
    { text: "Secure loose assets; for floods move critical equipment to higher ground; check for and remove hazardous tree limbs", responsible: "College Services", due: 15 },
    { text: "Review scheduled off-campus activities for anyone in danger areas; liaise with partner organisations", responsible: "Planning Coordinator", due: 15 },
    { text: "Prepare parent communications on status, arrangements and any transport/road-closure impacts", responsible: "Communications Coordinator", due: 25, approval: true },
  ],
  disease_outbreak: [
    { text: "Isolate affected individual(s); for a school-notifiable condition (measles, mumps, rubella, whooping cough, meningococcal, diphtheria, Hib, polio, tetanus, or 2+ linked gastro cases) notify the local Public Health Unit (1300 066 055) as soon as possible; follow PHU directions", responsible: "Critical Incident Leader", due: 15, mandatory: true },
    { text: "Decide on enhanced cleaning, cohorting or partial closure; apply NSW Health exclusion periods (case exclusion + return-to-school timing)", responsible: "College Services", due: 20, approval: true },
    { text: "Draft a factual parent notification (symptoms, actions, advice); coordinate wording with the Public Health Unit", responsible: "Communications Coordinator", due: 30, approval: true },
    { text: "Contact affected families with collection and health advice", responsible: "Student Coordinator", due: 25, approval: true },
  ],
  cyber: [
    { text: "Direct IT to isolate affected systems (disconnect, do NOT power off); decide whether to switch to manual/paper business-continuity mode", responsible: "Critical Incident Leader", due: 5, approval: true },
    { text: "Preserve evidence (do not delete logs/emails/files); analyse scope; do NOT restore back-ups until the threat is eliminated; contact the ACSC (1300 CYBER1 · 1300 292 371)", responsible: "Recovery – IT Coordinator", due: 15, mandatory: true },
    { text: "Report the incident to ReportCyber (cyber.gov.au); if a ransom is considered, check the 72-hour reporting duty (Cyber Security Act 2024)", responsible: "Critical Incident Leader", due: 30, mandatory: true, approval: true },
    { text: "If personal data is involved, assess as a Notifiable Data Breach (≤30 days) and notify the OAIC + affected individuals as soon as practicable", responsible: "Communications Coordinator", due: 45, mandatory: true, approval: true },
    { text: "Switch reception to manual sign-in/out and phone processes; keep a manual log while systems are down", responsible: "College Services", due: 15 },
  ],
  infrastructure: [
    { text: "Make the affected area safe and restrict access; call 000 if there is any danger (gas/electrical/structural)", responsible: "Critical Incident Leader", due: 5, mandatory: true },
    { text: "Suspected gas leak: evacuate; do NOT operate switches, phones or naked flames; ventilate; call 000 and the gas network — 1800 GAS LEAK (1800 427 532)", responsible: "Facilities", due: 5, mandatory: true },
    { text: "A gas/electrical/structural failure creating serious risk is a notifiable dangerous incident even with no injury — notify SafeWork NSW immediately (13 10 50)", responsible: "Critical Incident Leader", due: 15, mandatory: true },
    { text: "Decide on relocation, early closure or continuation; notify relevant suppliers/contractors", responsible: "Recovery Coordinator", due: 20, approval: true },
  ],
  parent_aggression: [
    { text: "Ensure children are moved away; direct de-escalation by a trained staff member; call 000 if there is a threat of violence", responsible: "Critical Incident Leader", due: 5, mandatory: true },
    { text: "Keep the front office calm; maintain distance; control access — do not admit the person further into the school; alert nearby staff discreetly", responsible: "College Services", due: 10 },
    { text: "Decide whether to issue a written, principal-signed Ban Notice withdrawing consent to enter (Inclosed Lands Protection Act 1901)", responsible: "Critical Incident Leader", due: 20, approval: true },
    { text: "Record what was said/done with times and witnesses; if a Ban Notice is issued, record how and when it was served (to prove service)", responsible: "Support Coordinator", due: 20 },
  ],
  external_threat: [
    { text: "Assess the threat and decide the protective action — apply Escape. Hide. Tell. (NSW Police): escape if a safe route exists, otherwise hide; all-clear only when Police confirm safe", responsible: "Critical Incident Leader", due: 5, approval: true },
    { text: "Call 000 when safe; give Police the threat details, location and site access; relay Police instructions", responsible: "Planning Coordinator", due: 5, mandatory: true },
    { text: "Account for all students, staff and visitors; secure zones per the lockdown protocol via the ECO", responsible: "College Services", due: 20 },
    { text: "Hold a single Leader-approved message (do not come / do not phone); prepare parent updates for after the all-clear", responsible: "Communications Coordinator", due: 20, approval: true },
  ],
  transport: [
    { text: "Ensure 000 (ambulance/Police) is called for any injury; a death/serious injury/dangerous incident arising from the school's activity is notifiable — notify SafeWork NSW immediately (13 10 50)", responsible: "Critical Incident Leader", due: 15, mandatory: true },
    { text: "If a bus was involved: ensure the operator notifies OTSI immediately (1800 677 766) and Transport for NSW within 3 days — do it if College-run, confirm it if contracted", responsible: "Critical Incident Leader", due: 20, mandatory: true },
    { text: "Contact parents of affected students with factual updates; coordinate attendance at the scene or hospital", responsible: "Student Coordinator", due: 20, approval: true },
    { text: "Prepare a holding statement for the wider community", responsible: "Communications Coordinator", due: 30, approval: true },
  ],
  excursion: [
    { text: "Ensure local 000 is called for any emergency; a death/serious injury/dangerous incident on the excursion is notifiable — notify SafeWork NSW (13 10 50); if a bus was involved the OTSI/TfNSW duty also applies", responsible: "Critical Incident Leader", due: 15, mandatory: true },
    { text: "Confirm the off-campus leader has assumed control and is using their off-campus guide; schedule regular updates", responsible: "Planning Coordinator", due: 10 },
    { text: "Decide whether to continue, relocate or return; coordinate with the venue and local emergency services", responsible: "Critical Incident Leader", due: 20, approval: true },
    { text: "Contact parents of affected students with factual updates; coordinate collection/travel; secure student devices for the return journey", responsible: "Student Coordinator", due: 25, approval: true },
  ],
  death_oncampus: [
    { text: "Confirm emergency services are en route — do NOT move the deceased; restrict and screen access; notify head office/AngliSchools by phone; designate a single spokesperson", responsible: "Critical Incident Leader", due: 5, mandatory: true },
    { text: "Preserve the scene — a death on site is reportable to the Coroner; Police will manage it; maintain sole Police liaison", responsible: "Planning Coordinator", due: 15, mandatory: true },
    { text: "Notify next of kin in person, coordinated with Police — never by phone or text; wait for Police authorisation before family contact", responsible: "Student Coordinator", due: 20, approval: true },
    { text: "Prepare staff, community and media messages — withhold the name; if a suspected suicide follow safe-messaging (no method/location/detail); include help-seeking info (Lifeline 13 11 14)", responsible: "Communications Coordinator", due: 30, approval: true },
    { text: "Activate the critical-incident counsellor protocol; support witnesses; identify and monitor at-risk students", responsible: "Student Wellbeing Services Coordinator", due: 20 },
  ],
  death_offcampus: [
    { text: "Confirm the facts with the family/Police before acting; convene the CIMT; designate a single spokesperson; notify AngliSchools/AISNSW for support", responsible: "Critical Incident Leader", due: 10, mandatory: true },
    { text: "Identify and monitor at-risk students beyond close friends/siblings; inform students in class/small-group settings — avoid a whole-school assembly; ensure memorials do not glamorise", responsible: "Student Wellbeing Services Coordinator", due: 18 },
    { text: "Do NOT state or speculate cause of death (a matter for the Coroner); safe-messaging; include help-seeking info (Lifeline 13 11 14); brief staff before students", responsible: "Communications Coordinator", due: 30, approval: true },
    { text: "Ensure the deceased student's family is not auto-sent correspondence; check with family on what may be disclosed and the use of the term 'suicide'", responsible: "Student Coordinator", due: 20, approval: true },
  ],
};

export function responseProcedureFor(typeId) {
  return RESPONSE_PROCEDURES[typeId] || null;
}

// ==================================================================
// CIMT INCIDENT LIFECYCLE — the plan's phase model + master checklist
// (CIM & BCP V0.3 §3.4 Critical Incident Management Checklist). The
// incident moves Assessment → Activation → Response → Business
// Recovery → Business Resumption → Stand Down. Each phase carries the
// plan's checklist (Action · Responsible CIMT role · reference). An
// incident tracks which items are ticked in `phaseChecks`.
// ==================================================================
export const CIMT_PHASES = [
  { id: "assessment", label: "Assessment", blurb: "Collect information, assess the situation, and determine the incident level and which CIMT roles are required." },
  { id: "activation", label: "Activation", blurb: "Formally declare, stand up the CIMT and Control Room, and hold the initial briefing." },
  { id: "response", label: "Response", blurb: "Confirm welfare, run the response, manage communications, and coordinate with emergency services." },
  { id: "recovery", label: "Business Recovery", blurb: "Where operations are impacted, recover critical business functions and relocate as needed." },
  { id: "resumption", label: "Business Resumption", blurb: "Return the College to pre-incident operations — restoration or relocation." },
  { id: "standdown", label: "Stand Down", blurb: "Declare the response over, deactivate the CIMT, and arrange the Post-Incident Review (within 7 days)." },
];

export const PHASE_CHECKLIST = {
  assessment: [
    { id: "as1", text: "Collect information: what happened, where/when, who is affected, emergency services called/ETA, injuries, first aid, evacuated or locked down, media on site, reliability of the information", responsible: "Critical Incident Leader", reference: "Call Taker Form" },
    { id: "as2", text: "Direct Support to WhatsApp the CIMT to stand by while the situation is assessed; then continue via Teams", responsible: "Critical Incident Leader" },
    { id: "as3", text: "Confirm the Emergency Response Procedures (ECO / warden team) have been activated, if required", responsible: "Planning Coordinator", reference: "Emergency Response Plan" },
    { id: "as4", text: "Determine whether the Emergency Control Organisation needs additional support and organise it", responsible: "College Services" },
    { id: "as5", text: "Determine whether someone needs to go to the incident/assembly area to manage media", responsible: "Communications Coordinator" },
    { id: "as6", text: "Determine whether immediate communications need to be issued to those impacted", responsible: "Communications Coordinator" },
    { id: "as7", text: "Conduct an incident assessment to determine the incident level", responsible: "Critical Incident Leader", reference: "Incident Levels" },
    { id: "as8", text: "Determine which CIMT members are required", responsible: "Critical Incident Leader" },
    { id: "as9", text: "Set up Teams for the incident (new channel named with incident + date; copy templates from General)", responsible: "Support Coordinator" },
    { id: "as10", text: "Initiate and maintain the incident log", responsible: "Support Coordinator", reference: "Incident Log" },
  ],
  activation: [
    { id: "ac1", text: "Formally declare a Critical Incident", responsible: "Critical Incident Leader", mandatory: true },
    { id: "ac2", text: "Notify CIMT members of the location and time for the initial briefing", responsible: "Support Coordinator" },
    { id: "ac3", text: "Activate the Critical Incident Control Room (Boardroom) and ensure all equipment is working", responsible: "Support Coordinator", reference: "Control Room Activation" },
    { id: "ac4", text: "Establish the visual boards in the Control Room (physical or via Teams)", responsible: "Support Coordinator", reference: "Visual Boards" },
    { id: "ac5", text: "Confirm available CIMT members and their roles", responsible: "Critical Incident Leader" },
    { id: "ac6", text: "Run the initial CIMT meeting: welfare, update, area reports, impact & issues assessment, objectives, comms protocols, next meeting time", responsible: "Critical Incident Leader", reference: "Meeting Agenda" },
    { id: "ac7", text: "Notify the Chair of College Council and the CEO of AngliSchools", responsible: "Critical Incident Leader", mandatory: true },
    { id: "ac8", text: "Allocate a CIMT member to liaise with emergency services on what can be told to parents and where they should go", responsible: "Critical Incident Leader" },
  ],
  response: [
    { id: "re1", text: "Confirm the safety and wellbeing of all staff, students and visitors; track affected persons (names, condition, next of kin)", responsible: "Student Coordinator", reference: "People at Risk Log" },
    { id: "re2", text: "Confirm the Emergency Control Organisation / warden team has been activated, if needed", responsible: "College Services" },
    { id: "re3", text: "Re-assess the expected incident level", responsible: "Critical Incident Leader", reference: "Incident Levels" },
    { id: "re4", text: "Conduct the impact & issues assessment", responsible: "Planning Coordinator", reference: "Impact Assessment" },
    { id: "re5", text: "Review Critical Business Functions with short RTOs for likely impact", responsible: "Recovery Coordinator", reference: "Critical Business Functions" },
    { id: "re6", text: "Develop the initial communications strategy for the Leader to approve", responsible: "Communications Coordinator", reference: "Communications Strategy" },
    { id: "re7", text: "Draft a holding statement", responsible: "Communications Coordinator" },
    { id: "re8", text: "Assume the media spokesperson role for the College", responsible: "Critical Incident Leader" },
    { id: "re9", text: "Establish a call centre / reception script for parent and family calls", responsible: "Communications Coordinator" },
    { id: "re10", text: "Inform parents of students who may be directly involved", responsible: "Student Coordinator" },
    { id: "re11", text: "Establish a regular communications schedule with staff, students and community", responsible: "Communications Coordinator" },
    { id: "re12", text: "Provide regular briefings to CIMT, Council, AngliSchools, media, parents and students", responsible: "Critical Incident Leader" },
    { id: "re13", text: "If required, notify next of kin through the appropriate authorities", responsible: "Student Coordinator" },
    { id: "re14", text: "Establish daily debriefing: self-care, counselling services, and EAP for impacted staff", responsible: "Critical Incident Leader" },
  ],
  recovery: [
    { id: "br1", text: "Commence a physical damage assessment (IT & applications, voice/data, buildings, grounds) to estimate downtime", responsible: "Recovery Coordinator" },
    { id: "br2", text: "If voice communications are affected, organise diversion of phones", responsible: "Recovery Coordinator" },
    { id: "br3", text: "Review the Critical Business Functions list to assess all work-in-progress affected", responsible: "Recovery Coordinator", reference: "Critical Business Functions" },
    { id: "br4", text: "If downtime is estimated > 24 hours, initiate the Relocation Plan (confirm rooms/resources at offsite locations)", responsible: "Recovery Coordinator", reference: "Relocation Plan" },
    { id: "br5", text: "If key staff are affected, cover via existing staff or activate workarounds for critical functions", responsible: "Recovery Coordinator" },
    { id: "br6", text: "Facilitate relocation of key staff/students to recovery sites; advise other staff to return home until further notice", responsible: "Recovery Coordinator" },
    { id: "br7", text: "Procure replacement IT and equipment as determined by the damage assessment", responsible: "Recovery – IT Coordinator" },
    { id: "br8", text: "Provide regular status reports to the Critical Incident Leader on critical business capabilities", responsible: "Recovery Coordinator", reference: "SITREP" },
  ],
  resumption: [
    { id: "rs1", text: "Continue referring to the Critical Business Functions list to ensure restoration alongside longer-term resumption", responsible: "Recovery Coordinator", reference: "Critical Business Functions" },
    { id: "rs2", text: "Develop a resumption communication strategy for Council, parents, staff and community", responsible: "Communications Coordinator" },
    { id: "rs3", text: "Work with HR on staff injuries/near misses; liaise with SafeWork NSW, doctors and insurers on care and return-to-work", responsible: "Planning Coordinator" },
    { id: "rs4", text: "If there were deaths, organise memorial services and ongoing trauma management support", responsible: "Student Coordinator" },
    { id: "rs5", text: "Notify insurers of the disruption", responsible: "Recovery Coordinator", reference: "Insurance Register" },
    { id: "rs6", text: "Maintain a log of all post-incident steps (time, location, action, delegations, work orders, invoices)", responsible: "Recovery Coordinator", reference: "Incident Log" },
    { id: "rs7", text: "Make plans for repairing damage or relocating buildings/campuses as required", responsible: "Recovery Coordinator" },
    { id: "rs8", text: "Resume normal operations and advise key stakeholders that operations have resumed", responsible: "Recovery Coordinator" },
  ],
  standdown: [
    { id: "sd1", text: "Declare an end to the response phase of the Critical Incident", responsible: "Critical Incident Leader" },
    { id: "sd2", text: "Notify internal and external stakeholders that the CIMT is being deactivated", responsible: "Critical Incident Leader" },
    { id: "sd3", text: "Liaise with the trauma/counselling provider on support for impacted staff, students and community", responsible: "Student Coordinator" },
    { id: "sd4", text: "Collect, collate and file all incident logs and documents related to the incident", responsible: "Support Coordinator" },
    { id: "sd5", text: "Confirm reporting and ongoing liaison with regulators, agencies and insurers is established", responsible: "Communications Coordinator" },
    { id: "sd6", text: "Arrange cleaning and return of the Control Room to normal use", responsible: "Support Coordinator" },
    { id: "sd7", text: "Determine the need for a formal investigation and report", responsible: "Critical Incident Leader" },
    { id: "sd8", text: "Arrange a Post-Incident Review within 7 days of the incident", responsible: "Critical Incident Leader", reference: "PIR", mandatory: true },
    { id: "sd9", text: "Update the CIMP and applicable policies and procedures as required", responsible: "Recovery Coordinator" },
  ],
};

// The incident's current phase (defaults sensibly for legacy incidents).
export function incidentPhase(incident) {
  if (incident?.phase && CIMT_PHASES.some((p) => p.id === incident.phase)) return incident.phase;
  return incident?.status === "closed" ? "standdown" : "assessment";
}
export function phaseMeta(id) {
  return CIMT_PHASES.find((p) => p.id === id) || CIMT_PHASES[0];
}
export function phaseIndex(id) {
  return Math.max(0, CIMT_PHASES.findIndex((p) => p.id === id));
}
export function nextPhaseId(id) {
  const i = phaseIndex(id);
  return i < CIMT_PHASES.length - 1 ? CIMT_PHASES[i + 1].id : null;
}
export function isPhaseItemDone(incident, itemId) {
  return !!incident?.phaseChecks?.[itemId]?.done;
}
// Progress of a single phase = ticked / total checklist items.
export function phaseProgress(incident, phaseId) {
  const items = PHASE_CHECKLIST[phaseId] || [];
  const done = items.filter((it) => isPhaseItemDone(incident, it.id)).length;
  return { done, total: items.length, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
}

// ==================================================================
// CIMT INSTRUMENTS — the plan's appendix forms as living digital tools
// (CIM & BCP V0.3 §16): Visual Boards, People at Risk Log, SITREP,
// Incident Action Plan (SMEAC). Stored on the incident.
// ==================================================================

// --- Visual Boards (§16.6): Facts · Assumptions · Issues · Actions ---
// The Control Room boards the Support Coordinator maintains.
export const BOARD_QUADRANTS = [
  { id: "facts", label: "Facts", blurb: "What we know for certain, verified." },
  { id: "assumptions", label: "Assumptions", blurb: "What we believe but have not confirmed." },
  { id: "issues", label: "Issues", blurb: "Problems and open questions to resolve." },
  { id: "actions", label: "Actions", blurb: "What we are doing / need to do." },
];
export function newBoardItem(text) {
  return { id: `bd${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text: (text || "").trim(), ts: Date.now() };
}
export function boardCounts(incident) {
  const b = incident?.boards || {};
  return BOARD_QUADRANTS.reduce((acc, q) => { acc[q.id] = (b[q.id] || []).length; return acc; }, {});
}

// --- People at Risk Log (§16.10) ---
// Track affected persons: who, condition, location, next of kin.
export const PERSON_CATEGORIES = ["Student", "Staff", "Visitor", "Contractor"];
export const PERSON_STATUS = {
  safe: { label: "Safe / accounted for", color: "#5B8C7C" },
  injured: { label: "Injured — on site", color: "#B89460" },
  hospital: { label: "Hospitalised", color: "#A85535" },
  unaccounted: { label: "Unaccounted", color: "#A02029" },
};
export function newPersonAtRisk(data = {}) {
  return {
    id: `pr${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: data.name || "",
    category: data.category || "Student",
    status: data.status || "safe",     // safe | injured | hospital | unaccounted
    location: data.location || "",
    nok: data.nok || "",                // next of kin — notified/contact
    notes: data.notes || "",
    updatedAt: Date.now(),
  };
}
export function peopleAtRiskCounts(incident) {
  const list = incident?.peopleAtRisk || [];
  return {
    total: list.length,
    unaccounted: list.filter((p) => p.status === "unaccounted").length,
    injured: list.filter((p) => p.status === "injured" || p.status === "hospital").length,
  };
}

// --- SITREP (§16.3): per-functional-area situation report → Planning ---
export function newSitrep(data = {}) {
  return {
    id: `sr${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    ts: Date.now(),
    area: data.area || "",        // functional area / CIMT role
    situation: data.situation || "",   // what has happened
    future: data.future || "",          // what could happen
    impacts: data.impacts || "",        // services/buildings impacted
    actions: data.actions || "",        // what you've done
    objectives: data.objectives || "",  // what you need to achieve
    needs: data.needs || "",            // what you need to do it
  };
}
export const SITREP_FIELDS = [
  { key: "situation", label: "Situation", hint: "What has happened?" },
  { key: "future", label: "Future situation", hint: "What could happen?" },
  { key: "impacts", label: "Impacts", hint: "What services / buildings are impacted?" },
  { key: "actions", label: "Actions taken", hint: "What have you done so far?" },
  { key: "objectives", label: "Objectives", hint: "What do you need to achieve?" },
  { key: "needs", label: "Needs", hint: "What do you need to complete the next steps?" },
];

// --- Incident Action Plan / Briefing (§16.2), SMEAC structure ---
export const IAP_FIELDS = [
  { key: "situation", label: "Situation", hint: "Current situation, impacts, key risks, prognosis." },
  { key: "mission", label: "Mission", hint: "Objectives to be achieved." },
  { key: "execution", label: "Execution", hint: "Strategies, alternatives, priorities, resources." },
  { key: "admin", label: "Administration", hint: "Meeting intervals, shift changeovers, welfare, logistics, information plan." },
  { key: "command", label: "Command & Communications", hint: "CIMT structure; internal/external communications plan." },
  { key: "safety", label: "Safety", hint: "Key safety issues." },
];
export function emptyIAP() {
  return { situation: "", mission: "", execution: "", admin: "", command: "", safety: "", updatedAt: null };
}

// --- Call Taker Form (§16.1): the first-notification intake checklist ---
export const CALL_TAKER_QUESTIONS = [
  { id: "ct1", q: "What has happened?" },
  { id: "ct2", q: "Where did it happen?" },
  { id: "ct3", q: "Who is involved?" },
  { id: "ct4", q: "Any casualties?" },
  { id: "ct5", q: "Have emergency services been called? If yes, ETA?" },
  { id: "ct6", q: "Has first aid been administered?" },
  { id: "ct7", q: "Has the immediate area been contained or secured?" },
  { id: "ct8", q: "Are there any hazards in the incident area?" },
  { id: "ct9", q: "Are there any restrictions to accessing the site?" },
  { id: "ct10", q: "Is the media on site?" },
  { id: "ct11", q: "What action has been taken so far?" },
  { id: "ct12", q: "What assistance is required?" },
];
export function emptyCallTaker() {
  return { receivedFrom: "", contact: "", answers: {}, notes: "", updatedAt: null };
}
export function callTakerProgress(incident) {
  const a = incident?.callTaker?.answers || {};
  const done = CALL_TAKER_QUESTIONS.filter((x) => (a[x.id] || "").trim()).length;
  return { done, total: CALL_TAKER_QUESTIONS.length };
}

// --- CIMT Meeting Agenda (§16.5 / §3.4 initial-meeting agenda) ---
export const CIMT_MEETING_AGENDA = [
  { id: "ag1", text: "Confirm the welfare of all CIMT members" },
  { id: "ag2", text: "Provide an update to the CIMT on events to date" },
  { id: "ag3", text: "CIMT members provide an update on their areas" },
  { id: "ag4", text: "Conduct an impact assessment" },
  { id: "ag5", text: "Conduct an issues assessment" },
  { id: "ag6", text: "Confirm team objectives" },
  { id: "ag7", text: "Establish protocols for CIMT communications" },
  { id: "ag8", text: "Confirm team members are aware of their roles" },
  { id: "ag9", text: "Agree the time for the next meeting" },
];
export function newMeeting() {
  return { id: `mtg${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, at: Date.now(), checks: {}, notes: "", nextMeeting: "" };
}

// --- PIR structured elements (§16.4 Debriefing / PIR template) ---
export const PIR_ELEMENTS = [
  { id: "er", label: "Emergency Response", questions: [
    { id: "er1", q: "Was an evacuation or lockdown required?" },
    { id: "er2", q: "Were any staff, students or visitors injured or affected?" },
    { id: "er3", q: "Was the building(s) secured to prevent re-entry?" },
    { id: "er4", q: "Were evacuation/lockdown details reported to College Services?" },
  ] },
  { id: "an", label: "Activation & Notification", questions: [
    { id: "an1", q: "Was the incident detected promptly?" },
    { id: "an2", q: "Were emergency services notified promptly?" },
    { id: "an3", q: "Was a member of the Leadership Team notified promptly and easily reachable?" },
    { id: "an4", q: "Was the CIMT easily reachable, with current contact details?" },
    { id: "an5", q: "Were the control rooms available and properly equipped?" },
  ] },
  { id: "bi", label: "Business Impacts", questions: [
    { id: "bi1", q: "Was an incident assessment conducted, and how was it used?" },
    { id: "bi2", q: "Was an impact assessment conducted, and how was it used?" },
    { id: "bi3", q: "Were any buildings affected and deemed un-useable?" },
    { id: "bi4", q: "Were critical business functions affected?" },
    { id: "bi5", q: "Was a business continuity plan activated, and which strategy?" },
    { id: "bi6", q: "Was an IT disaster recovery plan activated?" },
  ] },
  { id: "ir", label: "Incident Response", questions: [
    { id: "ir1", q: "Were people and equipment mobilised efficiently and available?" },
    { id: "ir2", q: "Were the procedures and tools available and flexible enough?" },
    { id: "ir3", q: "Did staff/students know what to do? Is further training required?" },
    { id: "ir4", q: "Were critical business functions restored within their RTOs?" },
    { id: "ir5", q: "If required, were alternate sites activated and operational?" },
  ] },
  { id: "co", label: "Communication", questions: [
    { id: "co1", q: "Were all key stakeholders notified appropriately and in a timely way?" },
    { id: "co2", q: "Was consultation established with emergency services/agencies?" },
    { id: "co3", q: "Was the media communicated with appropriately?" },
    { id: "co4", q: "Were the communication templates used?" },
    { id: "co5", q: "Was an action log maintained throughout?" },
  ] },
  { id: "sd", label: "Stand Down", questions: [
    { id: "sd1", q: "Were ongoing site-security issues addressed?" },
    { id: "sd2", q: "Were long-term restoration/relocation strategies assessed?" },
  ] },
];

// ==================================================================
// BUSINESS CONTINUITY (CIM & BCP V0.3 Section Three) — the recovery
// half of the plan. Time-phased recovery strategies, the Critical
// Business Functions register (with RTOs from the BIA), and the impact
// & issues assessment. Stored on incident.recovery.
// Charter note: in scope because the plan defines Response → Recovery →
// Resumption as one continuum (SCOPE.md v2). Built last (Pivot 6).
// ==================================================================

// --- 5 Recovery Strategies (§11), each a time-phased checklist ---
export const RECOVERY_STRATEGIES = [
  {
    id: "loss_people",
    label: "Loss of key people / large numbers of staff",
    triggers: ["Resignation of key staff", "Illness or injury", "Pandemic", "Assault or serious injury", "Staff/students overseas or remote", "Abduction"],
    steps: [
      { id: "lp1", timing: "Pre", text: "Maintain contingency resourcing options (agency, contractors, recruiters)." },
      { id: "lp2", timing: "0–2 hrs", text: "Assemble remaining staff (on site or virtually) and brief them on the incident." },
      { id: "lp3", timing: "0–2 hrs", text: "Assess the interruption; determine impact to critical functions; cover with existing staff or transfer functions." },
      { id: "lp4", timing: "0–2 hrs", text: "Notify and brief the Critical Incident Leader; consider activating the CIMT." },
      { id: "lp5", timing: "2–4 hrs", text: "Develop and implement a communication strategy; notify affected stakeholders." },
      { id: "lp6", timing: "2–4 hrs", text: "Establish a recovery plan — interim/manual workarounds, casual/agency staff, staffing-ratio review, financial assessment — for Leader approval." },
      { id: "lp7", timing: "4–6 hrs", text: "Confirm CIMT, regulators and stakeholders are informed; resume operations per the Critical Business Functions list." },
      { id: "lp8", timing: "12–24 hrs", text: "Confirm impacted staff have access to EAP / trauma counselling." },
      { id: "lp9", timing: "1 week+", text: "Commence recruitment of permanent/temporary replacements for key roles." },
      { id: "lp10", timing: "Ongoing", text: "Monitor the recovery plan and affected functions; update the Leader." },
    ],
  },
  {
    id: "loss_campus",
    label: "Loss of access to campus (temporary / permanent)",
    triggers: ["Structure fire / smoke damage", "Water damage", "Asbestos", "Suspicious device", "Security/access malfunction", "Civil disturbance", "Construction accident"],
    steps: [
      { id: "lc1", timing: "Pre", text: "Maintain relocation plans for staff and students (work/study-from-home set-up)." },
      { id: "lc2", timing: "0–2 hrs", text: "Activate the ECO if an evacuation is required, and emergency services if appropriate." },
      { id: "lc3", timing: "0–2 hrs", text: "Commence a damage assessment — cause, downtime estimate, partial vs total loss of access." },
      { id: "lc4", timing: "0–2 hrs", text: "Work with IT to divert phones if they are not operating." },
      { id: "lc5", timing: "0–2 hrs", text: "If downtime is estimated > 24 hrs, initiate staff and student relocation strategies." },
      { id: "lc6", timing: "0–2 hrs", text: "Develop and implement a communication strategy for the incident." },
      { id: "lc7", timing: "2–4 hrs", text: "Implement parent pick-up processes if required." },
      { id: "lc8", timing: "2–4 hrs", text: "Review the Critical Business Functions list for impacted functions; establish a recovery plan (relocation, IT access, comms, transport)." },
      { id: "lc9", timing: "4–6 hrs", text: "Facilitate relocation of key staff/students to the nominated recovery site(s)." },
      { id: "lc10", timing: "Ongoing", text: "Provide regular status reports to the Critical Incident Leader." },
    ],
  },
  {
    id: "loss_it",
    label: "Sustained loss of IT and/or communications",
    triggers: ["Cyber-attack / denial of service", "Virus or hacker", "IT systems / hardware / software failure", "Human error or negligence", "Theft, fraud or malice"],
    steps: [
      { id: "li1", timing: "Pre", text: "Keep the IT Disaster Recovery Plan and backups current and tested." },
      { id: "li2", timing: "0–2 hrs", text: "Conduct an IT impact assessment to determine the extent of disruption." },
      { id: "li3", timing: "0–2 hrs", text: "If a breach, isolate affected systems (disconnect, do NOT power off); do NOT restore backups until the threat is eliminated." },
      { id: "li4", timing: "0–2 hrs", text: "Switch impacted functions to manual/paper workarounds (sign-in, reception, comms)." },
      { id: "li5", timing: "2–4 hrs", text: "Implement the IT Disaster Recovery Plan; approve back-up accesses and privileges." },
      { id: "li6", timing: "2–4 hrs", text: "Communicate the outage to staff and families (what not to click; service status)." },
      { id: "li7", timing: "4–6 hrs", text: "Prioritise restoration by RTO (SMS system, Office 365, finance, LMS, networking)." },
      { id: "li8", timing: "Daily", text: "Provide status updates to the Recovery Coordinator and Leader." },
      { id: "li9", timing: "Ongoing", text: "Complete root-cause analysis and remediation; restore remaining services." },
    ],
  },
  {
    id: "loss_supplier",
    label: "Loss of supplier",
    triggers: ["Service-provider failure or negligence", "Loss of partner/relationship agreement", "Loss or reduction in funding"],
    steps: [
      { id: "ls1", timing: "Pre", text: "Maintain a list of alternate suppliers." },
      { id: "ls2", timing: "0–2 hrs", text: "Identify the failed supplier and the functions/services affected." },
      { id: "ls3", timing: "0–2 hrs", text: "Assess the impact on critical functions and the timeframes involved." },
      { id: "ls4", timing: "2–4 hrs", text: "Activate an alternate supplier or a manual workaround." },
      { id: "ls5", timing: "2–4 hrs", text: "Notify affected stakeholders of any service change." },
      { id: "ls6", timing: "4–6 hrs", text: "Confirm continuity of the affected service; agree interim arrangements." },
      { id: "ls7", timing: "Ongoing", text: "Manage the contract/commercial issues; source a permanent replacement; update the Leader." },
    ],
  },
  {
    id: "loss_utilities",
    label: "Loss of utilities (water / electricity / gas)",
    triggers: ["Loss of water", "Loss of electricity", "Loss of gas"],
    steps: [
      { id: "lu1", timing: "0–2 hrs", text: "Confirm which utility is affected and the safety implications; for gas follow the gas-leak procedure (evacuate; no switches/flames; call 000 and the gas network)." },
      { id: "lu2", timing: "0–2 hrs", text: "Make the area safe; consider shutting down the affected utility at the main." },
      { id: "lu3", timing: "0–2 hrs", text: "Notify the utility provider/contractor and obtain a restoration estimate." },
      { id: "lu4", timing: "0–2 hrs", text: "Assess the impact on operations (heating/cooling, water for hygiene, power for IT/servers)." },
      { id: "lu5", timing: "2–4 hrs", text: "Decide continuation vs relocation vs early closure based on the estimate." },
      { id: "lu6", timing: "2–4 hrs", text: "Communicate to staff and families as required." },
      { id: "lu7", timing: "4–6 hrs", text: "Arrange interim measures (generator, bottled water, alternate facilities)." },
      { id: "lu8", timing: "Ongoing", text: "Monitor restoration; provide status updates to the Leader." },
    ],
  },
];

// Which recovery strategies to suggest for a CIMPLE incident type.
const STRATEGY_SUGGESTIONS = {
  cyber: ["loss_it", "loss_campus"],
  infrastructure: ["loss_utilities", "loss_campus"],
  natural_disaster: ["loss_campus", "loss_people"],
  hazmat: ["loss_campus"],
  evacuation: ["loss_campus"],
  external_threat: ["loss_campus"],
  lockdown: ["loss_campus"],
  disease_outbreak: ["loss_people"],
  death_oncampus: ["loss_people"],
  death_offcampus: ["loss_people"],
  transport: ["loss_people"],
};
export function suggestedStrategyIds(typeId) {
  return STRATEGY_SUGGESTIONS[typeId] || [];
}
export function recoveryStrategyById(id) {
  return RECOVERY_STRATEGIES.find((s) => s.id === id) || null;
}
export function strategyActivated(incident, id) {
  return !!incident?.recovery?.strategies?.[id]?.activated;
}
export function strategyProgress(incident, id) {
  const s = recoveryStrategyById(id);
  if (!s) return { done: 0, total: 0 };
  const checks = incident?.recovery?.checks || {};
  const done = s.steps.filter((st) => checks[st.id]).length;
  return { done, total: s.steps.length };
}
export function activeStrategyCount(incident) {
  return RECOVERY_STRATEGIES.filter((s) => strategyActivated(incident, s.id)).length;
}

// --- Critical Business Functions register (§13, from the BIA) ---
// Representative short-RTO set — the functions the Recovery Coordinator
// checks "in the next few hours". Not the full BIA. rtoMins drives tiering.
export const CRITICAL_BUSINESS_FUNCTIONS = [
  { id: "cbf1", task: "Support external events including transport", unit: "Facilities", rto: "< 1 hour", mins: 60 },
  { id: "cbf2", task: "Manage campus security (on call)", unit: "Facilities", rto: "< 1 hour", mins: 60 },
  { id: "cbf3", task: "Manage IT infrastructure", unit: "IT", rto: "< 1 hour", mins: 60 },
  { id: "cbf4", task: "Administer on-site server infrastructure", unit: "IT", rto: "< 1 hour", mins: 60 },
  { id: "cbf5", task: "Manage networking infrastructure", unit: "IT", rto: "< 1 hour", mins: 60 },
  { id: "cbf6", task: "Internal marketing & comms (media releases, holding statements)", unit: "Marketing / Enrolments", rto: "1 hour", mins: 60 },
  { id: "cbf7", task: "Manage the TAC SMS messaging system", unit: "Marketing / Enrolments", rto: "1 hour", mins: 60 },
  { id: "cbf8", task: "Provide & manage Office 365", unit: "IT", rto: "1 hour", mins: 60 },
  { id: "cbf9", task: "Deliver the finance system", unit: "IT", rto: "1 hour", mins: 60 },
  { id: "cbf10", task: "Coordinate reception & daily stakeholder interactions", unit: "Executive Assistant", rto: "2 hours", mins: 120 },
  { id: "cbf11", task: "Manage direct debit / credit card / direct deposit payments", unit: "Finance", rto: "2 hours", mins: 120 },
  { id: "cbf12", task: "Billing, invoicing, reconciliations, month-end reporting", unit: "Finance", rto: "2 hours", mins: 120 },
  { id: "cbf13", task: "Manage creditor payments", unit: "Finance", rto: "2 hours", mins: 120 },
  { id: "cbf14", task: "Manage debt collection", unit: "Finance", rto: "2 hours", mins: 120 },
  { id: "cbf15", task: "Employee onboarding / offboarding", unit: "HR", rto: "2 hours", mins: 120 },
  { id: "cbf16", task: "Monthly student-movement reports", unit: "Marketing / Enrolments", rto: "2 hours", mins: 120 },
  { id: "cbf17", task: "Provide & deliver the LMS", unit: "IT", rto: "2 hours", mins: 120 },
  { id: "cbf18", task: "Coordinate response to significant personal impacts (staff/students/family)", unit: "Principal", rto: "2 hours", mins: 120 },
  { id: "cbf19", task: "Respond to hazards", unit: "Risk & Compliance", rto: "2 hours", mins: 120 },
  { id: "cbf20", task: "Schedule events & activities (sport, excursions, camps)", unit: "Daily Organiser", rto: "3 hours", mins: 180 },
  { id: "cbf21", task: "Provide First Aid", unit: "Executive Assistant", rto: "3 hours", mins: 180 },
  { id: "cbf22", task: "Maintain student attendance", unit: "Executive Assistant", rto: "3 hours", mins: 180 },
  { id: "cbf23", task: "Oversee the counselling & wellbeing team", unit: "Deputy Principals", rto: "3 hours", mins: 180 },
  { id: "cbf24", task: "Deliver the telephone system", unit: "IT", rto: "6 hours", mins: 360 },
  { id: "cbf25", task: "Manage on-campus WiFi", unit: "IT", rto: "6 hours", mins: 360 },
];
export function cbfTierColor(mins) {
  if (mins <= 60) return "#A02029";   // crimson — recover within the hour
  if (mins <= 120) return "#A85535";  // rust
  if (mins <= 360) return "#B89460";  // amber
  return "#5B8C7C";                    // sage
}
export function impactedCBFCount(incident) {
  const imp = incident?.recovery?.impacted || {};
  return CRITICAL_BUSINESS_FUNCTIONS.filter((c) => imp[c.id]).length;
}

// --- Impact & Issues Assessment matrix (§12) ---
export const IMPACT_DIMENSIONS = [
  "Health & Safety", "Operations", "Financial", "Compliance", "Reputational", "Strategic / Market",
];
export const IMPACT_LEVELS = ["Not assessed", "Insignificant", "Minor", "Moderate", "Major", "Catastrophic"];
export const IMPACT_LEVEL_COLORS = ["#4A5664", "#5B8C7C", "#7FA07A", "#B89460", "#A85535", "#7A1820"];

function normResp(e) {
  return typeof e === "string" ? { text: e } : e;
}

export function responsibilitiesFor(roleName, incidentType) {
  // What this CIMT role does in THIS incident = the type-specific response
  // procedure steps owned by the role (plan §5.x + statutory hooks), then the
  // role's standing checklist from the plan (§4.2–4.9, applies to any incident).
  const typeSpecific = (RESPONSE_PROCEDURES[incidentType] || []).filter((e) => e.responsible === roleName);
  const baseline = CIMT_ROLE_CHECKLISTS[roleName] || [];
  const list = [...typeSpecific, ...baseline];
  return list.length ? list.map(normResp) : null;
}

// Generate a role-owned operational task board from the playbook, after
// triage + allocation. Each assigned role receives its immediate actions;
// tasks carry owner, due time, status, priority, and approval/mandatory flags.
export function generateIncidentTasks(typeId, roles) {
  const now = Date.now();
  const out = [];
  let i = 0;
  for (const role of (roles || [])) {
    const entries = [
      ...((RESPONSE_PROCEDURES[typeId] || []).filter((e) => e.responsible === role.role)),
      ...(CIMT_ROLE_CHECKLISTS[role.role] || []),
    ].map(normResp);
    const owner = roleIsAssigned(role) ? role.initials : "—";
    for (const e of entries) {
      const due = e.due ?? 60;
      out.push({
        id: `tk${now}-${i++}`,
        text: e.text,
        owner,
        role: role.role,
        done: false,
        priority: due <= 15 ? "high" : due <= 30 ? "med" : "low",
        dueAt: e.due ? now + e.due * 60000 : undefined,
        approval: !!e.approval,
        mandatory: !!e.mandatory,
      });
    }
  }
  out.sort((a, b) => (a.dueAt || Infinity) - (b.dueAt || Infinity));
  return out.length ? out : tasksForIncidentType(typeId);
}

// ============================================================
// Staff CRUD
// ============================================================
// ============================================================
// Increment A — Enhanced staff model + bulk import
// Primary / Secondary / Other role preference. qualifiedFor stays
// DERIVED so the existing allocation engine keeps working untouched.
// ============================================================

export const ALL_ROLES = Object.keys(ROLE_DEFINITIONS);

function initialsFromName(name) {
  return String(name || "").split(/\s+/).map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "?";
}

// Case-insensitive canonical role match → known role name, or trimmed input if unknown.
export function matchRole(str) {
  const t = String(str || "").trim();
  if (!t) return "";
  return ALL_ROLES.find((r) => r.toLowerCase() === t.toLowerCase()) || t;
}

function deriveQualifiedFor({ primaryRole, secondaryRoles, otherQualifiedRoles, existing }) {
  const all = [primaryRole, ...(secondaryRoles || []), ...(otherQualifiedRoles || [])].filter(Boolean);
  const uniq = [...new Set(all)];
  return uniq.length ? uniq : (existing || []);
}

// Bring any staff record (old or new schema) up to the current shape.
export function normalizeStaff(s) {
  if (!s) return s;
  const firstName = s.firstName != null ? s.firstName : (s.name ? s.name.split(/\s+/)[0] : "");
  const lastName = s.lastName != null ? s.lastName : (s.name ? s.name.split(/\s+/).slice(1).join(" ") : "");
  const name = (s.name && s.name.trim()) || `${firstName} ${lastName}`.trim();
  const primaryRole = s.primaryRole != null ? s.primaryRole : (s.qualifiedFor?.[0] || "");
  const secondaryRoles = s.secondaryRoles || [];
  const otherQualifiedRoles = s.otherQualifiedRoles != null ? s.otherQualifiedRoles : (s.qualifiedFor ? s.qualifiedFor.slice(1) : []);
  const qualifiedFor = deriveQualifiedFor({ primaryRole, secondaryRoles, otherQualifiedRoles, existing: s.qualifiedFor });
  const availabilityStatus = s.availabilityStatus || (s.available === false ? "unavailable" : "available");
  const mobile = s.mobile != null ? s.mobile : (s.phone || "");
  const jobTitle = s.jobTitle != null ? s.jobTitle : (s.role || "");
  return {
    ...s,
    firstName, lastName, name,
    initials: s.initials || initialsFromName(name),
    email: s.email || "",
    mobile, phone: mobile,
    jobTitle, role: jobTitle,
    department: s.department || "",
    availabilityStatus,
    available: availabilityStatus === "available",
    primaryRole, secondaryRoles, otherQualifiedRoles,
    qualifiedFor,
    notes: s.notes || "",
    verifiedAt: s.verifiedAt || Date.now(),
  };
}

// ---- Bulk CSV import ----
export const STAFF_CSV_HEADERS = [
  "First Name", "Last Name", "Email", "Mobile Number", "Job Title",
  "Department", "Availability Status", "Preferred Incident Role", "Backup Incident Role(s)",
];

function csvCell(v) {
  const s = String(v == null ? "" : v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function staffCsvTemplate() {
  const rows = [
    ["Adrian", "Johnson", "ajohnson@trinityac.nsw.edu.au", "", "Principal", "Executive", "available", "Critical Incident Leader", ""],
    ["Annika", "Fairley", "afairley@trinityac.nsw.edu.au", "", "Risk & Compliance Officer", "Operations", "available", "Planning Coordinator", "Recovery Coordinator"],
  ];
  return STAFF_CSV_HEADERS.join(",") + "\n" + rows.map((r) => r.map(csvCell).join(",")).join("\n") + "\n";
}

function parseCSV(text) {
  const rows = []; let row = [], field = "", inQuotes = false;
  const s = String(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i++; } else inQuotes = false; }
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((c) => String(c).trim() !== ""));
}

// Parse CSV text → { staff:[], errors:[], warnings:[] }. Does NOT save.
export function parseStaffImport(text) {
  const out = { staff: [], errors: [], warnings: [] };
  const rows = parseCSV(text);
  if (rows.length === 0) { out.errors.push({ row: 0, message: "No rows found." }); return out; }
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (n) => header.indexOf(n.toLowerCase());
  const idx = {
    firstName: col("First Name"), lastName: col("Last Name"), email: col("Email"),
    mobile: col("Mobile Number"), jobTitle: col("Job Title"), department: col("Department"),
    availability: col("Availability Status"), primary: col("Preferred Incident Role"),
    backup: col("Backup Incident Role(s)"),
  };
  if (idx.firstName < 0 && idx.lastName < 0) {
    out.errors.push({ row: 1, message: "Header must include 'First Name' and/or 'Last Name'." });
    return out;
  }
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const get = (i) => (i >= 0 && i < cells.length ? String(cells[i]).trim() : "");
    const firstName = get(idx.firstName), lastName = get(idx.lastName);
    if (!firstName && !lastName) { out.errors.push({ row: r + 1, message: "Missing name — row skipped." }); continue; }
    const availRaw = get(idx.availability).toLowerCase();
    const availabilityStatus = ["unavailable", "off", "off duty", "offduty", "no"].includes(availRaw) ? "unavailable"
      : ["offsite", "off-site", "off site"].includes(availRaw) ? "offsite" : "available";
    const primaryRaw = get(idx.primary);
    const primaryRole = primaryRaw ? matchRole(primaryRaw) : "";
    if (primaryRaw && !ALL_ROLES.includes(primaryRole)) out.warnings.push({ row: r + 1, message: `Unknown role "${primaryRaw}" kept as-is.` });
    const backupRaw = get(idx.backup);
    const secondaryRoles = backupRaw ? backupRaw.split(/[;,|]/).map((x) => matchRole(x)).filter(Boolean) : [];
    for (const b of secondaryRoles) { if (!ALL_ROLES.includes(b)) out.warnings.push({ row: r + 1, message: `Unknown backup role "${b}" kept as-is.` }); }
    out.staff.push(newStaffMember({
      firstName, lastName, email: get(idx.email), mobile: get(idx.mobile),
      jobTitle: get(idx.jobTitle), department: get(idx.department),
      availabilityStatus, primaryRole, secondaryRoles, otherQualifiedRoles: [],
    }));
  }
  return out;
}

// Save imported staff. mode: "append" (dedupe by email) | "replace".
export function bulkImportStaff(staffArray, mode = "append") {
  const state = loadAll();
  if (mode === "replace") state.staff = [];
  if (!state.staff) state.staff = [];
  const byEmail = new Map(state.staff.filter((s) => s.email).map((s) => [s.email.toLowerCase(), s]));
  let added = 0, updated = 0;
  for (const incoming of staffArray) {
    const email = (incoming.email || "").toLowerCase();
    if (email && byEmail.has(email)) {
      const existing = byEmail.get(email);
      Object.assign(existing, incoming, { id: existing.id });
      updated++;
    } else {
      state.staff.push(incoming);
      if (email) byEmail.set(email, incoming);
      added++;
    }
  }
  saveAll(state);
  return { added, updated, total: state.staff.length };
}

export function listStaff() {
  return (loadAll().staff || []).map(normalizeStaff);
}

export function getStaff(id) {
  return listStaff().find((s) => s.id === id) || null;
}

export function saveStaff(staff) {
  const state = loadAll();
  const normalized = normalizeStaff(staff); // ensures derived qualifiedFor/name are stored
  const idx = (state.staff || []).findIndex((s) => s.id === normalized.id);
  if (!state.staff) state.staff = [];
  if (idx >= 0) state.staff[idx] = normalized;
  else state.staff.push(normalized);
  saveAll(state);
}

export function deleteStaff(id) {
  const state = loadAll();
  state.staff = (state.staff || []).filter((s) => s.id !== id);
  saveAll(state);
}

export function newStaffMember(data = {}) {
  return normalizeStaff({
    id: data.id || `staff-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    firstName: data.firstName,
    lastName: data.lastName,
    name: data.name,
    initials: data.initials,
    email: data.email,
    mobile: data.mobile != null ? data.mobile : data.phone,
    jobTitle: data.jobTitle != null ? data.jobTitle : data.role,
    department: data.department,
    availabilityStatus: data.availabilityStatus,
    available: data.available,
    primaryRole: data.primaryRole,
    secondaryRoles: data.secondaryRoles,
    otherQualifiedRoles: data.otherQualifiedRoles,
    qualifiedFor: data.qualifiedFor,
    notes: data.notes,
    verifiedAt: data.verifiedAt,
  });
}

// Mark a staff record's contact details as freshly verified.
export function verifyStaffContact(id) {
  const state = loadAll();
  const idx = (state.staff || []).findIndex((s) => s.id === id);
  if (idx >= 0) {
    state.staff[idx] = { ...state.staff[idx], verifiedAt: Date.now() };
    saveAll(state);
  }
}

// Days since contact details were last confirmed. Returns Infinity if never.
export function staffContactAgeDays(staff) {
  if (!staff?.verifiedAt) return Infinity;
  return Math.floor((Date.now() - staff.verifiedAt) / (24 * 60 * 60 * 1000));
}

// ============================================================
// v4 — ROLE CONFLICT DETECTION (PRD §13.2 / FR-ADM-03)
// ============================================================
// Pairs of roles that should NOT be held simultaneously by the same person.
// Drawn from PRD §13.2 (e.g. the source plan flags the Risk & Compliance
// Officer being both Planning Coordinator and Recovery Coordinator).
// Each pair: [roleA, roleB, reason shown to user].
// CIMT role pairs one person should not hold at once (they pull in different
// directions during an active incident). Note: the plan deliberately pairs
// Planning + Recovery on one person (Annika Fairley), so that is NOT a conflict.
export const ROLE_CONFLICTS = [
  ["Critical Incident Leader", "Support Coordinator", "The Leader leads and decides; Support runs the control room and log — different focus."],
  ["Critical Incident Leader", "Communications Coordinator", "The Leader approves comms and is spokesperson; drafting them is a separate job."],
  ["Critical Incident Leader", "College Services", "The Leader keeps oversight; College Services is hands-on at the scene."],
  ["Critical Incident Leader", "Planning Coordinator", "The Leader needs an independent planning/intelligence read, not to do it themselves."],
  ["Communications Coordinator", "Student Coordinator", "Comms drafting and student-family welfare demand attention in different rooms."],
  ["Communications Coordinator", "Staff Coordinator", "Comms drafting and staff welfare demand attention in different rooms."],
  ["Support Coordinator", "Planning Coordinator", "Both are control-room-heavy at the same time — split them."],
  ["College Services", "Communications Coordinator", "On-the-ground operations and external comms can't be run by one person."],
];

// Returns array of conflict descriptions for a given staff member's role set.
// Each item: { roles: [roleA, roleB], reason }
export function detectRoleConflicts(qualifiedFor) {
  if (!qualifiedFor || qualifiedFor.length < 2) return [];
  const set = new Set(qualifiedFor);
  return ROLE_CONFLICTS
    .filter(([a, b]) => set.has(a) && set.has(b))
    .map(([a, b, reason]) => ({ roles: [a, b], reason }));
}

// ============================================================
// v11 — DYNAMIC ROLE REPLACEMENT (SUPPORTING · coordination)
// When a role-holder is unavailable, recommend the best qualified,
// available, non-conflicted alternate — reusing the existing
// qualifications, availability and role-conflict engine.
// ============================================================

// Recommend the best alternate for a role in THIS incident.
// Ranking: no conflict first, then not-already-assigned, then name.
// Returns { staff, reason, conflict, alreadyAssigned } or null.
export function recommendAlternate(incident, roleId) {
  const role = (incident.roles || []).find((r) => r.id === roleId);
  if (!role) return null;
  const currentHolder = role.staff;
  const assignedElsewhere = new Map(); // name → [roles they hold here]
  for (const r of (incident.roles || []).filter(roleIsAssigned)) {
    if (!assignedElsewhere.has(r.staff)) assignedElsewhere.set(r.staff, []);
    assignedElsewhere.get(r.staff).push(r.role);
  }
  const conflictsForCandidate = (name) => {
    const theirRoles = assignedElsewhere.get(name) || [];
    return theirRoles.some((rn) =>
      ROLE_CONFLICTS.some(([a, b]) => (a === role.role && b === rn) || (b === role.role && a === rn))
    );
  };

  const candidates = listStaff()
    .filter((s) => s.qualifiedFor?.includes(role.role) && s.available && s.name !== currentHolder)
    .map((s) => ({ staff: s, conflict: conflictsForCandidate(s.name), alreadyAssigned: assignedElsewhere.has(s.name) }))
    .sort((a, b) => (a.conflict - b.conflict) || (a.alreadyAssigned - b.alreadyAssigned) || a.staff.name.localeCompare(b.staff.name));

  const best = candidates[0];
  if (!best) return null;
  const reason = [
    "Qualified",
    "available",
    best.conflict ? "⚠ has a conflicting role" : "no role conflicts",
    best.alreadyAssigned && !best.conflict ? "already assigned elsewhere" : null,
  ].filter(Boolean).join(" · ");
  return { staff: best.staff, reason, conflict: best.conflict, alreadyAssigned: best.alreadyAssigned };
}

// ============================================================
// Increment B — Automated role allocation (used in triage/create)
// Determine required roles → auto-allocate best available staff →
// (UI) review & override → create. One person = one role at auto
// stage, so role conflicts can't arise here (handled in Increment C).
// ============================================================

// Lower number = higher priority. Drives fill order + escalation.
export const ROLE_PRIORITY = {
  "Critical Incident Leader": 1,
  "Support Coordinator": 2,
  "Planning Coordinator": 2,
  "Communications Coordinator": 3,
  "College Services": 3,
  "Student Coordinator": 4,
  "Staff Coordinator": 4,
  "Student Wellbeing Services Coordinator": 4,
  "Facilities": 5,
  "Recovery Coordinator": 5,
  "Recovery – IT Coordinator": 6,
  "Recovery – Curriculum": 6,
  "Recovery – Co-Curriculum": 6,
};

// Extra roles pulled in at higher severities (deduped against the template).
export const SEVERITY_ROLE_ADDONS = {
  3: ["Communications Coordinator"],
  4: ["Communications Coordinator", "Recovery Coordinator"],
};

// Required roles for a type at a given severity = template + severity add-ons.
export function requiredRolesFor(typeId, severity = 1) {
  const template = (ROLE_TEMPLATES[typeId] || COMMON_ROLES).map((t) => ({ ...t }));
  for (let lvl = 1; lvl <= severity; lvl++) {
    for (const rn of (SEVERITY_ROLE_ADDONS[lvl] || [])) {
      if (!template.some((t) => t.role === rn)) template.push({ role: rn, required: true });
    }
  }
  return template;
}

// How well this person fits the role: 0 primary, 1 backup, 2 other-qualified.
export function rolePreferenceRank(staff, role) {
  if (staff.primaryRole === role) return 0;
  if ((staff.secondaryRoles || []).includes(role)) return 1;
  if ((staff.otherQualifiedRoles || []).includes(role)) return 2;
  if ((staff.qualifiedFor || []).includes(role)) return 2;
  return 9;
}
export const PREF_LABEL = { 0: "primary role", 1: "backup role", 2: "also qualified" };

// Available, qualified staff for a role, best-fit first (for override menus).
export function availableQualifiedStaff(role) {
  return listStaff()
    .filter((s) => s.available && (s.qualifiedFor || []).includes(role))
    .map((s) => ({ id: s.id, name: s.name, initials: s.initials, pref: rolePreferenceRank(s, role) }))
    .sort((a, b) => a.pref - b.pref || a.name.localeCompare(b.name));
}

// Auto-allocate staff to the required roles. Returns incident-role objects.
export function autoAllocate(typeId, severity = 1) {
  const required = requiredRolesFor(typeId, severity);
  const pool = listStaff().filter((s) => s.available);
  // Fill highest-priority roles first so the best people land in critical roles.
  const order = required.map((rt, i) => ({ rt, i })).sort((a, b) => (ROLE_PRIORITY[a.rt.role] || 50) - (ROLE_PRIORITY[b.rt.role] || 50));
  const taken = new Set();
  const chosen = {};
  for (const { rt } of order) {
    const best = pool
      .filter((s) => (s.qualifiedFor || []).includes(rt.role) && !taken.has(s.id))
      .map((s) => ({ s, pref: rolePreferenceRank(s, rt.role) }))
      .sort((a, b) => a.pref - b.pref || a.s.name.localeCompare(b.s.name))[0];
    if (best) { taken.add(best.s.id); chosen[rt.role] = best; }
  }
  const stamp = Date.now();
  return required.map((rt, i) => {
    const c = chosen[rt.role];
    const backup = pool
      .filter((s) => (s.qualifiedFor || []).includes(rt.role) && (!c || s.id !== c.s.id) && !taken.has(s.id))
      .map((s) => ({ s, pref: rolePreferenceRank(s, rt.role) }))
      .sort((a, b) => a.pref - b.pref || a.s.name.localeCompare(b.s.name))[0];
    return {
      id: `r${stamp}-${i}`,
      role: rt.role,
      required: !!rt.required,
      isPrincipal: rt.isPrincipal || false,
      staff: c ? c.s.name : "—",
      staffId: c ? c.s.id : null,
      initials: c ? c.s.initials : "—",
      status: c ? "confirmed" : "unassigned",
      allocPref: c ? PREF_LABEL[c.pref] : null,
      backup: backup ? backup.s.name : undefined,
      backupStaffId: backup ? backup.s.id : undefined,
    };
  });
}

// Find best available staff for a role.
// Returns { primary, backup } where backup is the next best match.
export function suggestStaffForRole(roleName) {
  const allStaff = listStaff();
  const matches = allStaff
    .filter((s) => s.qualifiedFor?.includes(roleName) && s.available)
    .sort((a, b) => a.name.localeCompare(b.name));
  return {
    primary: matches[0] || null,
    backup: matches[1] || null,
  };
}

// ============================================================
// v5 — COMMUNICATIONS MODULE (PRD M4 / FR-COMM)
// Draft → approve → dispatch, routed through the Communications
// Lead and signed off by the Incident Commander before release.
// Channel notes below encode TAC's real-world constraints as
// captured in Annika Fairley's PRD review (June 2026).
// ============================================================

// Dispatch channels TAC actually has. `note` reflects the
// current real-world state so the demo is honest about what is
// and isn't wired up yet.
export const COMMS_CHANNELS = [
  { id: "digistorm", label: "Trinity App (DigiStorm)", note: "Primary parent channel · push notification" },
  { id: "sms", label: "SMS", note: "Out-of-band · numbers sourced from DigiStorm" },
  { id: "email", label: "Email", note: "Staff & parent lists · Seqta email for parents" },
  { id: "website", label: "Website notice", note: "Holding page built & hidden — ready to publish" },
  { id: "facebook", label: "Facebook", note: "Official page · post only AFTER the official message is issued" },
  { id: "instagram", label: "Instagram", note: "Official account · post only AFTER the official message is issued" },
  { id: "linkedin", label: "LinkedIn", note: "Official account · corporate/community" },
  { id: "vivi", label: "Vivi screens", note: "On-campus screens · evac/lockdown captured" },
  { id: "phone", label: "Phone / reception", note: "Reception uses the approved script; log all media calls" },
  { id: "newsletter", label: "Newsletter", note: "Slower cadence · community updates" },
  { id: "media_release", label: "Media release", note: "Via the Communications Coordinator; Leader-approved only" },
];

export function channelLabel(id) {
  return COMMS_CHANNELS.find((c) => c.id === id)?.label || id;
}

// Who a message is addressed to (CIM & BCP §6 + Crisis Comms Plan stakeholders).
export const COMMS_AUDIENCES = [
  { id: "families_affected", label: "Affected families" },
  { id: "parents_all", label: "All parents & carers" },
  { id: "students", label: "Students" },
  { id: "staff_all", label: "All staff" },
  { id: "council", label: "College Council" },
  { id: "asc", label: "Anglican Schools Commission (ASC) / AngliSchools" },
  { id: "community", label: "Wider community" },
  { id: "suppliers", label: "Suppliers & contractors" },
  { id: "neighbours", label: "Neighbouring properties" },
  { id: "media", label: "Media" },
  { id: "head_office", label: "Head office / network" },
];

export function audienceLabel(id) {
  return COMMS_AUDIENCES.find((a) => a.id === id)?.label || id;
}

// Communications exposure level (CIM & BCP §7, Crisis Comms Strategy — Assess).
// Sets the intensity of the comms response; stored on incident.commsLevel.
export const COMMS_LEVELS = {
  1: { label: "Minimal exposure", color: "#5B8C7C", blurb: "Little or no attention. Pre-event information requests; public/media largely unaware." },
  2: { label: "Moderate exposure", color: "#B89460", blurb: "Slow but steady media coverage. Parents aware; public aware but paying little attention." },
  3: { label: "High exposure", color: "#A85535", blurb: "Increased local/regional media enquiries; media contacting non-CIMT staff; stakeholders/partners on site." },
  4: { label: "Very high exposure", color: "#7A1820", blurb: "Multi-channel media; broadcast/print on-site for live coverage; high negative social traffic; anger/outrage." },
};

// Comms phases (Crisis Comms Plan) — aligned to Assess → Stabilise → Remedy /
// the incident phase spine. Templates are tagged with the phase they suit.
export const COMMS_PHASES = [
  { id: "start", label: "At the start", blurb: "Immediate & decisive: assess, issue a holding statement, brief reception, families before public, single spokesperson." },
  { id: "persist", label: "If it persists", blurb: "Sustain: factual updates via website/social/media, three key messages, guidance on what to do/avoid, monitor & correct misinformation." },
  { id: "recovery", label: "Recovery", blurb: "Wind down: continue updates as needed, reduce cadence as the situation stabilises, resumption messaging." },
];

// Spokesperson & media-handling protocol (Crisis Comms Plan, MW).
export const MEDIA_PROTOCOL = {
  spokesperson: "Critical Incident Leader (Principal) — the sole College spokesperson.",
  activates: "Communications Coordinator (Marketing Manager) activates the Crisis Communications Plan under the Leader's direction.",
  rules: [
    "Only the designated spokesperson speaks to media — one voice.",
    "All media interactions are pre-approved, factual and courteous — no speculation or unverified information.",
    "Families of the injured/deceased are notified by the appropriate person BEFORE any public announcement.",
    "Press conferences: single spokesperson; schedule before 2:00pm for evening-news coverage; location TBA.",
    "Monitor coverage; promptly correct significant misinformation; archive all coverage and Q&A.",
  ],
};

// What reception / key contacts do when a reporter makes contact (CCP).
export const RECEPTION_SCRIPT = [
  "Do not comment on the situation.",
  "Direct all reporters to the Communications Coordinator / Critical Incident Leader.",
  "Collect the reporter's name, outlet, contact details and their questions.",
  "Relay every enquiry to the Communications Coordinator immediately.",
];

// Social-media guardrails during a crisis (CCP best practices).
export const SOCIAL_RULES = [
  "Release the official message BEFORE any social-media post about the crisis.",
  "Cancel all scheduled social-media posts until the crisis is resolved.",
  "Avoid engaging with followers/comments so critical updates stay visible.",
  "Official channels only: Seqta email, website, Facebook, Instagram.",
];

// Seeded template library. Holding & media statements are
// attributed to MWHI (Megan Whitshed, Marketing Manager), who
// per the PRD review already has holding statements drafted.
// Bodies use {{tokens}} filled by fillTemplate() at draft time.
export const COMMS_TEMPLATES = [
  {
    id: "tpl-initial-alert",
    name: "Immediate alert",
    category: "alert",
    phase: "start",
    audienceId: "parents_all",
    channels: ["digistorm", "sms", "vivi"],
    owner: "MWHI — M. Whitshed",
    suggestedTypes: ["lockdown", "evacuation", "external_threat", "hazmat", "natural_disaster"],
    body:
      "Trinity Anglican College is managing an emergency at {{location}}. Staff are following emergency procedures and are directing students. Please do NOT attend or phone the College. Await official updates via the College website and Trinity App.",
  },
  {
    id: "tpl-holding-assessing",
    name: "Holding statement — assessing",
    category: "holding",
    phase: "start",
    audienceId: "parents_all",
    channels: ["digistorm", "website", "facebook"],
    owner: "MWHI — M. Whitshed",
    suggestedTypes: ["lockdown", "evacuation", "external_threat", "hazmat", "natural_disaster", "cyber", "infrastructure"],
    body:
      "We are aware of a situation at Trinity Anglican College and are currently assessing it. The safety and wellbeing of our students and staff is our top priority. Please expect a further update from the Principal within the next two hours. For updates, please check our website or social media channels. — Trinity Anglican College",
  },
  {
    id: "tpl-holding",
    name: "Holding statement — families",
    category: "holding",
    phase: "start",
    audienceId: "parents_all",
    channels: ["digistorm", "sms", "website"],
    owner: "MWHI — M. Whitshed",
    suggestedTypes: ["lockdown", "evacuation", "external_threat", "hazmat", "natural_disaster", "death_oncampus", "missing"],
    body:
      "Trinity Anglican College is currently managing an incident at the College. The safety and wellbeing of our students and staff is our absolute priority, and our emergency procedures are in place. Please do not attend the College at this time and await official communication. A further update will follow as soon as we are able. — Trinity Anglican College",
  },
  {
    id: "tpl-parent-email",
    name: "Parent email — situation being managed",
    category: "parent",
    phase: "start",
    audienceId: "parents_all",
    channels: ["digistorm", "email"],
    owner: "MWHI — M. Whitshed",
    suggestedTypes: ["lockdown", "evacuation", "external_threat", "hazmat", "natural_disaster"],
    body:
      "Dear Parents,\n\nTrinity Anglican College is currently managing an emergency situation involving {{incident_type}}. All students and staff are safe, and we are following our emergency protocols.\n\nWe will keep you updated with further information as it becomes available. Please avoid calling the College so that phone lines remain open for emergency communication.\n\nThank you for your understanding.\n\n{{principal}}\nPrincipal, Trinity Anglican College",
  },
  {
    id: "tpl-media-holding",
    name: "Media holding statement",
    category: "media",
    phase: "start",
    audienceId: "media",
    channels: ["email", "media_release"],
    owner: "MWHI — M. Whitshed",
    suggestedTypes: ["external_threat", "death_oncampus", "death_offcampus", "lockdown", "hazmat", "natural_disaster"],
    body:
      "Trinity Anglican College can confirm it is responding to an incident today, {{date}}. The College's priority is the safety and wellbeing of its students and staff, and established emergency procedures have been followed. The College is cooperating with emergency services and will provide further information as appropriate. Media enquiries: Marketing Manager, M. Whitshed. — Trinity Anglican College",
  },
  {
    id: "tpl-staff-notice",
    name: "Staff notice",
    category: "staff",
    phase: "start",
    audienceId: "staff_all",
    channels: ["email", "vivi"],
    owner: null,
    suggestedTypes: ["lockdown", "evacuation", "external_threat", "hazmat", "natural_disaster", "death_offcampus"],
    body:
      "STAFF NOTICE — {{incident_type}}\n\nAn incident is currently being managed at {{location}}. Please follow the instructions of your Chief Warden and the Critical Incident Leader. Do not speak with media or post on social media. Refer any media enquiries to the Communications Coordinator. Await the all-clear via this channel.\n\n— Critical Incident Leader",
  },
  {
    id: "tpl-key-messages",
    name: "Key messages — ongoing updates",
    category: "keymsg",
    phase: "persist",
    audienceId: "community",
    channels: ["website", "facebook", "instagram", "email"],
    owner: "MWHI — M. Whitshed",
    suggestedTypes: [],
    body:
      "Our three key messages for this incident:\n\n1. Our priority is the safety of our community. We are working closely with authorities to ensure all necessary precautions are taken.\n\n2. We are actively managing the situation and will continue to provide accurate, timely updates as more information becomes available.\n\n3. We understand the concern this has caused and are committed to keeping all stakeholders informed every step of the way.\n\n[Tailor these three messages to the verified facts, and adapt per audience — students, parents, staff, media.]",
  },
  {
    id: "tpl-parent-notify",
    name: "Parent notification — factual detail",
    category: "parent",
    phase: "persist",
    audienceId: "families_affected",
    channels: ["digistorm", "email"],
    owner: null,
    suggestedTypes: [],
    body:
      "Dear Parents and Carers,\n\nWe are writing to inform you of an incident involving {{incident_type}} at Trinity Anglican College today, {{date}}. Our staff responded in line with the College's emergency management procedures and all students are safe and accounted for.\n\n[Add specific, factual detail here — do not speculate.]\n\nIf you have any concerns, please contact the College office. We will provide any further updates as needed.\n\nKind regards,\n{{principal}}\nPrincipal, Trinity Anglican College",
  },
  {
    id: "tpl-all-clear",
    name: "All-clear",
    category: "allclear",
    phase: "recovery",
    audienceId: "parents_all",
    channels: ["digistorm", "sms", "website"],
    owner: null,
    suggestedTypes: ["lockdown", "evacuation", "external_threat", "hazmat", "natural_disaster"],
    body:
      "ALL CLEAR — The incident at Trinity Anglican College has now been resolved and normal operations have resumed. Thank you for your patience and cooperation. Any families needing further information can contact the College office. — {{principal}}, Principal",
  },
];

export const COMMS_CATEGORIES = {
  alert: { label: "Immediate alert", color: "#7A1820" },
  holding: { label: "Holding statement", color: "#B89460" },
  keymsg: { label: "Key messages", color: "#4F6D8F" },
  parent: { label: "Parent notification", color: "#00305E" },
  staff: { label: "Staff notice", color: "#5B8C7C" },
  allclear: { label: "All-clear", color: "#5B8C7C" },
  media: { label: "Media", color: "#A85535" },
};

// Templates suggested for a given incident type, best matches first.
export function templatesForIncidentType(typeId) {
  const suited = COMMS_TEMPLATES.filter((t) => t.suggestedTypes.includes(typeId));
  const rest = COMMS_TEMPLATES.filter((t) => !t.suggestedTypes.includes(typeId));
  return [...suited, ...rest];
}

export function commsPhaseMeta(id) {
  return COMMS_PHASES.find((p) => p.id === id) || null;
}

// ------------------------------------------------------------------
// MEDIA Q&A / FAQ BUILDER (Crisis Comms Plan, MW — "Media Coverage
// Preparation"). The spokesperson pre-drafts answers to the questions
// journalists ask; answered items become the FAQ single-source-of-truth.
// The 5 broad categories frame ~35 specific questions. Answers are
// stored on incident.mediaQA = { [questionId]: "answer" }.
// ------------------------------------------------------------------
export const MEDIA_QA_CATEGORIES = [
  { id: "happened", label: "What happened?" },
  { id: "caused", label: "What caused it?" },
  { id: "means", label: "What does it mean?" },
  { id: "responsible", label: "Who is responsible?" },
  { id: "prevent", label: "What's being done / preventing recurrence?" },
];

export const MEDIA_QA_QUESTIONS = [
  // What happened?
  { id: "q1", cat: "happened", q: "What is your name and title?" },
  { id: "q2", cat: "happened", q: "Can you explain what happened?" },
  { id: "q3", cat: "happened", q: "When did the incident occur?" },
  { id: "q4", cat: "happened", q: "Where did it happen?" },
  { id: "q5", cat: "happened", q: "Who was affected, and how many people were involved?" },
  { id: "q6", cat: "happened", q: "How confident are you about the accuracy of this information?" },
  { id: "q7", cat: "happened", q: "Can you specify the extent of the harm or damage?" },
  { id: "q8", cat: "happened", q: "When did the response begin, and when were you notified of the situation?" },
  // What caused it?
  { id: "q9", cat: "caused", q: "Why did this happen, and what caused it?" },
  { id: "q10", cat: "caused", q: "What is your best estimate of the cause, if not yet confirmed?" },
  { id: "q11", cat: "caused", q: "Did you have any prior warning?" },
  { id: "q12", cat: "caused", q: "Could this situation have been prevented?" },
  // What does it mean?
  { id: "q13", cat: "means", q: "Is the situation under control?" },
  { id: "q14", cat: "means", q: "Is there any ongoing danger, and are people safe now?" },
  { id: "q15", cat: "means", q: "Are those affected receiving help?" },
  { id: "q16", cat: "means", q: "What should people do now?" },
  { id: "q17", cat: "means", q: "How long will it take for things to return to normal?" },
  { id: "q18", cat: "means", q: "What is the estimated damage, and could more damage occur?" },
  { id: "q19", cat: "means", q: "What impact will this have on those involved?" },
  { id: "q20", cat: "means", q: "What is the worst-case scenario?" },
  { id: "q21", cat: "means", q: "Will this cause any inconvenience to employees or the public?" },
  { id: "q22", cat: "means", q: "What would you say to those affected and their families?" },
  { id: "q23", cat: "means", q: "When can we expect more updates?" },
  // Who is responsible?
  { id: "q24", cat: "responsible", q: "Who is leading the response?" },
  { id: "q25", cat: "responsible", q: "Who is responsible or to blame?" },
  { id: "q26", cat: "responsible", q: "Who is conducting the investigation, and what have you found so far?" },
  { id: "q27", cat: "responsible", q: "Have any laws been broken, and were any mistakes made?" },
  { id: "q28", cat: "responsible", q: "How was the response handled, and could it have been better?" },
  // What's being done / preventing recurrence?
  { id: "q29", cat: "prevent", q: "What is being done to manage the crisis?" },
  { id: "q30", cat: "prevent", q: "What help has been offered or requested?" },
  { id: "q31", cat: "prevent", q: "What actions will be taken after the investigation?" },
  { id: "q32", cat: "prevent", q: "What precautionary measures were in place, and were lessons from previous incidents applied?" },
  { id: "q33", cat: "prevent", q: "How much will the response and recovery cost?" },
  { id: "q34", cat: "prevent", q: "What steps are being taken to prevent this from happening again?" },
  { id: "q35", cat: "prevent", q: "Can we speak to those affected? (media access)" },
];

export function mediaQAProgress(incident) {
  const a = incident?.mediaQA || {};
  const done = MEDIA_QA_QUESTIONS.filter((x) => (a[x.id] || "").trim()).length;
  return { done, total: MEDIA_QA_QUESTIONS.length };
}

// Build the FAQ single-source-of-truth from answered questions only.
export function buildFAQText(incident) {
  const a = incident?.mediaQA || {};
  const settings = loadAll().settings || {};
  const lines = [
    `Trinity Anglican College — Media FAQ`,
    `Incident: ${incident?.title || incident?.id || ""}`,
    `Prepared by: ${settings.principalName || "Critical Incident Leader"} (spokesperson)`,
    ``,
  ];
  for (const cat of MEDIA_QA_CATEGORIES) {
    const answered = MEDIA_QA_QUESTIONS.filter((x) => x.cat === cat.id && (a[x.id] || "").trim());
    if (!answered.length) continue;
    lines.push(`## ${cat.label}`);
    for (const x of answered) { lines.push(`Q: ${x.q}`); lines.push(`A: ${a[x.id].trim()}`); lines.push(``); }
  }
  return lines.join("\n");
}

// Substitute {{tokens}} in a template body against an incident.
export function fillTemplate(body, incident) {
  const settings = loadAll().settings || {};
  const now = new Date();
  const tokens = {
    incident_type: (incident?.typeLabel || "an incident").toLowerCase(),
    location: incident?.location || "the College",
    date: now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    principal: settings.principalName || "Adrian Johnson",
    school: "Trinity Anglican College",
  };
  return String(body).replace(/\{\{(\w+)\}\}/g, (m, key) => (key in tokens ? tokens[key] : m));
}

// Factory for a new communication (starts as a draft).
export function newComm({ templateId = null, name, audienceId, channels = [], body }) {
  return {
    id: `cm${Date.now()}`,
    ts: Date.now(),
    templateId,
    name: name || "Untitled message",
    audienceId: audienceId || "parents_all",
    channels,
    body: body || "",
    status: "draft", // draft → approved → dispatched
    approvedBy: null,
    approvedAt: null,
    dispatchedAt: null,
  };
}

export const COMMS_STATUS = {
  draft: { label: "Draft", color: "#4A5664" },
  approved: { label: "Approved", color: "#5B8C7C" },
  dispatched: { label: "Dispatched", color: "#00305E" },
};

// ============================================================
// v6 — ACTIVATION & NOTIFICATION (PRD M2 / FR-ACT)
// One-action declare → cascading notification to assigned role-
// holders with acknowledgement tracking and failover to backup.
// NFR-02/03/11: ≥2 independent activation channels, one of them
// out-of-band (SMS) so activation survives an M365/network outage.
// Prototype: sends are SIMULATED (no backend / SMS gateway yet).
// ============================================================

// Two independent channels — the app push AND an out-of-band SMS.
export const ACTIVATION_CHANNELS = [
  { id: "digistorm", label: "Trinity App push", note: "Primary · in-app alert" },
  { id: "sms", label: "SMS (out-of-band)", note: "Independent of M365 / network" },
];

// Per-recipient acknowledgement state during an activation.
export const NOTIFY_STATUS = {
  sent: { label: "Notified", color: "#B89460" },
  acked: { label: "Acknowledged", color: "#5B8C7C" },
  no_response: { label: "No response", color: "#A85535" },
  declined: { label: "Declined", color: "#A02029" },
};

// ---- Increment C: Role Status Board states (derived from assignment + notify) ----
export const ROLE_BOARD_STATE = {
  acknowledged: { label: "Acknowledged", color: "#5B8C7C" },
  notified: { label: "Notified — awaiting ack", color: "#B89460" },
  assigned: { label: "Assigned", color: "#00305E" },
  declined: { label: "Declined", color: "#A02029" },
  unassigned: { label: "Unassigned", color: "#A85535" },
};

export function roleBoardState(role) {
  if (!roleIsAssigned(role)) return "unassigned";
  const s = role.notify?.status;
  if (s === "acked") return "acknowledged";
  if (s === "declined") return "declined";
  if (s === "sent" || s === "no_response") return "notified";
  return "assigned";
}

// Reporting/escalation chain for a role, walking reportsTo while it's a known role.
export function escalationPathwayFor(roleName) {
  const chain = [];
  const seen = new Set();
  let current = roleName;
  while (current && ROLE_DEFINITIONS[current] && !seen.has(current)) {
    seen.add(current);
    const rt = ROLE_DEFINITIONS[current].reportsTo;
    if (!rt) break;
    chain.push(rt);
    current = ROLE_DEFINITIONS[rt] ? rt : null;
  }
  return chain;
}

// Simulated notification dispatch (provider abstraction — real email/SMS/push swap in later).
export function simulateNotification(role, incident) {
  return {
    at: Date.now(),
    ok: true,
    channels: ["Trinity App", "SMS"],
    to: role.staff,
    role: role.role,
    payload: {
      incidentId: incident.id,
      title: incident.title,
      role: role.role,
      severity: SEVERITY[incident.severity]?.label,
      location: incident.location,
      action: "Open CIMPLE and acknowledge activation.",
    },
  };
}

// Escalation / conflict-resolution engine.
// Promote a staff member INTO targetRoleId; if they already hold another role
// in this incident, vacate it and backfill via recommendAlternate. Returns
// { roles, log } — the UI applies roles via update() and writes log to timeline.
export function promoteToRole(incident, staffId, targetRoleId) {
  const roles = (incident.roles || []).map((r) => ({ ...r }));
  const target = roles.find((r) => r.id === targetRoleId);
  const staff = getStaff(staffId) || listStaff().find((s) => s.id === staffId);
  if (!target || !staff) return { roles: incident.roles, log: [] };
  const log = [];
  const wasActivated = !!incident.activation;

  // Any OTHER role this person currently holds (match by id or name).
  const prev = roles.find((r) => r.id !== targetRoleId && roleIsAssigned(r) && (r.staffId === staffId || r.staff === staff.name));

  Object.assign(target, {
    staff: staff.name, staffId: staff.id, initials: staff.initials, status: "confirmed", suggested: undefined,
    notify: wasActivated ? { status: "sent", sentAt: Date.now(), viaBackup: false } : target.notify,
  });
  log.push(`${staff.name} assigned as ${target.role}${wasActivated ? " — notified" : ""}.`);

  if (prev) {
    log.push(`${staff.name} removed from ${prev.role} — no one holds two active roles at once.`);
    const alt = recommendAlternate({ ...incident, roles }, prev.id);
    if (alt && !alt.conflict) {
      Object.assign(prev, {
        staff: alt.staff.name, staffId: alt.staff.id, initials: alt.staff.initials, status: "confirmed", backup: undefined,
        notify: wasActivated ? { status: "sent", sentAt: Date.now(), viaBackup: true } : prev.notify,
      });
      log.push(`${prev.role} reassigned to ${alt.staff.name}${wasActivated ? " — notified" : ""}.`);
    } else {
      Object.assign(prev, { staff: "—", staffId: null, initials: "—", status: "unassigned", notify: undefined });
      log.push(`${prev.role} is now unassigned — no qualified alternate available.`);
    }
  }
  return { roles, log };
}

// Reassign a role to its backup / next alternate (used on decline or no-response).
export function reassignRoleToAlternate(incident, roleId) {
  const roles = (incident.roles || []).map((r) => ({ ...r }));
  const role = roles.find((r) => r.id === roleId);
  if (!role) return { roles: incident.roles, log: [] };
  const wasActivated = !!incident.activation;
  const prevName = role.staff;
  const alt = recommendAlternate(incident, roleId);
  if (!alt) {
    Object.assign(role, { staff: "—", staffId: null, initials: "—", status: "unassigned", notify: undefined });
    return { roles, log: [`${role.role} vacated — no qualified alternate available.`] };
  }
  Object.assign(role, {
    staff: alt.staff.name, staffId: alt.staff.id, initials: alt.staff.initials, status: "confirmed", backup: undefined,
    notify: wasActivated ? { status: "sent", sentAt: Date.now(), viaBackup: true } : { status: undefined },
  });
  return { roles, log: [`${role.role} reassigned from ${prevName} to ${alt.staff.name}${wasActivated ? " — notified" : ""}.`] };
}

// A role can be notified only if a real person is assigned to it.
export function roleIsAssigned(role) {
  return !!role && role.status !== "unassigned" && role.staff && role.staff !== "—";
}

// ============================================================
// v7 — POST-INCIDENT REVIEW (PRD M7 / FR-PIR)
// Auto-assemble the record → AI-drafted review → corrective
// actions → plan-update suggestions. AI drafts only; a human
// edits and finalises (PRD §9.2).
// ============================================================

export const PIR_STATUS = {
  draft: { label: "Draft", color: "#4A5664" },
  final: { label: "Finalised", color: "#00305E" },
};

export function newPIR() {
  return {
    createdAt: Date.now(),
    status: "draft", // draft → final
    summary: "",
    whatWorked: "",
    whatImprove: "",
    planUpdates: "",
    correctiveActions: [],
  };
}

export function newCorrectiveAction(text) {
  return { id: `ca${Date.now()}`, text: text || "", owner: "", done: false };
}

// ============================================================
// v8 — DECISION LOG (CORE · decision-making + accountability)
// Records leadership DECISIONS with rationale, options, the
// evidence/what-was-known, and a review point — not just actions.
// The single most valuable artefact for post-incident defensibility.
// Answers the command question: "What decisions have been made?"
// ============================================================

export const DECISION_STATUS = {
  open: { label: "Open", color: "#B89460" },
  reviewed: { label: "Reviewed", color: "#5B8C7C" },
};

export function newDecision({ decision, rationale, options, evidence, reviewBy }) {
  return {
    id: `dec${Date.now()}`,
    ts: Date.now(),
    decidedBy: (loadAll().settings || {}).principalName || "Critical Incident Leader",
    decision: decision || "",
    rationale: rationale || "",
    options: options || "",   // options considered
    evidence: evidence || "", // evidence relied on / what was known at the time
    reviewBy: reviewBy || null,
    reviewedAt: null,
    outcome: "",
    status: "open", // open → reviewed
  };
}

// ============================================================
// v9 — RISK / WATCH REGISTER (CORE · situational awareness)
// The second incident-command data stream alongside the Decision
// Log. Live operational concerns only — NOT a corporate risk
// register. Answers the command question: "What risks remain?"
//
// Model is shaped for zero-rework reuse by:
//  • Red Folder Mode  → openRisks() gives {severity,title} to show.
//  • Blind Spots      → open/severity/aging/unowned/escalated all
//                       derive from fields (no schema change needed).
// ============================================================

export const RISK_CATEGORIES = [
  "Safety", "Welfare", "Communications", "Operational", "Facilities", "IT", "External Agency", "Other",
];

// rank: higher = more severe (for sorting / Blind Spots thresholds).
export const RISK_SEVERITY = {
  low: { label: "Low", color: "#5B8C7C", rank: 1 },
  medium: { label: "Medium", color: "#B89460", rank: 2 },
  high: { label: "High", color: "#A85535", rank: 3 },
  critical: { label: "Critical", color: "#7A1820", rank: 4 },
};

export const RISK_STATUS = {
  watch: { label: "Watch", color: "#4A5664", open: true },
  active: { label: "Active Risk", color: "#B89460", open: true },
  escalated: { label: "Escalated", color: "#A02029", open: true },
  resolved: { label: "Resolved", color: "#5B8C7C", open: false },
};

export function newRisk({ title, description, category, severity, owner, reviewBy, status }) {
  const ts = Date.now();
  return {
    id: `risk${ts}`,
    createdAt: ts,
    updatedAt: ts,
    title: title || "",
    description: description || "",
    category: category || "Operational",
    severity: severity || "medium", // low | medium | high | critical
    status: status || "watch",      // watch | active | escalated | resolved
    owner: owner || "",
    reviewBy: reviewBy || null,
    resolvedAt: null,
    resolutionNotes: "",
  };
}

// A risk is "open" while its status is anything but resolved.
export function riskIsOpen(risk) {
  return !!risk && (RISK_STATUS[risk.status]?.open ?? risk.status !== "resolved");
}

// Open risks, most severe first then oldest first — the exact
// shape Red Folder Mode will render, and Copilot will reason over.
export function openRisks(incident) {
  return (incident.risks || [])
    .filter(riskIsOpen)
    .sort((a, b) => (RISK_SEVERITY[b.severity]?.rank || 0) - (RISK_SEVERITY[a.severity]?.rank || 0) || a.createdAt - b.createdAt);
}

// Counts for the command strip + incident summary.
export function riskCounts(incident) {
  const risks = incident.risks || [];
  return {
    watch: risks.filter((r) => r.status === "watch").length,
    active: risks.filter((r) => r.status === "active").length,
    escalated: risks.filter((r) => r.status === "escalated").length,
    resolved: risks.filter((r) => r.status === "resolved").length,
    open: risks.filter(riskIsOpen).length,
    total: risks.length,
  };
}

// ============================================================
// v10 — CRISIS COPILOT (CORE · decision support)
// A RULES-BASED assistant answering "what are we forgetting?".
// It recommends only — never decides, instructs, or automates.
// Architecture:
//   buildCopilotContext(incident) → one flat facts object
//   COPILOT_RULES[]               → declarative, each with an id;
//                                   evaluate(ctx) → finding | null
//   runCopilot(incident, now)     → sorted findings, each traceable
//                                   to its rule id (no hidden logic)
// Future AI upgrade path: an AI rule can be appended to
// COPILOT_RULES consuming the SAME ctx (decisions, risks, timeline)
// and returning findings in the same shape — no schema change.
// ============================================================

export const COPILOT_SEVERITY = {
  critical: { label: "Critical", color: "#7A1820", rank: 3 },
  important: { label: "Important", color: "#A85535", rank: 2 },
  advisory: { label: "Advisory", color: "#4A5664", rank: 1 },
};

// One flat, inspectable facts object. Every rule reads only from here.
export function buildCopilotContext(incident, now = Date.now()) {
  const roles = incident.roles || [];
  const assigned = roles.filter(roleIsAssigned);
  const requiredUnfilled = roles.filter((r) => r.required && !roleIsAssigned(r));
  const tasks = incident.tasks || [];
  const openTasks = tasks.filter((t) => !t.done);
  const decisions = incident.decisions || [];
  const comms = incident.comms || [];
  const rc = riskCounts(incident);
  const oRisks = openRisks(incident);
  const notified = assigned.filter((r) => r.notify);

  return {
    now,
    severityNum: incident.severity,
    severityLabel: SEVERITY[incident.severity]?.label || "—",
    isClosed: incident.status === "closed",
    isDrill: !!incident.isDrill,
    elapsedMin: Math.floor((now - incident.startedAt) / 60000),

    // roles
    requiredUnfilled,
    commsRoleAssigned: assigned.some((r) => /communication/i.test(r.role)),
    requiredWithoutBackup: roles.filter((r) => r.required && roleIsAssigned(r) && !r.backup).length,

    // activation
    activation: !!incident.activation,
    minsSinceActivation: incident.activation ? Math.floor((now - incident.activation.declaredAt) / 60000) : null,
    notifiedCount: notified.length,
    unackedCount: notified.filter((r) => r.notify.status !== "acked").length,

    // tasks
    openTasksCount: openTasks.length,
    overdueTasksCount: openTasks.filter((t) => t.dueAt && t.dueAt < now).length,
    ownedOpenTasksCount: openTasks.filter((t) => t.owner && t.owner !== "—").length,

    // decisions
    decisionsCount: decisions.length,
    openDecisionsCount: decisions.filter((d) => d.status === "open").length,
    decisionsWithReviewCount: decisions.filter((d) => d.reviewBy).length,

    // comms
    commsDrafted: comms.length,
    commsApproved: comms.filter((c) => c.status === "approved" || c.status === "dispatched").length,

    // risks
    openRisksCount: rc.open,
    criticalOpenCount: oRisks.filter((r) => r.severity === "critical").length,
    escalatedNoReviewCount: (incident.risks || []).filter((r) => r.status === "escalated" && !r.reviewBy).length,
    unownedOpenCount: oRisks.filter((r) => !r.owner).length,

    // recovery
    hasPir: !!incident.pir,

    // instruments (people at risk / visual boards)
    peopleUnaccounted: peopleAtRiskCounts(incident).unaccounted,
    boardIssues: (incident.boards?.issues || []).length,

    // business continuity
    inRecoveryPhase: ["recovery", "resumption"].includes(incidentPhase(incident)),
    activeStrategies: activeStrategyCount(incident),
  };
}

// Declarative rule set. Each rule owns an id + category; evaluate()
// returns the finding body (severity/issue/why/evidence/target) or null.
// target = a drawer key the UI can open, or null (surfaced elsewhere).
export const COPILOT_RULES = [
  // ---- COMMUNICATIONS ----
  { id: "COMMS-01", category: "Communications", evaluate: (c) => c.activation && c.commsDrafted === 0 && !c.isClosed
    ? { severity: c.severityNum >= 3 ? "critical" : "important", issue: "No communication after declaration", why: "The incident was activated but no communication has been drafted.", evidence: `Declared ${c.minsSinceActivation}m ago · 0 messages drafted.`, target: "comms" } : null },
  { id: "COMMS-02", category: "Communications", evaluate: (c) => c.commsDrafted > 0 && c.commsApproved === 0 && !c.isClosed
    ? { severity: "advisory", issue: "Communications drafted, none approved", why: "Draft messages exist but none have Principal approval to release.", evidence: `${c.commsDrafted} drafted · 0 approved.`, target: "comms" } : null },
  { id: "COMMS-03", category: "Communications", evaluate: (c) => (c.severityNum >= 3 || c.activation) && !c.commsRoleAssigned && !c.isClosed
    ? { severity: "important", issue: "No Communications Coordinator assigned", why: "A significant incident should have someone owning communications.", evidence: `Severity ${c.severityLabel} · comms role unfilled.`, target: null } : null },

  // ---- COMMAND ----
  { id: "CMD-01", category: "Command", evaluate: (c) => !c.isClosed && c.elapsedMin >= 15 && c.decisionsCount === 0
    ? { severity: "important", issue: "No decisions recorded", why: "15+ minutes in with no decisions logged — key calls may be going undocumented.", evidence: `${c.elapsedMin}m elapsed · 0 decisions.`, target: "decisions" } : null },
  { id: "CMD-02", category: "Command", evaluate: (c) => !c.isClosed && c.requiredUnfilled.length > 0 && (c.activation || c.severityNum >= 3)
    ? { severity: c.severityNum >= 4 ? "critical" : "important", issue: "Required roles unfilled", why: "Key command roles have no one assigned.", evidence: `${c.requiredUnfilled.length} unfilled: ${c.requiredUnfilled.map((r) => r.role).join(", ")}.`, target: null } : null },
  { id: "CMD-03", category: "Command", evaluate: (c) => !c.isClosed && c.openDecisionsCount > 0 && c.decisionsWithReviewCount === 0
    ? { severity: "advisory", issue: "No review point on decisions", why: "Open decisions have no scheduled review — assumptions may go unchecked.", evidence: `${c.openDecisionsCount} open · 0 with a review point.`, target: "decisions" } : null },

  // ---- TASKS ----
  { id: "TASK-01", category: "Tasks", evaluate: (c) => c.overdueTasksCount > 0 && !c.isClosed
    ? { severity: c.severityNum >= 3 ? "important" : "advisory", issue: "Tasks overdue", why: "Tasks past their due time may be slipping.", evidence: `${c.overdueTasksCount} task(s) overdue.`, target: null } : null },
  { id: "TASK-02", category: "Tasks", evaluate: (c) => !c.isClosed && c.openTasksCount > 0 && c.ownedOpenTasksCount === 0
    ? { severity: "advisory", issue: "Open tasks unassigned", why: "No owner on any open task.", evidence: `${c.openTasksCount} open · 0 owned.`, target: null } : null },
  { id: "TASK-03", category: "Tasks", evaluate: (c) => !c.isClosed && c.severityNum >= 3 && c.openTasksCount < 2
    ? { severity: "advisory", issue: "Few active tasks for a major incident", why: "A major incident usually has more tracked actions — is everything being captured?", evidence: `Severity ${c.severityLabel} · ${c.openTasksCount} open task(s).`, target: null } : null },

  // ---- RISK ----
  { id: "RISK-01", category: "Risk", evaluate: (c) => c.criticalOpenCount > 0
    ? { severity: "critical", issue: "Critical risk unresolved", why: "A risk marked critical remains open.", evidence: `${c.criticalOpenCount} critical risk(s) open.`, target: "risks" } : null },
  { id: "RISK-02", category: "Risk", evaluate: (c) => c.escalatedNoReviewCount > 0
    ? { severity: "important", issue: "Escalated risk without review", why: "An escalated risk has no review point set.", evidence: `${c.escalatedNoReviewCount} escalated risk(s) without a review point.`, target: "risks" } : null },
  { id: "RISK-03", category: "Risk", evaluate: (c) => c.unownedOpenCount > 0
    ? { severity: "important", issue: "Open risk without an owner", why: "An open risk has no one accountable for watching it.", evidence: `${c.unownedOpenCount} open risk(s) unowned.`, target: "risks" } : null },

  // ---- ACTIVATION ----
  { id: "ACT-01", category: "Activation", evaluate: (c) => !c.isClosed && c.severityNum >= 3 && !c.activation
    ? { severity: c.severityNum >= 4 ? "critical" : "important", issue: "Activation not run", why: "This severity usually warrants notifying role-holders.", evidence: `Severity ${c.severityLabel} · not activated.`, target: "activation" } : null },
  { id: "ACT-02", category: "Activation", evaluate: (c) => c.activation && c.unackedCount > 0 && c.minsSinceActivation >= 5
    ? { severity: "important", issue: "Notified staff haven't acknowledged", why: "Some notified role-holders have not confirmed receipt.", evidence: `${c.unackedCount} of ${c.notifiedCount} not acknowledged · ${c.minsSinceActivation}m since declaration.`, target: "activation" } : null },
  { id: "ACT-03", category: "Activation", evaluate: (c) => c.activation && c.requiredWithoutBackup > 0 && !c.isClosed
    ? { severity: "advisory", issue: "Key roles have no backup", why: "Some required roles have no named backup for failover.", evidence: `${c.requiredWithoutBackup} required role(s) without a backup.`, target: null } : null },

  // ---- PEOPLE / SAFETY ----
  { id: "PPL-01", category: "People", evaluate: (c) => c.peopleUnaccounted > 0 && !c.isClosed
    ? { severity: "critical", issue: "Person unaccounted for", why: "Someone in the People at Risk log is marked unaccounted — the highest-priority safety gap.", evidence: `${c.peopleUnaccounted} person(s) unaccounted.`, target: "instruments" } : null },

  // ---- RECOVERY ----
  { id: "REC-01", category: "Recovery", evaluate: (c) => c.isClosed && c.openRisksCount > 0
    ? { severity: "important", issue: "Closed with open risks", why: "The incident is closed but risks remain unresolved.", evidence: `${c.openRisksCount} risk(s) still open.`, target: "risks" } : null },
  { id: "REC-02", category: "Recovery", evaluate: (c) => c.isClosed && !c.hasPir
    ? { severity: "advisory", issue: "No post-incident review", why: "The incident closed without a review started.", evidence: "Closed · no PIR.", target: "pir" } : null },
  { id: "REC-03", category: "Recovery", evaluate: (c) => c.inRecoveryPhase && c.activeStrategies === 0 && !c.isClosed
    ? { severity: "important", issue: "In a recovery phase but no continuity strategy active", why: "The incident has moved into Business Recovery/Resumption but no recovery strategy is activated.", evidence: "Recovery phase · 0 strategies active.", target: "continuity" } : null },
];

// Run every rule against the context; return findings sorted most-severe first.
export function runCopilot(incident, now = Date.now()) {
  const c = buildCopilotContext(incident, now);
  const findings = [];
  for (const rule of COPILOT_RULES) {
    const f = rule.evaluate(c);
    if (f) findings.push({ ruleId: rule.id, category: rule.category, ...f });
  }
  return findings.sort((a, b) => COPILOT_SEVERITY[b.severity].rank - COPILOT_SEVERITY[a.severity].rank);
}

// Read-only facts auto-assembled from the incident record, so the
// reviewer (and the AI draft) work from the same evidence base.
export function pirFacts(incident) {
  const roles = incident.roles || [];
  const tasks = incident.tasks || [];
  const comms = incident.comms || [];
  const notified = roles.filter((r) => roleIsAssigned(r) && r.notify);
  const acked = notified.filter((r) => r.notify.status === "acked").length;
  const durationMs = (incident.closedAt || Date.now()) - incident.startedAt;
  return {
    id: incident.id,
    title: incident.title,
    type: incident.typeLabel,
    severity: SEVERITY[incident.severity]?.label || "—",
    status: incident.status,
    isDrill: !!incident.isDrill,
    durationMs,
    rolesAssigned: roles.filter(roleIsAssigned).length,
    rolesTotal: roles.length,
    tasksDone: tasks.filter((t) => t.done).length,
    tasksTotal: tasks.length,
    timelineEntries: (incident.timeline || []).length,
    activated: !!incident.activation,
    ackRate: notified.length ? `${acked}/${notified.length}` : "n/a",
    commsSent: comms.filter((c) => c.status === "dispatched").length,
    commsTotal: comms.length,
  };
}
