// ============================================================
// CIMPLE — Single Incident Dashboard
// Works with any incident from the data layer.
// ============================================================
import React, { useState, useEffect, useRef } from "react";
import {
  Shield, AlertCircle, Clock, Users, FileText, Paperclip, MapPin, Mic,
  Send, Plus, Phone, ChevronRight, ChevronDown, ChevronUp, CheckCircle2,
  Circle, Lock, Unlock, X, BookOpen, Heart, AlertTriangle, Mail,
  Activity, Eye, Edit3, Download, ArrowLeft, RotateCcw,
  UserCheck, UserX, UserPlus, Settings, MessageSquare, Megaphone,
  Sparkles, Check, Radio, Bell, ClipboardCheck, Trash2, Scale, Lightbulb,
  AlertOctagon, Minimize2, ListChecks, ArrowRight, LayoutGrid, ClipboardList, Building2,
  GitBranch, CornerDownRight, Star, Zap,
} from "lucide-react";
import { PALETTE, TopBarShell, formatTime, formatRelative, formatElapsed, EscalationMatrixButton, ReferenceModal } from "./shared.jsx";
import {
  SEVERITY, getIncident, saveIncident, listStaff, responsibilitiesFor, ROLE_DEFINITIONS,
  COMMS_CHANNELS, COMMS_AUDIENCES, COMMS_CATEGORIES, COMMS_STATUS,
  templatesForIncidentType, fillTemplate, newComm, channelLabel, audienceLabel,
  COMMS_LEVELS, COMMS_PHASES, commsPhaseMeta, MEDIA_PROTOCOL, RECEPTION_SCRIPT, SOCIAL_RULES,
  MEDIA_QA_CATEGORIES, MEDIA_QA_QUESTIONS, mediaQAProgress, buildFAQText,
  ACTIVATION_CHANNELS, NOTIFY_STATUS, roleIsAssigned,
  PIR_STATUS, newPIR, newCorrectiveAction, pirFacts,
  DECISION_STATUS, newDecision, unacknowledgedDecisionCount, rolesAwaitingDecisionAck,
  RISK_CATEGORIES, RISK_SEVERITY, RISK_STATUS, newRisk, openRisks, riskCounts, riskIsOpen,
  COPILOT_SEVERITY, COPILOT_RULES, runCopilot,
  recommendAlternate,
  ROLE_BOARD_STATE, roleBoardState, escalationPathwayFor, simulateNotification,
  promoteToRole, reassignRoleToAlternate, availableQualifiedStaff, PREF_LABEL,
  CIMT_PHASES, PHASE_CHECKLIST, incidentPhase, phaseMeta, phaseIndex,
  phaseProgress, nextPhaseId, prevPhaseId, openMandatoryItems, isPhaseItemDone,
  BOARD_QUADRANTS, newBoardItem, boardCounts,
  PERSON_CATEGORIES, PERSON_STATUS, newPersonAtRisk, peopleAtRiskCounts,
  newSitrep, SITREP_FIELDS, IAP_FIELDS, emptyIAP,
  CALL_TAKER_QUESTIONS, emptyCallTaker, callTakerProgress, CIMT_MEETING_AGENDA, MEETING_TYPES, meetingTypeMeta, newMeeting, PIR_ELEMENTS,
  RECOVERY_STRATEGIES, suggestedStrategyIds, recoveryStrategyById, strategyActivated,
  strategyProgress, activeStrategyCount, CRITICAL_BUSINESS_FUNCTIONS, cbfTierColor,
  impactedCBFCount, IMPACT_DIMENSIONS, IMPACT_LEVELS, IMPACT_LEVEL_COLORS, IMPACT_CRITERIA, newImpactIssue,
  decisionFlowsFor, decisionFlowById, summarizeFlowPath,
  ROLE_GROUPS, roleGroupOf, applySoftLocks, getMyRole, setMyRole,
  phaseForDue, ESCALATION_MATRIX, severityRationale, disambiguatedInitials, taskOwnerName,
  REFERENCE_DOCS, referenceDoc,
} from "./data.js";

export default function Dashboard({ incidentId, onBack }) {
  const [incident, setIncident] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [drawer, setDrawer] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [redFolder, setRedFolder] = useState(false);

  // Load
  useEffect(() => {
    const inc = getIncident(incidentId);
    if (!inc) {
      setNotFound(true);
    } else {
      setIncident(inc);
    }
  }, [incidentId]);

  // Tick
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  // Persist on every change
  function update(changes) {
    setIncident((prev) => {
      const next = typeof changes === "function" ? changes(prev) : { ...prev, ...changes };
      saveIncident(next);
      return next;
    });
  }

  function addTimelineEntry(entry) {
    const text = incident?.isDrill && entry.text && !entry.text.startsWith("[DRILL]")
      ? `[DRILL] ${entry.text}`
      : entry.text;
    const e = {
      id: `t${Date.now()}`,
      ts: Date.now(),
      actor: "K. Patel",
      actorInitials: "KP",
      ...entry,
      text,
    };
    update((prev) => ({ ...prev, timeline: [...prev.timeline, e] }));
  }

  if (notFound) {
    return (
      <>
        <TopBarShell />
        <div style={{ maxWidth: 600, margin: "120px auto", padding: 32, textAlign: "center" }}>
          <AlertCircle size={32} color={PALETTE.rust} style={{ margin: "0 auto" }} />
          <h2 className="display" style={{ fontSize: 28, color: PALETTE.teal, fontWeight: 500, marginTop: 20 }}>
            Incident not found
          </h2>
          <p style={{ fontSize: 14, color: PALETTE.inkSoft, marginTop: 8 }}>
            The incident "{incidentId}" doesn't exist or has been deleted.
          </p>
          <button className="btn btn-primary" onClick={onBack} style={{ marginTop: 24 }}>
            <ArrowLeft size={14} /> Back to incidents
          </button>
        </div>
      </>
    );
  }

  if (!incident) {
    return (
      <>
        <TopBarShell />
        <div style={{ padding: 64, textAlign: "center", color: PALETTE.inkSoft }}>Loading…</div>
      </>
    );
  }

  const isClosed = incident.status === "closed";

  function changeSeverity(newSev) {
    if (newSev === incident.severity) return;
    if (isClosed) return;
    addTimelineEntry({ type: "system", text: `Severity changed from ${SEVERITY[incident.severity].label} to ${SEVERITY[newSev].label}.` });
    update({ severity: newSev });
  }

  function closeIncident() {
    const summary = prompt("Closing summary (optional):");
    addTimelineEntry({
      type: "system",
      text: `Incident closed.${summary ? " Resolution: " + summary : ""}`,
    });
    update({ status: "closed", closedAt: Date.now() });
  }

  function reopenIncident() {
    addTimelineEntry({ type: "system", text: "Incident reopened by Principal." });
    update({ status: "active", closedAt: null });
  }

  function toggleTask(id) {
    update((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
  }

  if (redFolder) {
    return (
      <RedFolderView
        incident={incident}
        now={now}
        isClosed={isClosed}
        onExit={() => setRedFolder(false)}
        onToggleTask={toggleTask}
        onActivate={() => { setRedFolder(false); setDrawer("activation"); }}
        onOpen={(d) => { setRedFolder(false); setDrawer(d); }}
      />
    );
  }

  return (
    <div style={{ background: PALETTE.bone, minHeight: "100vh" }}>
      <TopBarPresence incident={incident} now={now} />
      {incident.isDrill && <DrillBanner />}
      <CommandStrip incident={incident} changeSeverity={changeSeverity} setDrawer={setDrawer} closeIncident={closeIncident} reopenIncident={reopenIncident} onBack={onBack} onRedFolder={() => setRedFolder(true)} />
      <PhaseStepper incident={incident} onOpen={(phaseId) => setDrawer({ kind: "phases", phaseId })} />
      <GlanceStrip incident={incident} setDrawer={setDrawer} now={now} />

      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "24px 32px", display: "grid", gridTemplateColumns: "260px 1fr 320px", gap: 24, alignItems: "start" }}>
        <LeftRail incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} setDrawer={setDrawer} />
        <CenterColumn incident={incident} addTimelineEntry={addTimelineEntry} update={update} now={now} isClosed={isClosed} />
        <RightRail incident={incident} setDrawer={setDrawer} />
      </div>

      {drawer === "student" && incident.student && (
        <Drawer onClose={() => setDrawer(null)} title="Student Profile Card"><StudentDrawer student={incident.student} /></Drawer>
      )}
      {drawer === "policy" && (
        <Drawer onClose={() => setDrawer(null)} title="EMP & Policy"><PolicyDrawer incident={incident} /></Drawer>
      )}
      {drawer === "export" && (
        <Drawer onClose={() => setDrawer(null)} title="Incident Pack Export"><ExportDrawer incident={incident} /></Drawer>
      )}
      {drawer === "decisions" && (
        <Drawer onClose={() => setDrawer(null)} title="Decision Log">
          <DecisionLogDrawer incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} now={now} />
        </Drawer>
      )}
      {drawer === "risks" && (
        <Drawer onClose={() => setDrawer(null)} title="Risk / Watch Register">
          <RiskRegisterDrawer incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} now={now} />
        </Drawer>
      )}
      {drawer === "copilot" && (
        <Drawer onClose={() => setDrawer(null)} title="Blind Spots">
          <CopilotDrawer incident={incident} addTimelineEntry={addTimelineEntry} setDrawer={setDrawer} now={now} />
        </Drawer>
      )}
      {drawer === "comms" && (
        <Drawer onClose={() => setDrawer(null)} title="Communications">
          <CommsDrawer incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} />
        </Drawer>
      )}
      {drawer === "activation" && (
        <Drawer onClose={() => setDrawer(null)} title="Activation & Notification">
          <ActivationDrawer incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} />
        </Drawer>
      )}
      {drawer === "team" && (
        <Drawer onClose={() => setDrawer(null)} title="Team Status Board">
          <TeamBoardDrawer incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} />
        </Drawer>
      )}
      {drawer === "instruments" && (
        <Drawer onClose={() => setDrawer(null)} title="CIMT Instruments">
          <InstrumentsDrawer incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} />
        </Drawer>
      )}
      {(drawer === "continuity" || (drawer && typeof drawer === "object" && drawer.kind === "continuity")) && (
        <Drawer onClose={() => setDrawer(null)} title="Business Continuity">
          <ContinuityDrawer incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} initialTab={typeof drawer === "object" ? drawer.tab : undefined} />
        </Drawer>
      )}
      {drawer === "pir" && (
        <Drawer onClose={() => setDrawer(null)} title="Post-Incident Review">
          <PIRDrawer incident={incident} update={update} addTimelineEntry={addTimelineEntry} />
        </Drawer>
      )}
      {drawer === "flowcharts" && (
        <Drawer onClose={() => setDrawer(null)} title="Guided Flowcharts">
          <FlowchartsDrawer incident={incident} update={update} addTimelineEntry={addTimelineEntry} setDrawer={setDrawer} isClosed={isClosed} />
        </Drawer>
      )}
      {drawer && typeof drawer === "object" && drawer.kind === "phases" && (
        <Drawer onClose={() => setDrawer(null)} title="Incident Phases — CIMT Checklist">
          <PhaseDrawer
            incident={incident}
            initialPhase={drawer.phaseId}
            update={update}
            addTimelineEntry={addTimelineEntry}
            isClosed={isClosed}
            setDrawer={setDrawer}
          />
        </Drawer>
      )}
      {drawer && typeof drawer === "object" && drawer.kind === "role" && (
        <Drawer onClose={() => setDrawer(null)} title="Manage role assignment">
          <RoleAssignDrawer
            incident={incident}
            roleId={drawer.roleId}
            update={update}
            addTimelineEntry={addTimelineEntry}
            isClosed={isClosed}
            onClose={() => setDrawer(null)}
          />
        </Drawer>
      )}
    </div>
  );
}

/* ---------- Drill mode banner ---------- */
function DrillBanner() {
  return (
    <div
      role="status"
      style={{
        background: `repeating-linear-gradient(135deg, ${PALETTE.amber} 0 18px, #d4b56e 18px 36px)`,
        color: PALETTE.ink,
        padding: "10px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        borderBottom: `2px solid ${PALETTE.amber}`,
      }}
    >
      <AlertTriangle size={16} color={PALETTE.ink} strokeWidth={2.2} />
      <span className="mono" style={{ fontSize: 11, letterSpacing: "0.22em", fontWeight: 600 }}>
        DRILL MODE · NO REAL NOTIFICATIONS WILL BE SENT · TRAINING USE ONLY
      </span>
      <AlertTriangle size={16} color={PALETTE.ink} strokeWidth={2.2} />
    </div>
  );
}

/* ---------- Top bar: presence + elapsed ---------- */
function TopBarPresence({ incident, now }) {
  const elapsed = formatElapsed(now - incident.startedAt);
  const isActive = incident.status === "active";

  // Build presence list from confirmed roles
  const presence = (incident.roles || [])
    .filter((r) => r.status === "confirmed" || r.status === "contacted")
    .slice(0, 5)
    .map((r) => ({
      initials: r.initials,
      name: r.staff,
      color: r.isPrincipal ? PALETTE.teal : PALETTE.sage,
    }));

  return (
    <TopBarShell current="home">
      {isActive && (
        <div className="mono" style={{ fontSize: 11, color: incident.isDrill ? PALETTE.amber : PALETTE.teal, display: "flex", alignItems: "center", gap: 8, opacity: 0.95, fontWeight: incident.isDrill ? 600 : 400 }}>
          <span className="live-dot" style={{ width: 7, height: 7, background: incident.isDrill ? PALETTE.amber : PALETTE.rust, display: "inline-block", borderRadius: "50%" }} />
          {incident.isDrill ? "DRILL" : "LIVE"} · {elapsed} ELAPSED
        </div>
      )}
      {!isActive && (
        <div className="mono" style={{ fontSize: 11, color: PALETTE.inkSoft, display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={11} /> CLOSED · {formatRelative(incident.closedAt, now)}
        </div>
      )}
      <div style={{ display: "flex" }}>
        {presence.map((p, i) => (
          <div
            key={i}
            title={`${p.name} — present`}
            style={{
              width: 26, height: 26, background: p.color, color: PALETTE.paper,
              fontSize: 10, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
              marginLeft: i > 0 ? -8 : 0,
              border: `2px solid ${PALETTE.paper}`,
              borderRadius: "50%",
              position: "relative",
              zIndex: presence.length - i,
            }}
          >
            {p.initials}
          </div>
        ))}
      </div>
    </TopBarShell>
  );
}

/* ---------- Command strip ---------- */
/* ============================================================
   RED FOLDER MODE (CORE · command under pressure)
   Stress-optimised full-screen view. Only: situation · critical
   actions · active risks · latest decisions · key contacts.
   Composes the Decision Log, Risk register, Blind Spots, tasks &
   roles already built — one calm, high-contrast surface.
   ============================================================ */
function RedFolderView({ incident, now, isClosed, onExit, onToggleTask, onActivate, onOpen }) {
  const sev = SEVERITY[incident.severity];
  const findings = runCopilot(incident, now).filter((f) => f.severity === "critical" || f.severity === "important");
  const risks = openRisks(incident).slice(0, 6);
  const decisions = (incident.decisions || []).slice(0, 3);
  const openT = sortTasks((incident.tasks || []).filter((t) => !t.done), now).slice(0, 6);
  const contacts = incident.student?.emergencyContacts || [];
  const keyRoles = (incident.roles || []).filter(roleIsAssigned).slice(0, 6);
  const needsActivation = !incident.activation && incident.severity >= 2 && !isClosed;

  const C = { bg: "#04182E", card: "rgba(255,255,255,0.05)", line: "rgba(255,255,255,0.13)", text: "#F4F7FB", soft: "rgba(255,255,255,0.6)" };

  return (
    <div style={{ position: "fixed", inset: 0, background: C.bg, color: C.text, zIndex: 200, overflowY: "auto", fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ position: "sticky", top: 0, background: C.bg, borderBottom: `1px solid ${C.line}`, padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <AlertOctagon size={22} color={PALETTE.crimson} />
          <div>
            <div className="mono" style={{ fontSize: 13, letterSpacing: "0.22em", fontWeight: 700, color: C.text }}>RED FOLDER</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: C.soft, marginTop: 2 }}>{incident.id}{incident.isDrill ? " · DRILL" : ""}</div>
          </div>
        </div>
        <button onClick={onExit} style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "rgba(255,255,255,0.1)", border: `1px solid ${C.line}`, color: C.text, fontSize: 15, fontWeight: 600, cursor: "pointer" }}>
          <Minimize2 size={16} /> Full detail
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
        {/* SITUATION */}
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderLeft: `5px solid ${sev.color}`, padding: "24px 26px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
            <span className="display" style={{ fontSize: 46, fontWeight: 600, color: sev.color, lineHeight: 1, letterSpacing: "-0.02em" }}>{sev.label}</span>
            <span style={{ fontSize: 15, color: C.soft }}>{isClosed ? "CLOSED" : "ACTIVE"} · {formatElapsed(now - incident.startedAt)} elapsed</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 600, color: C.text, marginTop: 14, lineHeight: 1.2 }}>{incident.title}</div>
          <div style={{ fontSize: 15, color: C.soft, marginTop: 10, display: "flex", gap: 18, flexWrap: "wrap" }}>
            <span>📍 {incident.location}</span>
            <span>{incident.empSection}</span>
          </div>
          {needsActivation && (
            <button onClick={onActivate} style={{ marginTop: 18, width: "100%", padding: "16px", background: PALETTE.crimson, color: "#fff", border: "none", fontSize: 18, fontWeight: 700, letterSpacing: "0.02em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <Radio size={20} /> ACTIVATE — NOTIFY THE TEAM
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
          {/* CRITICAL ACTIONS */}
          <RFBlock title="CRITICAL ACTIONS" accent={PALETTE.rust} C={C}>
            {findings.length === 0 && openT.length === 0 ? (
              <RFEmpty C={C} text="No outstanding actions flagged." />
            ) : (
              <>
                {findings.map((f) => (
                  <div key={f.ruleId} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: `1px solid ${C.line}` }}>
                    <AlertTriangle size={17} color={f.severity === "critical" ? PALETTE.crimson : PALETTE.rust} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 15.5, color: C.text, lineHeight: 1.35 }}>{f.issue}</span>
                  </div>
                ))}
                {openT.map((t) => {
                  const overdue = t.dueAt && t.dueAt < now;
                  return (
                    <button key={t.id} onClick={() => onToggleTask(t.id)} style={{ width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: `1px solid ${C.line}`, padding: "10px 0", display: "flex", gap: 11, alignItems: "center", cursor: "pointer" }}>
                      <Circle size={18} color={C.soft} style={{ flexShrink: 0 }} />
                      <span style={{ flex: 1, fontSize: 15.5, color: C.text, lineHeight: 1.3 }}>{t.text}</span>
                      {overdue && <span className="mono" style={{ fontSize: 10, color: PALETTE.crimson, fontWeight: 700 }}>OVERDUE</span>}
                    </button>
                  );
                })}
              </>
            )}
          </RFBlock>

          {/* ACTIVE RISKS */}
          <RFBlock title={`ACTIVE RISKS · ${openRisks(incident).length}`} accent={PALETTE.amber} C={C}>
            {risks.length === 0 ? (
              <RFEmpty C={C} text="No active risks." />
            ) : (
              risks.map((r) => {
                const sv = RISK_SEVERITY[r.severity] || {};
                return (
                  <div key={r.id} style={{ display: "flex", gap: 11, alignItems: "center", padding: "9px 0", borderBottom: `1px solid ${C.line}` }}>
                    <span style={{ width: 11, height: 11, borderRadius: "50%", background: sv.color, flexShrink: 0 }} />
                    <span style={{ flex: 1, fontSize: 15.5, color: C.text, lineHeight: 1.3 }}>{r.title}</span>
                    {r.status === "escalated" && <span className="mono" style={{ fontSize: 10, color: PALETTE.crimson, fontWeight: 700 }}>ESC</span>}
                  </div>
                );
              })
            )}
          </RFBlock>

          {/* LATEST DECISIONS */}
          <RFBlock title="LATEST DECISIONS" accent="#E39199" C={C}>
            {decisions.length === 0 ? (
              <RFEmpty C={C} text="No decisions recorded." />
            ) : (
              decisions.map((d) => (
                <div key={d.id} style={{ padding: "9px 0", borderBottom: `1px solid ${C.line}` }}>
                  <div style={{ fontSize: 15.5, color: C.text, lineHeight: 1.35 }}>{d.decision}</div>
                  <div className="mono" style={{ fontSize: 10, color: C.soft, marginTop: 4 }}>{formatTime(d.ts)} · {d.decidedBy}</div>
                </div>
              ))
            )}
          </RFBlock>

          {/* KEY CONTACTS */}
          <RFBlock title="KEY CONTACTS" accent={PALETTE.sage} C={C}>
            <a href="tel:000" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "rgba(160,32,41,0.22)", border: `1px solid ${PALETTE.crimson}`, marginBottom: 10, textDecoration: "none" }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>Emergency</span>
              <span className="mono" style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>000</span>
            </a>
            {keyRoles.map((r) => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 14.5 }}>
                <span className="mono" style={{ fontSize: 10.5, color: C.soft, letterSpacing: "0.08em" }}>{r.role.toUpperCase()}</span>
                <span style={{ color: C.text, fontWeight: 500 }}>{r.staff}</span>
              </div>
            ))}
            {contacts.map((c) => (
              <div key={c.name} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${C.line}`, fontSize: 14.5 }}>
                <span style={{ color: C.soft }}>{c.relation}</span>
                <span className="mono" style={{ color: C.text }}>{c.phone}</span>
              </div>
            ))}
            {keyRoles.length === 0 && contacts.length === 0 && <RFEmpty C={C} text="No contacts assigned." />}
          </RFBlock>
        </div>

        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: C.soft, textAlign: "center", marginTop: 24, opacity: 0.7 }}>
          RED FOLDER · ESSENTIALS ONLY · TAP “FULL DETAIL” FOR THE COMPLETE WORKSPACE
        </div>
      </div>
    </div>
  );
}

function RFBlock({ title, accent, C, children }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.line}`, borderTop: `3px solid ${accent}`, padding: "18px 20px" }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: "0.2em", color: accent, fontWeight: 700, marginBottom: 12 }}>{title}</div>
      {children}
    </div>
  );
}

function RFEmpty({ C, text }) {
  return <div style={{ fontSize: 14, color: C.soft, padding: "6px 0" }}>{text}</div>;
}

// Homepage glance strip — Visual Boards + open Risks at a glance (Annika: make
// the boards accessible from the homepage; risks reachable). Read-only; click
// through to the full instruments / risk register.
function GlanceStrip({ incident, setDrawer, now }) {
  const counts = boardCounts(incident);
  const boards = incident.boards || {};
  const open = openRisks(incident);
  const latest = (q) => { const arr = boards[q] || []; return arr.length ? arr[arr.length - 1].text : null; };
  const quad = [
    { id: "facts", label: "Facts" },
    { id: "assumptions", label: "Assumptions" },
    { id: "issues", label: "Issues" },
    { id: "actions", label: "Actions" },
  ];
  return (
    <div style={{ maxWidth: 1480, margin: "0 auto", padding: "0 32px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "stretch" }}>
        {/* Visual boards */}
        <button onClick={() => setDrawer("instruments")} className="card" style={{ textAlign: "left", cursor: "pointer", padding: "12px 16px", border: `1px solid rgba(0,48,94,0.12)`, background: PALETTE.paper }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span className="panel-h-label" style={{ fontSize: 10 }}>VISUAL BOARDS</span>
            <span className="mono" style={{ fontSize: 9.5, color: PALETTE.teal }}>OPEN INSTRUMENTS →</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 }}>
            {quad.map((q) => (
              <div key={q.id}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  <span className="display" style={{ fontSize: 20, fontWeight: 600, color: PALETTE.teal }}>{counts[q.id] || 0}</span>
                  <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.06em", color: PALETTE.inkSoft, textTransform: "uppercase" }}>{q.label}</span>
                </div>
                <div style={{ fontSize: 10.5, color: PALETTE.inkSoft, lineHeight: 1.35, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{latest(q.id) || "—"}</div>
              </div>
            ))}
          </div>
        </button>
        {/* Open risks */}
        <button onClick={() => setDrawer("risks")} className="card" style={{ textAlign: "left", cursor: "pointer", padding: "12px 16px", border: `1px solid ${open.length ? "rgba(168,85,53,0.4)" : "rgba(0,48,94,0.12)"}`, background: PALETTE.paper }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span className="panel-h-label" style={{ fontSize: 10, color: open.length ? PALETTE.rust : PALETTE.teal }}>OPEN RISKS · {open.length}</span>
            <span className="mono" style={{ fontSize: 9.5, color: PALETTE.teal }}>REGISTER →</span>
          </div>
          {open.length === 0 ? (
            <div style={{ fontSize: 11.5, color: PALETTE.inkSoft }}>No open risks.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {open.slice(0, 3).map((r) => {
                const sv = RISK_SEVERITY[r.severity] || {};
                return (
                  <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: PALETTE.ink }}>
                    <span style={{ width: 7, height: 7, borderRadius: "50%", background: sv.color, flexShrink: 0 }} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
                  </div>
                );
              })}
              {open.length > 3 && <div style={{ fontSize: 10.5, color: PALETTE.inkSoft }}>+{open.length - 3} more</div>}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

function CommandStrip({ incident, changeSeverity, setDrawer, closeIncident, reopenIncident, onBack, onRedFolder }) {
  const sev = SEVERITY[incident.severity];
  const isClosed = incident.status === "closed";
  const copilotFindings = runCopilot(incident);
  const copilotCrit = copilotFindings.filter((f) => f.severity === "critical").length;

  return (
    <div style={{ background: PALETTE.paper, borderBottom: `1px solid rgba(0, 48, 94, 0.14)`, padding: "20px 32px" }}>
      <div style={{ maxWidth: 1480, margin: "0 auto" }}>
        <button onClick={onBack} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginBottom: 12, opacity: 0.8 }}>
          <ArrowLeft size={13} /> All incidents
        </button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 32 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6 }}>{incident.id}</span>
              <span style={{ width: 3, height: 3, background: PALETTE.teal, opacity: 0.4, borderRadius: "50%" }} />
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6 }}>{(incident.typeLabel || "").toUpperCase()}</span>
              {incident.isDrill && <span className="chip" style={{ background: PALETTE.amber, color: PALETTE.ink, borderColor: PALETTE.amber }}>DRILL</span>}
              {isClosed && <span className="chip" style={{ background: PALETTE.inkSoft, color: PALETTE.paper, borderColor: PALETTE.inkSoft }}>CLOSED</span>}
            </div>
            <h1 className="display" style={{ fontSize: 28, lineHeight: 1.15, color: PALETTE.teal, fontWeight: 500, margin: 0, letterSpacing: "-0.015em" }}>
              {incident.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 13, color: PALETTE.inkSoft, display: "flex", alignItems: "center", gap: 6 }}>
                <MapPin size={13} /> {incident.location}
              </span>
              <span style={{ fontSize: 13, color: PALETTE.inkSoft, display: "flex", alignItems: "center", gap: 6 }}>
                <BookOpen size={13} /> {incident.empSection}
              </span>
              {incident.student && (
                <button onClick={() => setDrawer("student")} style={{ background: "none", border: "none", padding: 0, fontSize: 13, color: PALETTE.teal, display: "flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                  <Users size={13} /> Student profile · {incident.student.initials}
                </button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6 }}>SEVERITY</span>
              <div style={{ display: "flex", border: `1px solid rgba(0, 48, 94, 0.2)`, opacity: isClosed ? 0.5 : 1 }}>
                {[0, 1, 2, 3].map((lvl) => {
                  const isActive = lvl === incident.severity;
                  const cfg = SEVERITY[lvl];
                  return (
                    <button key={lvl} onClick={() => changeSeverity(lvl)} disabled={isClosed} style={{
                      padding: "8px 14px",
                      background: isActive ? cfg.color : PALETTE.paper,
                      color: isActive ? PALETTE.paper : PALETTE.ink,
                      border: "none",
                      borderRight: lvl < 3 ? `1px solid rgba(0, 48, 94, 0.15)` : "none",
                      fontSize: 12,
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      cursor: isClosed ? "not-allowed" : "pointer",
                    }}>L{lvl}</button>
                  );
                })}
              </div>
            </div>
            {/* Why this level + quick links to the plan's matrix and the impact
                assessment (Annika: severity felt like a bare number; the impact
                tool was hard to find). */}
            <div style={{ maxWidth: 360, textAlign: "right", fontSize: 11.5, color: PALETTE.inkSoft, lineHeight: 1.5 }}>
              <strong style={{ color: sev.color }}>{sev.label}</strong> — {sev.tone}.
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", alignItems: "center", flexWrap: "wrap" }}>
              <EscalationMatrixButton compact />
              <button onClick={() => setDrawer({ kind: "continuity", tab: "impact" })} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }}>
                <Building2 size={13} /> Impact &amp; Issues
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button className="btn" onClick={onRedFolder} style={{ borderColor: PALETTE.crimson, color: PALETTE.crimson, fontWeight: 600 }}><AlertOctagon size={14} /> Red Folder</button>
              {!incident.activation && !isClosed ? (
                <button className="btn btn-danger" onClick={() => setDrawer("activation")}><Radio size={14} /> Activate</button>
              ) : incident.activation ? (
                <button className="btn" onClick={() => setDrawer("activation")} style={{ borderColor: PALETTE.sage, color: PALETTE.sage }}>
                  <Radio size={14} /> Activated · {ackRollup(incident)}
                </button>
              ) : null}
              <button className="btn" onClick={() => setDrawer({ kind: "phases", phaseId: incidentPhase(incident) })}>
                <ListChecks size={14} /> Phase · {phaseMeta(incidentPhase(incident)).label}
              </button>
              {(() => { const done = Object.keys(incident.decisionFlows || {}).length; return (
                <button className="btn" onClick={() => setDrawer("flowcharts")}>
                  <GitBranch size={14} /> Flowcharts{done ? ` · ${done} run` : ""}
                </button>
              ); })()}
              <button className="btn" onClick={() => setDrawer("copilot")} style={copilotFindings.length ? { borderColor: copilotCrit ? PALETTE.crimson : PALETTE.rust, color: copilotCrit ? PALETTE.crimson : PALETTE.rust } : undefined}>
                <Lightbulb size={14} /> Blind Spots{copilotFindings.length ? ` · ${copilotFindings.length}` : ""}
              </button>
              <button className="btn" onClick={() => setDrawer("team")}><Users size={14} /> Team</button>
              {(() => { const pr = peopleAtRiskCounts(incident); return (
                <button className="btn" onClick={() => setDrawer("instruments")} style={pr.unaccounted ? { borderColor: PALETTE.crimson, color: PALETTE.crimson } : undefined}>
                  <LayoutGrid size={14} /> Instruments{pr.unaccounted ? ` · ${pr.unaccounted} unaccounted` : ""}
                </button>
              ); })()}
              <button className="btn" onClick={() => setDrawer("policy")}><BookOpen size={14} /> Policy</button>
              {(() => { const pend = unacknowledgedDecisionCount(incident); return (
                <button className="btn" onClick={() => setDrawer("decisions")} style={pend ? { borderColor: PALETTE.rust, color: PALETTE.rust } : undefined}>
                  <Scale size={14} /> Decisions{(incident.decisions || []).length ? ` · ${(incident.decisions || []).length}` : ""}{pend ? ` · ${pend} to ack` : ""}
                </button>
              ); })()}
              {(() => { const open = riskCounts(incident).open; return (
                <button className="btn" onClick={() => setDrawer("risks")} style={open ? { borderColor: PALETTE.rust, color: PALETTE.rust } : undefined}>
                  <AlertTriangle size={14} /> Risks{open ? ` · ${open}` : ""}
                </button>
              ); })()}
              <button className="btn" onClick={() => setDrawer("comms")}><MessageSquare size={14} /> Communications{(incident.comms || []).length ? ` · ${(incident.comms || []).length}` : ""}</button>
              {(() => { const n = activeStrategyCount(incident); return (
                <button className="btn" onClick={() => setDrawer("continuity")} style={n ? { borderColor: PALETTE.sage, color: PALETTE.sage } : undefined}>
                  <Building2 size={14} /> Continuity{n ? ` · ${n}` : ""}
                </button>
              ); })()}
              <button className="btn" onClick={() => setDrawer("pir")} style={incident.pir ? { borderColor: PALETTE.sage, color: PALETTE.sage } : undefined}><ClipboardCheck size={14} /> Review</button>
              <button className="btn" onClick={() => setDrawer("export")}><Download size={14} /> Export pack</button>
              {!isClosed ? (
                <button className="btn btn-primary" onClick={closeIncident}><Lock size={14} /> Close incident</button>
              ) : (
                <button className="btn" onClick={reopenIncident}><RotateCcw size={14} /> Reopen</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Phase stepper (the incident lifecycle spine) ---------- */
function PhaseStepper({ incident, onOpen }) {
  const currentId = incidentPhase(incident);
  const curIdx = phaseIndex(currentId);
  return (
    <div style={{ background: PALETTE.paper, borderBottom: `1px solid rgba(0, 48, 94, 0.1)` }}>
      <div style={{ maxWidth: 1480, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "stretch" }}>
        {CIMT_PHASES.map((p, i) => {
          const prog = phaseProgress(incident, p.id);
          const isCurrent = p.id === currentId;
          const isPast = i < curIdx;
          const complete = prog.total > 0 && prog.done === prog.total;
          const topColor = isCurrent ? PALETTE.teal : isPast ? PALETTE.sage : "rgba(0, 48, 94, 0.15)";
          return (
            <button
              key={p.id}
              onClick={() => onOpen(p.id)}
              title={p.blurb}
              style={{
                flex: 1, textAlign: "left", cursor: "pointer",
                background: isCurrent ? "rgba(0, 48, 94, 0.05)" : "transparent",
                border: "none", borderTop: `3px solid ${topColor}`,
                padding: "9px 12px", minWidth: 0,
              }}
            >
              <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: PALETTE.inkSoft, opacity: 0.7 }}>PHASE {i + 1}</div>
              <div style={{ fontSize: 12.5, fontWeight: isCurrent ? 600 : 500, color: isCurrent ? PALETTE.teal : isPast ? PALETTE.sage : PALETTE.ink, display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {isPast && complete ? <Check size={12} color={PALETTE.sage} /> : null}{p.label}
              </div>
              <div style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 2 }}>{prog.done}/{prog.total} done{isCurrent ? " · current" : ""}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Phase drawer: the plan's master checklist per phase ---------- */
function PhaseDrawer({ incident, initialPhase, update, addTimelineEntry, isClosed, setDrawer }) {
  const currentId = incidentPhase(incident);
  const [sel, setSel] = useState(initialPhase && CIMT_PHASES.some((p) => p.id === initialPhase) ? initialPhase : currentId);
  const items = PHASE_CHECKLIST[sel] || [];
  const meta = phaseMeta(sel);
  const prog = phaseProgress(incident, sel);
  const nid = nextPhaseId(currentId);
  const [refDoc, setRefDoc] = useState(null);

  function toggleItem(itemId) {
    if (isClosed) return;
    const wasDone = isPhaseItemDone(incident, itemId);
    update((prev) => {
      const checks = { ...(prev.phaseChecks || {}) };
      if (wasDone) delete checks[itemId];
      else checks[itemId] = { done: true, at: Date.now() };
      return { ...prev, phaseChecks: checks };
    });
    const it = items.find((x) => x.id === itemId);
    addTimelineEntry({ type: wasDone ? "system" : "action", text: `${meta.label} checklist — ${wasDone ? "un-ticked" : "completed"}: ${(it?.text || "").slice(0, 90)}` });
  }

  const pid = prevPhaseId(currentId);
  const openMand = openMandatoryItems(incident, currentId);

  function advance() {
    if (!nid || isClosed) return;
    // Warn-and-allow (Annika's call): mandatory items don't hard-block, but the
    // Leader must consciously acknowledge any still open before moving on.
    if (openMand.length) {
      const ok = window.confirm(
        `${openMand.length} mandatory item${openMand.length > 1 ? "s" : ""} in ${phaseMeta(currentId).label} still incomplete:\n\n• ${openMand.map((i) => i.text).join("\n• ")}\n\nProceed to ${phaseMeta(nid).label} anyway?`
      );
      if (!ok) return;
    }
    update({ phase: nid });
    addTimelineEntry({ type: "system", text: `Phase advanced: ${phaseMeta(currentId).label} → ${phaseMeta(nid).label}.${openMand.length ? ` ${openMand.length} mandatory item(s) still open at advance.` : ""}` });
    setSel(nid);
  }

  function goBack() {
    if (!pid || isClosed) return;
    update({ phase: pid });
    addTimelineEntry({ type: "system", text: `Phase moved back: ${phaseMeta(currentId).label} → ${phaseMeta(pid).label}.` });
    setSel(pid);
  }

  return (
    <div>
      {/* Phase selector */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {CIMT_PHASES.map((p, i) => {
          const isSel = p.id === sel;
          const isCur = p.id === currentId;
          const pr = phaseProgress(incident, p.id);
          return (
            <button key={p.id} onClick={() => setSel(p.id)} style={{
              padding: "6px 10px", fontSize: 11.5, cursor: "pointer",
              border: `1px solid ${isSel ? PALETTE.teal : "rgba(0, 48, 94, 0.2)"}`,
              background: isSel ? PALETTE.teal : PALETTE.paper,
              color: isSel ? PALETTE.paper : PALETTE.ink,
              display: "flex", alignItems: "center", gap: 5, fontWeight: isSel ? 600 : 500,
            }}>
              <span className="mono" style={{ opacity: 0.7, fontSize: 9 }}>{i + 1}</span>{p.label}
              {isCur && <span style={{ width: 6, height: 6, borderRadius: "50%", background: isSel ? PALETTE.paper : PALETTE.rust }} />}
              <span style={{ opacity: 0.7, fontSize: 10 }}>{pr.done}/{pr.total}</span>
            </button>
          );
        })}
      </div>

      {/* Selected phase header */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div className="display" style={{ fontSize: 22, fontWeight: 500, color: PALETTE.teal }}>{meta.label}</div>
          {sel === currentId ? (
            <span className="chip" style={{ background: PALETTE.rust, color: PALETTE.paper, borderColor: PALETTE.rust }}>CURRENT PHASE</span>
          ) : phaseIndex(sel) < phaseIndex(currentId) ? (
            <span className="chip" style={{ background: PALETTE.sage, color: PALETTE.paper, borderColor: PALETTE.sage }}>PASSED</span>
          ) : (
            <span className="chip">UPCOMING</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: PALETTE.inkSoft, lineHeight: 1.6, margin: "6px 0 0" }}>{meta.blurb}</p>
        <div style={{ marginTop: 10, height: 5, background: "rgba(0, 48, 94, 0.1)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${prog.pct}%`, height: "100%", background: prog.pct === 100 ? PALETTE.sage : PALETTE.teal }} />
        </div>
        <div style={{ fontSize: 11, color: PALETTE.inkSoft, marginTop: 4 }}>{prog.done} of {prog.total} steps complete</div>
      </div>

      {/* Checklist */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((it) => {
          const done = isPhaseItemDone(incident, it.id);
          return (
            <button key={it.id} onClick={() => toggleItem(it.id)} disabled={isClosed} style={{
              display: "flex", gap: 10, alignItems: "flex-start", textAlign: "left",
              padding: "10px 8px", background: "none", border: "none",
              borderBottom: `1px solid rgba(0, 48, 94, 0.07)`, cursor: isClosed ? "default" : "pointer", width: "100%",
            }}>
              {done ? <CheckCircle2 size={17} color={PALETTE.sage} style={{ flexShrink: 0, marginTop: 1 }} />
                    : <Circle size={17} color={PALETTE.inkSoft} style={{ flexShrink: 0, marginTop: 1, opacity: 0.5 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: done ? PALETTE.inkSoft : PALETTE.ink, textDecoration: done ? "line-through" : "none" }}>
                  {it.text}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                  <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.06em", color: PALETTE.teal, background: "rgba(0, 48, 94, 0.07)", padding: "2px 6px" }}>{it.responsible}</span>
                  {it.reference && (referenceDoc(it.reference) ? (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); setRefDoc(referenceDoc(it.reference)); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setRefDoc(referenceDoc(it.reference)); } }}
                      className="mono"
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, letterSpacing: "0.04em", color: PALETTE.teal, border: `1px solid rgba(0,48,94,0.25)`, background: PALETTE.parchment, padding: "2px 7px", cursor: "pointer", fontWeight: 600 }}
                    >
                      <BookOpen size={10} /> {it.reference.toUpperCase()}
                    </span>
                  ) : (
                    <span className="mono" style={{ fontSize: 9.5, color: PALETTE.inkSoft }}>↳ {it.reference}</span>
                  ))}
                  {it.flowchart && setDrawer && (
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => { e.stopPropagation(); setDrawer("flowcharts"); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); setDrawer("flowcharts"); } }}
                      className="mono"
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 9.5, letterSpacing: "0.04em", color: PALETTE.rust, border: `1px solid rgba(168,85,53,0.4)`, background: PALETTE.parchment, padding: "2px 7px", cursor: "pointer", fontWeight: 600 }}
                    >
                      <GitBranch size={10} /> OPEN FLOWCHART
                    </span>
                  )}
                  {it.mandatory && <span className="mono" style={{ fontSize: 9, letterSpacing: "0.08em", color: PALETTE.crimson, fontWeight: 600 }}>MANDATORY</span>}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Advance / go back */}
      {!isClosed && sel === currentId && (nid || pid) && (
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          {pid && (
            <button onClick={goBack} className="btn" style={{ justifyContent: "center", flex: nid ? "0 0 auto" : 1 }} title={`Return to ${phaseMeta(pid).label}`}>
              <ArrowLeft size={14} /> Back to {phaseMeta(pid).label}
            </button>
          )}
          {nid && (
            <button onClick={advance} className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>
              Advance to {phaseMeta(nid).label} <ArrowRight size={14} />
            </button>
          )}
        </div>
      )}
      {!isClosed && sel === currentId && openMand.length > 0 && nid && (
        <p style={{ fontSize: 11.5, color: PALETTE.rust, textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
          {openMand.length} mandatory item{openMand.length > 1 ? "s" : ""} still open — you'll be asked to confirm before advancing.
        </p>
      )}
      {sel === currentId && !nid && (
        <p style={{ fontSize: 12, color: PALETTE.inkSoft, textAlign: "center", marginTop: 16 }}>Final phase — stand the CIMT down and complete the Post-Incident Review.</p>
      )}
      {refDoc && <ReferenceDocModal doc={refDoc} onClose={() => setRefDoc(null)} />}
    </div>
  );
}

// Render one of the plan's activation reference procedures in a modal.
function ReferenceDocModal({ doc, onClose }) {
  return (
    <ReferenceModal title={doc.title} subtitle={doc.intro} onClose={onClose} maxWidth={720}>
      {doc.locations && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {doc.locations.map(([k, v]) => (
            <div key={k} style={{ border: `1px solid rgba(0,48,94,0.14)`, padding: "6px 10px", background: PALETTE.parchment }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: PALETTE.teal, opacity: 0.7, textTransform: "uppercase" }}>{k}</div>
              <div style={{ fontSize: 12.5, color: PALETTE.ink }}>{v}</div>
            </div>
          ))}
        </div>
      )}
      {doc.sections.map((s) => (
        <div key={s.heading} style={{ marginBottom: 16 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.08em", color: PALETTE.rust, fontWeight: 600, marginBottom: 6, textTransform: "uppercase" }}>{s.heading}</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {s.items.map((it, i) => <li key={i} style={{ fontSize: 13, color: PALETTE.ink, lineHeight: 1.55, marginBottom: 4 }}>{it}</li>)}
          </ul>
        </div>
      ))}
    </ReferenceModal>
  );
}

/* ---------- Left rail: roles ---------- */
function LeftRail({ incident, update, addTimelineEntry, isClosed, setDrawer }) {
  function confirmRole(id) {
    update((prev) => ({ ...prev, roles: prev.roles.map((r) => (r.id === id ? { ...r, status: "confirmed" } : r)) }));
    const r = incident.roles.find((x) => x.id === id);
    addTimelineEntry({ type: "system", text: `${r.staff} confirmed as ${r.role}.` });
  }

  function assignSuggested(id) {
    const r = incident.roles.find((x) => x.id === id);
    if (!r?.suggested) return;
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((rr) =>
        rr.id === id
          ? { ...rr, staff: rr.suggested, initials: rr.suggested.split(" ").map((s) => s[0]).join(""), status: "confirmed", suggested: undefined }
          : rr
      ),
    }));
    addTimelineEntry({ type: "system", text: `${r.suggested} assigned as ${r.role}.` });
  }

  function assignSelf(id) {
    const r = incident.roles.find((x) => x.id === id);
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((rr) => (rr.id === id ? { ...rr, staff: "K. Patel", initials: "KP", status: "confirmed" } : rr)),
    }));
    addTimelineEntry({ type: "system", text: `K. Patel self-assigned as ${r.role}.` });
  }

  const confirmed = incident.roles.filter((r) => r.status === "confirmed").length;
  const required = incident.roles.filter((r) => r.required).length;

  return (
    <div className="card">
      <div className="panel-h">
        <span className="panel-h-label">ROLES · {confirmed}/{required}</span>
      </div>
      {incident.activation && (
        <button onClick={() => setDrawer("activation")} style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", background: "rgba(91,140,124,0.08)", border: "none", borderBottom: `1px solid rgba(0,48,94,0.1)`, cursor: "pointer" }}>
          <Radio size={12} color={PALETTE.sage} />
          <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: PALETTE.sage, fontWeight: 600 }}>ACTIVATED · {ackRollup(incident).toUpperCase()}</span>
        </button>
      )}
      <div>
        {incident.roles.map((r) => (
          <RoleRow
            key={r.id}
            role={r}
            incidentType={incident.type}
            onConfirm={() => confirmRole(r.id)}
            onAssign={() => assignSuggested(r.id)}
            onAssignSelf={() => assignSelf(r.id)}
            onManage={() => setDrawer({ kind: "role", roleId: r.id })}
            disabled={isClosed}
          />
        ))}
      </div>
      <div style={{ padding: 14, borderTop: `1px solid rgba(0, 48, 94, 0.12)` }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 8 }}>
          DIRECTORY · QUICK CALL
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { name: "Emergency · 000", urgent: true },
            { name: "Chair of College Council" },
            { name: "CEO · AngliSchools" },
            { name: "AISNSW critical-incident support" },
          ].map((c) => (
            <button key={c.name} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px",
              background: c.urgent ? "rgba(184, 92, 60, 0.08)" : "transparent",
              border: `1px solid ${c.urgent ? "rgba(184, 92, 60, 0.3)" : "rgba(0, 48, 94, 0.12)"}`,
              fontSize: 12,
              color: c.urgent ? PALETTE.rust : PALETTE.ink,
              fontWeight: c.urgent ? 500 : 400,
              textAlign: "left",
              width: "100%",
            }}>
              <Phone size={11} /> {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function RoleRow({ role, incidentType, onConfirm, onAssign, onAssignSelf, onManage, disabled }) {
  const cfg = {
    confirmed: { color: PALETTE.sage, icon: CheckCircle2, label: "Confirmed" },
    pending: { color: PALETTE.amber, icon: Clock, label: "Pending" },
    unassigned: { color: PALETTE.rust, icon: AlertCircle, label: "Unassigned" },
    contacted: { color: PALETTE.teal, icon: Phone, label: "Contacted" },
  }[role.status];

  const hasResponsibilities = !!responsibilitiesFor(role.role, incidentType);

  return (
    <div style={{ padding: "12px 14px", borderBottom: `1px solid rgba(0, 48, 94, 0.08)`, display: "flex", alignItems: "flex-start", gap: 10, position: "relative" }}>
      <div style={{
        width: 28, height: 28,
        background: role.status === "unassigned" ? PALETTE.bone : role.isPrincipal ? PALETTE.teal : "rgba(0, 48, 94, 0.1)",
        color: role.status === "unassigned" ? PALETTE.inkSoft : role.isPrincipal ? PALETTE.paper : PALETTE.teal,
        fontSize: 10, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        borderRadius: "50%",
      }}>{role.initials}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: PALETTE.teal, opacity: 0.6 }}>
            {role.role.toUpperCase()}
          </div>
          {!disabled && onManage && (
            <button
              onClick={onManage}
              title="Manage assignment & view responsibilities"
              className="btn-ghost"
              style={{ background: "none", border: "none", padding: 2, color: PALETTE.teal, opacity: 0.7, cursor: "pointer" }}
            >
              <Settings size={11} />
            </button>
          )}
        </div>
        <div style={{ fontSize: 13, color: PALETTE.ink, marginTop: 2, fontWeight: role.staff === "—" ? 400 : 500 }}>{role.staff}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 4, flexWrap: "wrap" }}>
          <cfg.icon size={10} color={cfg.color} />
          <span style={{ fontSize: 10, color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>
          {role.backup && <span style={{ fontSize: 10, color: PALETTE.inkSoft }}>· backup: {role.backup}</span>}
        </div>
        {!disabled && role.status === "pending" && (
          <button onClick={onConfirm} className="btn-ghost" style={{ marginTop: 6, fontSize: 11, color: PALETTE.teal, background: "none", border: "none", padding: 0, fontWeight: 500 }}>
            Confirm →
          </button>
        )}
        {!disabled && role.status === "unassigned" && role.suggested && (
          <button onClick={onAssign} className="btn-ghost" style={{ marginTop: 6, fontSize: 11, color: PALETTE.rust, background: "none", border: "none", padding: 0, fontWeight: 500 }}>
            Suggest: {role.suggested} →
          </button>
        )}
        {!disabled && role.status === "unassigned" && !role.suggested && (
          <button onClick={onManage || onAssignSelf} className="btn-ghost" style={{ marginTop: 6, fontSize: 11, color: PALETTE.teal, background: "none", border: "none", padding: 0, fontWeight: 500 }}>
            Assign staff →
          </button>
        )}
        {hasResponsibilities && role.status !== "unassigned" && !disabled && (
          <button onClick={onManage} className="btn-ghost" style={{ marginTop: 4, fontSize: 10, color: PALETTE.sage, background: "none", border: "none", padding: 0, fontWeight: 500, display: "flex", alignItems: "center", gap: 3 }}>
            <BookOpen size={9} /> View responsibilities
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------- Center column: timeline + composer + tasks ---------- */
function CenterColumn({ incident, addTimelineEntry, update, now, isClosed }) {
  const [composerType, setComposerType] = useState("note");

  function handleSubmit(text) {
    if (!text.trim()) return;
    addTimelineEntry({ type: composerType, text });
  }

  function toggleTask(id) {
    update((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) }));
  }

  function addTask(text, dueAt) {
    if (!text.trim()) return;
    update((prev) => ({ ...prev, tasks: [...prev.tasks, { id: `tk${Date.now()}`, text, owner: "—", done: false, priority: "med", dueAt: dueAt || null }] }));
  }

  // Edit / delete a timeline entry (Annika: notes, actions and comms should be
  // correctable). Soft-delete keeps the audit trail — the entry stays, struck out.
  function editEntry(id, text) {
    if (!text.trim()) return;
    update((prev) => ({ ...prev, timeline: prev.timeline.map((e) => (e.id === id ? { ...e, text, edited: true, editedAt: Date.now() } : e)) }));
  }
  function deleteEntry(id) {
    if (!window.confirm("Remove this entry? It stays in the record struck through, for the audit trail.")) return;
    update((prev) => ({ ...prev, timeline: prev.timeline.map((e) => (e.id === id ? { ...e, deleted: true, deletedAt: Date.now() } : e)) }));
  }
  const EDITABLE_TYPES = new Set(["note", "action", "comm"]);

  return (
    // Tasks up top (used most frequently), the timeline beneath (Annika's layout
    // feedback: keep the checklist at the top, move the timeline to the bottom).
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <PhaseTaskBoard incident={incident} update={update} addTimelineEntry={addTimelineEntry} now={now} isClosed={isClosed} toggleTask={toggleTask} addTask={addTask} />

      <div className="card">
        <div className="panel-h">
          <span className="panel-h-label">INCIDENT TIMELINE · {incident.timeline.filter((e) => !e.deleted).length} ENTRIES</span>
          <span className="panel-h-meta">AUTO-LOG ON</span>
        </div>
        <div style={{ padding: "16px 24px 6px", maxHeight: 420, overflowY: "auto" }} className="scroll-y">
          {incident.timeline.map((e, i) => (
            <TimelineEntry key={e.id} entry={e} now={now} isLast={i === incident.timeline.length - 1}
              editable={!isClosed && EDITABLE_TYPES.has(e.type)}
              onEdit={(text) => editEntry(e.id, text)} onDelete={() => deleteEntry(e.id)} />
          ))}
        </div>
        {!isClosed && <Composer composerType={composerType} setComposerType={setComposerType} onSubmit={handleSubmit} />}
      </div>
    </div>
  );
}

/* ---------- Role-tabbed, phase-scoped, soft-locked task board (part c) ---------- */
function PhaseTaskBoard({ incident, update, addTimelineEntry, now, isClosed, toggleTask, addTask }) {
  const curPhase = incidentPhase(incident);
  const curIdx = phaseIndex(curPhase);
  const all = incident.tasks || [];
  const rolesPresent = [...new Set(all.map((t) => t.role).filter(Boolean))];
  const hasRoles = rolesPresent.length > 0;

  // Default to the whole-current-phase view so advancing a phase visibly
  // changes what's on the board — Annika's feedback that the task list didn't
  // obviously reflect the phase she'd moved into.
  const [view, setView] = useState("phase"); // "mine" | "phase" | "role"
  const [myRole, setMyRoleState] = useState(() => {
    const saved = getMyRole();
    return saved && rolesPresent.includes(saved) ? saved : rolesPresent[0] || null;
  });
  const [pickRole, setPickRole] = useState(() => getMyRole() || rolesPresent[0] || null);
  const [showFuture, setShowFuture] = useState(false);
  const [showDone, setShowDone] = useState(false);

  function chooseMyRole(r) { setMyRoleState(r); setMyRole(r); }
  // A task's phase — explicit if tagged, otherwise derived from its due-time /
  // text so even legacy (untagged) tasks scope to a phase and reveal/​hide as
  // the incident advances.
  const effectivePhase = (t) =>
    t.phase || phaseForDue(t.dueAt != null ? Math.round((t.dueAt - incident.startedAt) / 60000) : null, t.text);
  const inScopePhase = (t) => phaseIndex(effectivePhase(t)) <= curIdx;
  // Full names of everyone assigned — lets us show unique owner codes + names.
  const ownerNames = (incident.roles || []).map((r) => r.staff).filter((s) => s && s !== "—");
  const awaitingAck = rolesAwaitingDecisionAck(incident); // roles with an unacknowledged decision

  function overrideLock(id) {
    update((prev) => ({ ...prev, tasks: prev.tasks.map((t) => (t.id === id ? { ...t, overrideLock: true } : t)) }));
    const t = all.find((x) => x.id === id);
    addTimelineEntry({ type: "action", text: `Lock overridden — "${t?.text || id}" unlocked out of sequence by the Leader.` });
  }

  // Task → risk: flag any job onto the Risk/Watch register, kept linked both ways.
  function flagTaskAsRisk(task) {
    if (task.riskId) return;
    const r = newRisk({
      title: task.text,
      description: `Flagged from a task${task.role ? ` (${shortRole(task.role)})` : ""}.`,
      category: "Operational",
      severity: task.priority === "high" ? "high" : task.priority === "low" ? "low" : "medium",
      status: "watch",
      owner: task.owner && task.owner !== "—" ? task.owner : "",
    });
    r.fromTaskId = task.id;
    update((prev) => ({
      ...prev,
      risks: [r, ...(prev.risks || [])],
      tasks: (prev.tasks || []).map((t) => (t.id === task.id ? { ...t, riskId: r.id } : t)),
    }));
    addTimelineEntry({ type: "risk", text: `Task flagged as a risk: ${task.text}.` });
  }

  // Legacy / demo incidents with no role-tagged tasks: flat phase-scoped list.
  if (!hasRoles) {
    const open = all.filter((t) => !t.done);
    const inScope = open.filter(inScopePhase);
    const shown = sortTasks(showFuture ? open : inScope, now);
    return (
      <div className="card">
        <div className="panel-h"><span className="panel-h-label">ACTIVE TASKS · {phaseMeta(curPhase).label.toUpperCase()} · {inScope.length} OPEN</span><span className="panel-h-meta">BY PHASE</span></div>
        <ActivePhaseBanner curPhase={curPhase} curIdx={curIdx} openCount={inScope.length} />
        <div>{shown.map((t, i, arr) => { const oname = taskOwnerName(incident, t); return <TaskRow key={t.id} task={t} now={now} onToggle={() => toggleTask(t.id)} isLast={i === arr.length - 1} disabled={isClosed} onFlagRisk={() => flagTaskAsRisk(t)} ownerName={oname} ownerCode={oname ? disambiguatedInitials(oname, ownerNames) : t.owner} />; })}</div>
        {!isClosed && <TaskAdder onAdd={addTask} />}
      </div>
    );
  }

  const activeRole = view === "mine" ? myRole : view === "role" ? pickRole : null;
  const scopeRoles = view === "phase" ? rolesPresent : [activeRole].filter(Boolean);
  const phaseOpenCount = all.filter((t) => !t.done && inScopePhase(t)).length;

  // Build a display section per role in scope.
  const sections = scopeRoles.map((role) => {
    const locked = applySoftLocks(all.filter((t) => t.role === role)); // due-ordered + lock flags
    const open = locked.filter((t) => !t.done);
    const inPhase = open.filter(inScopePhase);
    const future = open.filter((t) => !inScopePhase(t));
    const done = locked.filter((t) => t.done);
    const visible = [...(showFuture ? open : inPhase), ...(showDone ? done : [])];
    const person = (incident.roles || []).find((r) => r.role === role);
    return { role, visible, futureCount: future.length, doneCount: done.length, openInPhase: inPhase.length, person };
  });
  const totalFuture = sections.reduce((n, s) => n + s.futureCount, 0);
  const totalDone = sections.reduce((n, s) => n + s.doneCount, 0);

  const tabBtn = (on) => ({
    padding: "7px 12px", fontSize: 12.5, cursor: "pointer", fontWeight: on ? 600 : 500,
    background: on ? PALETTE.teal : PALETTE.paper, color: on ? PALETTE.paper : PALETTE.ink,
    border: `1px solid ${on ? PALETTE.teal : "rgba(0,48,94,0.18)"}`, display: "flex", alignItems: "center", gap: 6,
  });

  return (
    <div className="card">
      <div className="panel-h">
        <span className="panel-h-label">JOBS · {phaseMeta(curPhase).label.toUpperCase()}</span>
        <span className="panel-h-meta">BY ROLE &amp; PHASE</span>
      </div>

      {/* Active-phase banner — makes the current phase unmistakable, and the
          board defaults to this phase's jobs so advancing a phase visibly
          changes the list. */}
      <ActivePhaseBanner curPhase={curPhase} curIdx={curIdx} openCount={phaseOpenCount} />

      {/* View tabs */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "12px 24px 4px", alignItems: "center" }}>
        <button onClick={() => setView("mine")} style={tabBtn(view === "mine")}><Star size={13} /> My role</button>
        <button onClick={() => setView("phase")} style={{
          ...tabBtn(view === "phase"),
          ...(view !== "phase" ? { borderColor: PALETTE.rust, color: PALETTE.rust, background: PALETTE.parchment, fontWeight: 600 } : { background: PALETTE.rust, borderColor: PALETTE.rust }),
        }}>
          <Zap size={13} /> Whole current phase
          {phaseOpenCount > 0 && <span className="mono" style={{ fontSize: 10, background: view === "phase" ? "rgba(255,255,255,0.25)" : PALETTE.rust, color: PALETTE.paper, padding: "1px 6px", borderRadius: 8 }}>{phaseOpenCount}</span>}
        </button>
        <button onClick={() => setView("role")} style={tabBtn(view === "role")}>By role</button>
      </div>

      {/* Contextual selector row */}
      {view === "mine" && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 24px 12px", fontSize: 12.5, color: PALETTE.inkSoft }}>
          You are the
          <select value={myRole || ""} onChange={(e) => chooseMyRole(e.target.value)} style={{ fontSize: 12.5, padding: "4px 8px", border: `1px solid rgba(0,48,94,0.18)`, background: PALETTE.paper, color: PALETTE.ink }}>
            {rolesPresent.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      )}
      {view === "role" && (
        <div style={{ padding: "6px 24px 12px", display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ROLE_GROUPS.map((g) => {
            const groupRoles = g.roles.filter((r) => rolesPresent.includes(r));
            if (!groupRoles.length) return null;
            return (
              <div key={g.id} style={{ display: "flex", flexDirection: "column", gap: 4, marginRight: 8 }}>
                <span className="mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: PALETTE.inkSoft, opacity: 0.7 }}>{g.label.toUpperCase()}</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {groupRoles.map((r) => {
                    const on = pickRole === r;
                    const c = all.filter((t) => t.role === r && !t.done && inScopePhase(t)).length;
                    return <button key={r} onClick={() => setPickRole(r)} style={{ padding: "5px 9px", fontSize: 11.5, cursor: "pointer", background: on ? PALETTE.teal : PALETTE.paper, color: on ? PALETTE.paper : PALETTE.ink, border: `1px solid ${on ? PALETTE.teal : "rgba(0,48,94,0.16)"}`, fontWeight: on ? 600 : 500 }}>{shortRole(r)}{c ? ` · ${c}` : ""}</button>;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sections */}
      <div>
        {sections.every((s) => s.visible.length === 0) && (
          <div style={{ padding: "18px 24px", fontSize: 13, color: PALETTE.inkSoft, lineHeight: 1.5 }}>
            No open jobs here in the {phaseMeta(curPhase).label} phase.{totalFuture ? " More appear as the incident advances." : ""}
          </div>
        )}
        {sections.map((s) => (
          s.visible.length === 0 ? null : (
            <div key={s.role}>
              {view === "phase" && (
                <div style={{ padding: "10px 24px 4px", display: "flex", alignItems: "center", gap: 8, background: PALETTE.bone }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: PALETTE.teal }}>{s.role}</span>
                  <span style={{ fontSize: 11.5, color: PALETTE.inkSoft }}>{s.person && s.person.staff && s.person.staff !== "—" ? s.person.staff : "unassigned"}</span>
                  {awaitingAck.has(s.role) && <span className="mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: PALETTE.paper, background: PALETTE.rust, padding: "2px 6px", display: "inline-flex", alignItems: "center", gap: 4 }}><Scale size={10} /> DECISION TO ACK</span>}
                </div>
              )}
              {s.visible.map((t, i, arr) => {
                const oname = taskOwnerName(incident, t);
                return (
                  <TaskRow key={t.id} task={t} now={now} onToggle={() => toggleTask(t.id)} isLast={i === arr.length - 1} disabled={isClosed} onOverride={() => overrideLock(t.id)} onFlagRisk={() => flagTaskAsRisk(t)}
                    ownerName={oname} ownerCode={oname ? disambiguatedInitials(oname, ownerNames) : t.owner} />
                );
              })}
            </div>
          )
        ))}
      </div>

      {(totalFuture > 0 || totalDone > 0) && (
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", padding: "11px 24px", borderTop: `1px solid rgba(0,48,94,0.1)` }}>
          {totalFuture > 0 && <button onClick={() => setShowFuture((v) => !v)} style={{ background: "none", border: "none", padding: 0, fontSize: 11.5, color: PALETTE.teal, cursor: "pointer", fontWeight: 500 }}>{showFuture ? "Hide later-phase jobs" : `Show ${totalFuture} upcoming (later phases)`}</button>}
          {totalDone > 0 && <button onClick={() => setShowDone((v) => !v)} style={{ background: "none", border: "none", padding: 0, fontSize: 11.5, color: PALETTE.inkSoft, cursor: "pointer", fontWeight: 500 }}>{showDone ? "Hide completed" : `Show ${totalDone} completed`}</button>}
        </div>
      )}
      {!isClosed && <TaskAdder onAdd={addTask} />}
    </div>
  );
}

// Short role label for compact chips.
function shortRole(role) {
  return role.replace("Coordinator", "Coord.").replace("Recovery – ", "Rec. ").replace("Student Wellbeing Services", "Wellbeing");
}

function TimelineEntry({ entry, now, isLast, editable, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(entry.text);
  const cfg = {
    system: { color: PALETTE.teal, icon: Shield, label: "SYSTEM" },
    action: { color: PALETTE.sage, icon: CheckCircle2, label: "ACTION" },
    note: { color: PALETTE.ink, icon: Edit3, label: "NOTE" },
    comm: { color: PALETTE.amber, icon: Mail, label: "COMM" },
    decision: { color: PALETTE.crimson, icon: Scale, label: "DECISION" },
    risk: { color: PALETTE.rust, icon: AlertTriangle, label: "RISK" },
  }[entry.type] || { color: PALETTE.ink, icon: Circle, label: "ENTRY" };
  const deleted = !!entry.deleted;

  return (
    <div className="fade-in" style={{ display: "flex", gap: 14, paddingBottom: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 26, height: 26, background: PALETTE.paper, border: `1.5px solid ${deleted ? "rgba(0,48,94,0.25)" : cfg.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: "50%", opacity: deleted ? 0.5 : 1 }}>
          <cfg.icon size={12} color={deleted ? PALETTE.inkSoft : cfg.color} strokeWidth={2} />
        </div>
        {!isLast && <div style={{ width: 1, flex: 1, background: "rgba(0, 48, 94, 0.15)", marginTop: 4, minHeight: 24 }} />}
      </div>
      <div style={{ flex: 1, paddingTop: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: deleted ? PALETTE.inkSoft : cfg.color, fontWeight: 500 }}>{cfg.label}</span>
          <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>{formatTime(entry.ts)} · {formatRelative(entry.ts, now)}</span>
          <span style={{ fontSize: 11, color: PALETTE.inkSoft }}>by {entry.actor}</span>
          {entry.edited && !deleted && <span className="mono" style={{ fontSize: 9, color: PALETTE.inkSoft, fontStyle: "italic" }}>· edited</span>}
          {!deleted && editable && !editing && (
            <span style={{ display: "inline-flex", gap: 8, marginLeft: "auto" }}>
              <button onClick={() => { setDraft(entry.text); setEditing(true); }} title="Edit" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: PALETTE.inkSoft, display: "flex" }}><Edit3 size={12} /></button>
              <button onClick={onDelete} title="Remove" style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: PALETTE.inkSoft, display: "flex" }}><Trash2 size={12} /></button>
            </span>
          )}
        </div>
        {deleted ? (
          <p style={{ fontSize: 13, lineHeight: 1.55, color: PALETTE.inkSoft, fontStyle: "italic", textDecoration: "line-through", margin: 0 }}>{entry.text} <span style={{ fontStyle: "normal", textDecoration: "none" }}>— entry removed</span></p>
        ) : editing ? (
          <div>
            <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} style={{ width: "100%", fontSize: 13, lineHeight: 1.5, resize: "vertical", boxSizing: "border-box" }} />
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <button onClick={() => { onEdit(draft); setEditing(false); }} className="btn btn-primary" style={{ padding: "5px 12px", fontSize: 12 }}>Save</button>
              <button onClick={() => setEditing(false)} className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12, background: "none", border: "none" }}>Cancel</button>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: 14, lineHeight: 1.55, color: PALETTE.ink, margin: 0 }}>{entry.text}</p>
        )}
      </div>
    </div>
  );
}

function Composer({ composerType, setComposerType, onSubmit }) {
  const [text, setText] = useState("");
  return (
    <div style={{ borderTop: `1px solid rgba(0, 48, 94, 0.12)`, padding: 18 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[
          { v: "note", label: "Note", icon: Edit3 },
          { v: "action", label: "Action taken", icon: CheckCircle2 },
          { v: "comm", label: "Communication", icon: Mail },
        ].map((t) => (
          <button key={t.v} onClick={() => setComposerType(t.v)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 10px", fontSize: 11, fontWeight: 500,
            border: `1px solid ${composerType === t.v ? PALETTE.teal : "rgba(0, 48, 94, 0.15)"}`,
            background: composerType === t.v ? PALETTE.teal : PALETTE.paper,
            color: composerType === t.v ? PALETTE.paper : PALETTE.ink,
          }}>
            <t.icon size={11} /> {t.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { onSubmit(text); setText(""); } }}
          rows={2}
          placeholder={`Add a ${composerType}…   ⌘+Enter to post`}
          style={{ resize: "none", flex: 1, fontSize: 13, lineHeight: 1.5 }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <button className="btn" style={{ padding: "7px 10px" }} title="Voice-to-text"><Mic size={12} /></button>
          <button className="btn" style={{ padding: "7px 10px" }} title="Attach"><Paperclip size={12} /></button>
        </div>
        <button onClick={() => { onSubmit(text); setText(""); }} className="btn btn-primary" style={{ padding: "9px 14px" }}>
          <Send size={12} /> Post
        </button>
      </div>
    </div>
  );
}

function sortTasks(tasks, now) {
  // Active tasks first, sorted by overdue → soonest dueAt → no dueAt. Then completed.
  const active = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  active.sort((a, b) => {
    const aOver = a.dueAt && a.dueAt < now ? 1 : 0;
    const bOver = b.dueAt && b.dueAt < now ? 1 : 0;
    if (aOver !== bOver) return bOver - aOver;
    if (a.dueAt && b.dueAt) return a.dueAt - b.dueAt;
    if (a.dueAt) return -1;
    if (b.dueAt) return 1;
    return 0;
  });
  return [...active, ...done];
}

function formatDue(dueAt, now) {
  const d = new Date(dueAt);
  const sameDay = new Date(now).toDateString() === d.toDateString();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  if (sameDay) return `${hh}:${mm}`;
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" }) + ` ${hh}:${mm}`;
}

function RespFlags({ r }) {
  if (!r || (!r.approval && !r.mandatory)) return null;
  return (
    <>
      {r.approval && <span className="mono" title="Requires Principal approval before acting" style={{ fontSize: 8, letterSpacing: "0.08em", fontWeight: 700, color: PALETTE.crimson, border: `1px solid ${PALETTE.crimson}`, padding: "0px 4px", marginLeft: 4, whiteSpace: "nowrap" }}>APPROVAL</span>}
      {r.mandatory && <span className="mono" title="Mandatory notification / report" style={{ fontSize: 8, letterSpacing: "0.08em", fontWeight: 700, color: PALETTE.rust, border: `1px solid ${PALETTE.rust}`, padding: "0px 4px", marginLeft: 4, whiteSpace: "nowrap" }}>NOTIFY</span>}
    </>
  );
}

function TaskRow({ task, now, onToggle, isLast, disabled, onOverride, onFlagRisk, ownerName, ownerCode }) {
  const p = { high: { color: PALETTE.rust, label: "HIGH" }, med: { color: PALETTE.amber, label: "MED" }, low: { color: PALETTE.sage, label: "LOW" } }[task.priority];
  const overdue = !task.done && task.dueAt && task.dueAt < now;
  const locked = task.locked && !task.done;
  return (
    <div style={{
      padding: "12px 18px",
      borderBottom: isLast ? "none" : `1px solid rgba(0, 48, 94, 0.08)`,
      display: "flex", alignItems: "flex-start", gap: 12,
      opacity: task.done ? 0.55 : locked ? 0.7 : 1,
      background: overdue ? "rgba(160, 32, 41, 0.06)" : locked ? "rgba(184, 148, 96, 0.07)" : "transparent",
      borderLeft: overdue ? `3px solid ${PALETTE.crimson}` : locked ? `3px solid ${PALETTE.amber}` : "3px solid transparent",
    }}>
      <button onClick={onToggle} disabled={disabled || locked} title={locked ? "Locked — an earlier step must be done first" : undefined} style={{
        width: 18, height: 18, marginTop: 1,
        border: `1.5px solid ${task.done ? PALETTE.sage : locked ? PALETTE.amber : PALETTE.teal}`,
        background: task.done ? PALETTE.sage : "transparent",
        padding: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        cursor: (disabled || locked) ? "not-allowed" : "pointer",
      }}>
        {task.done && <CheckCircle2 size={12} color={PALETTE.paper} strokeWidth={3} />}
        {locked && <Lock size={10} color={PALETTE.amber} />}
      </button>
      <span style={{ flex: 1, fontSize: 14, color: PALETTE.ink, textDecoration: task.done ? "line-through" : "none" }}>
        {task.text} <RespFlags r={task} />
        {locked && (
          <span style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontSize: 11.5, color: PALETTE.inkSoft }}>
            <Lock size={10} /> Waiting on: <em style={{ fontStyle: "normal", color: PALETTE.rust }}>{task.blockedBy}</em>
            {onOverride && !disabled && (
              <button onClick={onOverride} style={{ background: "none", border: `1px solid rgba(0,48,94,0.2)`, padding: "1px 7px", fontSize: 10.5, color: PALETTE.teal, cursor: "pointer", fontWeight: 500 }}>Override</button>
            )}
          </span>
        )}
      </span>
      {task.dueAt && (
        <span
          className="mono"
          title={overdue ? "Overdue" : "Due"}
          style={{
            fontSize: 10,
            letterSpacing: "0.1em",
            padding: "2px 7px",
            background: overdue ? PALETTE.crimson : "rgba(0, 48, 94, 0.08)",
            color: overdue ? PALETTE.paper : PALETTE.teal,
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <Clock size={9} /> {overdue ? "OVERDUE " : ""}{formatDue(task.dueAt, now)}
        </span>
      )}
      {!task.done && onFlagRisk && !disabled && (
        task.riskId
          ? <span title="On the risk register" className="mono" style={{ fontSize: 8.5, letterSpacing: "0.06em", color: PALETTE.rust, alignSelf: "center" }}>RISK</span>
          : <button onClick={onFlagRisk} title="Flag as a risk" style={{ background: "none", border: "none", padding: 2, cursor: "pointer", color: PALETTE.inkSoft, alignSelf: "center", display: "flex" }}><AlertTriangle size={12} /></button>
      )}
      <span className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: p.color, fontWeight: 500 }}>{p.label}</span>
      <div title={ownerName || undefined} style={{ minWidth: 24, height: 24, padding: "0 5px", background: "rgba(0, 48, 94, 0.1)", color: PALETTE.teal, fontSize: 9, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 12 }}>{ownerCode || task.owner}</div>
    </div>
  );
}

// A loud, unmistakable banner for the phase the incident is currently in —
// with a 6-step progress rail — so it's obvious which actions are live now.
function ActivePhaseBanner({ curPhase, curIdx, openCount }) {
  const meta = phaseMeta(curPhase);
  return (
    <div style={{ padding: "12px 24px 8px", background: PALETTE.parchment, borderBottom: `1px solid rgba(0,48,94,0.08)` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span className="mono" style={{ fontSize: 9.5, letterSpacing: "0.14em", color: PALETTE.paper, background: PALETTE.rust, padding: "3px 8px", fontWeight: 600 }}>
          PHASE {curIdx + 1} OF {CIMT_PHASES.length}
        </span>
        <span className="display" style={{ fontSize: 18, fontWeight: 600, color: PALETTE.teal, letterSpacing: "-0.01em" }}>{meta.label}</span>
        {openCount > 0 && <span style={{ fontSize: 12, color: PALETTE.inkSoft }}>· {openCount} open now</span>}
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
        {CIMT_PHASES.map((p, i) => (
          <div key={p.id} title={p.label} style={{ flex: 1, height: 4, background: i < curIdx ? PALETTE.sage : i === curIdx ? PALETTE.rust : "rgba(0,48,94,0.14)" }} />
        ))}
      </div>
      <p style={{ fontSize: 11.5, color: PALETTE.inkSoft, lineHeight: 1.5, margin: "7px 0 0" }}>{meta.blurb}</p>
    </div>
  );
}

function TaskAdder({ onAdd }) {
  const [text, setText] = useState("");
  const [dueMins, setDueMins] = useState(""); // "" | "15" | "30" | "60" | "120" | "eod"

  function computeDueAt() {
    if (!dueMins) return null;
    if (dueMins === "eod") {
      const d = new Date();
      d.setHours(17, 0, 0, 0); // 5pm = end of school day
      if (d.getTime() < Date.now()) d.setDate(d.getDate() + 1);
      return d.getTime();
    }
    return Date.now() + parseInt(dueMins, 10) * 60 * 1000;
  }

  function submit() {
    onAdd(text, computeDueAt());
    setText("");
    setDueMins("");
  }

  return (
    <div style={{ padding: "12px 18px", borderTop: `1px solid rgba(0, 48, 94, 0.08)`, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
        placeholder="Add a task…"
        style={{ fontSize: 13, padding: "8px 10px", flex: 1, minWidth: 180 }}
      />
      <div style={{ display: "flex", gap: 2, border: `1px solid rgba(0, 48, 94, 0.18)`, background: PALETTE.paper }}>
        {[
          { v: "", l: "—" },
          { v: "15", l: "15m" },
          { v: "30", l: "30m" },
          { v: "60", l: "1h" },
          { v: "120", l: "2h" },
          { v: "eod", l: "EOD" },
        ].map((o) => (
          <button
            key={o.v}
            onClick={() => setDueMins(o.v)}
            title={o.v ? `Due in ${o.l}` : "No due time"}
            style={{
              padding: "6px 8px",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.06em",
              background: dueMins === o.v ? PALETTE.teal : "transparent",
              color: dueMins === o.v ? PALETTE.paper : PALETTE.teal,
              border: "none",
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
            }}
          >
            {o.l}
          </button>
        ))}
      </div>
      <button onClick={submit} className="btn" style={{ padding: "8px 12px" }}>
        <Plus size={13} />
      </button>
    </div>
  );
}

/* ---------- Right rail ---------- */
function RightRail({ incident, setDrawer }) {
  const sev = SEVERITY[incident.severity];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="card" style={{ borderLeft: `3px solid ${sev.color}` }}>
        <div className="panel-h">
          <span className="panel-h-label">CURRENT SEVERITY</span>
          <span className="panel-h-meta">DEPT-ALIGNED</span>
        </div>
        <div style={{ padding: "18px" }}>
          <div className="display" style={{ fontSize: 28, color: sev.color, fontWeight: 500, lineHeight: 1, letterSpacing: "-0.015em" }}>
            {sev.label}
          </div>
          <p style={{ fontSize: 12, lineHeight: 1.5, color: PALETTE.inkSoft, margin: "10px 0 0" }}>{sev.tone}.</p>
        </div>
      </div>

      <RiskSummaryPanel incident={incident} setDrawer={setDrawer} />

      {incident.student && (
        <div className="card">
          <div className="panel-h">
            <span className="panel-h-label">STUDENT · {incident.student.initials}</span>
            <button onClick={() => setDrawer("student")} className="btn-ghost panel-h-meta" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontWeight: 500 }}>
              FULL CARD →
            </button>
          </div>
          <div style={{ padding: 18 }}>
            <div style={{ fontSize: 12, color: PALETTE.inkSoft, marginBottom: 10 }}>{incident.student.yearLevel}</div>
            {incident.student.medicalAlerts?.map((a) => (
              <div key={a} style={{ display: "flex", gap: 8, alignItems: "center", padding: "6px 10px", background: "rgba(184, 92, 60, 0.08)", marginBottom: 6, fontSize: 12 }}>
                <AlertTriangle size={12} color={PALETTE.rust} /> {a}
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 6 }}>EMERGENCY CONTACTS</div>
              {incident.student.emergencyContacts?.map((c) => (
                <div key={c.name} style={{ fontSize: 12, color: PALETTE.ink, padding: "4px 0", display: "flex", justifyContent: "space-between" }}>
                  <span>{c.relation}</span>
                  <span className="mono" style={{ color: PALETTE.teal }}>{c.phone}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="panel-h">
          <span className="panel-h-label">EMP & POLICY</span>
          <button onClick={() => setDrawer("policy")} className="btn-ghost panel-h-meta" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontWeight: 500 }}>
            ALL →
          </button>
        </div>
        <div>
          {(incident.policies || []).map((p, i) => (
            <div key={p.id} onClick={() => setDrawer("policy")} className="row-hover" style={{
              padding: "12px 18px",
              borderBottom: i < incident.policies.length - 1 ? `1px solid rgba(0, 48, 94, 0.08)` : "none",
              display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer",
            }}>
              {p.type === "emp" ? <Shield size={14} color={PALETTE.teal} style={{ marginTop: 2, flexShrink: 0 }} /> : <FileText size={14} color={PALETTE.teal} style={{ marginTop: 2, flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: PALETTE.ink, fontWeight: 500 }}>{p.name}</div>
                <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 2, letterSpacing: "0.06em" }}>{p.section} · {p.type.toUpperCase()}</div>
              </div>
              <ChevronRight size={14} color={PALETTE.teal} style={{ opacity: 0.5, marginTop: 2 }} />
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ background: PALETTE.tealDeep, color: PALETTE.paper, border: `1px solid ${PALETTE.tealDeep}` }}>
        <div style={{ padding: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Heart size={14} color={PALETTE.sage} />
            <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage }}>STAFF WELLBEING</span>
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.5, margin: 0, opacity: 0.9 }}>
            After this incident closes, all assigned staff will receive a structured reflection prompt and counsellor referral options.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Drawers ---------- */
function Drawer({ children, onClose, title }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0, 30, 61, 0.4)", display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} className="slide-in" style={{ width: 520, maxWidth: "100vw", height: "100vh", background: PALETTE.paper, borderLeft: `1px solid rgba(0, 48, 94, 0.2)`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid rgba(0, 48, 94, 0.14)` }}>
          {/* Clear, labelled return to the incident (Annika: hard to get back from
              a section like Communications). Kept on every drawer. */}
          <button onClick={onClose} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginBottom: 10, opacity: 0.85 }}>
            <ArrowLeft size={13} /> Back to incident
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="display" style={{ fontSize: 22, color: PALETTE.teal, fontWeight: 500, letterSpacing: "-0.015em" }}>{title}</div>
            <button onClick={onClose} className="btn-ghost" style={{ background: "none", border: "none", color: PALETTE.ink, padding: 6 }}><X size={18} /></button>
          </div>
        </div>
        <div className="scroll-y" style={{ flex: 1, padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

function RoleAssignDrawer({ incident, roleId, update, addTimelineEntry, isClosed, onClose }) {
  const role = incident.roles.find((r) => r.id === roleId);
  const def = role ? ROLE_DEFINITIONS[role.role] : null;
  const responsibilities = role ? responsibilitiesFor(role.role, incident.type) : null;
  const [showStaffPicker, setShowStaffPicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("primary"); // "primary" | "backup"

  if (!role) {
    return <p style={{ fontSize: 14, color: PALETTE.inkSoft }}>Role not found.</p>;
  }

  const allStaff = listStaff();
  const qualifiedStaff = allStaff.filter((s) => s.qualifiedFor?.includes(role.role));
  const otherStaff = allStaff.filter((s) => !s.qualifiedFor?.includes(role.role));

  function assignStaff(staffMember, mode) {
    const isPrimary = mode === "primary";
    const oldStaff = role.staff;
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.id === roleId
          ? isPrimary
            ? {
                ...r,
                staff: staffMember.name,
                initials: staffMember.initials,
                status: "confirmed",
                suggestedStaffId: staffMember.id,
                suggested: undefined,
              }
            : { ...r, backup: staffMember.name, backupStaffId: staffMember.id }
          : r
      ),
    }));
    if (isPrimary) {
      addTimelineEntry({
        type: "system",
        text: oldStaff && oldStaff !== "—"
          ? `${role.role}: ${staffMember.name} re-assigned (was ${oldStaff}).`
          : `${role.role}: ${staffMember.name} assigned.`,
      });
    } else {
      addTimelineEntry({ type: "system", text: `${role.role}: ${staffMember.name} set as backup.` });
    }
    setShowStaffPicker(false);
  }

  function replaceWithAlternate(alt) {
    const oldStaff = role.staff;
    const wasActivated = !!incident.activation;
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.id === roleId
          ? {
              ...r,
              staff: alt.name,
              initials: alt.initials,
              status: "confirmed",
              suggestedStaffId: alt.id,
              suggested: undefined,
              // If the incident is activated, the new holder needs notifying.
              notify: wasActivated ? { status: "sent", sentAt: Date.now(), viaBackup: false } : r.notify,
            }
          : r
      ),
    }));
    addTimelineEntry({
      type: "system",
      text: `${role.role}: ${oldStaff} replaced by ${alt.name}${wasActivated ? " — re-notified" : ""}.`,
    });
  }

  function clearAssignment() {
    if (!confirm(`Remove ${role.staff} from ${role.role}?`)) return;
    const oldStaff = role.staff;
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.id === roleId ? { ...r, staff: "—", initials: "—", status: "unassigned" } : r
      ),
    }));
    addTimelineEntry({ type: "system", text: `${role.role}: ${oldStaff} removed.` });
  }

  function clearBackup() {
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.id === roleId ? { ...r, backup: undefined, backupStaffId: undefined } : r
      ),
    }));
    addTimelineEntry({ type: "system", text: `${role.role}: backup cleared.` });
  }

  function promoteBackup() {
    if (!role.backup) return;
    const oldStaff = role.staff;
    const initials = role.backup.split(/\s+/).map((s) => s[0]).join("").toUpperCase().slice(0, 3);
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((r) =>
        r.id === roleId
          ? {
              ...r,
              staff: role.backup,
              initials,
              status: "confirmed",
              backup: undefined,
              backupStaffId: undefined,
            }
          : r
      ),
    }));
    addTimelineEntry({
      type: "system",
      text: `${role.role}: ${role.backup} promoted from backup to primary (was ${oldStaff}).`,
    });
  }

  if (showStaffPicker) {
    return (
      <div className="fade-in">
        <button
          onClick={() => setShowStaffPicker(false)}
          className="btn-ghost"
          style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}
        >
          <ArrowLeft size={13} /> Back
        </button>
        <h3 className="display" style={{ fontSize: 22, color: PALETTE.teal, fontWeight: 500, margin: "0 0 6px" }}>
          Pick {pickerMode === "primary" ? "primary" : "backup"} for {role.role}
        </h3>
        <p style={{ fontSize: 12, color: PALETTE.inkSoft, marginBottom: 20, lineHeight: 1.5 }}>
          {qualifiedStaff.length > 0
            ? "Qualified staff are listed first. You can also pick someone not formally qualified if needed."
            : "No staff are qualified for this role yet. Add qualifications in Admin → Staff Directory."}
        </p>

        {qualifiedStaff.length > 0 && (
          <>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 8 }}>
              QUALIFIED
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              {qualifiedStaff.map((s) => (
                <StaffPickerRow key={s.id} staff={s} onPick={() => assignStaff(s, pickerMode)} />
              ))}
            </div>
          </>
        )}

        {otherStaff.length > 0 && (
          <>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.inkSoft, marginBottom: 8 }}>
              OTHER STAFF
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {otherStaff.map((s) => (
                <StaffPickerRow key={s.id} staff={s} onPick={() => assignStaff(s, pickerMode)} notQualified />
              ))}
            </div>
          </>
        )}

        {allStaff.length === 0 && (
          <div style={{ padding: 24, background: PALETTE.bone, textAlign: "center", color: PALETTE.inkSoft, fontSize: 13 }}>
            No staff in directory yet. Go to Admin → Staff Directory to add staff.
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Role header */}
      <div style={{ padding: "20px", background: PALETTE.bone, marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 6 }}>
          ROLE
        </div>
        <h2 className="display" style={{ fontSize: 26, color: PALETTE.teal, fontWeight: 500, margin: 0, letterSpacing: "-0.015em" }}>
          {role.role}
        </h2>
        {def && (
          <p style={{ fontSize: 13, color: PALETTE.ink, marginTop: 8, lineHeight: 1.5, marginBottom: 0 }}>
            {def.description}
          </p>
        )}
        {def && (
          <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: PALETTE.inkSoft, flexWrap: "wrap" }}>
            <span><strong style={{ color: PALETTE.teal }}>Reports to:</strong> {def.reportsTo}</span>
          </div>
        )}
      </div>

      {/* Primary assignment */}
      <Section title="Primary">
        {role.staff && role.staff !== "—" ? (
          <div style={{ padding: "14px 16px", border: `1px solid rgba(0, 48, 94, 0.18)`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: role.isPrincipal ? PALETTE.teal : PALETTE.sage,
              color: PALETTE.paper, fontSize: 12, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>{role.initials}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: PALETTE.ink }}>{role.staff}</div>
              <div style={{ fontSize: 11, color: PALETTE.sage, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                <CheckCircle2 size={10} /> Confirmed
              </div>
            </div>
            {!isClosed && (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => { setPickerMode("primary"); setShowStaffPicker(true); }} className="btn" style={{ padding: "6px 10px", fontSize: 11 }}>
                  Change
                </button>
                <button onClick={clearAssignment} className="btn-ghost" style={{ background: "none", border: "none", padding: 6, color: PALETTE.inkSoft }} title="Remove">
                  <X size={13} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => { setPickerMode("primary"); setShowStaffPicker(true); }}
            className="btn"
            disabled={isClosed}
            style={{ width: "100%", padding: 14, justifyContent: "center", borderStyle: "dashed", color: PALETTE.teal }}
          >
            <UserPlus size={14} /> Assign primary staff
          </button>
        )}
      </Section>

      {/* Dynamic role replacement — recommended alternate */}
      {!isClosed && role.staff && role.staff !== "—" && (() => {
        const alt = recommendAlternate(incident, roleId);
        if (!alt) return null;
        return (
          <div style={{ border: `1px solid ${alt.conflict ? "rgba(168,85,53,0.4)" : "rgba(0,48,94,0.16)"}`, borderLeft: `3px solid ${alt.conflict ? PALETTE.rust : PALETTE.sage}`, padding: "12px 14px", marginBottom: 20, background: PALETTE.parchment }}>
            <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 8 }}>IF UNAVAILABLE · RECOMMENDED ALTERNATE</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: alt.conflict ? PALETTE.rust : PALETTE.sage, color: PALETTE.paper, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{alt.staff.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: PALETTE.ink }}>{alt.staff.name}</div>
                <div style={{ fontSize: 11, color: alt.conflict ? PALETTE.rust : PALETTE.inkSoft, marginTop: 2 }}>{alt.reason}</div>
              </div>
            </div>
            <button onClick={() => replaceWithAlternate(alt.staff)} className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 10, fontSize: 12.5, borderColor: PALETTE.teal, color: PALETTE.teal }}>
              <UserCheck size={14} /> Replace{incident.activation ? " & re-notify" : ""}
            </button>
          </div>
        );
      })()}

      {/* Backup */}
      <Section title="Backup">
        {role.backup ? (
          <div style={{ padding: "14px 16px", border: `1px solid rgba(0, 48, 94, 0.18)`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0, 48, 94, 0.1)",
              color: PALETTE.teal, fontSize: 11, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>{role.backup.split(/\s+/).map((s) => s[0]).join("").toUpperCase().slice(0, 3)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: PALETTE.ink }}>{role.backup}</div>
              <div style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 2 }}>Standing by</div>
            </div>
            {!isClosed && (
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={promoteBackup} className="btn" style={{ padding: "6px 10px", fontSize: 11 }} title="Promote to primary">
                  Promote
                </button>
                <button onClick={clearBackup} className="btn-ghost" style={{ background: "none", border: "none", padding: 6, color: PALETTE.inkSoft }} title="Clear backup">
                  <X size={13} />
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => { setPickerMode("backup"); setShowStaffPicker(true); }}
            className="btn"
            disabled={isClosed}
            style={{ width: "100%", padding: 12, justifyContent: "center", borderStyle: "dashed", color: PALETTE.teal, fontSize: 12 }}
          >
            <UserPlus size={13} /> Assign backup
          </button>
        )}
      </Section>

      {/* Responsibilities for THIS role + incident type */}
      {responsibilities && responsibilities.length > 0 && (
        <Section title={`Responsibilities — ${incident.typeLabel}`}>
          <div style={{ padding: "14px 16px", background: PALETTE.bone, borderLeft: `3px solid ${PALETTE.teal}` }}>
            <p style={{ fontSize: 11, color: PALETTE.inkSoft, margin: "0 0 12px", lineHeight: 1.5 }}>
              What {role.role} should do during this specific incident type:
            </p>
            <ol style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {responsibilities.map((r, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    gap: 12,
                    padding: "10px 0",
                    borderBottom: i < responsibilities.length - 1 ? `1px solid rgba(0, 48, 94, 0.1)` : "none",
                    fontSize: 13,
                    color: PALETTE.ink,
                    lineHeight: 1.5,
                  }}
                >
                  <span className="mono" style={{ color: PALETTE.teal, fontSize: 11, fontWeight: 500, minWidth: 20, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ flex: 1 }}>{r.text} <RespFlags r={r} /></span>
                </li>
              ))}
            </ol>
          </div>
        </Section>
      )}

      {!responsibilities && (
        <Section title="Responsibilities">
          <p style={{ fontSize: 12, color: PALETTE.inkSoft, fontStyle: "italic", margin: 0 }}>
            No specific responsibilities defined for {role.role} in {incident.typeLabel} incidents. Refer to general role description above.
          </p>
        </Section>
      )}
    </div>
  );
}

function StaffPickerRow({ staff, onPick, notQualified }) {
  return (
    <button
      onClick={onPick}
      disabled={!staff.available}
      style={{
        textAlign: "left",
        background: PALETTE.paper,
        border: `1px solid rgba(0, 48, 94, 0.18)`,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        cursor: staff.available ? "pointer" : "not-allowed",
        opacity: staff.available ? 1 : 0.5,
      }}
    >
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        background: staff.available ? PALETTE.teal : PALETTE.inkSoft,
        color: PALETTE.paper, fontSize: 11, fontWeight: 600,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>{staff.initials}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: PALETTE.ink, fontWeight: 500 }}>{staff.name}</div>
        <div style={{ fontSize: 11, color: PALETTE.inkSoft, marginTop: 2 }}>
          {staff.role || "—"}
          {!staff.available && " · Off duty"}
          {notQualified && staff.available && " · Not formally qualified"}
        </div>
      </div>
      <ChevronRight size={14} color={PALETTE.teal} style={{ opacity: 0.5 }} />
    </button>
  );
}

function StudentDrawer({ student }) {
  return (
    <div>
      <div style={{ padding: "20px", background: PALETTE.bone, marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 6 }}>READ-ONLY · NOT A FULL SMS</div>
        <div className="display" style={{ fontSize: 32, color: PALETTE.teal, fontWeight: 500 }}>{student.initials}</div>
        <div style={{ fontSize: 14, color: PALETTE.inkSoft, marginTop: 4 }}>{student.yearLevel}</div>
      </div>
      <Section title="Medical Alerts">
        {student.medicalAlerts?.map((a) => (
          <div key={a} style={{ display: "flex", gap: 10, padding: "10px 12px", background: "rgba(184, 92, 60, 0.08)", marginBottom: 6, fontSize: 13, color: PALETTE.ink }}>
            <AlertTriangle size={14} color={PALETTE.rust} style={{ flexShrink: 0, marginTop: 1 }} /> {a}
          </div>
        ))}
      </Section>
      <Section title="Behaviour Plan"><p style={{ fontSize: 13, color: PALETTE.ink, lineHeight: 1.6, margin: 0 }}>{student.behaviourPlan}</p></Section>
      <Section title="Emergency Contacts">
        {student.emergencyContacts?.map((c) => (
          <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: `1px solid rgba(0, 48, 94, 0.12)`, marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 13, color: PALETTE.ink, fontWeight: 500 }}>{c.relation}</div>
              <div className="mono" style={{ fontSize: 11, color: PALETTE.inkSoft, marginTop: 2 }}>{c.phone}</div>
            </div>
            <button className="btn btn-primary" style={{ padding: "6px 10px", fontSize: 11 }}><Phone size={11} /> Call</button>
          </div>
        ))}
      </Section>
      <Section title="Known Risks"><p style={{ fontSize: 13, color: PALETTE.ink, lineHeight: 1.6, margin: 0 }}>{student.knownRisks}</p></Section>
      <Section title="Support Notes"><p style={{ fontSize: 13, color: PALETTE.ink, lineHeight: 1.6, margin: 0 }}>{student.supportNotes}</p></Section>
    </div>
  );
}

function PolicyDrawer({ incident }) {
  const [expanded, setExpanded] = useState(0);
  return (
    <div>
      <div style={{ padding: 14, background: PALETTE.bone, marginBottom: 20, fontSize: 12, color: PALETTE.inkSoft, lineHeight: 1.5 }}>
        AI has identified the following sections from your school's EMP and policy library as relevant to this incident type.
      </div>
      {(incident.policies || []).map((p, i) => (
        <div key={p.id} style={{ border: `1px solid rgba(0, 48, 94, 0.14)`, marginBottom: 10 }}>
          <button onClick={() => setExpanded(expanded === i ? -1 : i)} style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, background: PALETTE.paper, border: "none", textAlign: "left" }}>
            {p.type === "emp" ? <Shield size={14} color={PALETTE.teal} /> : <FileText size={14} color={PALETTE.teal} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PALETTE.ink }}>{p.name}</div>
              <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 2 }}>{p.section} · {p.type.toUpperCase()}</div>
            </div>
            {expanded === i ? <ChevronUp size={14} color={PALETTE.teal} /> : <ChevronDown size={14} color={PALETTE.teal} />}
          </button>
          {expanded === i && (
            <div style={{ padding: "0 16px 16px", borderTop: `1px solid rgba(0, 48, 94, 0.08)` }}>
              <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.sage, margin: "12px 0 8px" }}>SUMMARY</div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: PALETTE.ink, margin: 0 }}>
                For this incident type, the responsible staff member must follow the procedures outlined in {p.section}. Documentation, escalation thresholds, and family communication requirements are detailed in the linked source.
              </p>
              <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.sage, margin: "16px 0 8px" }}>REQUIRED ACTIONS</div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", fontSize: 13, color: PALETTE.ink }}>
                {["Follow procedural steps", "Document outcomes", "Notify head office if threshold met", "Review at debrief"].map((x) => (
                  <li key={x} style={{ display: "flex", gap: 8, padding: "5px 0" }}>
                    <CheckCircle2 size={13} color={PALETTE.sage} style={{ marginTop: 2, flexShrink: 0 }} /> {x}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Blind Spots drawer (CORE · decision support) ---------- */
const COPILOT_TARGET_LABEL = {
  comms: "Communications", activation: "Activation", decisions: "Decision Log", risks: "Risk register", pir: "Post-incident review",
};

function CopilotDrawer({ incident, addTimelineEntry, setDrawer, now }) {
  const findings = runCopilot(incident, now);
  const crit = findings.filter((f) => f.severity === "critical").length;
  const imp = findings.filter((f) => f.severity === "important").length;
  const adv = findings.filter((f) => f.severity === "advisory").length;

  function logReview() {
    addTimelineEntry({ type: "system", text: `Blind Spots review — ${findings.length} finding(s)${findings.length ? ` (${crit} critical, ${imp} important, ${adv} advisory)` : ""}.` });
  }

  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.amber, marginBottom: 6 }}>BLIND SPOTS · WHAT MIGHT BE MISSED</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>Have we forgotten anything?</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>
          Suggestions only. This check highlights what may have been overlooked against the response pattern for this incident — it never decides, instructs, or acts.
        </p>
      </div>

      {/* Summary + log */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 10 }}>
          {[["critical", crit], ["important", imp], ["advisory", adv]].map(([k, n]) => (
            <span key={k} className="mono" style={{ fontSize: 10, letterSpacing: "0.06em", color: n ? COPILOT_SEVERITY[k].color : PALETTE.inkSoft, fontWeight: n ? 700 : 400 }}>
              {n} {COPILOT_SEVERITY[k].label.toUpperCase()}
            </span>
          ))}
        </div>
        <button onClick={logReview} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, fontSize: 11, color: PALETTE.teal, fontWeight: 500 }}>Log review →</button>
      </div>

      {findings.length === 0 ? (
        <div style={{ border: `1px solid rgba(91,140,124,0.4)`, background: PALETTE.sageMist, padding: 20, textAlign: "center" }}>
          <CheckCircle2 size={28} color={PALETTE.sage} style={{ margin: "0 auto" }} />
          <div className="display" style={{ fontSize: 18, color: PALETTE.sage, fontWeight: 500, marginTop: 10 }}>Nothing obvious flagged.</div>
          <p style={{ fontSize: 12.5, color: PALETTE.inkSoft, marginTop: 6, lineHeight: 1.5 }}>
            No gaps detected across communications, command, tasks, risk, activation, and recovery. This is a prompt, not a guarantee — keep your own judgement.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {findings.map((f) => <FindingCard key={f.ruleId} f={f} setDrawer={setDrawer} />)}
        </div>
      )}

      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.08em", color: PALETTE.inkSoft, marginTop: 18, textAlign: "center", opacity: 0.7 }}>
        {COPILOT_RULES.length} RULES EVALUATED · EVERY FINDING TRACES TO A RULE
      </div>
    </div>
  );
}

function FindingCard({ f, setDrawer }) {
  const sv = COPILOT_SEVERITY[f.severity] || COPILOT_SEVERITY.advisory;
  return (
    <div style={{ border: `1px solid rgba(0,48,94,0.14)`, borderLeft: `3px solid ${sv.color}`, background: PALETTE.paper, padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <AlertTriangle size={14} color={sv.color} />
          <span style={{ fontSize: 13.5, fontWeight: 600, color: PALETTE.ink }}>{f.issue}</span>
        </div>
        <span className="chip" style={{ borderColor: sv.color, color: sv.color, flexShrink: 0 }}>{sv.label}</span>
      </div>
      <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.1em", color: PALETTE.inkSoft, marginTop: 6 }}>{f.category.toUpperCase()} · {f.ruleId}</div>

      <div style={{ marginTop: 10 }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: PALETTE.teal, opacity: 0.6, textTransform: "uppercase" }}>Why it matters</div>
        <div style={{ fontSize: 12.5, lineHeight: 1.5, color: PALETTE.ink, marginTop: 2 }}>{f.why}</div>
      </div>
      <div style={{ marginTop: 8 }}>
        <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: PALETTE.teal, opacity: 0.6, textTransform: "uppercase" }}>Evidence</div>
        <div className="mono" style={{ fontSize: 11, lineHeight: 1.45, color: PALETTE.inkSoft, marginTop: 2 }}>{f.evidence}</div>
      </div>

      {f.target ? (
        <button onClick={() => setDrawer(f.target)} className="btn" style={{ marginTop: 10, padding: "6px 10px", fontSize: 11.5 }}>
          Review · {COPILOT_TARGET_LABEL[f.target] || f.target} <ChevronRight size={12} />
        </button>
      ) : (
        <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 10, opacity: 0.8 }}>Review in the roles / tasks panel.</div>
      )}
    </div>
  );
}

/* ---------- Risk / Watch Register (CORE · situational awareness) ---------- */

// Main-screen panel — answers "what risks remain?" without opening a drawer.
function RiskSummaryPanel({ incident, setDrawer }) {
  const open = openRisks(incident);
  const shown = open.slice(0, 5);
  const extra = open.length - shown.length;
  return (
    <div className="card">
      <div className="panel-h">
        <span className="panel-h-label">ACTIVE RISKS · {open.length}</span>
        <button onClick={() => setDrawer("risks")} className="btn-ghost panel-h-meta" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontWeight: 500 }}>
          MANAGE →
        </button>
      </div>
      <div style={{ padding: open.length ? "6px 0" : 18 }}>
        {open.length === 0 ? (
          <p style={{ fontSize: 12, color: PALETTE.inkSoft, margin: 0 }}>No active risks.</p>
        ) : (
          <>
            {shown.map((r) => {
              const sv = RISK_SEVERITY[r.severity] || {};
              return (
                <button key={r.id} onClick={() => setDrawer("risks")} className="row-hover" style={{ width: "100%", textAlign: "left", background: "none", border: "none", borderBottom: `1px solid rgba(0,48,94,0.06)`, padding: "9px 18px", display: "flex", alignItems: "center", gap: 9, cursor: "pointer" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: sv.color, flexShrink: 0 }} title={sv.label} />
                  <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: PALETTE.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.title}</span>
                  {r.status === "escalated" && <span className="mono" style={{ fontSize: 8, letterSpacing: "0.1em", color: PALETTE.crimson, fontWeight: 700 }}>ESC</span>}
                </button>
              );
            })}
            {extra > 0 && (
              <button onClick={() => setDrawer("risks")} style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "8px 18px", fontSize: 11.5, color: PALETTE.teal, cursor: "pointer" }}>
                +{extra} more →
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function RiskRegisterDrawer({ incident, update, addTimelineEntry, isClosed, now }) {
  const risks = incident.risks || [];
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Operational");
  const [severity, setSeverity] = useState("medium");
  const [status, setStatus] = useState("watch");
  const [owner, setOwner] = useState("");
  const [reviewPreset, setReviewPreset] = useState("");

  function computeReviewBy() {
    if (!reviewPreset) return null;
    if (reviewPreset === "eod") { const d = new Date(); d.setHours(17, 0, 0, 0); return d.getTime(); }
    return Date.now() + parseInt(reviewPreset, 10) * 60000;
  }

  function record() {
    if (!title.trim()) return;
    const r = newRisk({ title: title.trim(), description: description.trim(), category, severity, status, owner: owner.trim(), reviewBy: computeReviewBy() });
    update((prev) => ({ ...prev, risks: [r, ...(prev.risks || [])] }));
    addTimelineEntry({ type: "risk", text: `Risk logged (${RISK_SEVERITY[severity].label}): ${r.title}.` });
    setTitle(""); setDescription(""); setCategory("Operational"); setSeverity("medium"); setStatus("watch"); setOwner(""); setReviewPreset("");
  }

  function setRiskStatus(id, next, verb) {
    const r = risks.find((x) => x.id === id);
    update((prev) => ({ ...prev, risks: (prev.risks || []).map((x) => (x.id === id ? { ...x, status: next, updatedAt: Date.now() } : x)) }));
    addTimelineEntry({ type: "risk", text: `Risk ${verb}: ${r.title}.` });
  }

  function resolve(id) {
    const r = risks.find((x) => x.id === id);
    const notes = window.prompt("Resolution notes (optional):") || "";
    update((prev) => ({ ...prev, risks: (prev.risks || []).map((x) => (x.id === id ? { ...x, status: "resolved", resolvedAt: Date.now(), resolutionNotes: notes, updatedAt: Date.now() } : x)) }));
    addTimelineEntry({ type: "risk", text: `Risk resolved: ${r.title}${notes ? ` — ${notes}` : ""}.` });
  }

  // Risk → task: allocate a risk into a role's workflow. The person then
  // acknowledges + sequences it on the board like any job. Kept linked both ways.
  function convertToTask(risk, roleName) {
    const roleObj = (incident.roles || []).find((r) => r.role === roleName);
    const oname = roleObj?.staff && roleObj.staff !== "—" ? roleObj.staff : "";
    const t = {
      id: `tk${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: risk.title,
      role: roleName || null,
      owner: oname ? disambiguatedInitials(oname, (incident.roles || []).map((r) => r.staff)) : "—",
      phase: incidentPhase(incident),
      done: false,
      priority: risk.severity === "high" ? "high" : risk.severity === "low" ? "low" : "med",
      dueAt: risk.reviewBy || undefined,
      fromRiskId: risk.id,
    };
    update((prev) => ({
      ...prev,
      tasks: [...(prev.tasks || []), t],
      risks: (prev.risks || []).map((x) => (x.id === risk.id ? { ...x, taskId: t.id } : x)),
    }));
    addTimelineEntry({ type: "action", text: `Risk allocated as a task${roleName ? ` to ${shortRole(roleName)}` : ""}: ${risk.title}.` });
  }

  const rolesPresent = [...new Set((incident.roles || []).map((r) => r.role).filter(Boolean))];

  function printRegister() {
    const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const rows = [...risks].map((r) => `<tr><td>${r.createdAt ? new Date(r.createdAt).toLocaleString("en-AU") : "—"}</td><td>${(RISK_SEVERITY[r.severity] || {}).label || "—"}</td><td>${esc(r.category)}</td><td>${(RISK_STATUS[r.status] || {}).label || "—"}</td><td>${esc(r.owner) || "—"}</td><td><strong>${esc(r.title)}</strong>${r.description ? `<br><span style="color:#4A5664">${esc(r.description)}</span>` : ""}</td></tr>`).join("");
    const w = window.open("", "_blank");
    if (!w) { window.alert("Please allow pop-ups to print the register."); return; }
    w.document.write(`<!doctype html><html><head><title>Risk Register — ${esc(incident.id)}</title><style>body{font-family:Arial,sans-serif;color:#0B1620;margin:32px}h1{color:#00305E;font-size:18px}table{border-collapse:collapse;width:100%;font-size:12px;margin-top:12px}th,td{border:1px solid #ccc;padding:6px 8px;text-align:left;vertical-align:top}th{background:#00305E;color:#fff}</style></head><body><h1>Risk / Watch Register — ${esc(incident.title)}</h1><div style="font-size:12px;color:#4A5664">${esc(incident.id)} · printed ${new Date().toLocaleString("en-AU")}</div><table><thead><tr><th>Logged</th><th>Severity</th><th>Category</th><th>Status</th><th>Owner</th><th>Risk</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No risks logged.</td></tr>'}</tbody></table></body></html>`);
    w.document.close(); w.focus(); w.print();
  }

  const counts = riskCounts(incident);
  const ordered = [...openRisks(incident), ...risks.filter((r) => !riskIsOpen(r)).sort((a, b) => (b.resolvedAt || 0) - (a.resolvedAt || 0))];
  const presets = [{ v: "30", l: "30m" }, { v: "60", l: "1h" }, { v: "120", l: "2h" }, { v: "eod", l: "EOD" }];

  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.amber, marginBottom: 6 }}>RISK / WATCH REGISTER · WHAT REMAINS</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>Track what could still go wrong.</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>
          Live operational concerns only — watch items, active risks, and escalations, each owned and tracked to resolution.
        </p>
      </div>

      {/* Counts summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 6, marginBottom: 20 }}>
        {[["Active", counts.active, RISK_STATUS.active.color], ["Watch", counts.watch, RISK_STATUS.watch.color], ["Escalated", counts.escalated, RISK_STATUS.escalated.color], ["Resolved", counts.resolved, RISK_STATUS.resolved.color]].map(([l, n, c]) => (
          <div key={l} style={{ border: `1px solid rgba(0,48,94,0.14)`, borderTop: `2px solid ${c}`, padding: "8px 6px", textAlign: "center" }}>
            <div className="display" style={{ fontSize: 22, color: c, fontWeight: 500, lineHeight: 1 }}>{n}</div>
            <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.08em", color: PALETTE.inkSoft, marginTop: 4, textTransform: "uppercase" }}>{l}</div>
          </div>
        ))}
      </div>

      {!isClosed && (
        <div style={{ border: `1px solid rgba(0,48,94,0.14)`, padding: 16, marginBottom: 22 }}>
          <Section title="Risk / watch item">
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Road closure possible — access route affected" />
          </Section>
          <Section title="Description (optional)">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} style={{ resize: "vertical", fontSize: 13, lineHeight: 1.5 }} placeholder="Detail on the concern." />
          </Section>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Section title="Category">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {RISK_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Section>
            <Section title="Owner (optional)">
              <input type="text" value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="who's watching it" />
            </Section>
          </div>
          <Section title="Severity">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {Object.entries(RISK_SEVERITY).map(([k, v]) => (
                <button key={k} onClick={() => setSeverity(k)} style={{ ...presetStyle(severity === k), borderColor: severity === k ? v.color : "rgba(0,48,94,0.18)", background: severity === k ? v.color : PALETTE.paper, color: severity === k ? PALETTE.paper : PALETTE.ink }}>{v.label}</button>
              ))}
            </div>
          </Section>
          <Section title="Status">
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setStatus("watch")} style={presetStyle(status === "watch")}>Watch</button>
              <button onClick={() => setStatus("active")} style={presetStyle(status === "active")}>Active Risk</button>
            </div>
          </Section>
          <Section title="Review point">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button onClick={() => setReviewPreset("")} style={presetStyle(reviewPreset === "")}>None</button>
              {presets.map((p) => <button key={p.v} onClick={() => setReviewPreset(p.v)} style={presetStyle(reviewPreset === p.v)}>{p.l}</button>)}
            </div>
          </Section>
          <button onClick={record} disabled={!title.trim()} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8, opacity: title.trim() ? 1 : 0.5 }}>
            <AlertTriangle size={14} /> Add to register
          </button>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6 }}>REGISTER · {risks.length}</div>
        {risks.length > 0 && <button onClick={printRegister} className="btn" style={{ padding: "5px 10px", fontSize: 11.5 }}><FileText size={12} /> Print register</button>}
      </div>
      {risks.length === 0 ? (
        <p style={{ fontSize: 13, color: PALETTE.inkSoft, fontStyle: "italic" }}>No risks or watch items yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {ordered.map((r) => (
            <RiskCard key={r.id} risk={r} now={now} isClosed={isClosed}
              roles={rolesPresent}
              onConvert={(roleName) => convertToTask(r, roleName)}
              onActivate={() => setRiskStatus(r.id, "active", "raised to active")}
              onEscalate={() => setRiskStatus(r.id, "escalated", "escalated")}
              onResolve={() => resolve(r.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function RiskCard({ risk, now, isClosed, roles = [], onConvert, onActivate, onEscalate, onResolve }) {
  const sv = RISK_SEVERITY[risk.severity] || {};
  const st = RISK_STATUS[risk.status] || RISK_STATUS.watch;
  const open = riskIsOpen(risk);
  const overdue = open && risk.reviewBy && risk.reviewBy < now;
  const [picking, setPicking] = useState(false);
  const [pickRole, setPickRole] = useState(roles[0] || "");
  return (
    <div style={{ border: `1px solid rgba(0,48,94,0.14)`, borderLeft: `3px solid ${sv.color}`, background: PALETTE.paper, padding: "12px 14px", opacity: open ? 1 : 0.72 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: PALETTE.ink, lineHeight: 1.35, textDecoration: open ? "none" : "line-through" }}>{risk.title}</div>
        <span className="chip" style={{ borderColor: st.color, color: st.color, flexShrink: 0 }}>{st.label}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 7 }}>
        <span className="mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: sv.color, border: `1px solid ${sv.color}`, padding: "1px 6px" }}>{(sv.label || "").toUpperCase()}</span>
        <span className="mono" style={{ fontSize: 9.5, color: PALETTE.inkSoft }}>{risk.category}</span>
        <span className="mono" style={{ fontSize: 9.5, color: risk.owner ? PALETTE.inkSoft : PALETTE.rust }}>{risk.owner ? `· ${risk.owner}` : "· unowned"}</span>
      </div>
      {risk.description && <p style={{ fontSize: 12.5, lineHeight: 1.5, color: PALETTE.ink, marginTop: 8, marginBottom: 0, whiteSpace: "pre-wrap" }}>{risk.description}</p>}
      {open && risk.reviewBy && (
        <div style={{ fontSize: 11.5, marginTop: 8, color: overdue ? PALETTE.crimson : PALETTE.inkSoft, fontWeight: overdue ? 600 : 400, display: "flex", alignItems: "center", gap: 5 }}>
          <Clock size={12} /> {overdue ? "Review overdue" : "Review by"} {formatTime(risk.reviewBy)}
        </div>
      )}
      {!open && (
        <div style={{ fontSize: 11.5, marginTop: 8, color: PALETTE.sage, display: "flex", alignItems: "center", gap: 5 }}>
          <CheckCircle2 size={12} /> Resolved {risk.resolvedAt ? formatTime(risk.resolvedAt) : ""}{risk.resolutionNotes ? ` — ${risk.resolutionNotes}` : ""}
        </div>
      )}
      {risk.taskId && (
        <div style={{ fontSize: 11, marginTop: 8, color: PALETTE.teal, display: "flex", alignItems: "center", gap: 5 }}>
          <CheckCircle2 size={12} /> Allocated to the task board
        </div>
      )}
      {!isClosed && open && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
          {risk.status === "watch" && <button onClick={onActivate} className="btn" style={{ padding: "6px 10px", fontSize: 11.5 }}>Raise to active</button>}
          {risk.status !== "escalated" && <button onClick={onEscalate} className="btn" style={{ padding: "6px 10px", fontSize: 11.5, borderColor: PALETTE.crimson, color: PALETTE.crimson }}>Escalate</button>}
          <button onClick={onResolve} className="btn" style={{ padding: "6px 10px", fontSize: 11.5, borderColor: PALETTE.sage, color: PALETTE.sage }}><Check size={12} /> Resolve</button>
          {onConvert && !risk.taskId && !picking && <button onClick={() => setPicking(true)} className="btn" style={{ padding: "6px 10px", fontSize: 11.5 }}><ListChecks size={12} /> Allocate as task</button>}
          {onConvert && !risk.taskId && picking && (
            <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
              <select value={pickRole} onChange={(e) => setPickRole(e.target.value)} style={{ fontSize: 11.5, padding: "5px 8px", width: "auto" }}>
                {roles.length === 0 && <option value="">Unassigned</option>}
                {roles.map((r) => <option key={r} value={r}>{shortRole(r)}</option>)}
              </select>
              <button onClick={() => { onConvert(pickRole); setPicking(false); }} className="btn btn-primary" style={{ padding: "6px 10px", fontSize: 11.5 }}>Add</button>
              <button onClick={() => setPicking(false)} className="btn-ghost" style={{ padding: "6px 8px", fontSize: 11.5, background: "none", border: "none" }}>Cancel</button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Decision Log drawer (CORE · defensibility) ---------- */
function DecisionLogDrawer({ incident, update, addTimelineEntry, isClosed, now }) {
  const decisions = incident.decisions || [];
  const [decision, setDecision] = useState("");
  const [rationale, setRationale] = useState("");
  const [options, setOptions] = useState("");
  const [evidence, setEvidence] = useState("");
  const [reviewPreset, setReviewPreset] = useState(""); // "" | "30" | "60" | "120" | "eod"

  function computeReviewBy() {
    if (!reviewPreset) return null;
    if (reviewPreset === "eod") {
      const d = new Date();
      d.setHours(17, 0, 0, 0);
      return d.getTime();
    }
    return Date.now() + parseInt(reviewPreset, 10) * 60000;
  }

  const rolesPresent = [...new Set((incident.roles || []).map((r) => r.role).filter(Boolean))];
  const [affected, setAffected] = useState([]);
  function toggleAffected(role) {
    setAffected((a) => (a.includes(role) ? a.filter((x) => x !== role) : [...a, role]));
  }

  function record() {
    if (!decision.trim()) return;
    const d = newDecision({ decision: decision.trim(), rationale: rationale.trim(), options: options.trim(), evidence: evidence.trim(), reviewBy: computeReviewBy(), affectedRoles: affected });
    update((prev) => ({ ...prev, decisions: [d, ...(prev.decisions || [])] }));
    addTimelineEntry({ type: "decision", text: `Decision: ${d.decision}${affected.length ? ` — flagged to ${affected.map(shortRole).join(", ")}` : ""}` });
    setDecision(""); setRationale(""); setOptions(""); setEvidence(""); setReviewPreset(""); setAffected([]);
  }

  // Tagged role acknowledges — notifies the author via the timeline + ack record.
  function acknowledge(decisionId, role) {
    const roleObj = (incident.roles || []).find((r) => r.role === role);
    const by = roleObj?.staff && roleObj.staff !== "—" ? roleObj.staff : role;
    update((prev) => ({
      ...prev,
      decisions: (prev.decisions || []).map((x) => (x.id === decisionId ? { ...x, acks: { ...(x.acks || {}), [role]: { at: Date.now(), by } } } : x)),
    }));
    const d = decisions.find((x) => x.id === decisionId);
    addTimelineEntry({ type: "decision", text: `${by} (${shortRole(role)}) acknowledged decision: ${d?.decision || ""}.` });
  }

  function markReviewed(id) {
    const d = decisions.find((x) => x.id === id);
    const outcome = window.prompt("Outcome / note on review (optional):") || "";
    update((prev) => ({
      ...prev,
      decisions: (prev.decisions || []).map((x) => (x.id === id ? { ...x, status: "reviewed", reviewedAt: Date.now(), outcome } : x)),
    }));
    addTimelineEntry({ type: "decision", text: `Decision reviewed: ${d.decision}${outcome ? ` — ${outcome}` : ""}.` });
  }

  const presets = [{ v: "30", l: "30m" }, { v: "60", l: "1h" }, { v: "120", l: "2h" }, { v: "eod", l: "EOD" }];

  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: "#E39199", marginBottom: 6 }}>DECISION LOG · COMMAND RECORD</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>Record the decision — and why.</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>
          Capture what was decided, the reasoning, and what was known at the time. Records are immutable once saved — the defensible account for any later review.
        </p>
      </div>

      {!isClosed && (
        <div style={{ border: `1px solid rgba(0,48,94,0.14)`, padding: 16, marginBottom: 22 }}>
          <Section title="Decision">
            <input type="text" value={decision} onChange={(e) => setDecision(e.target.value)} placeholder="e.g. Hold parent notification pending police advice" />
          </Section>
          <Section title="Rationale — why this call">
            <textarea value={rationale} onChange={(e) => setRationale(e.target.value)} rows={3} style={{ resize: "vertical", fontSize: 13, lineHeight: 1.5 }} placeholder="The reasoning behind the decision." />
          </Section>
          <Section title="Options considered (optional)">
            <textarea value={options} onChange={(e) => setOptions(e.target.value)} rows={2} style={{ resize: "vertical", fontSize: 13, lineHeight: 1.5 }} placeholder="Alternatives weighed and set aside." />
          </Section>
          <Section title="Evidence / what was known (optional)">
            <textarea value={evidence} onChange={(e) => setEvidence(e.target.value)} rows={2} style={{ resize: "vertical", fontSize: 13, lineHeight: 1.5 }} placeholder="The information relied on at the time." />
          </Section>
          <Section title="Review point">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <button onClick={() => setReviewPreset("")} style={presetStyle(reviewPreset === "")}>None</button>
              {presets.map((p) => (
                <button key={p.v} onClick={() => setReviewPreset(p.v)} style={presetStyle(reviewPreset === p.v)}>{p.l}</button>
              ))}
            </div>
          </Section>
          {rolesPresent.length > 0 && (
            <Section title="Flag affected role(s) — they'll be asked to acknowledge">
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {rolesPresent.map((r) => {
                  const on = affected.includes(r);
                  return <button key={r} onClick={() => toggleAffected(r)} style={{ padding: "5px 9px", fontSize: 11.5, cursor: "pointer", background: on ? PALETTE.teal : PALETTE.paper, color: on ? PALETTE.paper : PALETTE.ink, border: `1px solid ${on ? PALETTE.teal : "rgba(0,48,94,0.18)"}`, fontWeight: on ? 600 : 500 }}>{shortRole(r)}</button>;
                })}
              </div>
            </Section>
          )}
          <button onClick={record} disabled={!decision.trim()} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8, opacity: decision.trim() ? 1 : 0.5 }}>
            <Scale size={14} /> Record decision
          </button>
        </div>
      )}

      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 10 }}>
        DECISIONS · {decisions.length}
      </div>
      {decisions.length === 0 ? (
        <p style={{ fontSize: 13, color: PALETTE.inkSoft, fontStyle: "italic" }}>No decisions recorded yet.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {decisions.map((d) => (
            <DecisionCard key={d.id} d={d} now={now} isClosed={isClosed} onReview={() => markReviewed(d.id)} onAck={(role) => acknowledge(d.id, role)} />
          ))}
        </div>
      )}
    </div>
  );
}

function presetStyle(active) {
  return {
    padding: "6px 12px", fontSize: 12, fontWeight: 500,
    border: `1px solid ${active ? PALETTE.teal : "rgba(0,48,94,0.18)"}`,
    background: active ? PALETTE.teal : PALETTE.paper,
    color: active ? PALETTE.paper : PALETTE.ink, cursor: "pointer",
  };
}

function DecisionCard({ d, now, isClosed, onReview, onAck }) {
  const st = DECISION_STATUS[d.status] || DECISION_STATUS.open;
  const overdue = d.status === "open" && d.reviewBy && d.reviewBy < now;
  const affectedRoles = d.affectedRoles || [];
  return (
    <div style={{ border: `1px solid rgba(0,48,94,0.14)`, borderLeft: `3px solid ${PALETTE.crimson}`, background: PALETTE.paper, padding: "12px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: PALETTE.ink, lineHeight: 1.35 }}>{d.decision}</div>
        <span className="chip" style={{ borderColor: st.color, color: st.color, flexShrink: 0 }}>{st.label}</span>
      </div>
      <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.06em", color: PALETTE.inkSoft, marginTop: 6 }}>
        {d.decidedBy.toUpperCase()} · {formatTime(d.ts)}
      </div>
      {d.rationale && <DecisionField label="Rationale" value={d.rationale} />}
      {d.options && <DecisionField label="Options considered" value={d.options} />}
      {d.evidence && <DecisionField label="What was known" value={d.evidence} />}
      {d.status === "open" && d.reviewBy && (
        <div style={{ fontSize: 11.5, marginTop: 8, color: overdue ? PALETTE.crimson : PALETTE.inkSoft, fontWeight: overdue ? 600 : 400, display: "flex", alignItems: "center", gap: 5 }}>
          <Clock size={12} /> {overdue ? "Review overdue" : "Review by"} {formatTime(d.reviewBy)}
        </div>
      )}
      {d.status === "reviewed" && (
        <div style={{ fontSize: 11.5, marginTop: 8, color: PALETTE.sage, display: "flex", alignItems: "center", gap: 5 }}>
          <CheckCircle2 size={12} /> Reviewed {d.reviewedAt ? formatTime(d.reviewedAt) : ""}{d.outcome ? ` — ${d.outcome}` : ""}
        </div>
      )}
      {affectedRoles.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid rgba(0,48,94,0.08)` }}>
          <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.1em", color: PALETTE.teal, opacity: 0.6, textTransform: "uppercase", marginBottom: 6 }}>Flagged to</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {affectedRoles.map((r) => {
              const ack = (d.acks || {})[r];
              return (
                <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5 }}>
                  <span style={{ fontWeight: 600, color: PALETTE.ink }}>{shortRole(r)}</span>
                  {ack ? (
                    <span style={{ color: PALETTE.sage, display: "inline-flex", alignItems: "center", gap: 4 }}><CheckCircle2 size={12} /> acknowledged by {ack.by} · {formatTime(ack.at)}</span>
                  ) : (
                    <>
                      <span style={{ color: PALETTE.rust }}>awaiting acknowledgement</span>
                      {!isClosed && onAck && <button onClick={() => onAck(r)} className="btn" style={{ padding: "3px 9px", fontSize: 10.5 }}>Acknowledge</button>}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!isClosed && d.status === "open" && (
        <button onClick={onReview} className="btn" style={{ marginTop: 10, padding: "6px 10px", fontSize: 11.5, borderColor: PALETTE.sage, color: PALETTE.sage }}>
          <Check size={12} /> Mark reviewed
        </button>
      )}
    </div>
  );
}

function DecisionField({ label, value }) {
  return (
    <div style={{ marginTop: 8 }}>
      <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: PALETTE.teal, opacity: 0.6, textTransform: "uppercase" }}>{label}</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: PALETTE.ink, marginTop: 2, whiteSpace: "pre-wrap" }}>{value}</div>
    </div>
  );
}

/* ---------- Post-Incident Review drawer (PRD M7) ---------- */
function PIRDrawer({ incident, update, addTimelineEntry }) {
  const pir = incident.pir || null;
  const facts = pirFacts(incident);
  const [aiState, setAiState] = useState("idle");
  const [aiNote, setAiNote] = useState("");
  const [caText, setCaText] = useState("");

  function setPir(changes) {
    update((prev) => ({ ...prev, pir: { ...prev.pir, ...changes } }));
  }

  function startReview() {
    update((prev) => ({ ...prev, pir: newPIR() }));
    addTimelineEntry({ type: "system", text: "Post-incident review started." });
  }

  async function aiDraft() {
    setAiState("loading");
    setAiNote("");
    try {
      const timeline = (incident.timeline || []).slice(-15).map((e) => `${formatTime(e.ts)} ${e.type}: ${e.text}`);
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "pir", facts, timeline }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      const parsed = JSON.parse(String(data.text || "").replace(/```json|```/g, "").trim());
      setPir({
        summary: parsed.summary || pir.summary,
        whatWorked: parsed.whatWorked || pir.whatWorked,
        whatImprove: parsed.whatImprove || pir.whatImprove,
        planUpdates: parsed.planUpdates || pir.planUpdates,
      });
      setAiState("done");
      setAiNote("AI draft generated from the incident record — review and edit before finalising.");
    } catch {
      // Graceful fallback: assemble a factual summary locally.
      const dur = formatElapsed(facts.durationMs);
      const local =
        `${facts.title} (${facts.type}, ${facts.severity}) was managed over ${dur}. ` +
        `${facts.rolesAssigned} of ${facts.rolesTotal} roles were assigned and ${facts.tasksDone}/${facts.tasksTotal} tasks completed. ` +
        `${facts.activated ? `The incident was activated with ${facts.ackRate} acknowledgements. ` : "The incident was not formally activated. "}` +
        `${facts.commsTotal ? `${facts.commsSent} of ${facts.commsTotal} communications were dispatched. ` : "No communications were recorded. "}` +
        `[Reviewer to add narrative detail.]`;
      setPir({ summary: pir.summary || local });
      setAiState("error");
      setAiNote("AI drafting unavailable in this environment — a factual summary was assembled from the record instead. (Set ANTHROPIC_API_KEY on the server to enable full AI drafting.)");
    }
  }

  function addCA() {
    if (!caText.trim()) return;
    setPir({ correctiveActions: [...(pir.correctiveActions || []), newCorrectiveAction(caText.trim())] });
    setCaText("");
  }
  function toggleCA(id) {
    setPir({ correctiveActions: pir.correctiveActions.map((c) => (c.id === id ? { ...c, done: !c.done } : c)) });
  }
  function setCAOwner(id, owner) {
    setPir({ correctiveActions: pir.correctiveActions.map((c) => (c.id === id ? { ...c, owner } : c)) });
  }
  function removeCA(id) {
    setPir({ correctiveActions: pir.correctiveActions.filter((c) => c.id !== id) });
  }

  function finalise() {
    setPir({ status: "final" });
    addTimelineEntry({ type: "system", text: "Post-incident review finalised." });
  }
  function reopenReview() {
    setPir({ status: "draft" });
    addTimelineEntry({ type: "system", text: "Post-incident review reopened." });
  }

  const factRows = [
    ["Duration", formatElapsed(facts.durationMs)],
    ["Severity", facts.severity],
    ["Roles assigned", `${facts.rolesAssigned} / ${facts.rolesTotal}`],
    ["Tasks complete", `${facts.tasksDone} / ${facts.tasksTotal}`],
    ["Activation", facts.activated ? `yes · ${facts.ackRate} ack` : "not activated"],
    ["Comms dispatched", `${facts.commsSent} / ${facts.commsTotal}`],
    ["Timeline entries", String(facts.timelineEntries)],
  ];

  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>MODULE M7 · POST-INCIDENT REVIEW</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>Learn from the record.</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>
          The incident record is assembled below. Draft a review, capture corrective actions, and suggest plan updates.
        </p>
      </div>

      {/* Auto-assembled facts */}
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 8 }}>ASSEMBLED FROM THE RECORD</div>
      <div style={{ border: `1px solid rgba(0,48,94,0.14)`, marginBottom: 20 }}>
        {factRows.map(([k, v], i) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "9px 14px", borderBottom: i < factRows.length - 1 ? `1px solid rgba(0,48,94,0.08)` : "none", fontSize: 13 }}>
            <span style={{ color: PALETTE.inkSoft }}>{k}</span>
            <span className="mono" style={{ fontSize: 11.5, color: PALETTE.ink }}>{v}</span>
          </div>
        ))}
      </div>

      {!pir ? (
        <button onClick={startReview} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          <ClipboardCheck size={15} /> Start post-incident review
        </button>
      ) : (
        <>
          {pir.status === "final" && (
            <div style={{ padding: "10px 12px", background: PALETTE.tealMist, border: `1px solid rgba(0,48,94,0.2)`, marginBottom: 16, fontSize: 12.5, color: PALETTE.teal, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle2 size={14} /> This review is finalised.
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <button onClick={aiDraft} disabled={aiState === "loading"} className="btn" style={{ fontSize: 12 }}>
              <Sparkles size={13} /> {aiState === "loading" ? "Drafting…" : "AI draft review"}
            </button>
            <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>Human edits & finalises</span>
          </div>
          {aiNote && <p style={{ fontSize: 12, lineHeight: 1.5, color: aiState === "error" ? PALETTE.rust : PALETTE.sage, marginTop: 0, marginBottom: 16 }}>{aiNote}</p>}

          <PIRField label="What happened (summary)" value={pir.summary} onChange={(v) => setPir({ summary: v })} />
          <PIRField label="What worked well" value={pir.whatWorked} onChange={(v) => setPir({ whatWorked: v })} />
          <PIRField label="What could be improved" value={pir.whatImprove} onChange={(v) => setPir({ whatImprove: v })} />
          <PIRField label="Suggested plan updates" value={pir.planUpdates} onChange={(v) => setPir({ planUpdates: v })} />

          <PIRElements pir={pir} onSet={(id, v) => setPir({ elements: { ...(pir.elements || {}), [id]: v } })} />

          <Section title={`Corrective actions · ${(pir.correctiveActions || []).length}`}>
            <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
              {(pir.correctiveActions || []).map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "9px 11px", border: `1px solid rgba(0,48,94,0.14)`, background: PALETTE.paper }}>
                  <button onClick={() => toggleCA(c.id)} style={{ background: "none", border: "none", padding: 0, marginTop: 1, cursor: "pointer" }}>
                    {c.done ? <CheckCircle2 size={16} color={PALETTE.sage} /> : <Circle size={16} color={PALETTE.inkSoft} />}
                  </button>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: c.done ? PALETTE.inkSoft : PALETTE.ink, textDecoration: c.done ? "line-through" : "none" }}>{c.text}</div>
                    <input type="text" value={c.owner} onChange={(e) => setCAOwner(c.id, e.target.value)} placeholder="owner…" style={{ marginTop: 6, padding: "4px 8px", fontSize: 11.5, width: 140 }} />
                  </div>
                  <button onClick={() => removeCA(c.id)} className="btn-ghost" style={{ background: "none", border: "none", padding: 2, color: PALETTE.inkSoft, cursor: "pointer" }}><Trash2 size={13} /></button>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="text" value={caText} onChange={(e) => setCaText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addCA()} placeholder="Add a corrective action…" />
              <button onClick={addCA} className="btn" style={{ padding: "8px 12px" }}><Plus size={13} /></button>
            </div>
          </Section>

          {pir.status === "final" ? (
            <button onClick={reopenReview} className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}><RotateCcw size={14} /> Reopen review</button>
          ) : (
            <button onClick={finalise} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}><Check size={14} /> Finalise review</button>
          )}
        </>
      )}
    </div>
  );
}

function PIRField({ label, value, onChange }) {
  return (
    <Section title={label}>
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={4} style={{ resize: "vertical", lineHeight: 1.55, fontSize: 13 }} />
    </Section>
  );
}

// Structured debrief against the plan's PIR elements (§16.4).
function PIRElements({ pir, onSet }) {
  const [open, setOpen] = useState(false);
  const elements = pir.elements || {};
  const answered = PIR_ELEMENTS.reduce((n, cat) => n + cat.questions.filter((q) => (elements[q.id] || "").trim()).length, 0);
  const total = PIR_ELEMENTS.reduce((n, cat) => n + cat.questions.length, 0);
  return (
    <div style={{ marginBottom: 20 }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", textAlign: "left", background: PALETTE.parchment, border: `1px solid rgba(0,48,94,0.12)`, padding: "10px 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: PALETTE.teal }}>Structured debrief (plan §16.4)</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>{answered}/{total}</span>
          {open ? <ChevronUp size={14} color={PALETTE.teal} /> : <ChevronDown size={14} color={PALETTE.teal} />}
        </span>
      </button>
      {open && (
        <div style={{ padding: "12px 2px 0" }}>
          {PIR_ELEMENTS.map((cat) => (
            <div key={cat.id} style={{ marginBottom: 14 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8, textTransform: "uppercase" }}>{cat.label}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {cat.questions.map((q) => (
                  <div key={q.id}>
                    <div style={{ fontSize: 12, fontWeight: 500, color: PALETTE.ink, marginBottom: 3 }}>{q.q}</div>
                    <textarea value={elements[q.id] || ""} onChange={(e) => onSet(q.id, e.target.value)} rows={2} placeholder="Finding…" style={{ width: "100%", fontSize: 12, resize: "vertical", boxSizing: "border-box" }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Team Status Board (Increment C · command view) ---------- */
function TeamBoardDrawer({ incident, update, addTimelineEntry, isClosed }) {
  const roles = incident.roles || [];
  const [briefingId, setBriefingId] = useState(null);

  function applyRoles(nextRoles, log) {
    update((prev) => ({ ...prev, roles: nextRoles }));
    (log || []).forEach((t) => addTimelineEntry({ type: "system", text: t }));
  }

  function assignOrReplace(roleId, staffId) {
    const role = roles.find((r) => r.id === roleId);
    if (!staffId) {
      update((prev) => ({ ...prev, roles: prev.roles.map((r) => (r.id === roleId ? { ...r, staff: "—", staffId: null, initials: "—", status: "unassigned", notify: undefined } : r)) }));
      addTimelineEntry({ type: "system", text: `${role.role} unassigned.` });
      return;
    }
    const { roles: next, log } = promoteToRole(incident, staffId, roleId);
    applyRoles(next, log);
  }

  function notify(roleId) {
    const role = roles.find((r) => r.id === roleId);
    const res = simulateNotification(role, incident);
    update((prev) => ({ ...prev, roles: prev.roles.map((r) => (r.id === roleId ? { ...r, notify: { status: "sent", sentAt: res.at, viaBackup: r.notify?.viaBackup || false } } : r)) }));
    addTimelineEntry({ type: "comm", text: `Notification sent to ${role.staff} as ${role.role} via ${res.channels.join(" + ")} (simulated).` });
  }

  function setNotify(roleId, status, verb) {
    const role = roles.find((r) => r.id === roleId);
    update((prev) => ({ ...prev, roles: prev.roles.map((r) => (r.id === roleId ? { ...r, notify: { ...r.notify, status, [status === "acked" ? "ackedAt" : "declinedAt"]: Date.now() } } : r)) }));
    addTimelineEntry({ type: status === "acked" ? "action" : "system", text: `${role.staff} ${verb} ${role.role}.` });
  }

  function escalate(roleId) {
    const { roles: next, log } = reassignRoleToAlternate(incident, roleId);
    applyRoles(next, log);
  }

  if (briefingId) {
    const role = roles.find((r) => r.id === briefingId);
    return <BriefingView incident={incident} role={role} onBack={() => setBriefingId(null)} />;
  }

  // Summary counts by board state.
  const counts = roles.reduce((acc, r) => { const s = roleBoardState(r); acc[s] = (acc[s] || 0) + 1; return acc; }, {});

  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>INCIDENT TEAM · STATUS BOARD</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>Who holds what — and where they stand.</div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {["acknowledged", "notified", "assigned", "declined", "unassigned"].map((s) => (
          counts[s] ? (
            <span key={s} className="mono" style={{ fontSize: 10, letterSpacing: "0.06em", color: ROLE_BOARD_STATE[s].color, border: `1px solid ${ROLE_BOARD_STATE[s].color}`, padding: "3px 8px" }}>
              {counts[s]} {ROLE_BOARD_STATE[s].label.split(" ")[0].toUpperCase()}
            </span>
          ) : null
        ))}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {roles.map((r) => {
          const state = roleBoardState(r);
          const meta = ROLE_BOARD_STATE[state];
          const candidates = availableQualifiedStaff(r.role);
          const assigned = roleIsAssigned(r);
          return (
            <div key={r.id} style={{ border: `1px solid rgba(0,48,94,0.14)`, borderLeft: `3px solid ${meta.color}`, background: PALETTE.paper, padding: "11px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: PALETTE.ink }}>{r.role}</span>
                    {r.required && <span className="mono" style={{ fontSize: 8, letterSpacing: "0.1em", color: PALETTE.rust, fontWeight: 700 }}>REQUIRED</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: assigned ? PALETTE.ink : PALETTE.inkSoft, marginTop: 3 }}>
                    {assigned ? r.staff : "—"}{r.notify?.viaBackup && <span className="mono" style={{ fontSize: 8.5, color: PALETTE.rust, marginLeft: 6 }}>BACKUP</span>}
                  </div>
                </div>
                <span className="chip" style={{ borderColor: meta.color, color: meta.color, flexShrink: 0 }}>{meta.label}</span>
              </div>

              {/* Assign / replace */}
              {!isClosed && (
                <select value={r.staffId || ""} onChange={(e) => assignOrReplace(r.id, e.target.value || null)} style={{ marginTop: 10, fontSize: 12.5 }}>
                  <option value="">— Unassigned —</option>
                  {candidates.map((c) => <option key={c.id} value={c.id}>{c.name} · {PREF_LABEL[c.pref]}</option>)}
                </select>
              )}

              {/* Activation actions */}
              {!isClosed && assigned && (
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {(state === "assigned") && <button onClick={() => notify(r.id)} className="btn" style={{ padding: "6px 10px", fontSize: 11.5 }}><Bell size={12} /> Notify</button>}
                  {(state === "notified") && <button onClick={() => setNotify(r.id, "acked", "acknowledged")} className="btn" style={{ padding: "6px 10px", fontSize: 11.5, borderColor: PALETTE.sage, color: PALETTE.sage }}><Check size={12} /> Acknowledge</button>}
                  {(state === "notified") && <button onClick={() => setNotify(r.id, "declined", "declined")} className="btn" style={{ padding: "6px 10px", fontSize: 11.5, borderColor: PALETTE.crimson, color: PALETTE.crimson }}>Decline</button>}
                  {(state === "declined") && <button onClick={() => escalate(r.id)} className="btn" style={{ padding: "6px 10px", fontSize: 11.5, borderColor: PALETTE.crimson, color: PALETTE.crimson }}><UserCheck size={12} /> Escalate to alternate</button>}
                  <button onClick={() => setBriefingId(r.id)} className="btn-ghost" style={{ background: "none", border: "none", padding: "6px 4px", fontSize: 11.5, color: PALETTE.teal, fontWeight: 500 }}><BookOpen size={12} /> Briefing</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BriefingView({ incident, role, onBack }) {
  const def = role ? ROLE_DEFINITIONS[role.role] : null;
  const responsibilities = role ? responsibilitiesFor(role.role, incident.type) : null;
  const tasks = (incident.tasks || []).filter((t) => role && t.owner && t.owner === role.initials);
  const pathway = role ? escalationPathwayFor(role.role) : [];
  const sev = SEVERITY[incident.severity];

  if (!role) return <p style={{ fontSize: 14, color: PALETTE.inkSoft }}>Role not found.</p>;

  return (
    <div>
      <button onClick={onBack} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
        <ArrowLeft size={13} /> Back to board
      </button>

      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 18 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>ROLE BRIEFING</div>
        <div className="display" style={{ fontSize: 24, fontWeight: 500 }}>{role.role}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{role.staff && role.staff !== "—" ? role.staff : "Unassigned"}</div>
      </div>

      <Section title="Incident">
        <div style={{ fontSize: 13.5, color: PALETTE.ink, fontWeight: 500 }}>{incident.title}</div>
        <div className="mono" style={{ fontSize: 11, color: PALETTE.inkSoft, marginTop: 4 }}>{sev.label} · {incident.location}</div>
      </Section>

      {def && (
        <Section title="Role">
          <p style={{ fontSize: 13, lineHeight: 1.55, color: PALETTE.ink, margin: 0 }}>{def.description}</p>
          <div style={{ fontSize: 12, color: PALETTE.inkSoft, marginTop: 8 }}><strong style={{ color: PALETTE.teal }}>Reports to:</strong> {def.reportsTo}</div>
        </Section>
      )}

      <Section title="Immediate responsibilities">
        {responsibilities && responsibilities.length ? (
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {responsibilities.map((r, i) => <li key={i} style={{ fontSize: 13, lineHeight: 1.6, color: PALETTE.ink }}>{r.text} <RespFlags r={r} /></li>)}
          </ul>
        ) : <p style={{ fontSize: 13, color: PALETTE.inkSoft, margin: 0 }}>Follow the Critical Incident Leader's direction and this incident's task list.</p>}
      </Section>

      <Section title={`Assigned tasks (${tasks.length})`}>
        {tasks.length ? tasks.map((t) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: PALETTE.ink, padding: "4px 0" }}>
            {t.done ? <CheckCircle2 size={13} color={PALETTE.sage} /> : <Circle size={13} color={PALETTE.inkSoft} />} {t.text}
          </div>
        )) : <p style={{ fontSize: 13, color: PALETTE.inkSoft, margin: 0 }}>No tasks assigned to this role yet — tasks owned by these initials will appear here.</p>}
      </Section>

      <Section title="Escalation pathway">
        <div style={{ fontSize: 13, color: PALETTE.ink }}>
          {role.role}{pathway.map((p, i) => <span key={i}> → <strong style={{ color: PALETTE.teal }}>{p}</strong></span>)}
        </div>
      </Section>
    </div>
  );
}

/* ---------- Activation & Notification drawer (PRD M2) ---------- */
function ActivationDrawer({ incident, update, addTimelineEntry, isClosed }) {
  const roles = incident.roles || [];
  const assigned = roles.filter(roleIsAssigned);
  const unassignedRequired = roles.filter((r) => r.required && !roleIsAssigned(r));
  const activation = incident.activation || null;

  function declare() {
    const stamp = Date.now();
    update((prev) => ({
      ...prev,
      activation: { declaredAt: stamp, declaredBy: "K. Patel", channels: ACTIVATION_CHANNELS.map((c) => c.id) },
      roles: prev.roles.map((r) =>
        roleIsAssigned(r) ? { ...r, notify: { status: "sent", sentAt: stamp, viaBackup: false } } : r
      ),
    }));
    addTimelineEntry({
      type: "system",
      text: `Incident ACTIVATED — ${assigned.length} role-holder${assigned.length === 1 ? "" : "s"} notified via Trinity App push + SMS (out-of-band).`,
    });
  }

  function ack(roleId) {
    const r = roles.find((x) => x.id === roleId);
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((x) => (x.id === roleId ? { ...x, notify: { ...x.notify, status: "acked", ackedAt: Date.now() } } : x)),
    }));
    addTimelineEntry({ type: "action", text: `${r.staff} acknowledged notification as ${r.role}.` });
  }

  function markNoResponse(roleId) {
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((x) => (x.id === roleId ? { ...x, notify: { ...x.notify, status: "no_response" } } : x)),
    }));
  }

  function escalateToBackup(roleId) {
    const r = roles.find((x) => x.id === roleId);
    if (!r?.backup) return;
    const stamp = Date.now();
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((x) =>
        x.id === roleId
          ? { ...x, staff: r.backup, initials: initialsOf(r.backup), backup: undefined, notify: { status: "sent", sentAt: stamp, viaBackup: true } }
          : x
      ),
    }));
    addTimelineEntry({ type: "system", text: `No response from ${r.staff} — ${r.role} escalated to backup ${r.backup}, re-notified.` });
  }

  function renotify(roleId) {
    const r = roles.find((x) => x.id === roleId);
    update((prev) => ({
      ...prev,
      roles: prev.roles.map((x) => (x.id === roleId ? { ...x, notify: { ...x.notify, status: "sent", sentAt: Date.now() } } : x)),
    }));
    addTimelineEntry({ type: "system", text: `Re-notified ${r.staff} for ${r.role}.` });
  }

  const notified = assigned.filter((r) => r.notify);
  const ackedCount = notified.filter((r) => r.notify.status === "acked").length;
  const pct = notified.length ? Math.round((ackedCount / notified.length) * 100) : 0;

  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>MODULE M2 · ACTIVATION & NOTIFICATION</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>Declare once. Everyone alerted.</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>
          One action notifies every assigned role-holder across two independent channels, then tracks who has acknowledged.
          {incident.isDrill ? " Drill mode — notifications are simulated." : " Prototype — sends are simulated (no live gateway yet)."}
        </p>
      </div>

      {/* Channels */}
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 8 }}>ACTIVATION CHANNELS · ≥2 INDEPENDENT</div>
      <div style={{ display: "grid", gap: 6, marginBottom: 20 }}>
        {ACTIVATION_CHANNELS.map((ch) => (
          <div key={ch.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: `1px solid rgba(0,48,94,0.14)`, background: PALETTE.paper }}>
            <Bell size={14} color={PALETTE.teal} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: PALETTE.ink }}>{ch.label}</div>
              <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.04em", color: PALETTE.inkSoft, marginTop: 2 }}>{ch.note}</div>
            </div>
          </div>
        ))}
      </div>

      {!activation ? (
        <>
          {unassignedRequired.length > 0 && (
            <div style={{ padding: "10px 12px", background: "rgba(168,85,53,0.08)", border: `1px solid rgba(168,85,53,0.3)`, marginBottom: 16, fontSize: 12.5, color: PALETTE.rust, lineHeight: 1.5 }}>
              <strong>{unassignedRequired.length} required role{unassignedRequired.length === 1 ? "" : "s"} unassigned</strong> — {unassignedRequired.map((r) => r.role).join(", ")}. They won't be notified until someone is assigned.
            </div>
          )}
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 8 }}>WILL NOTIFY · {assigned.length}</div>
          <div style={{ border: `1px solid rgba(0,48,94,0.14)`, marginBottom: 20 }}>
            {assigned.length === 0 ? (
              <p style={{ fontSize: 13, color: PALETTE.inkSoft, fontStyle: "italic", padding: 14, margin: 0 }}>No one assigned yet — assign roles before activating.</p>
            ) : assigned.map((r, i) => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: i < assigned.length - 1 ? `1px solid rgba(0,48,94,0.08)` : "none", fontSize: 13 }}>
                <span style={{ color: PALETTE.ink }}>{r.staff}</span>
                <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>{r.role.toUpperCase()}</span>
              </div>
            ))}
          </div>
          <button onClick={declare} disabled={isClosed || assigned.length === 0} className="btn btn-danger" style={{ width: "100%", justifyContent: "center", opacity: isClosed || assigned.length === 0 ? 0.5 : 1 }}>
            <Radio size={15} /> Declare & notify {assigned.length} role-holder{assigned.length === 1 ? "" : "s"}
          </button>
        </>
      ) : (
        <>
          {/* Roll-up */}
          <div style={{ border: `1px solid rgba(0,48,94,0.14)`, padding: 16, marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
              <span className="display" style={{ fontSize: 20, color: PALETTE.teal, fontWeight: 500 }}>{ackedCount} of {notified.length} acknowledged</span>
              <span className="mono" style={{ fontSize: 11, color: PALETTE.inkSoft }}>{pct}%</span>
            </div>
            <div style={{ height: 6, background: PALETTE.tealMist, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: PALETTE.sage, transition: "width 240ms ease" }} />
            </div>
            <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.06em", color: PALETTE.inkSoft, marginTop: 10 }}>
              DECLARED {formatTime(activation.declaredAt)} BY {activation.declaredBy.toUpperCase()} · VIA {activation.channels.map(channelLabel).join(" + ").toUpperCase()}
            </div>
          </div>

          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 8 }}>RECIPIENTS</div>
          <div style={{ display: "grid", gap: 8 }}>
            {notified.map((r) => (
              <RecipientRow key={r.id} role={r} isClosed={isClosed} onAck={() => ack(r.id)} onNoResponse={() => markNoResponse(r.id)} onEscalate={() => escalateToBackup(r.id)} onRenotify={() => renotify(r.id)} />
            ))}
          </div>
          {unassignedRequired.length > 0 && (
            <p style={{ fontSize: 12, color: PALETTE.rust, marginTop: 14, lineHeight: 1.5 }}>
              Still unassigned: {unassignedRequired.map((r) => r.role).join(", ")} — assign, then re-open this panel to notify them.
            </p>
          )}
        </>
      )}
    </div>
  );
}

function RecipientRow({ role, isClosed, onAck, onNoResponse, onEscalate, onRenotify }) {
  const n = role.notify || {};
  const st = NOTIFY_STATUS[n.status] || NOTIFY_STATUS.sent;
  const acked = n.status === "acked";
  return (
    <div style={{ border: `1px solid rgba(0,48,94,0.14)`, background: PALETTE.paper, padding: "11px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: PALETTE.ink }}>
            {role.staff}{n.viaBackup && <span className="mono" style={{ fontSize: 9, color: PALETTE.rust, marginLeft: 6 }}>BACKUP</span>}
          </div>
          <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.1em", color: PALETTE.inkSoft, marginTop: 3 }}>{role.role.toUpperCase()}</div>
        </div>
        <span className="chip" style={{ borderColor: st.color, color: st.color, flexShrink: 0 }}>{st.label}</span>
      </div>
      <div className="mono" style={{ fontSize: 9.5, color: PALETTE.inkSoft, marginTop: 6 }}>
        {acked ? `Acknowledged ${n.ackedAt ? formatTime(n.ackedAt) : ""}` : `Notified ${n.sentAt ? formatTime(n.sentAt) : ""}`}
      </div>
      {!isClosed && !acked && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          <button onClick={onAck} className="btn" style={{ padding: "6px 10px", fontSize: 11.5, borderColor: PALETTE.sage, color: PALETTE.sage }}><Check size={12} /> Mark acknowledged</button>
          {role.backup && <button onClick={onEscalate} className="btn" style={{ padding: "6px 10px", fontSize: 11.5 }}><UserCheck size={12} /> Escalate to backup</button>}
          {n.status !== "no_response" ? (
            <button onClick={onNoResponse} className="btn-ghost" style={{ padding: "6px 8px", fontSize: 11, color: PALETTE.inkSoft, background: "none", border: "none" }}>No response</button>
          ) : (
            <button onClick={onRenotify} className="btn-ghost" style={{ padding: "6px 8px", fontSize: 11, color: PALETTE.teal, background: "none", border: "none" }}>Re-notify</button>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Communications drawer (PRD M4) ---------- */
/* ---------- CIMT Instruments (the plan's appendix forms, live) ---------- */
function InstrumentsDrawer({ incident, update, addTimelineEntry, isClosed }) {
  const [tab, setTab] = useState("boards");
  const bc = boardCounts(incident);
  const prc = peopleAtRiskCounts(incident);
  const TABS = [
    { id: "boards", label: "Visual Boards", badge: BOARD_QUADRANTS.reduce((n, q) => n + bc[q.id], 0) || null },
    { id: "people", label: "People at Risk", badge: prc.total || null, alert: prc.unaccounted > 0 },
    { id: "calltaker", label: "Call Taker", badge: callTakerProgress(incident).done || null },
    { id: "sitrep", label: "SITREP", badge: (incident.sitreps || []).length || null },
    { id: "iap", label: "Action Plan", badge: null },
    { id: "meetings", label: "Meetings", badge: (incident.meetings || []).length || null },
  ];
  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>CONTROL-ROOM INSTRUMENTS</div>
        <div className="display" style={{ fontSize: 20, fontWeight: 500 }}>The plan's forms, live.</div>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>Visual boards, people at risk, situation reports and the incident action plan — the CIM &amp; BCP appendix instruments (§16), kept in one shared record.</p>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {TABS.map((t) => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "7px 11px", fontSize: 12, cursor: "pointer", fontWeight: on ? 600 : 500,
              background: on ? PALETTE.teal : PALETTE.paper, color: on ? PALETTE.paper : PALETTE.ink,
              border: `1px solid ${t.alert ? PALETTE.crimson : on ? PALETTE.teal : "rgba(0,48,94,0.18)"}`,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              {t.label}
              {t.badge != null && <span className="mono" style={{ fontSize: 9, color: on ? PALETTE.paper : t.alert ? PALETTE.crimson : PALETTE.inkSoft }}>{t.badge}</span>}
            </button>
          );
        })}
      </div>
      {tab === "boards" && <BoardsTab incident={incident} update={update} isClosed={isClosed} />}
      {tab === "people" && <PeopleTab incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} />}
      {tab === "calltaker" && <CallTakerTab incident={incident} update={update} isClosed={isClosed} />}
      {tab === "sitrep" && <SitrepTab incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} />}
      {tab === "iap" && <IAPTab incident={incident} update={update} isClosed={isClosed} />}
      {tab === "meetings" && <MeetingsTab incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} />}
    </div>
  );
}

function CallTakerTab({ incident, update, isClosed }) {
  const ct = incident.callTaker || emptyCallTaker();
  const call = ct.call || { person: ct.receivedFrom || "", contact: ct.contact || "", date: "", time: "" };
  const notify = ct.notify || { date: "", time: "", person: "", contact: "" };
  function setField(field, val) {
    update((prev) => ({ ...prev, callTaker: { ...(prev.callTaker || emptyCallTaker()), [field]: val, updatedAt: Date.now() } }));
  }
  function setBlock(block, key, val) {
    update((prev) => {
      const base = prev.callTaker || emptyCallTaker();
      const cur = base[block] || {};
      return { ...prev, callTaker: { ...base, [block]: { ...cur, [key]: val }, updatedAt: Date.now() } };
    });
  }
  function setAnswer(qid, val) {
    update((prev) => { const base = prev.callTaker || emptyCallTaker(); return { ...prev, callTaker: { ...base, answers: { ...(base.answers || {}), [qid]: val }, updatedAt: Date.now() } }; });
  }
  return (
    <div>
      <p style={{ fontSize: 12.5, color: PALETTE.inkSoft, lineHeight: 1.5, marginTop: 0, marginBottom: 14 }}>
        First-notification intake — collect the facts as the incident is reported. Feeds the incident level and the Incident Action Plan.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
        <CallDetailBlock label="Call details — who you received it from" block="call" data={call} onChange={setBlock} isClosed={isClosed} />
        <CallDetailBlock label="Notification details — who you notified" block="notify" data={notify} onChange={setBlock} isClosed={isClosed} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {CALL_TAKER_QUESTIONS.map((x) => (
          <div key={x.id}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: PALETTE.ink, marginBottom: 3 }}>{x.q}</div>
            <input value={(ct.answers || {})[x.id] || ""} onChange={(e) => setAnswer(x.id, e.target.value)} disabled={isClosed} style={{ width: "100%", fontSize: 12.5, boxSizing: "border-box" }} />
          </div>
        ))}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: PALETTE.ink, marginBottom: 3 }}>Notes</div>
          <textarea value={ct.notes} onChange={(e) => setField("notes", e.target.value)} rows={2} disabled={isClosed} style={{ width: "100%", fontSize: 12.5, resize: "vertical", boxSizing: "border-box" }} />
        </div>
      </div>
    </div>
  );
}

// One dated contact block (Date / Time / Person / Contact) for the Call Taker form.
function CallDetailBlock({ label, block, data, onChange, isClosed }) {
  const field = (key, ph, type = "text") => (
    <input type={type} value={data[key] || ""} onChange={(e) => onChange(block, key, e.target.value)} placeholder={ph} disabled={isClosed} style={{ width: "100%", fontSize: 12.5, boxSizing: "border-box" }} />
  );
  return (
    <div style={{ border: `1px solid rgba(0,48,94,0.14)`, padding: 12, background: PALETTE.parchment }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.08em", color: PALETTE.teal, opacity: 0.75, marginBottom: 8, textTransform: "uppercase" }}>{label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
        <div><div style={{ fontSize: 10, color: PALETTE.inkSoft, marginBottom: 3 }}>Date</div>{field("date", "", "date")}</div>
        <div><div style={{ fontSize: 10, color: PALETTE.inkSoft, marginBottom: 3 }}>Time</div>{field("time", "", "time")}</div>
      </div>
      <div style={{ marginBottom: 8 }}><div style={{ fontSize: 10, color: PALETTE.inkSoft, marginBottom: 3 }}>Person</div>{field("person", "Name")}</div>
      <div><div style={{ fontSize: 10, color: PALETTE.inkSoft, marginBottom: 3 }}>Contact number</div>{field("contact", "Phone / email")}</div>
    </div>
  );
}

function MeetingsTab({ incident, update, addTimelineEntry, isClosed }) {
  const meetings = incident.meetings || [];
  const [openId, setOpenId] = useState(meetings[0]?.id || null);
  function addMeeting(type) {
    if (isClosed) return;
    const m = newMeeting(type);
    update((prev) => ({ ...prev, meetings: [m, ...(prev.meetings || [])] }));
    addTimelineEntry({ type: "note", text: `${meetingTypeMeta(type).label} started.` });
    setOpenId(m.id);
  }
  function patch(id, changes) {
    update((prev) => ({ ...prev, meetings: (prev.meetings || []).map((m) => (m.id === id ? { ...m, ...changes } : m)) }));
  }
  function toggleAgenda(id, agId) {
    update((prev) => ({ ...prev, meetings: (prev.meetings || []).map((m) => {
      if (m.id !== id) return m;
      const checks = { ...(m.checks || {}) };
      if (checks[agId]) delete checks[agId]; else checks[agId] = true;
      return { ...m, checks };
    }) }));
  }
  function removeMeeting(id) {
    update((prev) => ({ ...prev, meetings: (prev.meetings || []).filter((m) => m.id !== id) }));
  }
  return (
    <div>
      {!isClosed && (
        <div style={{ marginBottom: 14 }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: PALETTE.teal, opacity: 0.7, marginBottom: 6 }}>START A MEETING</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MEETING_TYPES.map((mt) => (
              <button key={mt.id} onClick={() => addMeeting(mt.id)} className="btn" style={{ fontSize: 12, padding: "8px 12px" }} title={mt.blurb}>
                <Plus size={12} /> {mt.label}
              </button>
            ))}
          </div>
        </div>
      )}
      {meetings.length === 0 ? (
        <p style={{ fontSize: 13, color: PALETTE.inkSoft, fontStyle: "italic" }}>No meetings recorded. Choose a meeting type above — each runs the plan's agenda for that meeting.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {meetings.map((m) => {
            const mt = meetingTypeMeta(m.type);
            const agenda = mt.agenda;
            const done = agenda.filter((a) => m.checks?.[a.id]).length;
            const open = openId === m.id;
            return (
              <div key={m.id} style={{ border: `1px solid rgba(0,48,94,0.14)`, background: PALETTE.paper }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px" }}>
                  <button onClick={() => setOpenId(open ? null : m.id)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left", flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: PALETTE.ink }}>{mt.label} · {formatTime(m.at)}</div>
                    <div className="mono" style={{ fontSize: 9.5, color: PALETTE.inkSoft, marginTop: 2 }}>{done}/{agenda.length} agenda · {open ? "hide" : "open"}</div>
                  </button>
                  {!isClosed && <button onClick={() => removeMeeting(m.id)} className="btn-ghost" style={{ background: "none", border: "none", padding: 2, color: PALETTE.inkSoft, cursor: "pointer" }}><Trash2 size={13} /></button>}
                </div>
                {open && (
                  <div style={{ borderTop: `1px solid rgba(0,48,94,0.1)`, padding: "8px 12px" }}>
                    <p style={{ fontSize: 11, color: PALETTE.inkSoft, lineHeight: 1.5, margin: "0 0 8px" }}>{mt.blurb}</p>
                    {agenda.map((a) => {
                      const ok = !!m.checks?.[a.id];
                      return (
                        <button key={a.id} onClick={() => toggleAgenda(m.id, a.id)} disabled={isClosed} style={{ display: "flex", gap: 9, alignItems: "flex-start", textAlign: "left", width: "100%", padding: "6px 0", background: "none", border: "none", borderBottom: `1px solid rgba(0,48,94,0.06)`, cursor: isClosed ? "default" : "pointer" }}>
                          {ok ? <CheckCircle2 size={15} color={PALETTE.sage} style={{ flexShrink: 0, marginTop: 1 }} /> : <Circle size={15} color={PALETTE.inkSoft} style={{ flexShrink: 0, marginTop: 1, opacity: 0.5 }} />}
                          <span style={{ fontSize: 12.5, lineHeight: 1.4, color: ok ? PALETTE.inkSoft : PALETTE.ink }}>{a.text}</span>
                        </button>
                      );
                    })}
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: PALETTE.ink, marginBottom: 3 }}>Notes / decisions</div>
                      <textarea value={m.notes} onChange={(e) => patch(m.id, { notes: e.target.value })} rows={2} disabled={isClosed} style={{ width: "100%", fontSize: 12.5, resize: "vertical", boxSizing: "border-box" }} />
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 11.5, fontWeight: 600, color: PALETTE.ink, marginBottom: 3 }}>Next meeting</div>
                      <input value={m.nextMeeting} onChange={(e) => patch(m.id, { nextMeeting: e.target.value })} placeholder="e.g. 14:30, Boardroom" disabled={isClosed} style={{ width: "100%", fontSize: 12.5, boxSizing: "border-box" }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BoardsTab({ incident, update, isClosed }) {
  const boards = incident.boards || {};
  const [draft, setDraft] = useState({});
  function addItem(qid) {
    const text = (draft[qid] || "").trim();
    if (!text || isClosed) return;
    update((prev) => ({ ...prev, boards: { ...(prev.boards || {}), [qid]: [...((prev.boards || {})[qid] || []), newBoardItem(text)] } }));
    setDraft((d) => ({ ...d, [qid]: "" }));
  }
  function removeItem(qid, id) {
    update((prev) => ({ ...prev, boards: { ...(prev.boards || {}), [qid]: ((prev.boards || {})[qid] || []).filter((x) => x.id !== id) } }));
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {BOARD_QUADRANTS.map((q) => {
        const items = boards[q.id] || [];
        return (
          <div key={q.id} style={{ border: `1px solid rgba(0,48,94,0.14)`, background: PALETTE.paper }}>
            <div style={{ padding: "9px 12px", background: PALETTE.parchment, borderBottom: `1px solid rgba(0,48,94,0.1)` }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: PALETTE.teal }}>{q.label}</span>
                <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>{items.length}</span>
              </div>
              <div style={{ fontSize: 10.5, color: PALETTE.inkSoft, marginTop: 2 }}>{q.blurb}</div>
            </div>
            <div style={{ padding: "8px 12px" }}>
              {items.length === 0 && <div style={{ fontSize: 12, color: PALETTE.inkSoft, fontStyle: "italic", padding: "4px 0" }}>—</div>}
              {items.map((it) => (
                <div key={it.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "5px 0", borderBottom: `1px solid rgba(0,48,94,0.06)` }}>
                  <span style={{ flex: 1, fontSize: 12.5, lineHeight: 1.45, color: PALETTE.ink }}>{it.text}</span>
                  {!isClosed && <button onClick={() => removeItem(q.id, it.id)} style={{ background: "none", border: "none", cursor: "pointer", color: PALETTE.inkSoft, padding: 0, flexShrink: 0 }} title="Remove"><X size={13} /></button>}
                </div>
              ))}
              {!isClosed && (
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <input
                    value={draft[q.id] || ""}
                    onChange={(e) => setDraft((d) => ({ ...d, [q.id]: e.target.value }))}
                    onKeyDown={(e) => { if (e.key === "Enter") addItem(q.id); }}
                    placeholder={`Add to ${q.label.toLowerCase()}…`}
                    style={{ flex: 1, fontSize: 12.5 }}
                  />
                  <button onClick={() => addItem(q.id)} className="btn" style={{ padding: "6px 10px", fontSize: 12 }}><Plus size={13} /></button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PeopleTab({ incident, update, addTimelineEntry, isClosed }) {
  const people = incident.peopleAtRisk || [];
  const counts = peopleAtRiskCounts(incident);
  function addPerson() {
    if (isClosed) return;
    update((prev) => ({ ...prev, peopleAtRisk: [...(prev.peopleAtRisk || []), newPersonAtRisk()] }));
  }
  function setField(id, field, val) {
    update((prev) => ({ ...prev, peopleAtRisk: (prev.peopleAtRisk || []).map((p) => (p.id === id ? { ...p, [field]: val, updatedAt: Date.now() } : p)) }));
  }
  function removePerson(id) {
    update((prev) => ({ ...prev, peopleAtRisk: (prev.peopleAtRisk || []).filter((p) => p.id !== id) }));
  }
  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <Stat label="Tracked" value={counts.total} color={PALETTE.teal} />
        <Stat label="Injured / hospital" value={counts.injured} color={PALETTE.rust} />
        <Stat label="Unaccounted" value={counts.unaccounted} color={counts.unaccounted ? PALETTE.crimson : PALETTE.sage} />
      </div>
      {people.length === 0 && <p style={{ fontSize: 13, color: PALETTE.inkSoft, fontStyle: "italic", marginBottom: 12 }}>No people logged yet. Track anyone affected — condition, location and next-of-kin status.</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {people.map((p) => {
          const st = PERSON_STATUS[p.status] || PERSON_STATUS.safe;
          return (
            <div key={p.id} style={{ border: `1px solid ${p.status === "unaccounted" ? PALETTE.crimson : "rgba(0,48,94,0.14)"}`, background: PALETTE.paper, padding: 12 }}>
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input value={p.name} onChange={(e) => setField(p.id, "name", e.target.value)} placeholder="Name" disabled={isClosed} style={{ flex: 1, fontSize: 13, fontWeight: 600 }} />
                {!isClosed && <button onClick={() => removePerson(p.id)} className="btn" style={{ padding: "6px 9px" }} title="Remove"><Trash2 size={13} /></button>}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <select value={p.category} onChange={(e) => setField(p.id, "category", e.target.value)} disabled={isClosed} style={{ fontSize: 12 }}>
                  {PERSON_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={p.status} onChange={(e) => setField(p.id, "status", e.target.value)} disabled={isClosed} style={{ fontSize: 12, color: st.color, fontWeight: 600 }}>
                  {Object.entries(PERSON_STATUS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <input value={p.location} onChange={(e) => setField(p.id, "location", e.target.value)} placeholder="Location" disabled={isClosed} style={{ fontSize: 12 }} />
                <input value={p.nok} onChange={(e) => setField(p.id, "nok", e.target.value)} placeholder="Next of kin — notified?" disabled={isClosed} style={{ fontSize: 12 }} />
              </div>
              <input value={p.notes} onChange={(e) => setField(p.id, "notes", e.target.value)} placeholder="Notes" disabled={isClosed} style={{ fontSize: 12, width: "100%", marginTop: 8, boxSizing: "border-box" }} />
            </div>
          );
        })}
      </div>
      {!isClosed && (
        <button onClick={addPerson} className="btn" style={{ width: "100%", justifyContent: "center", marginTop: 12 }}><Plus size={13} /> Add person</button>
      )}
    </div>
  );
}

function SitrepTab({ incident, update, addTimelineEntry, isClosed }) {
  const sitreps = incident.sitreps || [];
  const [form, setForm] = useState(() => newSitrep());
  const [openId, setOpenId] = useState(null);
  function save() {
    if (isClosed) return;
    const hasContent = form.area.trim() || SITREP_FIELDS.some((f) => (form[f.key] || "").trim());
    if (!hasContent) return;
    // Version = the next number in this functional area's SITREP sequence.
    const version = sitreps.filter((s) => (s.area || "").trim().toLowerCase() === form.area.trim().toLowerCase()).length + 1;
    const rec = { ...form, id: `sr${Date.now()}`, ts: Date.now(), version };
    update((prev) => ({ ...prev, sitreps: [rec, ...(prev.sitreps || [])] }));
    addTimelineEntry({ type: "note", text: `SITREP v${version} filed${form.area ? ` — ${form.area}` : ""} (to ${form.sitrepTo || "Planning Coordinator"}).` });
    setForm(newSitrep());
  }
  return (
    <div>
      {!isClosed && (
        <div style={{ border: `1px solid rgba(0,48,94,0.14)`, background: PALETTE.paper, padding: 12, marginBottom: 16 }}>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8 }}>NEW SITUATION REPORT → PLANNING COORDINATOR</div>
          <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} placeholder="Functional area / CIMT role (e.g. College Services)" style={{ width: "100%", fontSize: 12.5, marginBottom: 8, boxSizing: "border-box" }} />
          {SITREP_FIELDS.map((f) => (
            <div key={f.key} style={{ marginBottom: 8 }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: PALETTE.ink }}>{f.label} <span style={{ color: PALETTE.inkSoft, fontWeight: 400 }}>— {f.hint}</span></div>
              <textarea value={form[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} rows={2} style={{ width: "100%", fontSize: 12.5, resize: "vertical", boxSizing: "border-box", marginTop: 3 }} />
            </div>
          ))}
          <button onClick={save} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}><Send size={13} /> File SITREP</button>
        </div>
      )}
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 10 }}>FILED · {sitreps.length}</div>
      {sitreps.length === 0 ? (
        <p style={{ fontSize: 13, color: PALETTE.inkSoft, fontStyle: "italic" }}>No situation reports filed yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sitreps.map((s) => (
            <div key={s.id} style={{ border: `1px solid rgba(0,48,94,0.14)`, background: PALETTE.paper }}>
              <button onClick={() => setOpenId(openId === s.id ? null : s.id)} style={{ width: "100%", textAlign: "left", background: "none", border: "none", padding: "10px 12px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: PALETTE.ink }}>{s.area || "SITREP"}{s.version ? ` · v${s.version}` : ""}</span>
                <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>{formatTime(s.ts)}{s.sitrepTo ? ` · → ${shortRole(s.sitrepTo)}` : ""}</span>
              </button>
              {openId === s.id && (
                <div style={{ padding: "0 12px 12px" }}>
                  {SITREP_FIELDS.filter((f) => (s[f.key] || "").trim()).map((f) => (
                    <div key={f.key} style={{ marginBottom: 6 }}>
                      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: PALETTE.teal, opacity: 0.7 }}>{f.label.toUpperCase()}</div>
                      <div style={{ fontSize: 12.5, lineHeight: 1.5, color: PALETTE.ink, whiteSpace: "pre-wrap" }}>{s[f.key]}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function IAPTab({ incident, update, isClosed }) {
  const iap = incident.iap || emptyIAP();
  function setField(key, val) {
    update((prev) => ({ ...prev, iap: { ...(prev.iap || emptyIAP()), [key]: val, updatedAt: Date.now() } }));
  }
  return (
    <div>
      <p style={{ fontSize: 12.5, color: PALETTE.inkSoft, lineHeight: 1.5, marginTop: 0, marginBottom: 14 }}>
        The Planning Coordinator's Incident Action Plan / briefing (SMEAC). One shared, current plan the CIMT briefs from.
      </p>
      {IAP_FIELDS.map((f) => (
        <div key={f.key} style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: PALETTE.teal }}>{f.label}</div>
          <div style={{ fontSize: 11, color: PALETTE.inkSoft, marginBottom: 4 }}>{f.hint}</div>
          <textarea value={iap[f.key] || ""} onChange={(e) => setField(f.key, e.target.value)} rows={3} disabled={isClosed} style={{ width: "100%", fontSize: 12.5, lineHeight: 1.5, resize: "vertical", boxSizing: "border-box" }} />
        </div>
      ))}
      {iap.updatedAt && <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>Last updated {formatTime(iap.updatedAt)}</div>}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ flex: 1, minWidth: 90, border: `1px solid rgba(0,48,94,0.14)`, background: PALETTE.paper, padding: "8px 10px" }}>
      <div className="display" style={{ fontSize: 22, fontWeight: 500, color: color || PALETTE.teal, lineHeight: 1 }}>{value}</div>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.08em", color: PALETTE.inkSoft, marginTop: 4, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}

/* ---------- Business Continuity (Section Three of the plan) ---------- */
/* ---------- Guided decision flowcharts (the plan's flowcharts, interactive) ---------- */
function FlowchartsDrawer({ incident, update, addTimelineEntry, setDrawer, isClosed }) {
  const flows = decisionFlowsFor(incident.type);
  const [activeId, setActiveId] = useState(null);
  const runs = incident.decisionFlows || {};

  if (activeId) {
    const flow = decisionFlowById(activeId);
    return (
      <DecisionFlowRunner
        flow={flow}
        saved={runs[activeId]}
        isClosed={isClosed}
        onExit={() => setActiveId(null)}
        onJump={(drawerId) => setDrawer(drawerId)}
        persist={(record) => update((prev) => ({ ...prev, decisionFlows: { ...(prev.decisionFlows || {}), [activeId]: record } }))}
        addTimelineEntry={addTimelineEntry}
      />
    );
  }

  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>PLAN FLOWCHARTS · GUIDED</div>
        <div className="display" style={{ fontSize: 20, fontWeight: 500 }}>Walk the decision, step by step.</div>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>The plan's flowcharts, made interactive. Answer each fork and CIMPLE routes you down the correct path — the exact route you take is logged to the timeline.</p>
      </div>
      {flows.map((f) => {
        const run = runs[f.id];
        const typeSpecific = f.appliesTo !== "all";
        return (
          <div key={f.id} style={{ border: `1px solid rgba(0,48,94,0.16)`, padding: 14, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
              <GitBranch size={15} color={PALETTE.teal} />
              <div style={{ fontSize: 14.5, fontWeight: 600, color: PALETTE.teal }}>{f.label}</div>
              {typeSpecific && <span className="chip" style={{ background: PALETTE.parchment, color: PALETTE.rust, borderColor: "rgba(168,85,53,0.3)" }}>For this incident type</span>}
            </div>
            <p style={{ fontSize: 12.5, color: PALETTE.inkSoft, lineHeight: 1.5, margin: "0 0 8px" }}>{f.blurb}</p>
            <div className="mono" style={{ fontSize: 10, color: PALETTE.teal, opacity: 0.6, marginBottom: 10 }}>{f.reference}</div>
            {run && (
              <div style={{ fontSize: 11.5, color: PALETTE.inkSoft, background: PALETTE.bone, padding: "8px 10px", marginBottom: 10, borderLeft: `3px solid ${run.done ? PALETTE.sage : PALETTE.amber}`, lineHeight: 1.5 }}>
                <strong style={{ color: PALETTE.teal }}>{run.done ? "Last walked" : "In progress"}</strong> {formatRelative(run.at)}
                {summarizeFlowPath(run.path) ? <> · {summarizeFlowPath(run.path)}</> : null}
              </div>
            )}
            <button className="btn" onClick={() => setActiveId(f.id)}>
              {run ? (run.done ? "Walk again" : "Resume") : "Start"} <ArrowRight size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

function DecisionFlowRunner({ flow, saved, isClosed, onExit, onJump, persist, addTimelineEntry }) {
  const resumable = saved && !saved.done && saved.currentId && flow.nodes[saved.currentId];
  const [currentId, setCurrentId] = useState(resumable ? saved.currentId : flow.start);
  const [path, setPath] = useState(resumable ? (saved.path || []) : []);
  const node = flow.nodes[currentId];

  const KIND_LABEL = { decision: "Decision", action: "Action", terminal: "Outcome" };
  const toneColor = node.kind === "terminal"
    ? (node.tone === "calm" ? PALETTE.sage : node.tone === "done" ? PALETTE.teal : PALETTE.rust)
    : node.kind === "decision" ? PALETTE.rust : PALETTE.teal;

  function stepTo(choiceLabel, toId) {
    setPath((p) => [...p, { nodeId: currentId, title: node.title, kind: node.kind, choice: choiceLabel }]);
    setCurrentId(toId);
  }
  function goBack() {
    if (!path.length) return;
    const prev = path[path.length - 1];
    setPath((p) => p.slice(0, -1));
    setCurrentId(prev.nodeId);
  }
  function restart() { setPath([]); setCurrentId(flow.start); }
  function finish() {
    const finalPath = [...path, { nodeId: currentId, title: node.title, kind: node.kind, choice: "reached" }];
    persist({ path: finalPath, currentId, done: true, at: Date.now() });
    const summary = summarizeFlowPath(finalPath);
    addTimelineEntry({ type: "action", text: `Flowchart walked — ${flow.label}. ${summary ? "Path: " + summary + ". " : ""}Ended at: ${node.title}.` });
    onExit();
  }
  function jump(drawerId) {
    persist({ path, currentId, done: false, at: Date.now() }); // keep progress across the hand-off
    onJump(drawerId);
  }

  return (
    <div>
      <button className="btn-ghost" onClick={onExit} style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginBottom: 14, opacity: 0.8 }}>
        <ArrowLeft size={13} /> All flowcharts
      </button>

      <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 4 }}>{flow.label.toUpperCase()}</div>

      {/* Trail of forks taken so far */}
      {path.length > 0 && (
        <div style={{ marginBottom: 16, paddingLeft: 4 }}>
          {path.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11.5, color: PALETTE.inkSoft, lineHeight: 1.5, marginBottom: 2 }}>
              <CornerDownRight size={12} style={{ marginTop: 2, opacity: 0.5, flexShrink: 0 }} />
              <span>{s.title.replace(/\?$/, "")}{s.kind === "decision" ? <> — <strong style={{ color: PALETTE.teal }}>{s.choice}</strong></> : null}</span>
            </div>
          ))}
        </div>
      )}

      {/* Current node */}
      <div style={{ border: `1px solid ${toneColor}`, borderTop: `3px solid ${toneColor}`, padding: 18, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
          <span className="chip" style={{ background: toneColor, color: PALETTE.paper, borderColor: toneColor }}>{KIND_LABEL[node.kind]}</span>
          {node.reference && <span className="mono" style={{ fontSize: 9.5, color: PALETTE.teal, opacity: 0.6 }}>{node.reference}</span>}
        </div>
        <div className="display" style={{ fontSize: 20, fontWeight: 500, color: PALETTE.teal, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{node.title}</div>
        {node.help && <p style={{ fontSize: 12.5, color: PALETTE.inkSoft, lineHeight: 1.5, margin: "8px 0 0" }}>{node.help}</p>}
        {node.body && (
          <ul style={{ margin: "12px 0 0", paddingLeft: 18 }}>
            {node.body.map((b, i) => (
              <li key={i} style={{ fontSize: 13, color: PALETTE.ink, lineHeight: 1.55, marginBottom: 4 }}>{b}</li>
            ))}
          </ul>
        )}

        {/* Controls per node kind */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
          {node.kind === "decision" && node.options.map((opt, i) => (
            <button key={i} className="btn" onClick={() => stepTo(opt.label, opt.to)} style={{ justifyContent: "space-between", width: "100%", borderColor: toneColor, color: toneColor, fontWeight: 600 }}>
              {opt.label} <ArrowRight size={14} />
            </button>
          ))}
          {node.action && (
            <button className="btn" onClick={() => jump(node.action.drawer)} style={{ width: "100%", justifyContent: "center" }}>
              {node.action.label} <ArrowRight size={13} />
            </button>
          )}
          {node.kind === "action" && node.to && (
            <button className="btn btn-primary" onClick={() => stepTo("continued", node.to)} style={{ width: "100%", justifyContent: "center" }}>
              Continue <ArrowRight size={14} />
            </button>
          )}
          {node.kind === "terminal" && (
            <button className="btn btn-primary" onClick={finish} disabled={isClosed} style={{ width: "100%", justifyContent: "center", opacity: isClosed ? 0.5 : 1 }}>
              <Check size={14} /> Done — log this path
            </button>
          )}
        </div>
      </div>

      {/* Walk controls */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {path.length > 0 && <button className="btn" onClick={goBack}><ArrowLeft size={13} /> Back a step</button>}
        {path.length > 0 && <button className="btn" onClick={restart}><RotateCcw size={13} /> Start over</button>}
      </div>
      {isClosed && <p style={{ fontSize: 11.5, color: PALETTE.inkSoft, marginTop: 12 }}>This incident is closed — you can review the path, but completing it won't be logged.</p>}
    </div>
  );
}

function ContinuityDrawer({ incident, update, addTimelineEntry, isClosed, initialTab }) {
  const [tab, setTab] = useState(initialTab || "strategies");
  const TABS = [
    { id: "strategies", label: "Recovery Strategies", badge: activeStrategyCount(incident) || null },
    { id: "cbf", label: "Critical Functions", badge: impactedCBFCount(incident) || null },
    { id: "impact", label: "Impact & Issues", badge: null },
  ];
  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 16 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>SECTION THREE · BUSINESS CONTINUITY</div>
        <div className="display" style={{ fontSize: 20, fontWeight: 500 }}>Recover, resume, restore.</div>
        <p style={{ fontSize: 12.5, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>When operations are impacted: activate a time-phased recovery strategy, track the critical business functions against their RTOs, and assess the impact. Owned by the Recovery &amp; Planning Coordinators.</p>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {TABS.map((t) => {
          const on = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "7px 11px", fontSize: 12, cursor: "pointer", fontWeight: on ? 600 : 500,
              background: on ? PALETTE.teal : PALETTE.paper, color: on ? PALETTE.paper : PALETTE.ink,
              border: `1px solid ${on ? PALETTE.teal : "rgba(0,48,94,0.18)"}`, display: "flex", alignItems: "center", gap: 6,
            }}>
              {t.label}
              {t.badge != null && <span className="mono" style={{ fontSize: 9, color: on ? PALETTE.paper : PALETTE.inkSoft }}>{t.badge}</span>}
            </button>
          );
        })}
      </div>
      {tab === "strategies" && <StrategiesTab incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} />}
      {tab === "cbf" && <CBFTab incident={incident} update={update} isClosed={isClosed} />}
      {tab === "impact" && <ImpactTab incident={incident} update={update} addTimelineEntry={addTimelineEntry} isClosed={isClosed} />}
    </div>
  );
}

function StrategiesTab({ incident, update, addTimelineEntry, isClosed }) {
  const suggested = suggestedStrategyIds(incident.type);
  const [openId, setOpenId] = useState(suggested[0] || null);
  function toggleActivate(id) {
    if (isClosed) return;
    const was = strategyActivated(incident, id);
    update((prev) => ({ ...prev, recovery: { ...(prev.recovery || {}), strategies: { ...((prev.recovery || {}).strategies || {}), [id]: { activated: !was } } } }));
    addTimelineEntry({ type: was ? "system" : "action", text: `Recovery strategy ${was ? "deactivated" : "ACTIVATED"} — ${recoveryStrategyById(id).label}.` });
    if (!was) setOpenId(id);
  }
  function toggleStep(stepId) {
    if (isClosed) return;
    update((prev) => {
      const checks = { ...((prev.recovery || {}).checks || {}) };
      if (checks[stepId]) delete checks[stepId]; else checks[stepId] = true;
      return { ...prev, recovery: { ...(prev.recovery || {}), checks } };
    });
  }
  return (
    <div>
      {suggested.length > 0 && (
        <p style={{ fontSize: 12, color: PALETTE.inkSoft, lineHeight: 1.5, margin: "0 0 14px", padding: "8px 10px", background: PALETTE.parchment, border: `1px solid rgba(0,48,94,0.1)` }}>
          Suggested for <strong style={{ color: PALETTE.teal }}>{incident.typeLabel}</strong>: {suggested.map((id) => recoveryStrategyById(id)?.label).join(" · ")}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {RECOVERY_STRATEGIES.map((s) => {
          const on = strategyActivated(incident, s.id);
          const prog = strategyProgress(incident, s.id);
          const isSug = suggested.includes(s.id);
          const open = openId === s.id;
          const checks = incident.recovery?.checks || {};
          return (
            <div key={s.id} style={{ border: `1px solid ${on ? PALETTE.sage : "rgba(0,48,94,0.14)"}`, background: PALETTE.paper }}>
              <div style={{ padding: "11px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: PALETTE.ink, lineHeight: 1.3 }}>{s.label}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
                      {isSug && <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.08em", color: PALETTE.rust, textTransform: "uppercase" }}>◆ suggested</span>}
                      {on && <span className="mono" style={{ fontSize: 9.5, color: PALETTE.sage }}>{prog.done}/{prog.total} steps</span>}
                    </div>
                  </div>
                  <button onClick={() => toggleActivate(s.id)} disabled={isClosed} className="btn" style={on ? { borderColor: PALETTE.sage, color: PALETTE.sage, flexShrink: 0 } : { flexShrink: 0 }}>
                    {on ? <><Check size={13} /> Activated</> : "Activate"}
                  </button>
                </div>
                <button onClick={() => setOpenId(open ? null : s.id)} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 11, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                  {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {open ? "Hide" : "View"} the {s.steps.length}-step plan
                </button>
              </div>
              {open && (
                <div style={{ borderTop: `1px solid rgba(0,48,94,0.1)`, padding: "8px 12px" }}>
                  {s.steps.map((st) => {
                    const done = !!checks[st.id];
                    return (
                      <button key={st.id} onClick={() => toggleStep(st.id)} disabled={isClosed || !on} style={{
                        display: "flex", gap: 9, alignItems: "flex-start", textAlign: "left", width: "100%",
                        padding: "7px 0", background: "none", border: "none", borderBottom: `1px solid rgba(0,48,94,0.06)`,
                        cursor: isClosed || !on ? "default" : "pointer", opacity: on ? 1 : 0.55,
                      }}>
                        {done ? <CheckCircle2 size={16} color={PALETTE.sage} style={{ flexShrink: 0, marginTop: 1 }} /> : <Circle size={16} color={PALETTE.inkSoft} style={{ flexShrink: 0, marginTop: 1, opacity: 0.5 }} />}
                        <div style={{ flex: 1 }}>
                          <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.06em", color: PALETTE.teal, background: "rgba(0,48,94,0.07)", padding: "1px 5px", marginRight: 6 }}>{st.timing}</span>
                          <span style={{ fontSize: 12.5, lineHeight: 1.45, color: done ? PALETTE.inkSoft : PALETTE.ink, textDecoration: done ? "line-through" : "none" }}>{st.text}</span>
                        </div>
                      </button>
                    );
                  })}
                  {!on && <p style={{ fontSize: 11, color: PALETTE.inkSoft, fontStyle: "italic", marginTop: 8 }}>Activate this strategy to work its checklist.</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CBFTab({ incident, update, isClosed }) {
  const imp = incident.recovery?.impacted || {};
  const count = impactedCBFCount(incident);
  function toggle(id) {
    if (isClosed) return;
    update((prev) => {
      const impacted = { ...((prev.recovery || {}).impacted || {}) };
      if (impacted[id]) delete impacted[id]; else impacted[id] = true;
      return { ...prev, recovery: { ...(prev.recovery || {}), impacted } };
    });
  }
  return (
    <div>
      <p style={{ fontSize: 12.5, color: PALETTE.inkSoft, lineHeight: 1.5, marginTop: 0, marginBottom: 12 }}>
        Recovery Coordinator: mark the functions impacted by this incident. Ordered by Recovery Time Objective (RTO) — the reddest recover within the hour.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <Stat label="Impacted" value={count} color={count ? PALETTE.rust : PALETTE.sage} />
        <Stat label="In register" value={CRITICAL_BUSINESS_FUNCTIONS.length} color={PALETTE.teal} />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {CRITICAL_BUSINESS_FUNCTIONS.map((c) => {
          const on = !!imp[c.id];
          const color = cbfTierColor(c.mins);
          return (
            <button key={c.id} onClick={() => toggle(c.id)} disabled={isClosed} style={{
              display: "flex", gap: 10, alignItems: "center", textAlign: "left", width: "100%",
              padding: "9px 6px", background: on ? "rgba(168,85,53,0.06)" : "none", border: "none",
              borderBottom: `1px solid rgba(0,48,94,0.07)`, cursor: isClosed ? "default" : "pointer",
            }}>
              <div style={{ width: 15, height: 15, flexShrink: 0, border: `1.5px solid ${on ? PALETTE.rust : "rgba(0,48,94,0.3)"}`, background: on ? PALETTE.rust : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {on && <Check size={10} color={PALETTE.paper} strokeWidth={3} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: PALETTE.ink, lineHeight: 1.35 }}>{c.task}</div>
                <div className="mono" style={{ fontSize: 9.5, color: PALETTE.inkSoft, marginTop: 2 }}>{c.unit}</div>
              </div>
              <span className="mono" style={{ fontSize: 9.5, fontWeight: 600, color: PALETTE.paper, background: color, padding: "2px 7px", flexShrink: 0 }}>{c.rto}</span>
            </button>
          );
        })}
      </div>
      <p style={{ fontSize: 11, color: PALETTE.inkSoft, fontStyle: "italic", marginTop: 10 }}>Representative short-RTO set from the Business Impact Analysis — not the full register.</p>
    </div>
  );
}

function ImpactTab({ incident, update, addTimelineEntry, isClosed }) {
  const impact = incident.recovery?.impact || {};
  const issues = incident.recovery?.issues || {};
  const [openDim, setOpenDim] = useState(null);

  function setDim(dim, level) {
    update((prev) => ({ ...prev, recovery: { ...(prev.recovery || {}), impact: { ...((prev.recovery || {}).impact || {}), [dim]: level } } }));
  }
  function setIssues(dim, rows) {
    update((prev) => ({ ...prev, recovery: { ...(prev.recovery || {}), issues: { ...((prev.recovery || {}).issues || {}), [dim]: rows } } }));
  }
  function addIssue(dim) {
    setIssues(dim, [...(issues[dim] || []), newImpactIssue()]);
    setOpenDim(dim);
  }
  function patchIssue(dim, id, key, val) {
    setIssues(dim, (issues[dim] || []).map((r) => (r.id === id ? { ...r, [key]: val } : r)));
  }
  function removeIssue(dim, id) {
    setIssues(dim, (issues[dim] || []).filter((r) => r.id !== id));
  }
  // Feed the plan: an issue's Action becomes a task (owner = Who) on the board.
  function issueToTask(dim, row) {
    if (!row.action.trim() || row.taskId) return;
    const t = {
      id: `tk${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      text: row.action.trim(),
      role: null,
      owner: row.who ? disambiguatedInitials(row.who, (incident.roles || []).map((r) => r.staff)) : "—",
      phase: incidentPhase(incident),
      done: false,
      priority: "med",
      dueAt: undefined,
      fromIssue: `${dim}: ${row.issue || row.action}`.slice(0, 80),
    };
    update((prev) => ({
      ...prev,
      tasks: [...(prev.tasks || []), t],
      recovery: { ...(prev.recovery || {}), issues: { ...((prev.recovery || {}).issues || {}), [dim]: (((prev.recovery || {}).issues || {})[dim] || []).map((r) => (r.id === row.id ? { ...r, taskId: t.id } : r)) } },
    }));
    addTimelineEntry && addTimelineEntry({ type: "action", text: `Issue action added to the task board (${dim}): ${row.action.trim()}.` });
  }

  return (
    <div>
      <p style={{ fontSize: 12.5, color: PALETTE.inkSoft, lineHeight: 1.5, marginTop: 0, marginBottom: 14 }}>
        Planning Coordinator: rate the impact across each dimension, then log the issues each raises and how they'll be actioned. Repeat at intervals as the incident evolves. Issue actions can be sent to the task board.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {IMPACT_DIMENSIONS.map((dim) => {
          const lvl = impact[dim] || 0;
          const rows = issues[dim] || [];
          const crit = (IMPACT_CRITERIA[dim] || [])[lvl];
          const isOpen = openDim === dim;
          return (
            <div key={dim} style={{ border: `1px solid rgba(0,48,94,0.12)`, borderLeft: `3px solid ${IMPACT_LEVEL_COLORS[lvl]}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px" }}>
                <button onClick={() => setOpenDim(isOpen ? null : dim)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", flex: 1, textAlign: "left", fontSize: 12.5, fontWeight: 600, color: PALETTE.ink, display: "flex", alignItems: "center", gap: 6 }}>
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}{dim}
                  {rows.length > 0 && <span className="mono" style={{ fontSize: 9, color: PALETTE.inkSoft }}>· {rows.length} issue{rows.length > 1 ? "s" : ""}</span>}
                </button>
                <select value={lvl} onChange={(e) => setDim(dim, Number(e.target.value))} disabled={isClosed} style={{ fontSize: 12, width: 140, color: IMPACT_LEVEL_COLORS[lvl], fontWeight: lvl ? 600 : 400 }}>
                  {IMPACT_LEVELS.map((l, i) => <option key={i} value={i}>{l}</option>)}
                </select>
              </div>
              {isOpen && (
                <div style={{ padding: "4px 12px 12px", borderTop: `1px solid rgba(0,48,94,0.08)` }}>
                  {lvl > 0 && crit && crit !== "—" && (
                    <div style={{ fontSize: 11, color: PALETTE.inkSoft, fontStyle: "italic", margin: "8px 0" }}>{IMPACT_LEVELS[lvl]}: {crit}</div>
                  )}
                  {rows.length === 0 && <p style={{ fontSize: 11.5, color: PALETTE.inkSoft, margin: "8px 0" }}>No issues logged for this dimension yet.</p>}
                  {rows.map((r) => (
                    <div key={r.id} style={{ border: `1px solid rgba(0,48,94,0.1)`, padding: 8, marginBottom: 8, background: PALETTE.parchment }}>
                      <input value={r.issue} onChange={(e) => patchIssue(dim, r.id, "issue", e.target.value)} placeholder="Issue — what problem does this raise?" disabled={isClosed} style={{ width: "100%", fontSize: 12, marginBottom: 6, boxSizing: "border-box" }} />
                      <input value={r.action} onChange={(e) => patchIssue(dim, r.id, "action", e.target.value)} placeholder="Action — what will be done?" disabled={isClosed} style={{ width: "100%", fontSize: 12, marginBottom: 6, boxSizing: "border-box" }} />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 6, alignItems: "center" }}>
                        <input value={r.who} onChange={(e) => patchIssue(dim, r.id, "who", e.target.value)} placeholder="Who" disabled={isClosed} style={{ fontSize: 12, boxSizing: "border-box" }} />
                        <input value={r.when} onChange={(e) => patchIssue(dim, r.id, "when", e.target.value)} placeholder="When" disabled={isClosed} style={{ fontSize: 12, boxSizing: "border-box" }} />
                        {!isClosed && <button onClick={() => removeIssue(dim, r.id)} className="btn-ghost" style={{ background: "none", border: "none", padding: 4, color: PALETTE.inkSoft, cursor: "pointer" }}><Trash2 size={13} /></button>}
                      </div>
                      {!isClosed && (
                        <div style={{ marginTop: 6 }}>
                          {r.taskId
                            ? <span className="mono" style={{ fontSize: 9.5, color: PALETTE.sage }}>✓ ON TASK BOARD</span>
                            : <button onClick={() => issueToTask(dim, r)} disabled={!r.action.trim()} className="btn" style={{ padding: "4px 9px", fontSize: 11, opacity: r.action.trim() ? 1 : 0.5 }}><ListChecks size={11} /> Send action to board</button>}
                        </div>
                      )}
                    </div>
                  ))}
                  {!isClosed && <button onClick={() => addIssue(dim)} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, fontSize: 11.5, color: PALETTE.teal, cursor: "pointer", fontWeight: 500 }}>+ Add an issue</button>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniList({ title, items }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.1em", color: PALETTE.teal, opacity: 0.7, marginBottom: 5, textTransform: "uppercase" }}>{title}</div>
      <ul style={{ margin: 0, paddingLeft: 16 }}>
        {items.map((it, i) => <li key={i} style={{ fontSize: 12, lineHeight: 1.5, color: PALETTE.ink, marginBottom: 3 }}>{it}</li>)}
      </ul>
    </div>
  );
}

function CommsDrawer({ incident, update, addTimelineEntry, isClosed }) {
  const comms = incident.comms || [];
  const [view, setView] = useState("list"); // "list" | "compose"
  const [editing, setEditing] = useState(null); // draft comm being composed
  const [aiState, setAiState] = useState("idle"); // idle | loading | error | done
  const [aiNote, setAiNote] = useState("");
  const [showMedia, setShowMedia] = useState(false);

  const cilRole = (incident.roles || []).find((r) => r.role === "Critical Incident Leader" && roleIsAssigned(r));
  const principalName = cilRole?.staff || "Principal";
  const commsLevel = incident.commsLevel || null;

  function setLevel(lvl) {
    if (isClosed) return;
    update({ commsLevel: lvl });
    addTimelineEntry({ type: "system", text: `Communications exposure level set to L${lvl} — ${COMMS_LEVELS[lvl].label}.` });
  }

  function setAnswer(qid, val) {
    update((prev) => ({ ...prev, mediaQA: { ...(prev.mediaQA || {}), [qid]: val } }));
  }
  function copyFAQ() {
    const text = buildFAQText(incident);
    try { navigator.clipboard?.writeText(text); } catch { /* clipboard may be blocked */ }
    addTimelineEntry({ type: "comm", text: `Media FAQ compiled (${mediaQAProgress(incident).done} answered) — single source of truth for spokesperson & channels.` });
  }
  const qa = mediaQAProgress(incident);

  function persistComms(nextComms) {
    update((prev) => ({ ...prev, comms: nextComms }));
  }

  function startFromTemplate(tpl) {
    setAiState("idle");
    setAiNote("");
    setEditing({
      templateId: tpl?.id || null,
      name: tpl?.name || "New message",
      audienceId: tpl?.audienceId || "parents_all",
      channels: tpl?.channels ? [...tpl.channels] : [],
      body: tpl ? fillTemplate(tpl.body, incident) : "",
    });
    setView("compose");
  }

  function toggleChannel(id) {
    setEditing((e) => ({
      ...e,
      channels: e.channels.includes(id) ? e.channels.filter((c) => c !== id) : [...e.channels, id],
    }));
  }

  async function runAIDraft() {
    if (!editing) return;
    setAiState("loading");
    setAiNote("");
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          incidentType: incident.typeLabel,
          audience: audienceLabel(editing.audienceId),
          channels: editing.channels.map(channelLabel),
          seed: editing.body,
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = await res.json();
      if (!data.text) throw new Error("empty");
      setEditing((e) => ({ ...e, body: data.text }));
      setAiState("done");
      setAiNote("AI draft generated — review and edit before approval.");
    } catch {
      setAiState("error");
      setAiNote("AI drafting unavailable in this environment — the template text is kept. (Set ANTHROPIC_API_KEY on the server to enable.)");
    }
  }

  function saveDraft() {
    if (!editing) return;
    const comm = newComm(editing);
    persistComms([comm, ...comms]);
    addTimelineEntry({ type: "comm", text: `Communication drafted — "${comm.name}" for ${audienceLabel(comm.audienceId)}.` });
    setEditing(null);
    setView("list");
  }

  function approve(id) {
    const c = comms.find((x) => x.id === id);
    persistComms(comms.map((x) => (x.id === id ? { ...x, status: "approved", approvedBy: principalName, approvedAt: Date.now() } : x)));
    addTimelineEntry({ type: "comm", text: `Communication approved by ${principalName} (Critical Incident Leader) — "${c.name}".` });
  }

  function dispatchComm(id) {
    const c = comms.find((x) => x.id === id);
    const chans = c.channels.map(channelLabel).join(", ") || "no channel selected";
    persistComms(comms.map((x) => (x.id === id ? { ...x, status: "dispatched", dispatchedAt: Date.now() } : x)));
    addTimelineEntry({ type: "comm", text: `Communication dispatched to ${audienceLabel(c.audienceId)} via ${chans} — "${c.name}".` });
  }

  function removeComm(id) {
    persistComms(comms.filter((x) => x.id !== id));
  }

  // ---- Compose view ----
  if (view === "compose" && editing) {
    return (
      <div>
        <button onClick={() => { setView("list"); setEditing(null); }} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
          <ArrowLeft size={13} /> Back to messages
        </button>

        <Section title="Message name">
          <input type="text" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
        </Section>

        <Section title="Audience">
          <select value={editing.audienceId} onChange={(e) => setEditing({ ...editing, audienceId: e.target.value })}>
            {COMMS_AUDIENCES.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
          </select>
        </Section>

        <Section title="Channels">
          <div style={{ display: "grid", gap: 6 }}>
            {COMMS_CHANNELS.map((ch) => {
              const on = editing.channels.includes(ch.id);
              return (
                <button key={ch.id} onClick={() => toggleChannel(ch.id)} style={{
                  display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                  padding: "9px 12px", background: on ? PALETTE.tealMist : PALETTE.paper,
                  border: `1px solid ${on ? PALETTE.teal : "rgba(0,48,94,0.15)"}`, cursor: "pointer",
                }}>
                  <div style={{ width: 16, height: 16, flexShrink: 0, border: `1.5px solid ${on ? PALETTE.teal : "rgba(0,48,94,0.3)"}`, background: on ? PALETTE.teal : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {on && <Check size={11} color={PALETTE.paper} strokeWidth={3} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: PALETTE.ink }}>{ch.label}</div>
                    <div className="mono" style={{ fontSize: 9.5, letterSpacing: "0.04em", color: PALETTE.inkSoft, marginTop: 2 }}>{ch.note}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        <Section title="Message body">
          <textarea value={editing.body} onChange={(e) => setEditing({ ...editing, body: e.target.value })} rows={10} style={{ resize: "vertical", lineHeight: 1.55, fontSize: 13 }} />
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
            <button onClick={runAIDraft} disabled={aiState === "loading"} className="btn" style={{ fontSize: 12 }}>
              <Sparkles size={13} /> {aiState === "loading" ? "Drafting…" : "AI draft"}
            </button>
            <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>Human reviews before sending</span>
          </div>
          {aiNote && (
            <p style={{ fontSize: 12, lineHeight: 1.5, color: aiState === "error" ? PALETTE.rust : PALETTE.sage, marginTop: 10, marginBottom: 0 }}>{aiNote}</p>
          )}
        </Section>

        <button onClick={saveDraft} className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8 }}>
          <FileText size={14} /> Save as draft
        </button>
      </div>
    );
  }

  // ---- Media Q&A / FAQ view ----
  if (view === "qa") {
    return (
      <div>
        <button onClick={() => setView("list")} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 12, display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
          <ArrowLeft size={13} /> Back to messages
        </button>
        <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 16 }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>SPOKESPERSON PREP · FAQ SINGLE-SOURCE-OF-TRUTH</div>
          <div className="display" style={{ fontSize: 20, fontWeight: 500 }}>Media Q&amp;A</div>
          <p style={{ fontSize: 12.5, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>
            Pre-draft answers to the questions journalists ask. Keep to verified facts — no speculation. Answered items form the College's media FAQ. Only the spokesperson ({principalName}) speaks to media.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 5, background: "rgba(0,48,94,0.1)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ width: `${qa.total ? (qa.done / qa.total) * 100 : 0}%`, height: "100%", background: PALETTE.teal }} />
          </div>
          <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>{qa.done}/{qa.total} answered</span>
          <button onClick={copyFAQ} className="btn" style={{ fontSize: 11, padding: "6px 10px" }} disabled={qa.done === 0}><FileText size={12} /> Copy FAQ</button>
        </div>

        {MEDIA_QA_CATEGORIES.map((cat) => {
          const qs = MEDIA_QA_QUESTIONS.filter((x) => x.cat === cat.id);
          return (
            <div key={cat.id} style={{ marginBottom: 18 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: "0.1em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8, textTransform: "uppercase" }}>{cat.label}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {qs.map((x) => {
                  const val = (incident.mediaQA || {})[x.id] || "";
                  return (
                    <div key={x.id}>
                      <div style={{ fontSize: 12.5, fontWeight: 500, color: PALETTE.ink, marginBottom: 4, display: "flex", alignItems: "flex-start", gap: 6 }}>
                        {val.trim() ? <CheckCircle2 size={13} color={PALETTE.sage} style={{ flexShrink: 0, marginTop: 2 }} /> : <Circle size={13} color={PALETTE.inkSoft} style={{ flexShrink: 0, marginTop: 2, opacity: 0.5 }} />}
                        {x.q}
                      </div>
                      <textarea
                        value={val}
                        onChange={(e) => setAnswer(x.id, e.target.value)}
                        disabled={isClosed}
                        rows={2}
                        placeholder="Draft a factual answer…"
                        style={{ width: "100%", resize: "vertical", fontSize: 12.5, lineHeight: 1.5, boxSizing: "border-box" }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // ---- List view ----
  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 20 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>MODULE M4 · COMMUNICATIONS</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>Draft, approve, dispatch.</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>
          Every message is drafted, signed off by the Critical Incident Leader ({principalName}), then released. Nothing is sent automatically.
          {incident.isDrill && " Drill mode — dispatch is simulated."}
        </p>
      </div>

      {/* Exposure level (Crisis Comms Strategy — Assess) */}
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 8 }}>MEDIA EXPOSURE LEVEL</div>
      <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
        {[1, 2, 3, 4].map((lvl) => {
          const cfg = COMMS_LEVELS[lvl];
          const on = commsLevel === lvl;
          return (
            <button key={lvl} onClick={() => setLevel(lvl)} disabled={isClosed} title={cfg.blurb} style={{
              flex: 1, padding: "7px 6px", cursor: isClosed ? "default" : "pointer",
              background: on ? cfg.color : PALETTE.paper, color: on ? PALETTE.paper : PALETTE.ink,
              border: `1px solid ${on ? cfg.color : "rgba(0,48,94,0.18)"}`, fontSize: 11, fontWeight: on ? 600 : 500,
            }}>L{lvl}</button>
          );
        })}
      </div>
      <p style={{ fontSize: 11.5, color: PALETTE.inkSoft, lineHeight: 1.5, margin: "0 0 16px" }}>
        {commsLevel ? <><strong style={{ color: COMMS_LEVELS[commsLevel].color }}>{COMMS_LEVELS[commsLevel].label}.</strong> {COMMS_LEVELS[commsLevel].blurb}</> : "Assess the exposure level to set the intensity of the comms response."}
      </p>

      {/* Media handling & spokesperson protocol (Crisis Comms Plan) */}
      <button onClick={() => setShowMedia((s) => !s)} className="btn-ghost" style={{ background: PALETTE.parchment, border: `1px solid rgba(0,48,94,0.12)`, width: "100%", textAlign: "left", padding: "10px 12px", marginBottom: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, fontWeight: 600, color: PALETTE.teal }}><Mic size={14} /> Media handling & spokesperson</span>
        {showMedia ? <ChevronUp size={14} color={PALETTE.teal} /> : <ChevronDown size={14} color={PALETTE.teal} />}
      </button>
      {showMedia && (
        <div style={{ marginBottom: 18, padding: "2px 2px 0", fontSize: 12.5, lineHeight: 1.55, color: PALETTE.ink }}>
          <p style={{ margin: "0 0 8px" }}><strong>Spokesperson:</strong> {MEDIA_PROTOCOL.spokesperson}</p>
          <p style={{ margin: "0 0 10px", color: PALETTE.inkSoft }}>{MEDIA_PROTOCOL.activates}</p>
          <MiniList title="Media rules" items={MEDIA_PROTOCOL.rules} />
          <MiniList title="Reception script (when a reporter calls)" items={RECEPTION_SCRIPT} />
          <MiniList title="Social-media guardrails" items={SOCIAL_RULES} />
        </div>
      )}

      {/* Media Q&A / FAQ builder entry */}
      <button onClick={() => setView("qa")} style={{
        width: "100%", textAlign: "left", padding: "11px 12px", marginBottom: 18, cursor: "pointer",
        background: PALETTE.paper, border: `1px solid rgba(0,48,94,0.15)`, borderLeft: `3px solid ${PALETTE.rust}`,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <FileText size={15} color={PALETTE.rust} />
          <span>
            <span style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: PALETTE.ink }}>Media Q&amp;A / FAQ prep</span>
            <span className="mono" style={{ fontSize: 9.5, color: PALETTE.inkSoft }}>Spokesperson answers to journalist questions · FAQ single-source-of-truth</span>
          </span>
        </span>
        <span className="mono" style={{ fontSize: 10, color: qa.done ? PALETTE.sage : PALETTE.inkSoft, flexShrink: 0 }}>{qa.done}/{qa.total}</span>
      </button>

      {isClosed && <p style={{ fontSize: 12, color: PALETTE.inkSoft, marginBottom: 16 }}>This incident is closed — messages are read-only.</p>}

      {!isClosed && (
        <>
          <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 10 }}>START FROM A TEMPLATE</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
            {templatesForIncidentType(incident.type).map((tpl) => {
              const cat = COMMS_CATEGORIES[tpl.category] || {};
              const suited = tpl.suggestedTypes.includes(incident.type);
              return (
                <button key={tpl.id} onClick={() => startFromTemplate(tpl)} style={{
                  textAlign: "left", padding: "10px 12px", background: PALETTE.paper,
                  border: `1px solid rgba(0,48,94,0.15)`, borderLeft: `3px solid ${cat.color || PALETTE.teal}`, cursor: "pointer",
                }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: PALETTE.ink, lineHeight: 1.3 }}>{tpl.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5, flexWrap: "wrap" }}>
                    <span className="mono" style={{ fontSize: 9, letterSpacing: "0.08em", color: cat.color || PALETTE.inkSoft, textTransform: "uppercase" }}>{cat.label}</span>
                    {tpl.phase && <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.06em", color: PALETTE.inkSoft }}>· {commsPhaseMeta(tpl.phase)?.label}</span>}
                  </div>
                  {tpl.owner && <div className="mono" style={{ fontSize: 9, color: PALETTE.inkSoft, marginTop: 3 }}>{tpl.owner}</div>}
                  {suited && <div className="mono" style={{ fontSize: 8.5, letterSpacing: "0.1em", color: PALETTE.sage, marginTop: 4, textTransform: "uppercase" }}>◆ suggested</div>}
                </button>
              );
            })}
          </div>
          <button onClick={() => startFromTemplate(null)} className="btn" style={{ width: "100%", justifyContent: "center", marginBottom: 24 }}>
            <Plus size={13} /> Blank message
          </button>
        </>
      )}

      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 10 }}>
        MESSAGES · {comms.length}
      </div>
      {comms.length === 0 ? (
        <p style={{ fontSize: 13, color: PALETTE.inkSoft, fontStyle: "italic" }}>No communications yet. Start one from a template above.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {comms.map((c) => <CommCard key={c.id} comm={c} isClosed={isClosed} onApprove={() => approve(c.id)} onDispatch={() => dispatchComm(c.id)} onDelete={() => removeComm(c.id)} isDrill={incident.isDrill} />)}
        </div>
      )}
    </div>
  );
}

function CommCard({ comm, isClosed, onApprove, onDispatch, onDelete, isDrill }) {
  const st = COMMS_STATUS[comm.status] || COMMS_STATUS.draft;
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid rgba(0,48,94,0.14)`, background: PALETTE.paper }}>
      <div style={{ padding: "12px 14px", borderBottom: open ? `1px solid rgba(0,48,94,0.1)` : "none" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: PALETTE.ink }}>{comm.name}</div>
            <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 4 }}>{audienceLabel(comm.audienceId)}</div>
          </div>
          <span className="chip" style={{ borderColor: st.color, color: st.color, flexShrink: 0 }}>{st.label}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
          {comm.channels.length ? comm.channels.map((ch) => (
            <span key={ch} className="mono" style={{ fontSize: 9, letterSpacing: "0.06em", color: PALETTE.teal, border: `1px solid rgba(0,48,94,0.2)`, padding: "2px 6px" }}>{channelLabel(ch)}</span>
          )) : <span className="mono" style={{ fontSize: 9, color: PALETTE.rust }}>NO CHANNEL SELECTED</span>}
        </div>
        <button onClick={() => setOpen((o) => !o)} className="btn-ghost" style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 11, marginTop: 10, display: "flex", alignItems: "center", gap: 4 }}>
          {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {open ? "Hide" : "Preview"} message
        </button>
        {open && (
          <p style={{ fontSize: 12.5, lineHeight: 1.55, color: PALETTE.ink, marginTop: 10, marginBottom: 0, whiteSpace: "pre-wrap", background: PALETTE.parchment, padding: 12, border: `1px solid rgba(0,48,94,0.08)` }}>{comm.body}</p>
        )}
      </div>
      {!isClosed && (
        <div style={{ display: "flex", gap: 6, padding: "10px 14px", background: PALETTE.parchment }}>
          {comm.status === "draft" && (
            <button onClick={onApprove} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "7px 10px", fontSize: 12 }}><Check size={12} /> Approve</button>
          )}
          {comm.status === "approved" && (
            <button onClick={onDispatch} className="btn btn-primary" style={{ flex: 1, justifyContent: "center", padding: "7px 10px", fontSize: 12 }}><Megaphone size={12} /> {isDrill ? "Dispatch (simulated)" : "Mark dispatched"}</button>
          )}
          {comm.status === "dispatched" && (
            <span style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: PALETTE.sage }}><CheckCircle2 size={13} /> Dispatched {comm.dispatchedAt ? formatTime(comm.dispatchedAt) : ""}</span>
          )}
          {comm.status !== "dispatched" && (
            <button onClick={onDelete} className="btn" style={{ padding: "7px 10px", fontSize: 12 }} title="Delete draft"><X size={13} /></button>
          )}
        </div>
      )}
    </div>
  );
}

function ExportDrawer({ incident }) {
  const sections = [
    { k: "Incident metadata", v: `${incident.id} · ${incident.title}` },
    { k: "Severity level", v: SEVERITY[incident.severity].label },
    { k: "Status", v: incident.status === "active" ? "Active" : "Closed" },
    { k: "Timeline entries", v: `${incident.timeline.length} entries` },
    { k: "Assigned roles", v: `${incident.roles.filter((r) => r.status !== "unassigned").length} staff` },
    { k: "Tasks (open / total)", v: `${incident.tasks.filter((t) => !t.done).length} / ${incident.tasks.length}` },
    { k: "EMP references", v: incident.empSection },
    { k: "Policy references", v: `${(incident.policies || []).length} linked` },
    { k: "Student profile", v: incident.student ? incident.student.initials + " · attached" : "n/a" },
    { k: "Activation", v: incident.activation ? `declared ${formatTime(incident.activation.declaredAt)} · ${ackRollup(incident)}` : "not activated" },
    { k: "Decisions logged", v: decisionsSummary(incident.decisions) },
    { k: "Risk / watch register", v: risksSummary(incident) },
    { k: "Communications log", v: commsSummary(incident.comms) },
    { k: "Media Q&A / FAQ", v: (() => { const p = mediaQAProgress(incident); return p.done ? `${p.done}/${p.total} answered` : "not started"; })() },
    { k: "Visual boards", v: (() => { const b = boardCounts(incident); return `${b.facts}F · ${b.assumptions}A · ${b.issues}I · ${b.actions}Ac`; })() },
    { k: "People at risk", v: (() => { const p = peopleAtRiskCounts(incident); return p.total ? `${p.total} tracked · ${p.injured} injured · ${p.unaccounted} unaccounted` : "none logged"; })() },
    { k: "Call Taker intake", v: (() => { const p = callTakerProgress(incident); return p.done ? `${p.done}/${p.total} captured` : "not started"; })() },
    { k: "CIMT meetings", v: `${(incident.meetings || []).length}` },
    { k: "SITREPs filed", v: `${(incident.sitreps || []).length}` },
    { k: "Incident Action Plan", v: incident.iap?.updatedAt ? `updated ${formatTime(incident.iap.updatedAt)}` : "not started" },
    { k: "Recovery strategies active", v: (() => { const n = activeStrategyCount(incident); return n ? RECOVERY_STRATEGIES.filter((s) => strategyActivated(incident, s.id)).map((s) => s.label).join("; ") : "none"; })() },
    { k: "Critical functions impacted", v: `${impactedCBFCount(incident)} of ${CRITICAL_BUSINESS_FUNCTIONS.length}` },
    { k: "Post-incident review", v: incident.pir ? `${(PIR_STATUS[incident.pir.status] || {}).label || "Draft"} · ${(incident.pir.correctiveActions || []).length} actions` : "not started" },
    { k: "Flowcharts walked", v: (() => { const runs = Object.entries(incident.decisionFlows || {}); if (!runs.length) return "none"; return runs.map(([id, r]) => { const f = decisionFlowById(id); const s = summarizeFlowPath(r.path); return `${f ? f.label : id}${r.done ? "" : " (in progress)"}${s ? " — " + s : ""}`; }).join(" | "); })() },
    { k: "Blind spots", v: copilotSummary(incident) },
  ];

  function downloadJSON() {
    const payload = {
      exportedAt: new Date().toISOString(),
      exportedBy: "K. Patel",
      schema: "cimple.incident.v1",
      incident,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    triggerDownload(blob, `${incident.id}.json`);
  }

  async function downloadPDF() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 48;
    let y = margin;

    function line(text, opts = {}) {
      const { size = 10, color = [26, 32, 36], bold = false, gap = 14, indent = 0 } = opts;
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...color);
      const wrapped = doc.splitTextToSize(String(text), pageW - margin * 2 - indent);
      for (const w of wrapped) {
        if (y > pageH - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(w, margin + indent, y);
        y += gap;
      }
    }
    function rule() {
      if (y > pageH - margin) { doc.addPage(); y = margin; }
      doc.setDrawColor(0, 48, 94);
      doc.setLineWidth(0.5);
      doc.line(margin, y, pageW - margin, y);
      y += 12;
    }
    function heading(text) {
      y += 6;
      line(text, { size: 11, color: [0, 48, 94], bold: true, gap: 16 });
    }

    // Header
    line("TRINITY ANGLICAN COLLEGE", { size: 9, color: [0, 48, 94], bold: true, gap: 12 });
    line("CIMPLE · INCIDENT AUDIT RECORD", { size: 9, color: [90, 102, 112], gap: 18 });
    line(incident.title, { size: 17, color: [0, 48, 94], bold: true, gap: 22 });

    // Metadata block
    const sev = SEVERITY[incident.severity];
    const meta = [
      ["Incident ID", incident.id],
      ["Type", incident.typeLabel || "—"],
      ["Severity", sev.label],
      ["Status", incident.status === "active" ? "Active" : "Closed"],
      ["Drill", incident.isDrill ? "Yes — training exercise" : "No — real incident"],
      ["Location", incident.location || "—"],
      ["Started", new Date(incident.startedAt).toLocaleString("en-AU")],
      ["Closed", incident.closedAt ? new Date(incident.closedAt).toLocaleString("en-AU") : "—"],
      ["EMP reference", incident.empSection || "—"],
    ];
    for (const [k, v] of meta) {
      line(`${k}:  ${v}`, { size: 10, gap: 14 });
    }
    rule();

    // Roles
    heading("ROLES");
    if (incident.roles.length === 0) {
      line("No roles assigned.", { color: [90, 102, 112] });
    } else {
      for (const r of incident.roles) {
        const status = r.status.charAt(0).toUpperCase() + r.status.slice(1);
        line(`${r.role}  —  ${r.staff || "—"}  (${status})${r.backup ? `  · backup: ${r.backup}` : ""}`, { size: 10 });
      }
    }
    rule();

    // Tasks — Annika's feedback: split OUTSTANDING from COMPLETED so open items
    // aren't lost in a busy list, each grouped by phase. Owners print as full
    // names so initials never collide (SF/SF).
    const phaseOf = (t) =>
      t.phase || phaseForDue(t.dueAt != null ? Math.round((t.dueAt - incident.startedAt) / 60000) : null, t.text);
    function taskGroupsByPhase(items) {
      // Render `items` grouped under their phase headings; returns nothing (draws).
      for (let pi = 0; pi < CIMT_PHASES.length; pi++) {
        const ph = CIMT_PHASES[pi];
        const inPhase = items.filter((t) => phaseOf(t) === ph.id);
        if (!inPhase.length) continue;
        line(`${pi + 1}. ${ph.label.toUpperCase()}  (${inPhase.length})`, { size: 10, color: [0, 48, 94], bold: true, gap: 15 });
        for (const t of inPhase) {
          const mark = t.done ? "[x]" : "[ ]";
          const due = t.dueAt ? `  (due ${new Date(t.dueAt).toLocaleString("en-AU")})` : "";
          const oname = taskOwnerName(incident, t) || t.owner || "—";
          line(`${mark}  ${t.text}  · ${(t.priority || "med").toUpperCase()}${due}  · owner ${oname}`, { size: 10, indent: 8 });
        }
        y += 4;
      }
    }
    const outstanding = incident.tasks.filter((t) => !t.done);
    const completed = incident.tasks.filter((t) => t.done);

    heading(`OUTSTANDING ACTIONS (${outstanding.length} open of ${incident.tasks.length})`);
    if (!outstanding.length) line(incident.tasks.length ? "All actions complete." : "No tasks recorded.", { color: [90, 102, 112] });
    else taskGroupsByPhase(outstanding);
    rule();

    heading(`COMPLETED ACTIONS (${completed.length})`);
    if (!completed.length) line("None yet.", { color: [90, 102, 112] });
    else taskGroupsByPhase(completed);
    rule();

    // Timeline
    heading(`TIMELINE (${incident.timeline.length} entries · chronological)`);
    for (const e of incident.timeline) {
      const stamp = new Date(e.ts).toLocaleString("en-AU");
      line(`${stamp}  ·  ${(e.type || "entry").toUpperCase()}  ·  ${e.actor}`, { size: 9, color: [0, 48, 94], bold: true, gap: 12 });
      line(e.text, { size: 10, indent: 8, gap: 13 });
      y += 4;
    }
    rule();

    // Risks / watch register
    const risks = incident.risks || [];
    const rc = riskCounts(incident);
    heading(`RISK / WATCH REGISTER (${rc.open} open · ${rc.resolved} resolved)`);
    if (risks.length === 0) {
      line("No risks or watch items recorded.", { color: [90, 102, 112] });
    } else {
      // Chronological (register stores newest-first).
      for (const r of [...risks].reverse()) {
        const sLabel = (RISK_STATUS[r.status] || {}).label || "Watch";
        const svLabel = (RISK_SEVERITY[r.severity] || {}).label || "Medium";
        line(`${new Date(r.createdAt).toLocaleString("en-AU")} · ${svLabel} · ${r.category} · ${sLabel}${r.owner ? ` · owner ${r.owner}` : " · unowned"}`, { size: 9, color: [0, 48, 94], bold: true, gap: 12 });
        line(r.title, { size: 10, indent: 8, gap: 13 });
        if (r.description) line(r.description, { size: 10, indent: 8, gap: 13 });
        if (r.reviewBy && r.status !== "resolved") line(`Review by: ${new Date(r.reviewBy).toLocaleString("en-AU")}`, { size: 9, color: [90, 102, 112], indent: 8, gap: 12 });
        if (r.status === "resolved") line(`Resolved ${r.resolvedAt ? new Date(r.resolvedAt).toLocaleString("en-AU") : ""}${r.resolutionNotes ? ` — ${r.resolutionNotes}` : ""}`, { size: 9, color: [91, 140, 124], indent: 8, gap: 12 });
        y += 4;
      }
    }
    rule();

    // Decisions
    const decisions = incident.decisions || [];
    heading(`DECISIONS (${decisions.length} logged)`);
    if (decisions.length === 0) {
      line("No decisions recorded.", { color: [90, 102, 112] });
    } else {
      // Chronological order for the record (log stores newest-first).
      for (const d of [...decisions].reverse()) {
        line(`${new Date(d.ts).toLocaleString("en-AU")} · ${d.decidedBy} · ${(DECISION_STATUS[d.status] || {}).label || "Open"}`, { size: 9, color: [0, 48, 94], bold: true, gap: 12 });
        line(`Decision: ${d.decision}`, { size: 10, indent: 8, gap: 13 });
        if (d.rationale) line(`Rationale: ${d.rationale}`, { size: 10, indent: 8, gap: 13 });
        if (d.options) line(`Options considered: ${d.options}`, { size: 10, indent: 8, gap: 13 });
        if (d.evidence) line(`What was known: ${d.evidence}`, { size: 10, indent: 8, gap: 13 });
        if (d.reviewBy) line(`Review by: ${new Date(d.reviewBy).toLocaleString("en-AU")}`, { size: 9, color: [90, 102, 112], indent: 8, gap: 12 });
        if (d.status === "reviewed") line(`Reviewed ${d.reviewedAt ? new Date(d.reviewedAt).toLocaleString("en-AU") : ""}${d.outcome ? ` — ${d.outcome}` : ""}`, { size: 9, color: [91, 140, 124], indent: 8, gap: 12 });
        y += 4;
      }
    }
    rule();

    // Activation & notification
    heading("ACTIVATION & NOTIFICATION");
    if (!incident.activation) {
      line("Incident not activated.", { color: [90, 102, 112] });
    } else {
      const a = incident.activation;
      line(`Declared ${new Date(a.declaredAt).toLocaleString("en-AU")} by ${a.declaredBy} · channels: ${a.channels.map(channelLabel).join(", ")}`, { size: 10, gap: 13 });
      const notified = incident.roles.filter((r) => roleIsAssigned(r) && r.notify);
      for (const r of notified) {
        const s = (r.notify.status || "sent");
        const stamp = s === "acked" && r.notify.ackedAt ? ` at ${new Date(r.notify.ackedAt).toLocaleTimeString("en-AU")}` : "";
        line(`${r.role}  —  ${r.staff}  ·  ${s.replace("_", " ")}${stamp}${r.notify.viaBackup ? "  (via backup)" : ""}`, { size: 10 });
      }
    }
    rule();

    // Communications
    const comms = incident.comms || [];
    heading(`COMMUNICATIONS (${comms.length} ${comms.length === 1 ? "message" : "messages"})`);
    if (comms.length === 0) {
      line("No communications recorded.", { color: [90, 102, 112] });
    } else {
      for (const c of comms) {
        const status = (c.status || "draft").charAt(0).toUpperCase() + (c.status || "draft").slice(1);
        const chans = (c.channels || []).map(channelLabel).join(", ") || "no channel";
        line(`${c.name}  —  ${audienceLabel(c.audienceId)}  ·  ${status}`, { size: 10, color: [0, 48, 94], bold: true, gap: 13 });
        line(`Channels: ${chans}${c.dispatchedAt ? `  ·  dispatched ${new Date(c.dispatchedAt).toLocaleString("en-AU")}` : ""}`, { size: 9, color: [90, 102, 112], gap: 12 });
        line(c.body, { size: 10, indent: 8, gap: 13 });
        y += 4;
      }
    }
    rule();

    // Blind Spots findings (open at export time)
    const copilotFindings = runCopilot(incident);
    heading(`BLIND SPOTS — POTENTIAL GAPS (${copilotFindings.length} open at export)`);
    if (copilotFindings.length === 0) {
      line("No findings — no obvious gaps detected at export time.", { color: [90, 102, 112] });
    } else {
      for (const f of copilotFindings) {
        const sv = (COPILOT_SEVERITY[f.severity] || {}).label || "Advisory";
        line(`[${sv.toUpperCase()}] ${f.issue}  ·  ${f.category} · ${f.ruleId}`, { size: 10, color: [0, 48, 94], bold: true, gap: 13 });
        line(`Why: ${f.why}`, { size: 10, indent: 8, gap: 13 });
        line(`Evidence: ${f.evidence}`, { size: 9, color: [90, 102, 112], indent: 8, gap: 12 });
        y += 3;
      }
      line("Blind Spots are advisory prompts, not instructions. Human judgement governs the response.", { size: 8.5, color: [90, 102, 112], gap: 12 });
    }
    rule();

    // Post-incident review
    if (incident.pir) {
      const p = incident.pir;
      heading(`POST-INCIDENT REVIEW (${(PIR_STATUS[p.status] || {}).label || "Draft"})`);
      const parts = [
        ["What happened", p.summary],
        ["What worked well", p.whatWorked],
        ["What could be improved", p.whatImprove],
        ["Suggested plan updates", p.planUpdates],
      ];
      for (const [k, v] of parts) {
        if (v && v.trim()) {
          line(k, { size: 10, color: [0, 48, 94], bold: true, gap: 13 });
          line(v, { size: 10, indent: 8, gap: 13 });
          y += 2;
        }
      }
      const cas = p.correctiveActions || [];
      line(`Corrective actions (${cas.filter((c) => c.done).length}/${cas.length} complete):`, { size: 10, color: [0, 48, 94], bold: true, gap: 13 });
      if (cas.length === 0) {
        line("None recorded.", { color: [90, 102, 112] });
      } else {
        for (const c of cas) {
          line(`${c.done ? "[x]" : "[ ]"}  ${c.text}${c.owner ? `  · owner ${c.owner}` : ""}`, { size: 10, indent: 8 });
        }
      }
      rule();
    }

    // Policies
    heading("EMP & POLICY REFERENCES");
    if (!incident.policies || incident.policies.length === 0) {
      line("No policies linked.", { color: [90, 102, 112] });
    } else {
      for (const p of incident.policies) {
        line(`${p.section}  ·  ${p.name}  [${(p.type || "").toUpperCase()}]`, { size: 10 });
      }
    }
    rule();

    // Footer / signature block
    y += 8;
    line(`Generated by CIMPLE on ${new Date().toLocaleString("en-AU")} by K. Patel.`, { size: 9, color: [90, 102, 112], gap: 12 });
    line("This document is a machine-generated record of the incident as captured in CIMPLE. Original timeline entries are immutable.", { size: 9, color: [90, 102, 112], gap: 12 });

    doc.save(`${incident.id}.pdf`);
  }

  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>INCIDENT PACK</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>One-click, audit-ready export.</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>
          Generates a complete record suitable for head office, network audit, or formal review. PDF (printable) + JSON archive (machine-readable).
        </p>
      </div>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 12 }}>INCLUDED</div>
      <div style={{ border: `1px solid rgba(0, 48, 94, 0.14)` }}>
        {sections.map((s, i) => (
          <div key={s.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: i < sections.length - 1 ? `1px solid rgba(0, 48, 94, 0.08)` : "none", fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: PALETTE.ink }}>
              <CheckCircle2 size={13} color={PALETTE.sage} /> {s.k}
            </span>
            <span className="mono" style={{ fontSize: 11, color: PALETTE.inkSoft }}>{s.v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <button onClick={downloadJSON} className="btn" style={{ flex: 1, justifyContent: "center" }}><Download size={13} /> JSON archive</button>
        <button onClick={downloadPDF} className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}><Download size={13} /> Audit PDF</button>
      </div>
    </div>
  );
}

function commsSummary(comms) {
  const list = comms || [];
  if (list.length === 0) return "none yet";
  const dispatched = list.filter((c) => c.status === "dispatched").length;
  return `${list.length} total · ${dispatched} dispatched`;
}

function decisionsSummary(decisions) {
  const list = decisions || [];
  if (list.length === 0) return "none yet";
  const open = list.filter((d) => d.status === "open").length;
  return `${list.length} logged${open ? ` · ${open} open` : ""}`;
}

function risksSummary(incident) {
  const c = riskCounts(incident);
  if (c.total === 0) return "none yet";
  return `${c.open} open${c.escalated ? ` · ${c.escalated} escalated` : ""} · ${c.resolved} resolved`;
}

function copilotSummary(incident) {
  const f = runCopilot(incident);
  if (f.length === 0) return "no gaps flagged";
  const crit = f.filter((x) => x.severity === "critical").length;
  return `${f.length} finding${f.length === 1 ? "" : "s"}${crit ? ` · ${crit} critical` : ""}`;
}

function ackRollup(incident) {
  const notified = (incident.roles || []).filter((r) => roleIsAssigned(r) && r.notify);
  const acked = notified.filter((r) => r.notify.status === "acked").length;
  return `${acked}/${notified.length} ack`;
}

function initialsOf(name) {
  return String(name || "").split(/\s+/).map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase() || "—";
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 10 }}>{title.toUpperCase()}</div>
      {children}
    </div>
  );
}
