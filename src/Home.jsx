// ============================================================
// CIMPLE — Incidents Home (list view)
// ============================================================
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Trash2,
  Download,
  Inbox,
  PlayCircle,
  Activity,
  Lock,
} from "lucide-react";
import { PALETTE, TopBarShell, formatRelative, formatElapsed, formatDateShort } from "./shared.jsx";
import { listIncidents, SEVERITY, loadSampleData, resetAll, deleteIncident } from "./data.js";

export default function Home({ onOpenIncident, onNew, onTriage }) {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState("active"); // all | active | closed | drills
  const [search, setSearch] = useState("");
  const [now, setNow] = useState(Date.now());
  const [confirmReset, setConfirmReset] = useState(false);

  function refresh() {
    setIncidents(listIncidents());
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  function handleLoadSamples() {
    loadSampleData();
    refresh();
  }

  function handleReset() {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    resetAll();
    setConfirmReset(false);
    refresh();
  }

  function handleDelete(id) {
    deleteIncident(id);
    refresh();
  }

  const filtered = useMemo(() => {
    let list = [...incidents];
    if (filter === "active") list = list.filter((i) => i.status === "active" && !i.isDrill);
    else if (filter === "closed") list = list.filter((i) => i.status === "closed");
    else if (filter === "drills") list = list.filter((i) => i.isDrill);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (i) => i.title.toLowerCase().includes(q) || i.id.toLowerCase().includes(q) || (i.typeLabel || "").toLowerCase().includes(q)
      );
    }
    // Sort: active first by most recent activity; closed by closedAt
    list.sort((a, b) => {
      if (a.status === "active" && b.status !== "active") return -1;
      if (b.status === "active" && a.status !== "active") return 1;
      const at = a.status === "active" ? a.startedAt : a.closedAt;
      const bt = b.status === "active" ? b.startedAt : b.closedAt;
      return bt - at;
    });
    return list;
  }, [incidents, filter, search]);

  const stats = useMemo(() => {
    const active = incidents.filter((i) => i.status === "active" && !i.isDrill);
    const closedToday = incidents.filter((i) => {
      if (i.status !== "closed" || !i.closedAt) return false;
      const d = new Date(i.closedAt);
      const today = new Date();
      return d.toDateString() === today.toDateString();
    });
    const drills = incidents.filter((i) => i.isDrill);
    const critical = active.filter((i) => i.severity >= 2); // L2 Incident + L3 Critical Incident — the CIMT-activating levels
    return { active: active.length, closedToday: closedToday.length, drills: drills.length, critical: critical.length };
  }, [incidents]);

  return (
    <>
      <TopBarShell current="home" />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8 }}>
              INCIDENTS
            </div>
            <h1 className="display" style={{ fontSize: 44, lineHeight: 1, color: PALETTE.teal, fontWeight: 500, margin: 0, letterSpacing: "-0.02em" }}>
              Active operations
            </h1>
            <p style={{ fontSize: 14, color: PALETTE.inkSoft, marginTop: 8, margin: "8px 0 0" }}>
              Manage current incidents, review past records, run drills.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn" onClick={onTriage}>
              <Sparkles size={14} /> Guided triage
            </button>
            <button className="btn btn-primary" onClick={onNew}>
              <Plus size={14} /> Start new incident
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(0, 48, 94, 0.15)", marginBottom: 24, border: `1px solid rgba(0, 48, 94, 0.14)` }}>
          <Stat label="Active" value={stats.active} icon={Activity} color={PALETTE.teal} />
          <Stat label="CIMT-level" value={stats.critical} icon={AlertCircle} color={PALETTE.rust} />
          <Stat label="Closed today" value={stats.closedToday} icon={CheckCircle2} color={PALETTE.sage} />
          <Stat label="Drills logged" value={stats.drills} icon={PlayCircle} color={PALETTE.amber} />
        </div>

        {/* Toolbar: filter tabs + search */}
        <div className="card" style={{ marginBottom: 0, borderBottom: "none" }}>
          <div style={{ padding: "12px 18px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: 4 }}>
              {[
                { v: "active", l: "Active", c: stats.active },
                { v: "closed", l: "Closed" },
                { v: "drills", l: "Drills", c: stats.drills },
                { v: "all", l: "All" },
              ].map((t) => (
                <button
                  key={t.v}
                  onClick={() => setFilter(t.v)}
                  style={{
                    padding: "7px 14px",
                    fontSize: 13,
                    fontWeight: 500,
                    background: filter === t.v ? PALETTE.teal : "transparent",
                    color: filter === t.v ? PALETTE.paper : PALETTE.ink,
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {t.l}
                  {t.c !== undefined && t.c > 0 && (
                    <span
                      className="mono"
                      style={{
                        fontSize: 10,
                        padding: "1px 6px",
                        background: filter === t.v ? "rgba(255,255,255,0.2)" : "rgba(0, 48, 94, 0.1)",
                      }}
                    >
                      {t.c}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: PALETTE.inkSoft }} />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title or ID…"
                  style={{ paddingLeft: 32, fontSize: 13, width: 240, padding: "8px 12px 8px 32px" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Incident list */}
        <div className="card" style={{ borderTop: "none" }}>
          {filtered.length === 0 ? (
            <EmptyState filter={filter} hasAny={incidents.length > 0} onLoadSamples={handleLoadSamples} onNew={onNew} />
          ) : (
            <div>
              <ListHeader />
              {filtered.map((inc) => (
                <IncidentRow key={inc.id} incident={inc} now={now} onClick={() => onOpenIncident(inc.id)} onDelete={() => handleDelete(inc.id)} />
              ))}
            </div>
          )}
        </div>

        {/* Footer utilities */}
        <div style={{ marginTop: 32, padding: "16px 0", borderTop: `1px solid rgba(0, 48, 94, 0.12)`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6 }}>
            DATA STORED LOCALLY · YOUR BROWSER ONLY
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {incidents.length === 0 && (
              <button className="btn" onClick={handleLoadSamples}>
                <Inbox size={13} /> Load sample incidents
              </button>
            )}
            {incidents.length > 0 && (
              <button className={confirmReset ? "btn btn-danger" : "btn"} onClick={handleReset}>
                <Trash2 size={13} /> {confirmReset ? "Confirm reset all data?" : "Reset all data"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, icon: Icon, color }) {
  return (
    <div style={{ background: PALETTE.paper, padding: "20px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6 }}>
          {label.toUpperCase()}
        </span>
        <Icon size={14} color={color} />
      </div>
      <div className="display" style={{ fontSize: 36, lineHeight: 1, color, fontWeight: 500 }}>
        {value}
      </div>
    </div>
  );
}

function ListHeader() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "70px 1fr 160px 120px 120px 40px",
        gap: 16,
        padding: "12px 18px",
        borderBottom: `1px solid rgba(0, 48, 94, 0.12)`,
        background: PALETTE.bone,
      }}
    >
      {["SEV", "INCIDENT", "TYPE", "STATUS", "ACTIVITY", ""].map((h) => (
        <div key={h} className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6 }}>
          {h}
        </div>
      ))}
    </div>
  );
}

function IncidentRow({ incident, now, onClick, onDelete }) {
  const sev = SEVERITY[incident.severity];
  const elapsed = incident.status === "active" ? formatElapsed(now - incident.startedAt) : null;
  const closedRel = incident.closedAt ? formatRelative(incident.closedAt, now) : null;

  function handleDelete(e) {
    e.stopPropagation();
    if (confirm(`Delete ${incident.id}? This cannot be undone.`)) onDelete();
  }

  const confirmedRoles = (incident.roles || []).filter((r) => r.status === "confirmed").length;
  const totalRequired = (incident.roles || []).filter((r) => r.required).length;

  return (
    <div
      onClick={onClick}
      className="row-hover"
      style={{
        display: "grid",
        gridTemplateColumns: "70px 1fr 160px 120px 120px 40px",
        gap: 16,
        padding: "16px 18px",
        borderBottom: `1px solid rgba(0, 48, 94, 0.08)`,
        alignItems: "center",
        opacity: incident.status === "closed" ? 0.7 : 1,
      }}
    >
      <div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4px 10px",
            background: sev.color,
            color: PALETTE.paper,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.04em",
          }}
        >
          {sev.short}
        </span>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 14, color: PALETTE.ink, fontWeight: 500 }}>{incident.title}</span>
          {incident.isDrill && <span className="chip" style={{ background: PALETTE.amber, color: PALETTE.ink, borderColor: PALETTE.amber, padding: "2px 8px", fontSize: 9 }}>DRILL</span>}
        </div>
        <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, letterSpacing: "0.04em" }}>
          {incident.id} · {incident.location}
        </div>
      </div>

      <div style={{ fontSize: 13, color: PALETTE.ink, opacity: 0.85 }}>{incident.typeLabel}</div>

      <div>
        {incident.status === "active" ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: PALETTE.teal, fontWeight: 500 }}>
            <span className="live-dot" style={{ width: 6, height: 6, background: PALETTE.rust, borderRadius: "50%", display: "inline-block" }} />
            Active · {elapsed}
          </span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: PALETTE.inkSoft }}>
            <Lock size={11} /> Closed
          </span>
        )}
        <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 3 }}>
          Roles {confirmedRoles}/{totalRequired}
        </div>
      </div>

      <div style={{ fontSize: 12, color: PALETTE.inkSoft }}>
        {incident.status === "active" ? `Started ${formatRelative(incident.startedAt, now)}` : `Closed ${closedRel}`}
        <div className="mono" style={{ fontSize: 10, marginTop: 3 }}>{formatDateShort(incident.startedAt)}</div>
      </div>

      <button onClick={handleDelete} className="btn-ghost" style={{ background: "none", border: "none", padding: 6, color: PALETTE.inkSoft }} title="Delete">
        <Trash2 size={13} />
      </button>
    </div>
  );
}

function EmptyState({ filter, hasAny, onLoadSamples, onNew }) {
  if (!hasAny) {
    return (
      <div style={{ padding: "80px 32px", textAlign: "center" }}>
        <Inbox size={36} color={PALETTE.teal} strokeWidth={1.4} style={{ margin: "0 auto", opacity: 0.5 }} />
        <h3 className="display" style={{ fontSize: 28, color: PALETTE.teal, fontWeight: 500, marginTop: 24, marginBottom: 8 }}>
          No incidents yet
        </h3>
        <p style={{ fontSize: 14, color: PALETTE.inkSoft, maxWidth: 420, margin: "0 auto 24px", lineHeight: 1.6 }}>
          Start a new incident manually, or load a few sample scenarios to see how CIMPLE works during an active response.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button className="btn" onClick={onLoadSamples}>
            <Inbox size={14} /> Load sample incidents
          </button>
          <button className="btn btn-primary" onClick={onNew}>
            <Plus size={14} /> Start new incident
          </button>
        </div>
      </div>
    );
  }
  // Has data, but filter shows none
  return (
    <div style={{ padding: "60px 32px", textAlign: "center" }}>
      <Filter size={28} color={PALETTE.teal} strokeWidth={1.4} style={{ opacity: 0.4 }} />
      <p style={{ fontSize: 14, color: PALETTE.inkSoft, marginTop: 16 }}>
        No {filter === "all" ? "incidents" : filter} match your search.
      </p>
    </div>
  );
}
