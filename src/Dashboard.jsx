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
  UserCheck, UserX, UserPlus, Settings,
} from "lucide-react";
import { PALETTE, TopBarShell, formatTime, formatRelative, formatElapsed } from "./shared.jsx";
import { SEVERITY, getIncident, saveIncident, listStaff, responsibilitiesFor, ROLE_DEFINITIONS } from "./data.js";

export default function Dashboard({ incidentId, onBack }) {
  const [incident, setIncident] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [drawer, setDrawer] = useState(null);
  const [notFound, setNotFound] = useState(false);

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
    const e = {
      id: `t${Date.now()}`,
      ts: Date.now(),
      actor: "K. Patel",
      actorInitials: "KP",
      ...entry,
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

  return (
    <div style={{ background: PALETTE.bone, minHeight: "100vh" }}>
      <TopBarPresence incident={incident} now={now} />
      <CommandStrip incident={incident} changeSeverity={changeSeverity} setDrawer={setDrawer} closeIncident={closeIncident} reopenIncident={reopenIncident} onBack={onBack} />

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
        <div className="mono" style={{ fontSize: 11, color: PALETTE.teal, display: "flex", alignItems: "center", gap: 8, opacity: 0.85 }}>
          <span className="live-dot" style={{ width: 7, height: 7, background: PALETTE.rust, display: "inline-block", borderRadius: "50%" }} />
          LIVE · {elapsed} ELAPSED
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
function CommandStrip({ incident, changeSeverity, setDrawer, closeIncident, reopenIncident, onBack }) {
  const sev = SEVERITY[incident.severity];
  const isClosed = incident.status === "closed";

  return (
    <div style={{ background: PALETTE.paper, borderBottom: `1px solid rgba(15, 76, 92, 0.14)`, padding: "20px 32px" }}>
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
              <div style={{ display: "flex", border: `1px solid rgba(15, 76, 92, 0.2)`, opacity: isClosed ? 0.5 : 1 }}>
                {[1, 2, 3, 4].map((lvl) => {
                  const isActive = lvl === incident.severity;
                  const cfg = SEVERITY[lvl];
                  return (
                    <button key={lvl} onClick={() => changeSeverity(lvl)} disabled={isClosed} style={{
                      padding: "8px 14px",
                      background: isActive ? cfg.color : PALETTE.paper,
                      color: isActive ? PALETTE.paper : PALETTE.ink,
                      border: "none",
                      borderRight: lvl < 4 ? `1px solid rgba(15, 76, 92, 0.15)` : "none",
                      fontSize: 12,
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      cursor: isClosed ? "not-allowed" : "pointer",
                    }}>L{lvl}</button>
                  );
                })}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" onClick={() => setDrawer("policy")}><BookOpen size={14} /> Policy</button>
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
      <div style={{ padding: 14, borderTop: `1px solid rgba(15, 76, 92, 0.12)` }}>
        <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 8 }}>
          DIRECTORY · QUICK CALL
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            { name: "Emergency · 000", urgent: true },
            { name: "Head Office" },
            { name: "Police Liaison" },
            { name: "Headspace" },
          ].map((c) => (
            <button key={c.name} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "7px 10px",
              background: c.urgent ? "rgba(184, 92, 60, 0.08)" : "transparent",
              border: `1px solid ${c.urgent ? "rgba(184, 92, 60, 0.3)" : "rgba(15, 76, 92, 0.12)"}`,
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
    <div style={{ padding: "12px 14px", borderBottom: `1px solid rgba(15, 76, 92, 0.08)`, display: "flex", alignItems: "flex-start", gap: 10, position: "relative" }}>
      <div style={{
        width: 28, height: 28,
        background: role.status === "unassigned" ? PALETTE.bone : role.isPrincipal ? PALETTE.teal : "rgba(15, 76, 92, 0.1)",
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

  function addTask(text) {
    if (!text.trim()) return;
    update((prev) => ({ ...prev, tasks: [...prev.tasks, { id: `tk${Date.now()}`, text, owner: "—", done: false, priority: "med" }] }));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="card">
        <div className="panel-h">
          <span className="panel-h-label">INCIDENT TIMELINE · {incident.timeline.length} ENTRIES</span>
          <span className="panel-h-meta">AUTO-LOG ON</span>
        </div>
        <div style={{ padding: "20px 24px 8px", maxHeight: 480, overflowY: "auto" }} className="scroll-y">
          {incident.timeline.map((e, i) => (
            <TimelineEntry key={e.id} entry={e} now={now} isLast={i === incident.timeline.length - 1} />
          ))}
        </div>
        {!isClosed && <Composer composerType={composerType} setComposerType={setComposerType} onSubmit={handleSubmit} />}
      </div>

      <div className="card">
        <div className="panel-h">
          <span className="panel-h-label">ACTIVE TASKS · {incident.tasks.filter((t) => !t.done).length} OPEN</span>
          <span className="panel-h-meta">FROM EMP</span>
        </div>
        <div>
          {incident.tasks.map((t, i) => (
            <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t.id)} isLast={i === incident.tasks.length - 1} disabled={isClosed} />
          ))}
        </div>
        {!isClosed && <TaskAdder onAdd={addTask} />}
      </div>
    </div>
  );
}

function TimelineEntry({ entry, now, isLast }) {
  const cfg = {
    system: { color: PALETTE.teal, icon: Shield, label: "SYSTEM" },
    action: { color: PALETTE.sage, icon: CheckCircle2, label: "ACTION" },
    note: { color: PALETTE.ink, icon: Edit3, label: "NOTE" },
    comm: { color: PALETTE.amber, icon: Mail, label: "COMM" },
  }[entry.type] || { color: PALETTE.ink, icon: Circle, label: "ENTRY" };

  return (
    <div className="fade-in" style={{ display: "flex", gap: 14, paddingBottom: 18 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 26, height: 26, background: PALETTE.paper, border: `1.5px solid ${cfg.color}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, borderRadius: "50%" }}>
          <cfg.icon size={12} color={cfg.color} strokeWidth={2} />
        </div>
        {!isLast && <div style={{ width: 1, flex: 1, background: "rgba(15, 76, 92, 0.15)", marginTop: 4, minHeight: 24 }} />}
      </div>
      <div style={{ flex: 1, paddingTop: 2 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4, flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: cfg.color, fontWeight: 500 }}>{cfg.label}</span>
          <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>{formatTime(entry.ts)} · {formatRelative(entry.ts, now)}</span>
          <span style={{ fontSize: 11, color: PALETTE.inkSoft }}>by {entry.actor}</span>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.55, color: PALETTE.ink, margin: 0 }}>{entry.text}</p>
      </div>
    </div>
  );
}

function Composer({ composerType, setComposerType, onSubmit }) {
  const [text, setText] = useState("");
  return (
    <div style={{ borderTop: `1px solid rgba(15, 76, 92, 0.12)`, padding: 18 }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[
          { v: "note", label: "Note", icon: Edit3 },
          { v: "action", label: "Action taken", icon: CheckCircle2 },
          { v: "comm", label: "Communication", icon: Mail },
        ].map((t) => (
          <button key={t.v} onClick={() => setComposerType(t.v)} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 10px", fontSize: 11, fontWeight: 500,
            border: `1px solid ${composerType === t.v ? PALETTE.teal : "rgba(15, 76, 92, 0.15)"}`,
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

function TaskRow({ task, onToggle, isLast, disabled }) {
  const p = { high: { color: PALETTE.rust, label: "HIGH" }, med: { color: PALETTE.amber, label: "MED" }, low: { color: PALETTE.sage, label: "LOW" } }[task.priority];
  return (
    <div style={{ padding: "12px 18px", borderBottom: isLast ? "none" : `1px solid rgba(15, 76, 92, 0.08)`, display: "flex", alignItems: "center", gap: 12, opacity: task.done ? 0.55 : 1 }}>
      <button onClick={onToggle} disabled={disabled} style={{
        width: 18, height: 18,
        border: `1.5px solid ${task.done ? PALETTE.sage : PALETTE.teal}`,
        background: task.done ? PALETTE.sage : "transparent",
        padding: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        cursor: disabled ? "not-allowed" : "pointer",
      }}>
        {task.done && <CheckCircle2 size={12} color={PALETTE.paper} strokeWidth={3} />}
      </button>
      <span style={{ flex: 1, fontSize: 14, color: PALETTE.ink, textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
      <span className="mono" style={{ fontSize: 9, letterSpacing: "0.12em", color: p.color, fontWeight: 500 }}>{p.label}</span>
      <div style={{ width: 24, height: 24, background: "rgba(15, 76, 92, 0.1)", color: PALETTE.teal, fontSize: 9, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>{task.owner}</div>
    </div>
  );
}

function TaskAdder({ onAdd }) {
  const [text, setText] = useState("");
  return (
    <div style={{ padding: "12px 18px", borderTop: `1px solid rgba(15, 76, 92, 0.08)`, display: "flex", gap: 8 }}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { onAdd(text); setText(""); } }}
        placeholder="Add a task…"
        style={{ fontSize: 13, padding: "8px 10px" }}
      />
      <button onClick={() => { onAdd(text); setText(""); }} className="btn" style={{ padding: "8px 12px" }}>
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
              borderBottom: i < incident.policies.length - 1 ? `1px solid rgba(15, 76, 92, 0.08)` : "none",
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
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(10, 54, 66, 0.4)", display: "flex", justifyContent: "flex-end" }}>
      <div onClick={(e) => e.stopPropagation()} className="slide-in" style={{ width: 520, maxWidth: "100vw", height: "100vh", background: PALETTE.paper, borderLeft: `1px solid rgba(15, 76, 92, 0.2)`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid rgba(15, 76, 92, 0.14)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="display" style={{ fontSize: 22, color: PALETTE.teal, fontWeight: 500, letterSpacing: "-0.015em" }}>{title}</div>
          <button onClick={onClose} className="btn-ghost" style={{ background: "none", border: "none", color: PALETTE.ink, padding: 6 }}><X size={18} /></button>
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
          <div style={{ padding: "14px 16px", border: `1px solid rgba(15, 76, 92, 0.18)`, display: "flex", alignItems: "center", gap: 12 }}>
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

      {/* Backup */}
      <Section title="Backup">
        {role.backup ? (
          <div style={{ padding: "14px 16px", border: `1px solid rgba(15, 76, 92, 0.18)`, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(15, 76, 92, 0.1)",
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
                    borderBottom: i < responsibilities.length - 1 ? `1px solid rgba(15, 76, 92, 0.1)` : "none",
                    fontSize: 13,
                    color: PALETTE.ink,
                    lineHeight: 1.5,
                  }}
                >
                  <span className="mono" style={{ color: PALETTE.teal, fontSize: 11, fontWeight: 500, minWidth: 20, paddingTop: 2 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {r}
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
        border: `1px solid rgba(15, 76, 92, 0.18)`,
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
          <div key={c.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", border: `1px solid rgba(15, 76, 92, 0.12)`, marginBottom: 6 }}>
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
        <div key={p.id} style={{ border: `1px solid rgba(15, 76, 92, 0.14)`, marginBottom: 10 }}>
          <button onClick={() => setExpanded(expanded === i ? -1 : i)} style={{ width: "100%", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, background: PALETTE.paper, border: "none", textAlign: "left" }}>
            {p.type === "emp" ? <Shield size={14} color={PALETTE.teal} /> : <FileText size={14} color={PALETTE.teal} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: PALETTE.ink }}>{p.name}</div>
              <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 2 }}>{p.section} · {p.type.toUpperCase()}</div>
            </div>
            {expanded === i ? <ChevronUp size={14} color={PALETTE.teal} /> : <ChevronDown size={14} color={PALETTE.teal} />}
          </button>
          {expanded === i && (
            <div style={{ padding: "0 16px 16px", borderTop: `1px solid rgba(15, 76, 92, 0.08)` }}>
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
    { k: "Communications log", v: "drafts only · none sent" },
  ];
  return (
    <div>
      <div style={{ padding: 16, background: PALETTE.tealDeep, color: PALETTE.paper, marginBottom: 24 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.sage, marginBottom: 6 }}>INCIDENT PACK PREVIEW</div>
        <div className="display" style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>One-click, audit-ready export.</div>
        <p style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.85, marginTop: 8 }}>
          Generates a complete, locked record suitable for head office, network audit, or formal review. PDF + JSON archive.
        </p>
      </div>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 12 }}>INCLUDED</div>
      <div style={{ border: `1px solid rgba(15, 76, 92, 0.14)` }}>
        {sections.map((s, i) => (
          <div key={s.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderBottom: i < sections.length - 1 ? `1px solid rgba(15, 76, 92, 0.08)` : "none", fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8, color: PALETTE.ink }}>
              <CheckCircle2 size={13} color={PALETTE.sage} /> {s.k}
            </span>
            <span className="mono" style={{ fontSize: 11, color: PALETTE.inkSoft }}>{s.v}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
        <button className="btn" style={{ flex: 1, justifyContent: "center" }}><Download size={13} /> JSON archive</button>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}><Download size={13} /> Audit PDF</button>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6, marginBottom: 10 }}>{title.toUpperCase()}</div>
      {children}
    </div>
  );
}
