// ============================================================
// CIMPLE — Shared allocation review (used by New Incident + Triage)
// Renders the auto-allocated team with per-role override dropdowns.
// ============================================================
import React from "react";
import { CheckCircle2, Star } from "lucide-react";
import { PALETTE } from "./shared.jsx";
import { availableQualifiedStaff, PREF_LABEL } from "./data.js";

export default function AllocationReview({ allocation, onChange }) {
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
              <select value={r.staffId || ""} onChange={(e) => onChange(r.id, e.target.value || null)}>
                <option value="">— Unassigned —</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} · {PREF_LABEL[c.pref]}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </>
  );
}
