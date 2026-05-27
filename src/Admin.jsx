// ============================================================
// CIMPLE — Admin: Staff & Role management
// ============================================================
import React, { useState, useEffect, useMemo } from "react";
import {
  Users, Plus, Trash2, Edit3, X, Phone, Mail, ChevronRight,
  CheckCircle2, AlertCircle, ArrowLeft, BookOpen, Shield,
  Search, UserCheck, UserX, Save, RefreshCw, AlertTriangle,
} from "lucide-react";
import { PALETTE, TopBarShell } from "./shared.jsx";
import {
  listStaff, saveStaff, deleteStaff, newStaffMember,
  ROLE_DEFINITIONS, verifyStaffContact, staffContactAgeDays,
  detectRoleConflicts,
} from "./data.js";

const VERIFY_THRESHOLD_DAYS = 90;

const ROLE_NAMES = Object.keys(ROLE_DEFINITIONS);

export default function Admin({ onBack }) {
  const [tab, setTab] = useState("staff"); // "staff" | "roles"

  return (
    <>
      <TopBarShell current="admin" />
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "32px" }}>
        <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8 }}>
          ADMIN
        </div>
        <h1 className="display" style={{ fontSize: 44, lineHeight: 1, color: PALETTE.teal, fontWeight: 500, margin: 0, letterSpacing: "-0.02em" }}>
          Staff & roles
        </h1>
        <p style={{ fontSize: 14, color: PALETTE.inkSoft, marginTop: 8, margin: "8px 0 0", maxWidth: 600, lineHeight: 1.6 }}>
          Configure your school's staff directory and define the roles used during incident response. Staff added here are auto-suggested when starting a new incident.
        </p>

        <div style={{ marginTop: 32, display: "flex", gap: 4, borderBottom: `1px solid rgba(0, 48, 94, 0.15)` }}>
          {[
            { v: "staff", l: "Staff Directory" },
            { v: "roles", l: "Role Definitions" },
          ].map((t) => (
            <button
              key={t.v}
              onClick={() => setTab(t.v)}
              style={{
                padding: "12px 20px",
                fontSize: 13,
                fontWeight: 500,
                background: "transparent",
                color: tab === t.v ? PALETTE.teal : PALETTE.inkSoft,
                border: "none",
                borderBottom: `2px solid ${tab === t.v ? PALETTE.teal : "transparent"}`,
                marginBottom: -1,
              }}
            >
              {t.l}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 24 }}>
          {tab === "staff" && <StaffTab />}
          {tab === "roles" && <RolesTab />}
        </div>
      </div>
    </>
  );
}

/* ============================================================
   STAFF TAB
   ============================================================ */
function StaffTab() {
  const [staff, setStaff] = useState([]);
  const [editing, setEditing] = useState(null); // staff object or null
  const [search, setSearch] = useState("");

  function refresh() {
    setStaff(listStaff());
  }
  useEffect(refresh, []);

  function startNew() {
    setEditing(newStaffMember({}));
  }

  function startEdit(s) {
    setEditing({ ...s });
  }

  function handleSave(s) {
    saveStaff(s);
    setEditing(null);
    refresh();
  }

  function handleDelete(id) {
    if (!confirm("Delete this staff member? They will be removed from any incidents that haven't yet started.")) return;
    deleteStaff(id);
    refresh();
  }

  function handleVerify(id) {
    verifyStaffContact(id);
    refresh();
  }

  const filtered = useMemo(() => {
    if (!search.trim()) return staff;
    const q = search.toLowerCase();
    return staff.filter(
      (s) => s.name.toLowerCase().includes(q) || (s.role || "").toLowerCase().includes(q) || (s.qualifiedFor || []).some((r) => r.toLowerCase().includes(q))
    );
  }, [staff, search]);

  const stale = staff.filter((s) => staffContactAgeDays(s) > VERIFY_THRESHOLD_DAYS).length;
  const conflicted = staff.filter((s) => detectRoleConflicts(s.qualifiedFor).length > 0).length;

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.7 }}>
            {staff.length} STAFF · {staff.filter((s) => s.available).length} AVAILABLE
          </span>
          {stale > 0 && (
            <span className="mono" title={`Contact details not verified in ${VERIFY_THRESHOLD_DAYS}+ days`} style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.rust, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <RefreshCw size={10} /> {stale} NEEDS VERIFY
            </span>
          )}
          {conflicted > 0 && (
            <span className="mono" title="Has conflicting role qualifications" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.crimson, fontWeight: 600, display: "inline-flex", alignItems: "center", gap: 5 }}>
              <AlertTriangle size={10} /> {conflicted} ROLE CONFLICT
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {staff.length > 0 && (
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: PALETTE.inkSoft }} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search staff…"
                style={{ paddingLeft: 32, fontSize: 13, width: 220, padding: "8px 12px 8px 32px" }}
              />
            </div>
          )}
          <button className="btn btn-primary" onClick={startNew}>
            <Plus size={14} /> Add staff member
          </button>
        </div>
      </div>

      {staff.length === 0 ? (
        <EmptyStaff onAdd={startNew} />
      ) : (
        <div className="card">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "60px 1fr 1.2fr 1.5fr 130px 80px",
              gap: 16,
              padding: "12px 18px",
              borderBottom: `1px solid rgba(0, 48, 94, 0.12)`,
              background: PALETTE.bone,
            }}
          >
            {["", "NAME", "TITLE", "QUALIFIED FOR", "STATUS", ""].map((h, i) => (
              <div key={i} className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.6 }}>
                {h}
              </div>
            ))}
          </div>
          {filtered.map((s, i) => (
            <StaffRow key={s.id} staff={s} onEdit={() => startEdit(s)} onDelete={() => handleDelete(s.id)} onVerify={() => handleVerify(s.id)} isLast={i === filtered.length - 1} />
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "32px", textAlign: "center", color: PALETTE.inkSoft, fontSize: 13 }}>
              No staff match your search.
            </div>
          )}
        </div>
      )}

      {editing && <StaffEditor staff={editing} onSave={handleSave} onCancel={() => setEditing(null)} />}
    </>
  );
}

function StaffRow({ staff, onEdit, onDelete, onVerify, isLast }) {
  const ageDays = staffContactAgeDays(staff);
  const stale = ageDays > VERIFY_THRESHOLD_DAYS;
  const verifyLabel = ageDays === Infinity ? "Never verified" : ageDays === 0 ? "Verified today" : `Verified ${ageDays}d ago`;
  const conflicts = detectRoleConflicts(staff.qualifiedFor);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 1.2fr 1.5fr 130px 80px",
        gap: 16,
        padding: "14px 18px",
        borderBottom: isLast ? "none" : `1px solid rgba(0, 48, 94, 0.08)`,
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          background: staff.available ? PALETTE.teal : PALETTE.inkSoft,
          color: PALETTE.paper,
          fontSize: 12,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
        }}
      >
        {staff.initials}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 14, color: PALETTE.ink, fontWeight: 500 }}>{staff.name}</span>
          {conflicts.length > 0 && (
            <span
              title={`Role conflict: ${conflicts.map((c) => c.roles.join(" + ")).join("; ")}`}
              style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 6px", background: "rgba(160, 32, 41, 0.1)", color: PALETTE.crimson, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", fontFamily: "'JetBrains Mono', monospace" }}
            >
              <AlertTriangle size={9} strokeWidth={2.5} /> CONFLICT
            </span>
          )}
        </div>
        {staff.email && <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 2 }}>{staff.email}</div>}
      </div>
      <div style={{ fontSize: 13, color: PALETTE.ink, opacity: 0.85 }}>{staff.role || "—"}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {(staff.qualifiedFor || []).slice(0, 4).map((r) => (
          <span key={r} className="chip" style={{ fontSize: 10, padding: "2px 8px" }}>{r}</span>
        ))}
        {(staff.qualifiedFor || []).length > 4 && (
          <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, alignSelf: "center" }}>+{staff.qualifiedFor.length - 4}</span>
        )}
        {(staff.qualifiedFor || []).length === 0 && (
          <span style={{ fontSize: 12, color: PALETTE.inkSoft, fontStyle: "italic" }}>No roles assigned</span>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {staff.available ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: PALETTE.sage, fontWeight: 500 }}>
            <UserCheck size={11} /> Available
          </span>
        ) : (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, color: PALETTE.inkSoft }}>
            <UserX size={11} /> Off duty
          </span>
        )}
        <button
          onClick={onVerify}
          title={stale ? "Contact details are stale — confirm and re-verify" : "Re-confirm contact details now"}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: "0.1em",
            color: stale ? PALETTE.rust : PALETTE.inkSoft,
            fontWeight: stale ? 600 : 400,
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            textAlign: "left",
          }}
        >
          <RefreshCw size={9} /> {verifyLabel}
        </button>
      </div>
      <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
        <button onClick={onEdit} className="btn-ghost" style={{ background: "none", border: "none", padding: 6, color: PALETTE.teal }} title="Edit">
          <Edit3 size={13} />
        </button>
        <button onClick={onDelete} className="btn-ghost" style={{ background: "none", border: "none", padding: 6, color: PALETTE.inkSoft }} title="Delete">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

function StaffEditor({ staff, onSave, onCancel }) {
  const [form, setForm] = useState({ ...staff });

  function update(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      // Auto-update initials when name changes
      if (field === "name") {
        const auto = (value || "")
          .split(/\s+/)
          .map((s) => s[0])
          .filter(Boolean)
          .slice(0, 2)
          .join("")
          .toUpperCase();
        if (!staff.id || staff.initials === auto || !f.initials) {
          next.initials = auto || "?";
        }
      }
      return next;
    });
  }

  function toggleQualified(role) {
    setForm((f) => {
      const list = f.qualifiedFor || [];
      const has = list.includes(role);
      return { ...f, qualifiedFor: has ? list.filter((r) => r !== role) : [...list, role] };
    });
  }

  function handleSubmit() {
    if (!form.name.trim()) {
      alert("Please enter a name.");
      return;
    }
    onSave(form);
  }

  return (
    <Modal onClose={onCancel} title={staff.id && listStaff().some((s) => s.id === staff.id) ? "Edit staff member" : "Add staff member"}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 16, marginBottom: 20 }}>
        <div>
          <Label>Name</Label>
          <input type="text" value={form.name || ""} onChange={(e) => update("name", e.target.value)} placeholder="e.g. Sarah Nguyen" />
        </div>
        <div>
          <Label>Initials</Label>
          <input type="text" value={form.initials || ""} onChange={(e) => update("initials", e.target.value.toUpperCase().slice(0, 3))} placeholder="SN" maxLength={3} />
        </div>
      </div>

      <Label>Title / Position</Label>
      <input type="text" value={form.role || ""} onChange={(e) => update("role", e.target.value)} placeholder="e.g. Head of Wellbeing" style={{ marginBottom: 20 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <Label>Phone</Label>
          <input type="text" value={form.phone || ""} onChange={(e) => update("phone", e.target.value)} placeholder="0412 345 678" />
        </div>
        <div>
          <Label>Email</Label>
          <input type="text" value={form.email || ""} onChange={(e) => update("email", e.target.value)} placeholder="email@school.edu.au" />
        </div>
      </div>

      <Label>Qualified for incident roles</Label>
      <p style={{ fontSize: 12, color: PALETTE.inkSoft, margin: "0 0 12px", lineHeight: 1.5 }}>
        Tick the roles this person is qualified to perform. CIMPLE will auto-suggest them when a new incident is opened.
      </p>
      {(() => {
        const conflicts = detectRoleConflicts(form.qualifiedFor);
        if (conflicts.length === 0) return null;
        return (
          <div style={{ padding: "10px 14px", marginBottom: 12, background: "rgba(160, 32, 41, 0.08)", borderLeft: `3px solid ${PALETTE.crimson}`, fontSize: 12, color: PALETTE.ink, lineHeight: 1.5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, color: PALETTE.crimson, fontWeight: 600 }}>
              <AlertTriangle size={12} /> Role conflict — one person can't do both at once
            </div>
            {conflicts.map((c, i) => (
              <div key={i} style={{ marginTop: 4 }}>
                <strong>{c.roles[0]} + {c.roles[1]}:</strong> {c.reason}
              </div>
            ))}
            <div style={{ marginTop: 6, fontSize: 11, color: PALETTE.inkSoft }}>
              You can still save — but in a real incident, name a separate primary or alternate (PRD §13.2).
            </div>
          </div>
        );
      })()}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(0, 48, 94, 0.15)", border: `1px solid rgba(0, 48, 94, 0.14)`, marginBottom: 20 }}>
        {ROLE_NAMES.map((role) => {
          const checked = (form.qualifiedFor || []).includes(role);
          return (
            <label
              key={role}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 14px",
                fontSize: 13,
                background: checked ? PALETTE.tealMist : PALETTE.paper,
                cursor: "pointer",
                color: PALETTE.ink,
              }}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggleQualified(role)}
                style={{ width: 14, height: 14, cursor: "pointer", accentColor: PALETTE.teal }}
              />
              {role}
            </label>
          );
        })}
      </div>

      <Label>Currently available</Label>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button
          onClick={() => update("available", true)}
          style={{
            flex: 1,
            padding: 12,
            fontSize: 13,
            fontWeight: 500,
            background: form.available ? PALETTE.sage : PALETTE.paper,
            color: form.available ? PALETTE.paper : PALETTE.ink,
            border: `1px solid ${form.available ? PALETTE.sage : "rgba(0, 48, 94, 0.18)"}`,
          }}
        >
          <UserCheck size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
          On duty
        </button>
        <button
          onClick={() => update("available", false)}
          style={{
            flex: 1,
            padding: 12,
            fontSize: 13,
            fontWeight: 500,
            background: !form.available ? PALETTE.inkSoft : PALETTE.paper,
            color: !form.available ? PALETTE.paper : PALETTE.ink,
            border: `1px solid ${!form.available ? PALETTE.inkSoft : "rgba(0, 48, 94, 0.18)"}`,
          }}
        >
          <UserX size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />
          Off duty
        </button>
      </div>

      <Label>Notes (optional)</Label>
      <textarea rows={2} value={form.notes || ""} onChange={(e) => update("notes", e.target.value)} placeholder="Any relevant notes — e.g. on extended leave, lead first aider, etc." style={{ resize: "vertical", marginBottom: 20 }} />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 20, borderTop: `1px solid rgba(0, 48, 94, 0.12)` }}>
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          <Save size={13} /> Save
        </button>
      </div>
    </Modal>
  );
}

function EmptyStaff({ onAdd }) {
  return (
    <div className="card" style={{ padding: "60px 32px", textAlign: "center" }}>
      <Users size={36} color={PALETTE.teal} strokeWidth={1.4} style={{ margin: "0 auto", opacity: 0.5 }} />
      <h3 className="display" style={{ fontSize: 26, color: PALETTE.teal, fontWeight: 500, marginTop: 20, marginBottom: 8 }}>
        No staff added yet
      </h3>
      <p style={{ fontSize: 14, color: PALETTE.inkSoft, maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.6 }}>
        Add the staff at your school who may be involved in incident response. Set what each person is qualified for, and CIMPLE will auto-suggest them when incidents open.
      </p>
      <button className="btn btn-primary" onClick={onAdd}>
        <Plus size={14} /> Add your first staff member
      </button>
    </div>
  );
}

/* ============================================================
   ROLES TAB
   ============================================================ */
function RolesTab() {
  const [staff, setStaff] = useState([]);
  useEffect(() => setStaff(listStaff()), []);

  return (
    <>
      <div style={{ marginBottom: 16 }}>
        <span className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.7 }}>
          {ROLE_NAMES.length} ROLES · DEFINED BY CIMPLE
        </span>
      </div>
      <div className="card" style={{ padding: 16, marginBottom: 24, background: PALETTE.bone, border: "none" }}>
        <p style={{ fontSize: 13, color: PALETTE.ink, margin: 0, lineHeight: 1.6 }}>
          These are the standard roles CIMPLE uses during incident response. Each has a description, reporting line, and indicates how many of your staff are currently qualified.
        </p>
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {ROLE_NAMES.map((role) => {
          const def = ROLE_DEFINITIONS[role];
          const qualified = staff.filter((s) => s.qualifiedFor?.includes(role));
          const available = qualified.filter((s) => s.available);
          return (
            <div key={role} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <Shield size={14} color={PALETTE.teal} />
                    <h3 className="display" style={{ fontSize: 20, color: PALETTE.teal, fontWeight: 500, margin: 0, letterSpacing: "-0.015em" }}>
                      {role}
                    </h3>
                  </div>
                  <p style={{ fontSize: 13, color: PALETTE.ink, margin: 0, lineHeight: 1.6 }}>
                    {def.description}
                  </p>
                  <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 12, color: PALETTE.inkSoft, flexWrap: "wrap" }}>
                    <span><strong style={{ color: PALETTE.teal }}>Reports to:</strong> {def.reportsTo}</span>
                    <span><strong style={{ color: PALETTE.teal }}>Typically held by:</strong> {def.typicallyHeldBy}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 140 }}>
                  <div className="display" style={{ fontSize: 28, color: available.length > 0 ? PALETTE.sage : PALETTE.rust, fontWeight: 500, lineHeight: 1 }}>
                    {available.length}
                  </div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.inkSoft, marginTop: 4 }}>
                    AVAILABLE / {qualified.length} TOTAL
                  </div>
                </div>
              </div>
              {qualified.length > 0 && (
                <div style={{ paddingTop: 12, borderTop: `1px solid rgba(0, 48, 94, 0.1)`, display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {qualified.map((s) => (
                    <span
                      key={s.id}
                      className="chip"
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        opacity: s.available ? 1 : 0.5,
                        textDecoration: s.available ? "none" : "line-through",
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              )}
              {qualified.length === 0 && (
                <div style={{ paddingTop: 12, borderTop: `1px solid rgba(0, 48, 94, 0.1)`, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: PALETTE.rust }}>
                  <AlertCircle size={12} /> No staff currently qualified for this role.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ============================================================
   Helpers
   ============================================================ */
function Label({ children }) {
  return (
    <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8 }}>
      {children.toString().toUpperCase()}
    </div>
  );
}

function Modal({ children, onClose, title }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0, 30, 61, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} className="fade-in" style={{ width: "100%", maxWidth: 640, maxHeight: "90vh", background: PALETTE.paper, border: `1px solid rgba(0, 48, 94, 0.2)`, display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid rgba(0, 48, 94, 0.14)`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="display" style={{ fontSize: 22, color: PALETTE.teal, fontWeight: 500, letterSpacing: "-0.015em" }}>{title}</div>
          <button onClick={onClose} className="btn-ghost" style={{ background: "none", border: "none", color: PALETTE.ink, padding: 6 }}><X size={18} /></button>
        </div>
        <div className="scroll-y" style={{ flex: 1, padding: 24, overflowY: "auto" }}>{children}</div>
      </div>
    </div>
  );
}
