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

// ---------- Role templates per incident type ----------
const COMMON_ROLES = [
  { role: "Incident Commander", required: true, isPrincipal: true },
  { role: "Documenter", required: true },
];

const ROLE_TEMPLATES = {
  medical: [
    ...COMMON_ROLES,
    { role: "First Aid", required: true },
    { role: "Family Liaison", required: true },
  ],
  mental_health: [
    ...COMMON_ROLES,
    { role: "Wellbeing Lead", required: true },
    { role: "First Aid", required: true },
    { role: "Family Liaison", required: true },
    { role: "Counsellor (External)", required: false },
  ],
  behavioural: [
    ...COMMON_ROLES,
    { role: "Wellbeing Lead", required: true },
    { role: "Family Liaison", required: true },
  ],
  missing: [
    ...COMMON_ROLES,
    { role: "Search Coordinator", required: true },
    { role: "Family Liaison", required: true },
    { role: "Police Liaison", required: false },
  ],
  bullying: [
    ...COMMON_ROLES,
    { role: "Wellbeing Lead", required: true },
    { role: "Family Liaison", required: true },
  ],
  lockdown: [
    ...COMMON_ROLES,
    { role: "Communications Lead", required: true },
    { role: "Floor Wardens", required: true },
    { role: "Police Liaison", required: true },
  ],
  evacuation: [
    ...COMMON_ROLES,
    { role: "Floor Wardens", required: true },
    { role: "Headcount Officer", required: true },
    { role: "Communications Lead", required: true },
  ],
  hazmat: [
    ...COMMON_ROLES,
    { role: "Floor Wardens", required: true },
    { role: "First Aid", required: true },
    { role: "Communications Lead", required: true },
  ],
  natural_disaster: [
    ...COMMON_ROLES,
    { role: "Floor Wardens", required: true },
    { role: "Communications Lead", required: true },
    { role: "First Aid", required: false },
  ],
  parent_aggression: [
    ...COMMON_ROLES,
    { role: "Front Office Lead", required: true },
    { role: "Police Liaison", required: false },
  ],
  external_threat: [
    ...COMMON_ROLES,
    { role: "Police Liaison", required: true },
    { role: "Communications Lead", required: true },
    { role: "Floor Wardens", required: true },
  ],
  transport: [
    ...COMMON_ROLES,
    { role: "Family Liaison", required: true },
    { role: "First Aid", required: false },
    { role: "Communications Lead", required: true },
  ],
  death_oncampus: [
    ...COMMON_ROLES,
    { role: "Wellbeing Lead", required: true },
    { role: "Family Liaison", required: true },
    { role: "Communications Lead", required: true },
    { role: "Police Liaison", required: true },
    { role: "Counsellor (External)", required: true },
  ],
  death_offcampus: [
    ...COMMON_ROLES,
    { role: "Wellbeing Lead", required: true },
    { role: "Communications Lead", required: true },
    { role: "Counsellor (External)", required: true },
  ],
  child_protection: [
    ...COMMON_ROLES,
    { role: "Wellbeing Lead", required: true },
    { role: "Family Liaison", required: true },
    { role: "Police Liaison", required: false },
  ],
  disease_outbreak: [
    ...COMMON_ROLES,
    { role: "First Aid", required: true },
    { role: "Communications Lead", required: true },
    { role: "Family Liaison", required: false },
  ],
  cyber: [
    ...COMMON_ROLES,
    { role: "Communications Lead", required: true },
    { role: "Front Office Lead", required: false },
  ],
  infrastructure: [
    ...COMMON_ROLES,
    { role: "Floor Wardens", required: true },
    { role: "Communications Lead", required: true },
  ],
  excursion: [
    ...COMMON_ROLES,
    { role: "First Aid", required: true },
    { role: "Family Liaison", required: true },
    { role: "Communications Lead", required: false },
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
    roles: effectiveRoles,
    timeline: [
      {
        id: `t${Date.now()}`,
        ts: Date.now(),
        actor: "K. Patel",
        actorInitials: "KP",
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
      { id: "r1", role: "Incident Commander", staff: "K. Patel", initials: "KP", status: "confirmed", required: true, isPrincipal: true },
      { id: "r2", role: "Wellbeing Lead", staff: "S. Nguyen", initials: "SN", status: "confirmed", required: true },
      { id: "r3", role: "First Aid", staff: "J. Okafor", initials: "JO", status: "confirmed", required: true },
      { id: "r4", role: "Family Liaison", staff: "L. Martin", initials: "LM", status: "pending", required: true, backup: "R. Chen" },
      { id: "r5", role: "Documenter", staff: "—", initials: "—", status: "unassigned", required: true, suggested: "A. Wright" },
      { id: "r6", role: "Counsellor (External)", staff: "Headspace on call", initials: "HC", status: "contacted", required: false },
    ],
    timeline: [
      { id: "t1", ts: now - minutes(23), actor: "K. Patel", actorInitials: "KP", type: "system", text: "Incident opened. Initial severity: L3 Major." },
      { id: "t2", ts: now - minutes(22), actor: "K. Patel", actorInitials: "KP", type: "action", text: "Activated EMP §4.3 — Student Mental Health Crisis Response." },
      { id: "t3", ts: now - minutes(21), actor: "S. Nguyen", actorInitials: "SN", type: "note", text: "On site with student. Calm but distressed. No visible injury. Ventolin not required." },
      { id: "t4", ts: now - minutes(18), actor: "J. Okafor", actorInitials: "JO", type: "note", text: "First aid assessment complete. No medical intervention required at this time." },
      { id: "t5", ts: now - minutes(14), actor: "K. Patel", actorInitials: "KP", type: "action", text: "Contacted external counsellor (Headspace). On standby." },
      { id: "t6", ts: now - minutes(9), actor: "L. Martin", actorInitials: "LM", type: "note", text: "Drafting parent communication for review. Will not send without sign-off." },
      { id: "t7", ts: now - minutes(4), actor: "S. Nguyen", actorInitials: "SN", type: "note", text: "Student speaking with wellbeing lead. Refusing to call parent directly. Has agreed to remain on site with counsellor." },
    ],
    tasks: [
      { id: "tk1", text: "Confirm parent contact attempt", owner: "LM", done: false, priority: "high" },
      { id: "tk2", text: "Document incident in wellbeing register", owner: "SN", done: false, priority: "med" },
      { id: "tk3", text: "Notify Year Advisor (Ms Nguyen)", owner: "KP", done: true, priority: "med" },
      { id: "tk4", text: "Prepare head office notification draft", owner: "KP", done: false, priority: "high" },
      { id: "tk5", text: "Schedule student check-in for tomorrow AM", owner: "SN", done: false, priority: "low" },
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
    student: null,
    roles: [
      { id: "r1", role: "Incident Commander", staff: "K. Patel", initials: "KP", status: "confirmed", required: true, isPrincipal: true },
      { id: "r2", role: "First Aid", staff: "J. Okafor", initials: "JO", status: "confirmed", required: true },
      { id: "r3", role: "Family Liaison", staff: "—", initials: "—", status: "unassigned", required: true, suggested: "L. Martin" },
      { id: "r4", role: "Documenter", staff: "A. Wright", initials: "AW", status: "confirmed", required: true },
    ],
    timeline: [
      { id: "t1", ts: now - minutes(8), actor: "K. Patel", actorInitials: "KP", type: "system", text: "Incident opened. Initial severity: L2 Moderate." },
      { id: "t2", ts: now - minutes(7), actor: "J. Okafor", actorInitials: "JO", type: "note", text: "On scene. Student conscious, ankle visibly swollen, painful on weight-bearing." },
      { id: "t3", ts: now - minutes(3), actor: "J. Okafor", actorInitials: "JO", type: "action", text: "Splint applied. Awaiting parent collection / ambulance decision." },
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
      { id: "r1", role: "Incident Commander", staff: "K. Patel", initials: "KP", status: "confirmed", required: true, isPrincipal: true },
      { id: "r2", role: "Wellbeing Lead", staff: "S. Nguyen", initials: "SN", status: "confirmed", required: true },
      { id: "r3", role: "Family Liaison", staff: "L. Martin", initials: "LM", status: "confirmed", required: true },
      { id: "r4", role: "Documenter", staff: "A. Wright", initials: "AW", status: "confirmed", required: true },
    ],
    timeline: [
      { id: "t1", ts: now - minutes(60 * 26), actor: "K. Patel", actorInitials: "KP", type: "system", text: "Incident opened. Initial severity: L1 Minor." },
      { id: "t2", ts: now - minutes(60 * 26 - 5), actor: "S. Nguyen", actorInitials: "SN", type: "note", text: "Two students separated and spoken with. No injuries." },
      { id: "t3", ts: now - minutes(60 * 25), actor: "L. Martin", actorInitials: "LM", type: "action", text: "Both sets of parents notified by phone." },
      { id: "t4", ts: now - minutes(60 * 24), actor: "K. Patel", actorInitials: "KP", type: "system", text: "Incident closed. Resolution: minor disagreement, both students reconciled, restorative conversation completed." },
    ],
    tasks: [
      { id: "tk1", text: "Restorative conversation with both students", owner: "SN", done: true, priority: "high" },
      { id: "tk2", text: "Notify both sets of parents", owner: "LM", done: true, priority: "high" },
      { id: "tk3", text: "Log in behaviour register", owner: "AW", done: true, priority: "med" },
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
      { id: "r1", role: "Incident Commander", staff: "K. Patel", initials: "KP", status: "confirmed", required: true, isPrincipal: true },
      { id: "r2", role: "Floor Wardens", staff: "5 staff", initials: "FW", status: "confirmed", required: true },
      { id: "r3", role: "Headcount Officer", staff: "A. Wright", initials: "AW", status: "confirmed", required: true },
      { id: "r4", role: "Communications Lead", staff: "L. Martin", initials: "LM", status: "confirmed", required: true },
      { id: "r5", role: "Documenter", staff: "R. Chen", initials: "RC", status: "confirmed", required: true },
    ],
    timeline: [
      { id: "t1", ts: now - minutes(60 * 30), actor: "K. Patel", actorInitials: "KP", type: "system", text: "Drill commenced. Type: Fire / Evacuation." },
      { id: "t2", ts: now - minutes(60 * 30 - 4), actor: "A. Wright", actorInitials: "AW", type: "note", text: "All 487 students accounted for at assembly point. Time: 4 min 12 sec." },
      { id: "t3", ts: now - minutes(60 * 29), actor: "K. Patel", actorInitials: "KP", type: "system", text: "Drill closed. Performance: Within target. Minor delay in C-Block staircase noted for review." },
    ],
    tasks: [
      { id: "tk1", text: "All students to assembly point", owner: "FW", done: true, priority: "high" },
      { id: "tk2", text: "Complete headcount", owner: "AW", done: true, priority: "high" },
      { id: "tk3", text: "Log drill in compliance register", owner: "RC", done: true, priority: "med" },
    ],
  });

  return samples;
}

// ---------- localStorage operations ----------
function defaultState() {
  return {
    incidents: [],
    staff: [],
    settings: {
      principalName: "K. Patel",
      principalInitials: "KP",
      schoolName: "Demo School",
    },
    version: 2,
  };
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
export const ROLE_DEFINITIONS = {
  "Incident Commander": {
    description: "Overall command of the incident. Final decision-maker on severity, escalation, role assignment, and closure. Signs off all external communications.",
    reportsTo: "Head Office (in escalations)",
    typicallyHeldBy: "Principal or Deputy Principal",
  },
  "Deputy Commander": {
    description: "Acts as second-in-charge to the Incident Commander. Steps into command if the IC is unavailable. Coordinates internal logistics during the response.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Deputy Principal or senior leader",
  },
  "Wellbeing Lead": {
    description: "Coordinates psychological and emotional support for affected students and staff. Liaises with school counsellor and external mental health services.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Head of Wellbeing or School Counsellor",
  },
  "First Aid": {
    description: "Provides immediate medical response. Triages injuries. Logs treatment given. Liaises with paramedics on arrival.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "First Aid Officer",
  },
  "Family Liaison": {
    description: "Sole point of contact with affected students' families. Ensures timely, consistent communication. All parent contact is logged through this role.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Front Office Lead or designated staff member",
  },
  "Documenter": {
    description: "Maintains the incident timeline. Records actions, decisions, and communications. Ensures audit-ready record-keeping.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Admin Staff",
  },
  "Communications Lead": {
    description: "Drafts internal and external communications. All comms route through this role for consistency before Principal approval.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Designated communications staff member",
  },
  "Floor Wardens": {
    description: "Lead evacuation/lockdown of their assigned area. Conduct headcounts. Report status to Incident Commander.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Designated teaching staff per zone",
  },
  "Headcount Officer": {
    description: "Receives roll status from each Floor Warden. Reconciles against expected attendance. Reports any unaccounted persons to Incident Commander immediately.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Admin Staff or Deputy",
  },
  "Search Coordinator": {
    description: "Coordinates organised search for missing student. Assigns search zones. Liaises with police if escalated.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Deputy Principal or senior leader",
  },
  "Police Liaison": {
    description: "Sole point of contact with attending police. Ensures information flow is controlled and accurate. Records all police interactions.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Principal, Deputy, or designated leader",
  },
  "Counsellor (External)": {
    description: "External mental health professional brought in to provide additional support. Coordinated through Wellbeing Lead.",
    reportsTo: "Wellbeing Lead",
    typicallyHeldBy: "Headspace, school psychologist, or contracted service",
  },
  "Front Office Lead": {
    description: "Manages the front-of-school during the incident. Handles unexpected visitors and gate control. First point of contact for arriving services.",
    reportsTo: "Incident Commander",
    typicallyHeldBy: "Front Office Manager",
  },
};

// Per-incident-type responsibilities for each role.
// Tells the user "what does THIS role do during THIS type of incident".
const ROLE_RESPONSIBILITIES = {
  // Mental health
  mental_health: {
    "Incident Commander": [
      "Confirm severity classification within 5 minutes",
      "Activate EMP §4.3 if not yet triggered",
      "Approve all family communications before they leave the school",
      "Decide on counsellor activation (internal vs external)",
      "Determine head office notification timing",
    ],
    "Wellbeing Lead": [
      "Locate student and remain with them — do not leave unsupervised",
      "Conduct initial wellbeing assessment using school's framework",
      "Document disclosure factually in the timeline (no interpretation)",
      "Determine if mandatory reporting trigger is present",
      "Arrange immediate counsellor support (internal or Headspace)",
    ],
    "First Aid": [
      "Perform medical assessment if any self-harm injury",
      "Document any physical findings in incident timeline",
      "Standby for transfer to medical care if required",
    ],
    "Family Liaison": [
      "Wait for Principal approval before contacting family",
      "Use prepared script — do not improvise wording",
      "Document the call (time, who answered, what was said)",
      "Coordinate parent collection or attendance at school",
    ],
    "Documenter": [
      "Maintain factual timeline — no opinions or interpretation",
      "Capture all role assignments and changes",
      "Ensure mandatory reporting decision is recorded with rationale",
    ],
    "Counsellor (External)": [
      "Arrive within agreed response time",
      "Take primary responsibility for direct student support",
      "Brief Wellbeing Lead at handover",
    ],
  },
  // Medical
  medical: {
    "Incident Commander": [
      "Decide on ambulance vs parent transport based on First Aid advice",
      "Brief arriving paramedics personally",
      "Approve communication to family",
    ],
    "First Aid": [
      "Perform DRS-ABCD assessment immediately",
      "Apply first aid within scope of qualification",
      "Call 000 if condition meets ambulance criteria",
      "Stay with patient until handover to paramedics or parent",
      "Complete medical incident form",
    ],
    "Family Liaison": [
      "Contact emergency contact within 5 minutes of incident open",
      "Arrange parent collection or meet at hospital",
      "Provide factual update only — do not speculate on diagnosis",
    ],
    "Documenter": [
      "Record times of: incident, first aid commenced, 000 called, paramedics arrived, parent contacted",
      "Document treatment given and patient response",
    ],
  },
  // Lockdown
  lockdown: {
    "Incident Commander": [
      "Confirm trigger and decision to lockdown is documented",
      "Initiate PA announcement",
      "Maintain communication with police via Police Liaison",
      "Make all-clear decision",
    ],
    "Communications Lead": [
      "Draft internal staff message — to be sent silently via approved channel",
      "Hold all external comms until Principal approval",
      "Prepare parent notification draft for post-event release",
    ],
    "Floor Wardens": [
      "Lock all doors in your zone immediately",
      "Account for all students in your zone",
      "Move students away from windows",
      "Maintain silence — phones on silent",
      "Report your zone status to Headcount Officer",
    ],
    "Police Liaison": [
      "Brief police on arrival",
      "Provide site map and access points",
      "Maintain communication channel with Incident Commander",
    ],
    "Documenter": [
      "Record lockdown commenced time and trigger",
      "Capture all status reports from zones",
      "Record all-clear time and lifting decision",
    ],
  },
  // Evacuation
  evacuation: {
    "Incident Commander": [
      "Confirm evacuation trigger",
      "Authorise alarm sound",
      "Brief emergency services on arrival",
      "Authorise re-entry decision",
    ],
    "Floor Wardens": [
      "Lead your zone to the assembly point via designated route",
      "Sweep classrooms and bathrooms in your zone",
      "Conduct headcount at assembly point",
      "Report status to Headcount Officer",
    ],
    "Headcount Officer": [
      "Receive headcount from each Floor Warden",
      "Reconcile against expected attendance",
      "Report any unaccounted persons immediately",
      "Document final reconciled count",
    ],
    "Communications Lead": [
      "Prepare drafts for parent notification",
      "Draft media holding statement if required",
      "Hold all communications until Principal approval",
    ],
  },
  // Death — on campus
  death_oncampus: {
    "Incident Commander": [
      "Confirm services are en route — do not move the deceased",
      "Restrict access to the area",
      "Notify head office immediately — phone, not email",
      "Designate single spokesperson",
      "Approve all internal and external communications personally",
    ],
    "Wellbeing Lead": [
      "Coordinate immediate support for any witnesses",
      "Activate critical incident counsellor protocol",
      "Brief teaching staff on supporting students once authorised",
    ],
    "Family Liaison": [
      "Wait for police authorisation before family contact",
      "Coordinate with police if they are making the notification",
      "Be physically present with family if appropriate",
    ],
    "Communications Lead": [
      "Prepare staff communication for after-hours release",
      "Prepare community communication for after-hours release",
      "Prepare media holding statement",
      "All drafts route to Principal for approval",
    ],
    "Police Liaison": [
      "Maintain sole communication with police",
      "Document all interactions",
      "Coordinate scene access",
    ],
  },
  // Behavioural — fallback minimal
  behavioural: {
    "Incident Commander": [
      "Confirm safety of all involved parties",
      "Approve disciplinary or restorative pathway",
      "Authorise family communications",
    ],
    "Wellbeing Lead": [
      "Separate parties involved in conflict",
      "Conduct individual debriefs (not joint)",
      "Document accounts factually from each party",
    ],
    "Family Liaison": [
      "Contact family of each involved student separately",
      "Provide factual account — do not blame or speculate",
    ],
  },
};

// ============================================================
// PLAYBOOK TASK LIBRARY (offline knowledge base)
// Rich, role-specific operational actions for the first 30–60 min,
// grounded in NSW school critical-incident best practice. Entries:
//   { text, due (min), approval (Principal sign-off), mandatory (notification) }
// Overrides ROLE_RESPONSIBILITIES for the 6 priority incident types.
// NOT fetched live — this is CIMPLE's permanent built-in knowledge.
// ============================================================
export const PLAYBOOK_TASKS = {
  // ---------- MISSING STUDENT ----------
  missing: {
    "Incident Commander": [
      { text: "Confirm the student's last known location, time, and who reported it", due: 5 },
      { text: "Declare the incident level and activate the Missing Student procedure (EMP §6.1)", due: 5 },
      { text: "Direct an immediate coordinated search of grounds and buildings", due: 10 },
      { text: "Escalate to Police (000) early if there is any concern for the student's safety — do not impose an arbitrary wait", due: 15 },
      { text: "Authorise parent notification", due: 15, approval: true },
      { text: "Notify head office / network once Police are involved", due: 20, mandatory: true },
    ],
    "Search Coordinator": [
      { text: "Confirm the student actually arrived today — cross-check the morning roll/attendance", due: 8 },
      { text: "Divide the site into search sectors and assign a staff member to each", due: 10 },
      { text: "Check likely locations first: bathrooms, sick bay, friends' classes, library", due: 10 },
      { text: "Review and preserve gate/exit CCTV for the student's last movements before it overwrites", due: 15 },
      { text: "Check attendance/sign-out records and all gate and exit points", due: 15 },
      { text: "Report each sector to the Incident Commander as it is cleared", due: 20 },
      { text: "Prepare a current description and recent photo for Police", due: 25 },
    ],
    "Family Liaison": [
      { text: "Confirm the family's current emergency contact numbers", due: 10 },
      { text: "Check custody / AVO / parenting-order flags before contacting a parent", due: 12 },
      { text: "Contact the parent/carer using the approved script once authorised", due: 15, approval: true },
      { text: "Ask the family about likely locations, friends, or arrangements", due: 20 },
      { text: "Keep a log of every call, who answered, and what was said", due: 25 },
    ],
    "Police Liaison": [
      { text: "Call 000 when directed; give description, last-seen details, and site access", due: 15, mandatory: true },
      { text: "Meet and brief Police on arrival; hand over description and CCTV", due: 25 },
      { text: "Provide a site map and access/exit points", due: 25 },
      { text: "Maintain a single line of communication with Police", due: 30 },
    ],
    "Documenter": [
      { text: "Start the incident log with exact times (reported, search commenced)", due: 5 },
      { text: "Record the student description: clothing, appearance, last seen where", due: 10 },
      { text: "Log every search sector assigned and cleared, with times", due: 15 },
      { text: "Record all Police and parent contacts with times", due: 30 },
    ],
  },

  // ---------- CHILD PROTECTION / SERIOUS ALLEGATION ----------
  child_protection: {
    "Incident Commander": [
      { text: "Ensure the child is safe and separated from any alleged source of harm", due: 5 },
      { text: "Do NOT question the child, investigate, or confront/warn the alleged person — preserve the account", due: 5 },
      { text: "If a staff member is alleged, stand them down from child-related duties as a risk-management step (not a disciplinary finding)", due: 10, approval: true },
      { text: "Assess Risk of Significant Harm (ROSH) using the Mandatory Reporter Guide", due: 15, mandatory: true },
      { text: "Report suspected ROSH to the DCJ Child Protection Helpline (132 111) as soon as practicable", due: 30, mandatory: true },
      { text: "If the allegation is against a staff member, notify the Office of the Children's Guardian within 7 business days (Reportable Conduct)", due: 45, mandatory: true },
      { text: "Restrict information strictly to those with a need to know", due: 10 },
    ],
    "Wellbeing Lead": [
      { text: "Stay with the child; reassure without probing for detail", due: 5 },
      { text: "Record only what the child said, in their exact words, factually", due: 15 },
      { text: "Assess the child's immediate safety and support needs", due: 20 },
      { text: "Arrange counsellor support if required", due: 30 },
    ],
    "Family Liaison": [
      { text: "Wait for Principal / Police / DCJ authorisation before contacting family", due: 15, approval: true },
      { text: "Confirm which adult may safely be contacted (check custody / AVO flags)", due: 20 },
      { text: "Do not disclose allegation details beyond the agreed wording", due: 25, approval: true },
    ],
    "Police Liaison": [
      { text: "Report to NSW Police if a criminal offence is suspected; follow Police direction", due: 20, mandatory: true },
      { text: "Coordinate scene and information control with Police", due: 30 },
    ],
    "Documenter": [
      { text: "Record the disclosure time, who received it, and the exact words used", due: 10 },
      { text: "Log the mandatory-reporting decision and the rationale", due: 20 },
      { text: "Record every notification made and the time it was made", due: 45 },
    ],
  },

  // ---------- MEDICAL / INJURY ----------
  medical: {
    "Incident Commander": [
      { text: "Confirm the nature and severity of the injury or illness", due: 5 },
      { text: "Decide ambulance (000) vs parent transport on First Aid advice", due: 10, approval: true },
      { text: "Ensure the scene is safe and move bystander students away", due: 10 },
      { text: "Approve the message to the family", due: 15, approval: true },
      { text: "Brief arriving paramedics personally", due: 20 },
      { text: "If serious injury or death, notify SafeWork NSW immediately (13 10 50) — notifiable incident", due: 20, mandatory: true },
    ],
    "First Aid": [
      { text: "Perform a primary assessment (DRSABCD)", due: 5 },
      { text: "Provide first aid within your qualification", due: 5 },
      { text: "Call 000 if the condition meets ambulance criteria", due: 10, mandatory: true },
      { text: "Check the student's health-care plan (asthma, anaphylaxis, allergies)", due: 10 },
      { text: "Stay with the patient until handover to paramedics or parent", due: 20 },
      { text: "Record observations, treatment given, and times", due: 25 },
    ],
    "Family Liaison": [
      { text: "Contact the emergency contact within 5 minutes", due: 10 },
      { text: "Provide factual information only — do not speculate on diagnosis", due: 15 },
      { text: "Arrange parent collection or direct them to the hospital", due: 20 },
    ],
    "Documenter": [
      { text: "Record times: incident, first aid started, 000 called, paramedics arrived, parent contacted", due: 15 },
      { text: "Complete the medical incident form", due: 30 },
      { text: "Preserve the scene/equipment for SafeWork (you may still aid the injured and make the area safe)", due: 30 },
    ],
  },

  // ---------- LOCKDOWN ----------
  lockdown: {
    "Incident Commander": [
      { text: "Confirm the trigger and decide to initiate lockdown", due: 5 },
      { text: "Initiate the lockdown alert / PA announcement", due: 5 },
      { text: "Call 000 / Police and maintain contact via Police Liaison", due: 10, mandatory: true },
      { text: "Notify head office of the lockdown", due: 15, mandatory: true },
      { text: "Confirm a whole-site headcount via wardens", due: 20 },
      { text: "Make the all-clear decision only when Police confirm it is safe", due: 45, approval: true },
    ],
    "Floor Wardens": [
      { text: "Lock all doors and windows in your zone immediately", due: 5 },
      { text: "Move students away from windows and out of line of sight", due: 5 },
      { text: "Account for all students and visitors in your zone", due: 10 },
      { text: "Keep everyone silent; phones on silent", due: 10 },
      { text: "Report your zone status to the Headcount Officer / Incident Commander", due: 15 },
      { text: "Do not open the door until an authorised all-clear is given", due: 45 },
    ],
    "Communications Lead": [
      { text: "Draft the internal staff instruction for silent distribution", due: 10, approval: true },
      { text: "Prepare the parent holding statement — do NOT send until approved", due: 20, approval: true },
      { text: "Prepare the 'do not come to the College' message for parents", due: 25, approval: true },
      { text: "Hold all external communications until Principal sign-off", due: 20, approval: true },
    ],
    "Police Liaison": [
      { text: "Call 000: state 'school in lockdown', location, nature of threat, numbers on site, and access points", due: 5, mandatory: true },
      { text: "Brief Police on arrival; provide site map and access points", due: 20 },
      { text: "Relay Police instructions to the Incident Commander", due: 25 },
    ],
    "Documenter": [
      { text: "Record the lockdown start time and the trigger", due: 5 },
      { text: "Log each zone's status report as it comes in", due: 20 },
      { text: "Record the all-clear time and who authorised it", due: 45 },
    ],
  },

  // ---------- DEATH ON CAMPUS ----------
  death_oncampus: {
    "Incident Commander": [
      { text: "Confirm emergency services are en route — do NOT move the deceased", due: 5, mandatory: true },
      { text: "Restrict and screen access to the area", due: 5 },
      { text: "Notify head office / network immediately by phone, not email", due: 10, mandatory: true },
      { text: "Contact Police if not already attending", due: 10, mandatory: true },
      { text: "Designate a single spokesperson; all others refer media on", due: 15 },
      { text: "Personally approve every internal and external communication", due: 20, approval: true },
    ],
    "Wellbeing Lead": [
      { text: "Coordinate immediate support for any witnesses", due: 10 },
      { text: "Activate the critical-incident counsellor protocol", due: 20 },
      { text: "Brief teaching staff on supporting students once authorised", due: 45, approval: true },
    ],
    "Family Liaison": [
      { text: "Wait for Police authorisation before any family contact", due: 15, approval: true },
      { text: "Notify next of kin in person, coordinated with Police — never by phone or text", due: 20, approval: true },
      { text: "Be physically present with the family if appropriate", due: 45 },
    ],
    "Communications Lead": [
      { text: "Prepare the staff communication for controlled release", due: 30, approval: true },
      { text: "Prepare the community communication", due: 45, approval: true },
      { text: "Prepare a media holding statement — withhold the name; if a suspected suicide, follow safe-messaging (no method, location, or detail)", due: 30, approval: true },
      { text: "Route all drafts to the Principal for approval", due: 30, approval: true },
    ],
    "Police Liaison": [
      { text: "Maintain sole communication with Police", due: 10 },
      { text: "Preserve the scene — a death on site is reportable to the Coroner; Police will manage it", due: 15, mandatory: true },
      { text: "Document all Police interactions", due: 20 },
    ],
    "Documenter": [
      { text: "Record the sequence of events and times, factually only", due: 15 },
      { text: "Log all notifications (head office, Police, family)", due: 30 },
      { text: "Record no opinions or speculation", due: 15 },
    ],
    "Counsellor (External)": [
      { text: "Arrive within the agreed response time", due: 45 },
      { text: "Take primary responsibility for direct student and staff support", due: 60 },
    ],
  },

  // ---------- CYBER INCIDENT / DATA BREACH ----------
  cyber: {
    "Incident Commander": [
      { text: "Confirm the nature: ransomware, breach, outage, or suspected attack", due: 5 },
      { text: "Direct IT to isolate affected systems (disconnect, do NOT power off)", due: 5 },
      { text: "Notify head office / IT leadership immediately", due: 10, mandatory: true },
      { text: "Decide whether to switch to manual / paper business-continuity mode", due: 15, approval: true },
      { text: "Assess whether personal information is involved (privacy breach)", due: 30 },
      { text: "Approve any communication to families about outages or data", due: 30, approval: true },
      { text: "Report the incident to ReportCyber (cyber.gov.au); involve Police for cybercrime", due: 30, mandatory: true },
      { text: "If a ransom payment is considered, check the mandatory 72-hour reporting duty (Cyber Security Act 2024)", due: 30, approval: true },
    ],
    "Communications Lead": [
      { text: "Prepare an internal staff notice (what not to click or do)", due: 15, approval: true },
      { text: "Draft a parent holding statement about any service outage", due: 30, approval: true },
      { text: "If personal data is involved, assess as a Notifiable Data Breach (≤30 days) and notify OAIC + affected individuals as soon as practicable", due: 45, approval: true, mandatory: true },
      { text: "Hold all external communications until Principal + IT sign-off", due: 20, approval: true },
    ],
    "Front Office Lead": [
      { text: "Switch to manual sign-in / sign-out and phone processes", due: 15 },
      { text: "Manage parent enquiries using the approved holding line", due: 30 },
      { text: "Keep a manual log of key events while systems are down", due: 20 },
    ],
    "Documenter": [
      { text: "Record the time the incident was detected and by whom", due: 10 },
      { text: "Preserve evidence — do not delete logs, emails, or files", due: 15 },
      { text: "Log systems affected and every action taken, with times", due: 20 },
    ],
  },

  // ---------- STUDENT MENTAL HEALTH / SELF-HARM ----------
  mental_health: {
    "Incident Commander": [
      { text: "Confirm the student is safe, supervised, and any means of harm is removed", due: 5 },
      { text: "Activate the Mental Health / Self-Harm procedure (EMP §4.3)", due: 5 },
      { text: "Decide whether 000 / medical attention is required", due: 10 },
      { text: "Determine whether a mandatory reporting obligation exists (Risk of Significant Harm — DCJ Child Protection Helpline 132 111)", due: 15, mandatory: true },
      { text: "Approve any family communication before it is made", due: 15, approval: true },
    ],
    "Wellbeing Lead": [
      { text: "Locate and stay with the student — do not leave them unsupervised", due: 5 },
      { text: "Conduct an initial wellbeing/risk assessment using the school framework", due: 15 },
      { text: "Document the disclosure factually, in the student's own words", due: 20 },
      { text: "When briefing family or staff, describe in general terms — do NOT broadcast the method of self-harm (safe-messaging)", due: 20 },
      { text: "Determine whether the threshold for a mandatory report is met (Risk of Significant Harm)", due: 20, mandatory: true },
      { text: "Arrange immediate counsellor support (internal or external)", due: 30 },
    ],
    "First Aid": [
      { text: "Assess and treat any self-harm injury", due: 10 },
      { text: "Call 000 if there is a medical emergency", due: 10, mandatory: true },
      { text: "Document any physical findings", due: 20 },
    ],
    "Family Liaison": [
      { text: "Wait for Principal approval before contacting the family", due: 15, approval: true },
      { text: "Contact the family using the prepared script", due: 20, approval: true },
      { text: "Log the call: time, who answered, what was said", due: 25 },
    ],
    "Counsellor (External)": [
      { text: "Attend and take primary responsibility for the student's support", due: 30 },
      { text: "Brief the Wellbeing Lead at handover", due: 45 },
    ],
    "Documenter": [
      { text: "Maintain a factual timeline — no interpretation", due: 10 },
      { text: "Record the mandatory-reporting decision and rationale", due: 20 },
    ],
  },

  // ---------- BEHAVIOURAL / VIOLENT INCIDENT ----------
  behavioural: {
    "Incident Commander": [
      { text: "Confirm the immediate safety of all students and staff", due: 5 },
      { text: "Direct de-escalation and separation of those involved", due: 5 },
      { text: "Decide whether Police (000) are required", due: 10 },
      { text: "Determine whether the incident meets Risk of Significant Harm — if so, report to DCJ Child Protection Helpline (132 111)", due: 15, mandatory: true },
      { text: "Approve any communication to families", due: 15, approval: true },
    ],
    "Wellbeing Lead": [
      { text: "Separate the parties — do not debrief them jointly", due: 5 },
      { text: "Ensure any injured party receives first aid", due: 10 },
      { text: "Check on the welfare of each party individually — support, not interrogation", due: 20 },
      { text: "Put immediate safety measures in place", due: 25 },
    ],
    "Family Liaison": [
      { text: "Contact the family of each involved student separately", due: 20, approval: true },
      { text: "Provide a factual account — do not blame or speculate", due: 25 },
    ],
    "Documenter": [
      { text: "Record the sequence of events and who was involved", due: 10 },
      { text: "Record what staff directly observed, factually — do not run formal witness interviews (manage, don't investigate)", due: 20 },
      { text: "Note any injuries and the actions taken", due: 25 },
    ],
  },

  // ---------- BULLYING / HARASSMENT ----------
  bullying: {
    "Incident Commander": [
      { text: "Ensure the affected student is safe and supported", due: 10 },
      { text: "Decide the response pathway (restorative / disciplinary / report)", due: 20, approval: true },
      { text: "Determine if the conduct is a child-protection or Police matter", due: 20, mandatory: true },
    ],
    "Wellbeing Lead": [
      { text: "Separate the students involved", due: 10 },
      { text: "Speak with and support the affected student; document their account", due: 20 },
      { text: "If it may be a child-protection or Police matter, do NOT interview the alleged student(s) — preserve that process", due: 25, mandatory: true },
      { text: "Put immediate safety and support measures in place", due: 30 },
    ],
    "Family Liaison": [
      { text: "Contact the parents of the students involved separately", due: 30, approval: true },
      { text: "Provide factual information and the next steps", due: 35 },
    ],
    "Documenter": [
      { text: "Record the affected student's account and staff observations factually", due: 20 },
      { text: "Log the response pathway decided and by whom", due: 30 },
    ],
  },

  // ---------- FIRE / EVACUATION ----------
  evacuation: {
    "Incident Commander": [
      { text: "Confirm the trigger and authorise evacuation", due: 5 },
      { text: "Sound the alarm and initiate the evacuation procedure (EMP §1.2)", due: 5 },
      { text: "Call 000 (Fire & Rescue) if fire is confirmed", due: 5, mandatory: true },
      { text: "Confirm the whole-site headcount is complete", due: 20 },
      { text: "Brief emergency services on arrival", due: 20 },
      { text: "If there is a death, serious injury/illness, or dangerous incident, notify SafeWork NSW immediately (13 10 50) — notifiable incident", due: 25, mandatory: true },
      { text: "Authorise re-entry only when services confirm it is safe", due: 45, approval: true },
    ],
    "Floor Wardens": [
      { text: "Lead your zone to the assembly point via the designated route", due: 5 },
      { text: "Sweep classrooms, bathrooms, and offices in your zone", due: 10 },
      { text: "Conduct a headcount at the assembly point", due: 15 },
      { text: "Report your zone status to the Headcount Officer", due: 15 },
    ],
    "Headcount Officer": [
      { text: "Receive headcounts from each Floor Warden", due: 15 },
      { text: "Reconcile against expected attendance, incl. visitors and contractors", due: 20 },
      { text: "Report any unaccounted person to the Incident Commander immediately", due: 20 },
      { text: "Document the final reconciled count", due: 30 },
    ],
    "Communications Lead": [
      { text: "Prepare the parent notification — do not send until approved", due: 25, approval: true },
      { text: "Prepare a 'do not come to the College' holding message if needed", due: 30, approval: true },
    ],
    "Documenter": [
      { text: "Record the evacuation start time and the trigger", due: 5 },
      { text: "Log the headcount reconciliation and any issues", due: 20 },
      { text: "Record the re-entry time and who authorised it", due: 45 },
    ],
  },

  // ---------- HAZARDOUS MATERIAL ----------
  hazmat: {
    "Incident Commander": [
      { text: "Identify the substance only if safe to do so — do NOT approach", due: 5 },
      { text: "Evacuate or isolate the affected zone", due: 5 },
      { text: "Call 000 (Fire & Rescue / Hazmat)", due: 5, mandatory: true },
      { text: "Establish an exclusion zone upwind AND uphill (upstream if near water)", due: 10 },
      { text: "Brief emergency services on the substance and location", due: 15 },
      { text: "An uncontrolled chemical release is a notifiable dangerous incident — notify SafeWork NSW immediately (13 10 50)", due: 20, mandatory: true },
    ],
    "Floor Wardens": [
      { text: "Move students away from the affected zone — upwind and uphill", due: 5 },
      { text: "Keep everyone clear of the exclusion zone", due: 10 },
      { text: "Account for all students and staff", due: 15 },
    ],
    "First Aid": [
      { text: "Assess anyone exposed — do not enter the hazard zone", due: 10 },
      { text: "Call the Poisons Information Centre (13 11 26) for first-aid/decontamination advice on the substance", due: 12 },
      { text: "Follow decontamination advice from emergency services", due: 15 },
      { text: "Call 000 for any life-threatening exposure symptoms", due: 10, mandatory: true },
    ],
    "Communications Lead": [
      { text: "Prepare a parent holding statement — hold until approved", due: 25, approval: true },
    ],
    "Documenter": [
      { text: "Record the substance, location, and time identified", due: 10 },
      { text: "Log the exclusion zone and evacuation actions", due: 20 },
    ],
  },

  // ---------- NATURAL DISASTER ----------
  natural_disaster: {
    "Incident Commander": [
      { text: "Confirm the threat and monitor official warnings (Hazards Near Me NSW / NSW SES 132 500 / Bureau of Meteorology)", due: 5, mandatory: true },
      { text: "Decide shelter-in-place vs evacuation vs early closure", due: 10, approval: true },
      { text: "Activate the relevant plan (Bushfire / Flood / Storm)", due: 10 },
      { text: "Notify head office and coordinate with emergency services", due: 15, mandatory: true },
      { text: "Decide on student release and transport arrangements", due: 30, approval: true },
    ],
    "Floor Wardens": [
      { text: "Move students to the designated safe area", due: 10 },
      { text: "Account for all students and staff", due: 15 },
      { text: "Keep students away from windows and hazards", due: 15 },
    ],
    "First Aid": [
      { text: "Prepare for injuries and check first aid supplies", due: 15 },
    ],
    "Communications Lead": [
      { text: "Prepare parent communications on status and arrangements", due: 25, approval: true },
      { text: "Coordinate messaging with any transport / road-closure impacts", due: 35, approval: true },
    ],
    "Documenter": [
      { text: "Log warnings received and decisions made, with times", due: 10 },
      { text: "Record student release and collection details", due: 30 },
    ],
  },

  // ---------- DISEASE OUTBREAK / PUBLIC HEALTH ----------
  disease_outbreak: {
    "Incident Commander": [
      { text: "Isolate affected individual(s) from others", due: 5 },
      { text: "For a school-notifiable condition (measles, mumps, rubella, whooping cough, meningococcal, diphtheria, Hib, polio, tetanus, or 2+ linked gastro cases), notify the local Public Health Unit (1300 066 055) as soon as possible", due: 15, mandatory: true },
      { text: "Decide on enhanced cleaning, cohorting, or partial closure", due: 20, approval: true },
      { text: "Follow Public Health Unit directions", due: 30, mandatory: true },
      { text: "Approve communications to families", due: 30, approval: true },
    ],
    "First Aid": [
      { text: "Assess symptoms and isolate the affected person", due: 10 },
      { text: "Apply infection-control precautions (PPE, hygiene)", due: 15 },
      { text: "Exclude the case and advise return-to-school timing per NSW Health exclusion periods", due: 18 },
      { text: "Arrange collection by parent or medical care", due: 20 },
    ],
    "Communications Lead": [
      { text: "Draft a factual parent notification (symptoms, actions, advice)", due: 30, approval: true },
      { text: "Coordinate wording with the Public Health Unit", due: 35, approval: true },
    ],
    "Family Liaison": [
      { text: "Contact affected families with collection and health advice", due: 25, approval: true },
    ],
    "Documenter": [
      { text: "Record cases, times, and areas affected", due: 15 },
      { text: "Log Public Health Unit contact and directions", due: 30 },
    ],
  },

  // ---------- UTILITIES / INFRASTRUCTURE FAILURE ----------
  infrastructure: {
    "Incident Commander": [
      { text: "Confirm what has failed and the impact on operations", due: 5 },
      { text: "Make the affected area safe and restrict access", due: 10 },
      { text: "Call 000 if there is any danger (gas, electrical, structural)", due: 5, mandatory: true },
      { text: "Suspected gas leak: evacuate; do NOT operate switches, phones, or naked flames (ignition risk); ventilate; call 000 and the gas network — 1800 GAS LEAK (1800 427 532)", due: 5, mandatory: true },
      { text: "A gas/electrical/structural failure creating serious risk is a notifiable dangerous incident even with no injury — notify SafeWork NSW immediately (13 10 50)", due: 15, mandatory: true },
      { text: "Decide on relocation, early closure, or continuation", due: 20, approval: true },
      { text: "Notify head office and the relevant suppliers/contractors", due: 20 },
    ],
    "Floor Wardens": [
      { text: "Move students out of any unsafe area", due: 10 },
      { text: "Account for all students and staff", due: 15 },
    ],
    "Communications Lead": [
      { text: "Prepare a parent notification about the disruption or closure", due: 25, approval: true },
      { text: "Hold external communications until Principal sign-off", due: 20, approval: true },
    ],
    "Documenter": [
      { text: "Record the failure, time, and areas affected", due: 10 },
      { text: "Log continuity decisions and supplier contacts", due: 25 },
    ],
  },

  // ---------- PARENT / VISITOR AGGRESSION ----------
  parent_aggression: {
    "Incident Commander": [
      { text: "Ensure children are moved away from the aggressive person", due: 5 },
      { text: "Direct de-escalation by a trained staff member", due: 5 },
      { text: "Call 000 if there is a threat of violence", due: 10, mandatory: true },
      { text: "Decide whether to issue a written, principal-signed Ban Notice withdrawing consent to enter (Inclosed Lands Protection Act 1901)", due: 20, approval: true },
    ],
    "Front Office Lead": [
      { text: "Keep the front office calm — do not escalate", due: 5 },
      { text: "Maintain distance; move to a private area only if safe", due: 10 },
      { text: "Alert nearby staff discreetly", due: 10 },
      { text: "Control access — do not admit them further into the school", due: 15 },
    ],
    "Police Liaison": [
      { text: "Call 000 if the person is violent or refuses to leave", due: 10, mandatory: true },
      { text: "Brief Police on arrival", due: 20 },
    ],
    "Documenter": [
      { text: "Record what was said and done, with times", due: 10 },
      { text: "Note any threats and witnesses (for a possible AVO / trespass)", due: 20 },
      { text: "If a Ban Notice is issued, record how and when it was served (needed to prove service)", due: 25 },
    ],
  },

  // ---------- EXTERNAL THREAT / POLICE ----------
  external_threat: {
    "Incident Commander": [
      { text: "Assess the threat and decide the protective action — apply Escape. Hide. Tell. (NSW Police): escape to safety if a safe route exists, otherwise hide", due: 5, approval: true },
      { text: "Call 000 / Police immediately when it is safe to do so", due: 5, mandatory: true },
      { text: "Initiate the chosen protective action (escape/evacuate or lockdown)", due: 5 },
      { text: "Account for all students, staff, and visitors", due: 20 },
      { text: "Make the all-clear decision only when Police confirm it is safe", due: 45, approval: true },
    ],
    "Police Liaison": [
      { text: "Give Police the threat details, location, and site access", due: 10, mandatory: true },
      { text: "Meet and brief Police on arrival; provide a site map", due: 20 },
      { text: "Relay Police instructions to the Incident Commander", due: 25 },
    ],
    "Floor Wardens": [
      { text: "Secure your zone per the lockdown protocol", due: 5 },
      { text: "Account for everyone in your zone; keep them calm and quiet", due: 10 },
      { text: "Report your zone status to the Incident Commander", due: 15 },
    ],
    "Communications Lead": [
      { text: "Hold a single Principal-approved message (do not come / do not phone)", due: 20, approval: true },
      { text: "Prepare parent updates for after the all-clear", due: 30, approval: true },
    ],
    "Documenter": [
      { text: "Record the threat, time, and protective action taken", due: 5 },
      { text: "Log Police contact and instructions", due: 20 },
    ],
  },

  // ---------- TRANSPORT ACCIDENT ----------
  transport: {
    "Incident Commander": [
      { text: "Confirm the welfare and count of all students involved", due: 5 },
      { text: "Ensure 000 (ambulance / Police) is called for any injury", due: 5, mandatory: true },
      { text: "A death, serious injury/illness, or dangerous incident arising from the school's activity is notifiable — notify SafeWork NSW immediately (13 10 50)", due: 15, mandatory: true },
      { text: "If a bus was involved: ensure the operator notifies OTSI immediately (1800 677 766) and Transport for NSW within 3 days — do it if College-run, confirm it if contracted", due: 20, mandatory: true },
      { text: "Approve communications to affected families", due: 20, approval: true },
    ],
    "First Aid": [
      { text: "Assess and treat injuries at the scene within your qualification", due: 10 },
      { text: "Triage and prioritise for ambulance", due: 15 },
      { text: "Stay with injured students until handover", due: 25 },
    ],
    "Family Liaison": [
      { text: "Contact the parents of affected students with factual updates", due: 20, approval: true },
      { text: "Coordinate parent attendance at the scene or hospital", due: 30 },
    ],
    "Communications Lead": [
      { text: "Prepare a holding statement for the wider community", due: 30, approval: true },
    ],
    "Documenter": [
      { text: "Record the accident details, time, and location", due: 10 },
      { text: "Log which students were involved and their status", due: 20 },
      { text: "Record all notifications made", due: 30 },
    ],
  },

  // ---------- EXCURSION / OFF-SITE INCIDENT ----------
  excursion: {
    "Incident Commander": [
      { text: "Confirm the welfare and headcount of all students on the excursion", due: 5 },
      { text: "Ensure local 000 is called for any emergency", due: 5, mandatory: true },
      { text: "Contact the College / Principal immediately", due: 10, mandatory: true },
      { text: "A death, serious injury/illness, or dangerous incident on the excursion is notifiable — notify SafeWork NSW immediately (13 10 50); if a bus was involved, the OTSI/Transport for NSW duty also applies", due: 15, mandatory: true },
      { text: "Decide whether to continue, relocate, or return", due: 20, approval: true },
      { text: "Coordinate with the venue and local emergency services", due: 25 },
    ],
    "First Aid": [
      { text: "Provide first aid within qualification using the excursion kit", due: 10 },
      { text: "Call local 000 for any serious injury or illness", due: 10, mandatory: true },
      { text: "Stay with the affected student", due: 20 },
    ],
    "Family Liaison": [
      { text: "Contact parents of affected students with factual updates", due: 25, approval: true },
      { text: "Coordinate collection or travel arrangements", due: 35 },
    ],
    "Communications Lead": [
      { text: "Prepare a holding statement for other excursion families", due: 30, approval: true },
    ],
    "Documenter": [
      { text: "Record the incident, location, and time", due: 10 },
      { text: "Log student welfare status and actions taken", due: 20 },
      { text: "Record contact with base and emergency services", due: 25 },
    ],
  },

  // ---------- DEATH OFF-CAMPUS / COMMUNITY TRAGEDY ----------
  death_offcampus: {
    "Incident Commander": [
      { text: "Confirm the facts with the family / Police before acting", due: 10, mandatory: true },
      { text: "Convene the incident team and plan the response", due: 15 },
      { text: "Designate a single spokesperson", due: 15 },
      { text: "Approve all internal and community communications", due: 20, approval: true },
      { text: "Notify head office / AISNSW for critical-incident support", due: 20 },
    ],
    "Wellbeing Lead": [
      { text: "Identify students and staff most affected (siblings, close friends)", due: 15 },
      { text: "Identify and monitor other at-risk students beyond close friends/siblings; arrange individual risk assessment where needed", due: 18 },
      { text: "Activate the grief / psychological support plan", due: 20 },
      { text: "Inform students in class or small-group settings — avoid a whole-school assembly announcement", due: 25 },
      { text: "Ensure any memorial does not glamorise the death; treat it as you would a non-suicide death", due: 30 },
      { text: "Brief teaching staff on supporting students once authorised", due: 30, approval: true },
    ],
    "Communications Lead": [
      { text: "Prepare the staff notification (brief staff before students)", due: 25, approval: true },
      { text: "Prepare the community communication — withhold details; do NOT state or speculate cause of death (a matter for the Coroner); safe-messaging", due: 30, approval: true },
      { text: "Include help-seeking information (e.g. Lifeline 13 11 14) in every staff and community communication", due: 30, approval: true },
      { text: "Prepare a media holding statement if required", due: 35, approval: true },
    ],
    "Counsellor (External)": [
      { text: "Attend and provide student and staff support", due: 45 },
      { text: "Advise on the grief-support plan and follow-up", due: 60 },
    ],
    "Documenter": [
      { text: "Record the facts as confirmed and the decisions made", due: 15 },
      { text: "Log all communications and support actions", due: 30 },
    ],
  },
};

function normResp(e) {
  return typeof e === "string" ? { text: e } : e;
}

export function responsibilitiesFor(roleName, incidentType) {
  const list = PLAYBOOK_TASKS[incidentType]?.[roleName] || ROLE_RESPONSIBILITIES[incidentType]?.[roleName];
  return list ? list.map(normResp) : null;
}

// Generate a role-owned operational task board from the playbook, after
// triage + allocation. Each assigned role receives its immediate actions;
// tasks carry owner, due time, status, priority, and approval/mandatory flags.
export function generateIncidentTasks(typeId, roles) {
  const now = Date.now();
  const out = [];
  let i = 0;
  for (const role of (roles || [])) {
    const entries = (PLAYBOOK_TASKS[typeId]?.[role.role] || ROLE_RESPONSIBILITIES[typeId]?.[role.role] || []).map(normResp);
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
    ["Adrian", "Johnson", "ajohnson@school.edu.au", "0412 000 001", "Principal", "Executive", "available", "Incident Commander", "Police Liaison; Deputy Commander"],
    ["Annika", "Fairley", "afairley@school.edu.au", "0412 000 002", "Risk & Compliance Officer", "Operations", "available", "Search Coordinator", "Documenter"],
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
export const ROLE_CONFLICTS = [
  ["Incident Commander", "Documenter", "Commander must lead; cannot also keep the timeline."],
  ["Incident Commander", "Police Liaison", "Commander must keep oversight; cannot be tied up briefing police."],
  ["Incident Commander", "Family Liaison", "Family contact is sustained, hands-on work — Commander can't be off the floor."],
  ["Incident Commander", "First Aid", "Hands-on first aid removes Commander from oversight."],
  ["Incident Commander", "Floor Wardens", "Wardens are tied to a zone; Commander must be free to move."],
  ["Wellbeing Lead", "Communications Lead", "Wellbeing must stay with affected people; comms drafting needs separate focus."],
  ["Wellbeing Lead", "Documenter", "Both demand sustained attention in different rooms."],
  ["Family Liaison", "Police Liaison", "Two simultaneous high-stakes external conversations — split them."],
  ["Family Liaison", "Documenter", "Family calls require full presence; logging needs separate hands."],
  ["First Aid", "Documenter", "First aider is hands-on with the patient; cannot also log."],
  ["First Aid", "Communications Lead", "First aid takes priority; comms drafting must not wait on it."],
  ["Headcount Officer", "Floor Wardens", "Officer receives counts from wardens — can't be both."],
  ["Search Coordinator", "Documenter", "Coordinator is mobile and directing search; needs separate logger."],
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
  "Incident Commander": 1,
  "Deputy Commander": 2,
  "Police Liaison": 3,
  "Search Coordinator": 3,
  "Wellbeing Lead": 4,
  "Communications Lead": 4,
  "Family Liaison": 5,
  "First Aid": 5,
  "Headcount Officer": 6,
  "Floor Wardens": 6,
  "Front Office Lead": 6,
  "Documenter": 7,
  "Counsellor (External)": 8,
};

// Extra roles pulled in at higher severities (deduped against the template).
export const SEVERITY_ROLE_ADDONS = {
  3: ["Communications Lead"],
  4: ["Deputy Commander", "Communications Lead"],
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
  { id: "email", label: "Email", note: "Staff & parent distribution lists" },
  { id: "website", label: "Website notice", note: "Holding page built & hidden — ready to publish" },
  { id: "vivi", label: "Vivi screens", note: "On-campus screens · evac/lockdown captured (not CI levels yet)" },
];

export function channelLabel(id) {
  return COMMS_CHANNELS.find((c) => c.id === id)?.label || id;
}

// Who a message is addressed to.
export const COMMS_AUDIENCES = [
  { id: "families_affected", label: "Affected families" },
  { id: "parents_all", label: "All parents & carers" },
  { id: "staff_all", label: "All staff" },
  { id: "community", label: "Wider community" },
  { id: "media", label: "Media" },
  { id: "head_office", label: "Head office / network" },
];

export function audienceLabel(id) {
  return COMMS_AUDIENCES.find((a) => a.id === id)?.label || id;
}

// Seeded template library. Holding & media statements are
// attributed to MWHI (Megan Whitshed, Marketing Manager), who
// per the PRD review already has holding statements drafted.
// Bodies use {{tokens}} filled by fillTemplate() at draft time.
export const COMMS_TEMPLATES = [
  {
    id: "tpl-holding",
    name: "Holding statement — families",
    category: "holding",
    audienceId: "parents_all",
    channels: ["digistorm", "sms", "website"],
    owner: "MWHI — M. Whitshed",
    suggestedTypes: ["lockdown", "evacuation", "external_threat", "hazmat", "natural_disaster", "death_oncampus", "missing"],
    body:
      "Trinity Anglican College is currently managing an incident at the College. The safety and wellbeing of our students and staff is our absolute priority, and our emergency procedures are in place. Please do not attend the College at this time and await official communication. A further update will follow as soon as we are able. — Trinity Anglican College",
  },
  {
    id: "tpl-media-holding",
    name: "Media holding statement",
    category: "media",
    audienceId: "media",
    channels: ["email"],
    owner: "MWHI — M. Whitshed",
    suggestedTypes: ["external_threat", "death_oncampus", "death_offcampus", "lockdown", "hazmat", "natural_disaster"],
    body:
      "Trinity Anglican College can confirm it is responding to an incident today, {{date}}. The College's priority is the safety and wellbeing of its students and staff, and established emergency procedures have been followed. The College is cooperating with emergency services and will provide further information as appropriate. Media enquiries: Marketing Manager, M. Whitshed. — Trinity Anglican College",
  },
  {
    id: "tpl-parent-notify",
    name: "Parent notification",
    category: "parent",
    audienceId: "families_affected",
    channels: ["digistorm", "email"],
    owner: null,
    suggestedTypes: [],
    body:
      "Dear Parents and Carers,\n\nWe are writing to inform you of an incident involving {{incident_type}} at Trinity Anglican College today, {{date}}. Our staff responded in line with the College's emergency management procedures and all students are safe and accounted for.\n\n[Add specific, factual detail here — do not speculate.]\n\nIf you have any concerns, please contact the College office. We will provide any further updates as needed.\n\nKind regards,\n{{principal}}\nPrincipal, Trinity Anglican College",
  },
  {
    id: "tpl-staff-notice",
    name: "Staff notice",
    category: "staff",
    audienceId: "staff_all",
    channels: ["email", "vivi"],
    owner: null,
    suggestedTypes: ["lockdown", "evacuation", "external_threat", "hazmat", "natural_disaster", "death_offcampus"],
    body:
      "STAFF NOTICE — {{incident_type}}\n\nAn incident is currently being managed at {{location}}. Please follow the instructions of your Floor Warden and the Incident Commander. Do not speak with media or post on social media. Await the all-clear via this channel.\n\n— Incident Commander",
  },
  {
    id: "tpl-all-clear",
    name: "All-clear",
    category: "allclear",
    audienceId: "parents_all",
    channels: ["digistorm", "sms", "website"],
    owner: null,
    suggestedTypes: ["lockdown", "evacuation", "external_threat", "hazmat", "natural_disaster"],
    body:
      "ALL CLEAR — The incident at Trinity Anglican College has now been resolved and normal operations have resumed. Thank you for your patience and cooperation. Any families needing further information can contact the College office. — {{principal}}, Principal",
  },
];

export const COMMS_CATEGORIES = {
  holding: { label: "Holding statement", color: "#B89460" },
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

// Substitute {{tokens}} in a template body against an incident.
export function fillTemplate(body, incident) {
  const settings = loadAll().settings || {};
  const now = new Date();
  const tokens = {
    incident_type: (incident?.typeLabel || "an incident").toLowerCase(),
    location: incident?.location || "the College",
    date: now.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    time: `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
    principal: settings.principalName || "K. Patel",
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
    decidedBy: "K. Patel",
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
    ? { severity: "important", issue: "No Communications Lead assigned", why: "A significant incident should have someone owning communications.", evidence: `Severity ${c.severityLabel} · comms role unfilled.`, target: null } : null },

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

  // ---- RECOVERY ----
  { id: "REC-01", category: "Recovery", evaluate: (c) => c.isClosed && c.openRisksCount > 0
    ? { severity: "important", issue: "Closed with open risks", why: "The incident is closed but risks remain unresolved.", evidence: `${c.openRisksCount} risk(s) still open.`, target: "risks" } : null },
  { id: "REC-02", category: "Recovery", evaluate: (c) => c.isClosed && !c.hasPir
    ? { severity: "advisory", issue: "No post-incident review", why: "The incident closed without a review started.", evidence: "Closed · no PIR.", target: "pir" } : null },
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
