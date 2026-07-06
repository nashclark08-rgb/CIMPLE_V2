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
  { id: "lockdown", label: "Lockdown", category: "school", icon: "Lock", emp: "EMP §1.1 — Lockdown Procedure", defaultSeverity: 4 },
  { id: "evacuation", label: "Fire / Evacuation", category: "school", icon: "Flame", emp: "EMP §1.2 — Evacuation Procedure", defaultSeverity: 3 },
  { id: "hazmat", label: "Hazardous Material", category: "school", icon: "AlertOctagon", emp: "EMP §1.4 — Hazmat Response", defaultSeverity: 3 },
  { id: "natural_disaster", label: "Natural Disaster", category: "school", icon: "CloudLightning", emp: "EMP §1.5 — Natural Disaster Response", defaultSeverity: 3 },
  { id: "parent_aggression", label: "Parent Aggression", category: "external", icon: "UserCheck", emp: "EMP §7.3 — Parent Conflict Response", defaultSeverity: 2 },
  { id: "external_threat", label: "External Threat / Police", category: "external", icon: "Shield", emp: "EMP §1.3 — External Threat Response", defaultSeverity: 4 },
  { id: "transport", label: "Transport Accident", category: "external", icon: "Bus", emp: "EMP §8.2 — Transport Incident Response", defaultSeverity: 3 },
  { id: "death_oncampus", label: "Death — On Campus", category: "death", icon: "AlertCircle", emp: "EMP §9.1 — Critical Incident: Death", defaultSeverity: 4 },
  { id: "death_offcampus", label: "Death — Off Campus", category: "death", icon: "AlertCircle", emp: "EMP §9.2 — Off-Campus Death Response", defaultSeverity: 4 },
];

export const TYPE_CATEGORIES = {
  student: { label: "Student-Related", color: "#00305E" },
  school: { label: "School-Wide", color: "#B85C3C" },
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
export function createIncident({ type, severity, title, location, isDrill = false }) {
  const typeMeta = INCIDENT_TYPES.find((t) => t.id === type);
  const allIncidents = loadAll().incidents;
  const id = nextIncidentId(allIncidents);

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
    roles: rolesForIncidentType(type),
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
    tasks: tasksForIncidentType(type),
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

export function responsibilitiesFor(roleName, incidentType) {
  return ROLE_RESPONSIBILITIES[incidentType]?.[roleName] || null;
}

// ============================================================
// Staff CRUD
// ============================================================
export function listStaff() {
  return loadAll().staff || [];
}

export function getStaff(id) {
  return listStaff().find((s) => s.id === id) || null;
}

export function saveStaff(staff) {
  const state = loadAll();
  const idx = (state.staff || []).findIndex((s) => s.id === staff.id);
  if (!state.staff) state.staff = [];
  if (idx >= 0) state.staff[idx] = staff;
  else state.staff.push(staff);
  saveAll(state);
}

export function deleteStaff(id) {
  const state = loadAll();
  state.staff = (state.staff || []).filter((s) => s.id !== id);
  saveAll(state);
}

export function newStaffMember(data) {
  const initials = (data.name || "")
    .split(/\s+/)
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return {
    id: `staff-${Date.now()}`,
    name: data.name || "",
    initials: data.initials || initials || "?",
    role: data.role || "",
    qualifiedFor: data.qualifiedFor || [],
    phone: data.phone || "",
    email: data.email || "",
    available: data.available !== false,
    notes: data.notes || "",
    verifiedAt: data.verifiedAt || Date.now(),
  };
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
