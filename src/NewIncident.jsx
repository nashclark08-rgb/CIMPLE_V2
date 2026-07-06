// ============================================================
// CIMPLE — New Incident (quick start)
// ============================================================
import React, { useState } from "react";
import {
  Heart, Brain, AlertTriangle, UserX, Users, Lock, Flame,
  AlertOctagon, CloudLightning, UserCheck, Shield, Bus, AlertCircle,
  ShieldCheck, ServerCrash, Activity, Tent, Zap,
  ArrowLeft, ArrowRight, ChevronRight, CheckCircle2, Star,
} from "lucide-react";
import { PALETTE, TopBarShell } from "./shared.jsx";
import {
  INCIDENT_TYPES, TYPE_CATEGORIES, SEVERITY, createIncident, saveIncident,
  autoAllocate, availableQualifiedStaff, PREF_LABEL,
} from "./data.js";

const ICON_MAP = {
  Heart, Brain, AlertTriangle, UserX, Users, Lock, Flame,
  AlertOctagon, CloudLightning, UserCheck, Shield, Bus, AlertCircle,
  ShieldCheck, ServerCrash, Activity, Tent, Zap,
};

export default function NewIncident({ onCancel, onCreated }) {
  const [step, setStep] = useState(1); // 1: pick type, 2: details, 3: review team
  const [pickedType, setPickedType] = useState(null);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState(2);
  const [isDrill, setIsDrill] = useState(false);
  const [allocation, setAllocation] = useState([]);

  function pickType(typeId) {
    const t = INCIDENT_TYPES.find((x) => x.id === typeId);
    setPickedType(t);
    setSeverity(t.defaultSeverity);
    setTitle(""); // user fills in
    setStep(2);
  }

  function goToReview() {
    setAllocation(autoAllocate(pickedType.id, severity)); // determine roles + auto-allocate
    setStep(3);
  }

  function setRoleStaff(roleId, staffId) {
    setAllocation((alloc) => alloc.map((r) => {
      if (r.id !== roleId) return r;
      if (!staffId) return { ...r, staff: "—", staffId: null, initials: "—", status: "unassigned", allocPref: null };
      const cand = availableQualifiedStaff(r.role).find((c) => c.id === staffId);
      if (!cand) return r;
      return { ...r, staff: cand.name, staffId: cand.id, initials: cand.initials, status: "confirmed", allocPref: PREF_LABEL[cand.pref] };
    }));
  }

  function create() {
    const incident = createIncident({
      type: pickedType.id,
      severity,
      title: title.trim() || pickedType.label,
      location: location.trim() || "Location not specified",
      isDrill,
      roles: allocation.length ? allocation : null,
    });
    saveIncident(incident);
    onCreated(incident.id);
  }

  // Group types by category
  const grouped = Object.keys(TYPE_CATEGORIES).map((catKey) => ({
    key: catKey,
    meta: TYPE_CATEGORIES[catKey],
    items: INCIDENT_TYPES.filter((t) => t.category === catKey),
  }));

  return (
    <>
      <TopBarShell />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        <button className="btn-ghost" onClick={onCancel} style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
          <ArrowLeft size={14} /> Back to incidents
        </button>

        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8 }}>
          NEW INCIDENT · STEP {step} OF 3
        </div>

        {step === 1 && (
          <>
            <h1 className="display" style={{ fontSize: 44, lineHeight: 1.05, color: PALETTE.teal, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
              What kind of incident?
            </h1>
            <p style={{ fontSize: 15, color: PALETTE.inkSoft, marginBottom: 32, maxWidth: 600, lineHeight: 1.6 }}>
              Pick the closest match. CIMPLE will assign appropriate roles, surface the relevant EMP section, and pre-populate required tasks.
            </p>

            {grouped.map((group) => (
              <div key={group.key} style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, background: group.meta.color, borderRadius: 2 }} />
                  <span className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: group.meta.color, fontWeight: 500 }}>
                    {group.meta.label.toUpperCase()}
                  </span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 1, background: "rgba(0, 48, 94, 0.15)", border: `1px solid rgba(0, 48, 94, 0.14)` }}>
                  {group.items.map((t) => {
                    const Icon = ICON_MAP[t.icon] || AlertCircle;
                    const sev = SEVERITY[t.defaultSeverity];
                    return (
                      <button
                        key={t.id}
                        onClick={() => pickType(t.id)}
                        className="row-hover"
                        style={{
                          background: PALETTE.paper,
                          border: "none",
                          padding: "20px 22px",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          cursor: "pointer",
                          transition: "background 160ms ease",
                        }}
                      >
                        <Icon size={20} color={PALETTE.teal} strokeWidth={1.5} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, color: PALETTE.ink, fontWeight: 500, marginBottom: 4 }}>{t.label}</div>
                          <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, letterSpacing: "0.04em" }}>
                            Default: {sev.short} · {t.emp.split("—")[0].trim()}
                          </div>
                        </div>
                        <ChevronRight size={14} color={PALETTE.teal} style={{ opacity: 0.5 }} />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}

        {step === 2 && pickedType && (
          <>
            <h1 className="display" style={{ fontSize: 44, lineHeight: 1.05, color: PALETTE.teal, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
              Quick details
            </h1>
            <p style={{ fontSize: 15, color: PALETTE.inkSoft, marginBottom: 32, maxWidth: 600, lineHeight: 1.6 }}>
              You can edit any of this once the incident is open. Get a name and severity captured now — refine the rest in real time.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
              <div>
                <Label>Type</Label>
                <div style={{ padding: "12px 14px", border: `1px solid rgba(0, 48, 94, 0.18)`, fontSize: 14, color: PALETTE.ink, background: PALETTE.bone, marginBottom: 24 }}>
                  {pickedType.label}
                </div>

                <Label>Title</Label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`e.g. "${pickedType.label} — D-Block bathroom"`}
                  style={{ marginBottom: 24 }}
                />

                <Label>Location</Label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. D-Block, Level 1"
                  style={{ marginBottom: 24 }}
                />

                <Label>Drill?</Label>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => setIsDrill(false)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      fontSize: 13,
                      fontWeight: 500,
                      background: !isDrill ? PALETTE.teal : PALETTE.paper,
                      color: !isDrill ? PALETTE.paper : PALETTE.ink,
                      border: `1px solid ${!isDrill ? PALETTE.teal : "rgba(0, 48, 94, 0.18)"}`,
                    }}
                  >
                    Real incident
                  </button>
                  <button
                    onClick={() => setIsDrill(true)}
                    style={{
                      flex: 1,
                      padding: "12px",
                      fontSize: 13,
                      fontWeight: 500,
                      background: isDrill ? PALETTE.amber : PALETTE.paper,
                      color: isDrill ? PALETTE.ink : PALETTE.ink,
                      border: `1px solid ${isDrill ? PALETTE.amber : "rgba(0, 48, 94, 0.18)"}`,
                    }}
                  >
                    Drill / training
                  </button>
                </div>
              </div>

              <div>
                <Label>Initial severity</Label>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[1, 2, 3, 4].map((lvl) => {
                    const cfg = SEVERITY[lvl];
                    const selected = lvl === severity;
                    return (
                      <button
                        key={lvl}
                        onClick={() => setSeverity(lvl)}
                        style={{
                          padding: "14px 16px",
                          background: selected ? cfg.color : PALETTE.paper,
                          color: selected ? PALETTE.paper : PALETTE.ink,
                          border: `1px solid ${selected ? cfg.color : "rgba(0, 48, 94, 0.18)"}`,
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: 14,
                        }}
                      >
                        <span style={{ fontSize: 18, fontWeight: 600, minWidth: 24 }}>{cfg.short}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{cfg.label}</div>
                          <div style={{ fontSize: 11, opacity: 0.85, marginTop: 2 }}>{cfg.tone}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p style={{ fontSize: 12, color: PALETTE.inkSoft, marginTop: 12, lineHeight: 1.5 }}>
                  Severity can be changed at any time during the incident. All changes are logged automatically in the timeline.
                </p>
              </div>
            </div>

            <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid rgba(0, 48, 94, 0.12)`, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <button className="btn" onClick={() => setStep(1)}>
                <ArrowLeft size={14} /> Pick a different type
              </button>
              <button className="btn btn-primary" onClick={goToReview}>
                Review team <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}

        {step === 3 && pickedType && (
          <>
            <h1 className="display" style={{ fontSize: 44, lineHeight: 1.05, color: PALETTE.teal, fontWeight: 500, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
              Review the team
            </h1>
            <p style={{ fontSize: 15, color: PALETTE.inkSoft, marginBottom: 24, maxWidth: 640, lineHeight: 1.6 }}>
              CIMPLE auto-allocated available staff to the roles this incident needs — filling the most critical roles first, and preferring each person's primary role. Override anyone below, or continue and adjust once the incident is open.
            </p>

            {(() => {
              const filled = allocation.filter((r) => r.status !== "unassigned").length;
              const requiredUnfilled = allocation.filter((r) => r.required && r.status === "unassigned").length;
              const noStaff = allocation.every((r) => availableQualifiedStaff(r.role).length === 0);
              return (
                <>
                  <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
                    <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: PALETTE.teal }}>
                      {filled} / {allocation.length} ROLES FILLED
                    </span>
                    {requiredUnfilled > 0 && (
                      <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", color: PALETTE.rust, fontWeight: 600 }}>
                        {requiredUnfilled} REQUIRED ROLE{requiredUnfilled === 1 ? "" : "S"} UNFILLED
                      </span>
                    )}
                  </div>
                  {noStaff && (
                    <div style={{ padding: "12px 14px", background: "rgba(184,148,96,0.12)", borderLeft: `3px solid ${PALETTE.amber}`, fontSize: 13, color: PALETTE.ink, lineHeight: 1.5, marginBottom: 16 }}>
                      No staff in your directory are qualified &amp; available for these roles yet. You can still open the incident and assign people manually — or bulk-import your staff in <strong>Admin → Staff Directory</strong> first.
                    </div>
                  )}
                </>
              );
            })()}

            <div style={{ border: `1px solid rgba(0, 48, 94, 0.14)` }}>
              {allocation.map((r, i) => {
                const candidates = availableQualifiedStaff(r.role);
                const assigned = r.status !== "unassigned";
                return (
                  <div key={r.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr 260px", gap: 14, alignItems: "center", padding: "12px 16px", borderBottom: i < allocation.length - 1 ? `1px solid rgba(0, 48, 94, 0.08)` : "none" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: assigned ? (r.isPrincipal ? PALETTE.teal : PALETTE.sage) : PALETTE.bone, color: assigned ? PALETTE.paper : PALETTE.inkSoft, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {r.initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: PALETTE.ink }}>{r.role}</span>
                        {r.required && <span className="mono" style={{ fontSize: 8.5, letterSpacing: "0.1em", color: PALETTE.rust, fontWeight: 700 }}>REQUIRED</span>}
                      </div>
                      {assigned ? (
                        <div style={{ fontSize: 11, color: PALETTE.sage, marginTop: 3, display: "flex", alignItems: "center", gap: 4 }}>
                          {r.allocPref === "primary role" && <Star size={9} fill={PALETTE.sage} color={PALETTE.sage} />}
                          <CheckCircle2 size={10} /> {r.allocPref || "assigned"}
                        </div>
                      ) : (
                        <div style={{ fontSize: 11, color: candidates.length ? PALETTE.inkSoft : PALETTE.rust, marginTop: 3 }}>
                          {candidates.length ? "no one allocated — pick below" : "no qualified staff available"}
                        </div>
                      )}
                    </div>
                    <select value={r.staffId || ""} onChange={(e) => setRoleStaff(r.id, e.target.value || null)}>
                      <option value="">— Unassigned —</option>
                      {candidates.map((c) => (
                        <option key={c.id} value={c.id}>{c.name} · {PREF_LABEL[c.pref]}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid rgba(0, 48, 94, 0.12)`, display: "flex", justifyContent: "space-between", gap: 12 }}>
              <button className="btn" onClick={() => setStep(2)}>
                <ArrowLeft size={14} /> Back to details
              </button>
              <button className="btn btn-primary" onClick={create}>
                Open incident <ArrowRight size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Label({ children }) {
  return (
    <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8 }}>
      {children.toString().toUpperCase()}
    </div>
  );
}
