// ============================================================
// CIMPLE — Admin: Staff & Role management
// ============================================================
import React, { useState, useEffect, useMemo } from "react";
import {
  Users, Plus, Trash2, Edit3, X, Phone, Mail, ChevronRight,
  CheckCircle2, AlertCircle, ArrowLeft, BookOpen, Shield,
  Search, UserCheck, UserX, Save, RefreshCw, AlertTriangle,
  Upload, Download, Star,
} from "lucide-react";
import { PALETTE, TopBarShell } from "./shared.jsx";
import {
  listStaff, saveStaff, deleteStaff, newStaffMember,
  ROLE_DEFINITIONS, verifyStaffContact, staffContactAgeDays,
  detectRoleConflicts, parseStaffImport, bulkImportStaff, staffCsvTemplate,
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
  const [importing, setImporting] = useState(false);
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
  const conflicted = staff.filter((s) => detectRoleConflicts(s.qualifiedFor, s.canDoubleHat).length > 0).length;

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
          <button className="btn" onClick={() => setImporting(true)}>
            <Upload size={14} /> Bulk import
          </button>
          <button className="btn btn-primary" onClick={startNew}>
            <Plus size={14} /> Add staff member
          </button>
        </div>
      </div>

      {staff.length === 0 ? (
        <EmptyStaff onAdd={startNew} onImport={() => setImporting(true)} />
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
      {importing && <ImportModal onClose={() => setImporting(false)} onDone={() => { setImporting(false); refresh(); }} />}
    </>
  );
}

function StaffRow({ staff, onEdit, onDelete, onVerify, isLast }) {
  const ageDays = staffContactAgeDays(staff);
  const stale = ageDays > VERIFY_THRESHOLD_DAYS;
  const verifyLabel = ageDays === Infinity ? "Never verified" : ageDays === 0 ? "Verified today" : `Verified ${ageDays}d ago`;
  const conflicts = detectRoleConflicts(staff.qualifiedFor, staff.canDoubleHat);

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
              style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "1px 6px", background: "rgba(160, 32, 41, 0.1)", color: PALETTE.crimson, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em", fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}
            >
              <AlertTriangle size={9} strokeWidth={2.5} /> CONFLICT
            </span>
          )}
        </div>
        {staff.email && <div className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, marginTop: 2 }}>{staff.email}</div>}
      </div>
      <div style={{ fontSize: 13, color: PALETTE.ink, opacity: 0.85 }}>{staff.role || "—"}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {staff.primaryRole && (
          <span className="chip" style={{ fontSize: 10, padding: "2px 8px", background: PALETTE.teal, color: PALETTE.paper, borderColor: PALETTE.teal, display: "inline-flex", alignItems: "center", gap: 4 }}>
            <Star size={9} fill={PALETTE.paper} /> {staff.primaryRole}
          </span>
        )}
        {(staff.qualifiedFor || []).filter((r) => r !== staff.primaryRole).slice(0, 3).map((r) => (
          <span key={r} className="chip" style={{ fontSize: 10, padding: "2px 8px" }}>{r}</span>
        ))}
        {(staff.qualifiedFor || []).filter((r) => r !== staff.primaryRole).length > 3 && (
          <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft, alignSelf: "center" }}>+{(staff.qualifiedFor || []).filter((r) => r !== staff.primaryRole).length - 3}</span>
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
            fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
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
  const [form, setForm] = useState({
    ...staff,
    secondaryRoles: staff.secondaryRoles || [],
    otherQualifiedRoles: staff.otherQualifiedRoles || [],
  });

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateName(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      const full = `${next.firstName || ""} ${next.lastName || ""}`.trim();
      const auto = full.split(/\s+/).map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
      if (!staff.id || !f.initials || f.initials === (`${f.firstName || ""} ${f.lastName || ""}`.trim().split(/\s+/).map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase())) {
        next.initials = auto || "?";
      }
      return next;
    });
  }

  function setPrimary(role) {
    setForm((f) => ({
      ...f,
      primaryRole: role,
      // A role can't be primary and also secondary/other.
      secondaryRoles: (f.secondaryRoles || []).filter((r) => r !== role),
      otherQualifiedRoles: (f.otherQualifiedRoles || []).filter((r) => r !== role),
    }));
  }

  function toggleIn(field, role) {
    setForm((f) => {
      const list = f[field] || [];
      const has = list.includes(role);
      const next = { ...f, [field]: has ? list.filter((r) => r !== role) : [...list, role] };
      // Keep the three buckets mutually exclusive.
      if (!has) {
        if (field === "secondaryRoles") next.otherQualifiedRoles = (f.otherQualifiedRoles || []).filter((r) => r !== role);
        if (field === "otherQualifiedRoles") next.secondaryRoles = (f.secondaryRoles || []).filter((r) => r !== role);
      }
      return next;
    });
  }

  const derivedQualified = [form.primaryRole, ...(form.secondaryRoles || []), ...(form.otherQualifiedRoles || [])].filter(Boolean);
  const conflicts = detectRoleConflicts(derivedQualified, form.canDoubleHat);

  function handleSubmit() {
    if (!(form.firstName || "").trim() && !(form.lastName || "").trim()) {
      alert("Please enter a first or last name.");
      return;
    }
    onSave(form); // saveStaff normalizes (derives name + qualifiedFor)
  }

  const AVAIL = [
    { v: "available", l: "Available", color: PALETTE.sage, Icon: UserCheck },
    { v: "offsite", l: "Off-site", color: PALETTE.amber, Icon: UserX },
    { v: "unavailable", l: "Unavailable", color: PALETTE.inkSoft, Icon: UserX },
  ];

  return (
    <Modal onClose={onCancel} title={staff.id && listStaff().some((s) => s.id === staff.id) ? "Edit staff member" : "Add staff member"}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 90px", gap: 12, marginBottom: 18 }}>
        <div><Label>First name</Label><input type="text" value={form.firstName || ""} onChange={(e) => updateName("firstName", e.target.value)} placeholder="Sarah" /></div>
        <div><Label>Last name</Label><input type="text" value={form.lastName || ""} onChange={(e) => updateName("lastName", e.target.value)} placeholder="Nguyen" /></div>
        <div><Label>Initials</Label><input type="text" value={form.initials || ""} onChange={(e) => update("initials", e.target.value.toUpperCase().slice(0, 3))} placeholder="SN" maxLength={3} /></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <div><Label>Job title</Label><input type="text" value={form.jobTitle || ""} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Head of Wellbeing" /></div>
        <div><Label>Department</Label><input type="text" value={form.department || ""} onChange={(e) => update("department", e.target.value)} placeholder="Student Services" /></div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
        <div><Label>Mobile</Label><input type="text" value={form.mobile || ""} onChange={(e) => update("mobile", e.target.value)} placeholder="0412 345 678" /></div>
        <div><Label>Email</Label><input type="text" value={form.email || ""} onChange={(e) => update("email", e.target.value)} placeholder="email@school.edu.au" /></div>
      </div>

      <Label>Availability</Label>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {AVAIL.map(({ v, l, color, Icon }) => {
          const on = (form.availabilityStatus || "available") === v;
          return (
            <button key={v} onClick={() => update("availabilityStatus", v)} style={{ flex: 1, padding: 11, fontSize: 13, fontWeight: 500, background: on ? color : PALETTE.paper, color: on ? PALETTE.paper : PALETTE.ink, border: `1px solid ${on ? color : "rgba(0,48,94,0.18)"}` }}>
              <Icon size={13} style={{ marginRight: 6, verticalAlign: "middle" }} />{l}
            </button>
          );
        })}
      </div>

      <Label>Primary incident role</Label>
      <p style={{ fontSize: 12, color: PALETTE.inkSoft, margin: "0 0 8px", lineHeight: 1.5 }}>The role this person normally fills.</p>
      <select value={form.primaryRole || ""} onChange={(e) => setPrimary(e.target.value)} style={{ marginBottom: 18 }}>
        <option value="">— none —</option>
        {ROLE_NAMES.map((r) => <option key={r} value={r}>{r}</option>)}
      </select>

      {conflicts.length > 0 && (
        <div style={{ padding: "10px 14px", marginBottom: 14, background: "rgba(160, 32, 41, 0.08)", borderLeft: `3px solid ${PALETTE.crimson}`, fontSize: 12, color: PALETTE.ink, lineHeight: 1.5 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, color: PALETTE.crimson, fontWeight: 600 }}>
            <AlertTriangle size={12} /> Role conflict — one person can't do both at once
          </div>
          {conflicts.map((c, i) => (<div key={i} style={{ marginTop: 4 }}><strong>{c.roles[0]} + {c.roles[1]}:</strong> {c.reason}</div>))}
        </div>
      )}

      <Label>Backup roles</Label>
      <p style={{ fontSize: 12, color: PALETTE.inkSoft, margin: "0 0 8px", lineHeight: 1.5 }}>Roles they can step into if required.</p>
      <RolePickGrid roles={ROLE_NAMES} exclude={[form.primaryRole]} selected={form.secondaryRoles || []} onToggle={(r) => toggleIn("secondaryRoles", r)} />

      <Label>Other qualified roles</Label>
      <p style={{ fontSize: 12, color: PALETTE.inkSoft, margin: "0 0 8px", lineHeight: 1.5 }}>Additional roles they are qualified for.</p>
      <RolePickGrid roles={ROLE_NAMES} exclude={[form.primaryRole, ...(form.secondaryRoles || [])]} selected={form.otherQualifiedRoles || []} onToggle={(r) => toggleIn("otherQualifiedRoles", r)} />

      <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "11px 14px", marginBottom: 18, background: form.canDoubleHat ? PALETTE.tealMist : PALETTE.paper, border: `1px solid ${form.canDoubleHat ? PALETTE.teal : "rgba(0,48,94,0.18)"}`, cursor: "pointer" }}>
        <input type="checkbox" checked={form.canDoubleHat === true} onChange={(e) => update("canDoubleHat", e.target.checked)} style={{ width: 14, height: 14, marginTop: 2, cursor: "pointer", accentColor: PALETTE.teal }} />
        <span style={{ fontSize: 13, color: PALETTE.ink, lineHeight: 1.5 }}>
          <strong>Can fulfil two or more roles at once</strong>
          <span style={{ display: "block", fontSize: 12, color: PALETTE.inkSoft, marginTop: 2 }}>Allows this person to hold more than one live role in the same incident if you're short-staffed — CIMPLE won't flag it as a conflict.</span>
        </span>
      </label>

      <Label>Notes (optional)</Label>
      <textarea rows={2} value={form.notes || ""} onChange={(e) => update("notes", e.target.value)} placeholder="e.g. lead first aider; on extended leave from week 4." style={{ resize: "vertical", marginBottom: 20 }} />

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 20, borderTop: `1px solid rgba(0, 48, 94, 0.12)` }}>
        <button className="btn" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary" onClick={handleSubmit}><Save size={13} /> Save</button>
      </div>
    </Modal>
  );
}

function RolePickGrid({ roles, selected, onToggle, exclude = [] }) {
  const list = roles.filter((r) => !exclude.includes(r));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(0, 48, 94, 0.15)", border: `1px solid rgba(0, 48, 94, 0.14)`, marginBottom: 18 }}>
      {list.map((role) => {
        const checked = (selected || []).includes(role);
        return (
          <label key={role} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", fontSize: 13, background: checked ? PALETTE.tealMist : PALETTE.paper, cursor: "pointer", color: PALETTE.ink }}>
            <input type="checkbox" checked={checked} onChange={() => onToggle(role)} style={{ width: 14, height: 14, cursor: "pointer", accentColor: PALETTE.teal }} />
            {role}
          </label>
        );
      })}
    </div>
  );
}

function EmptyStaff({ onAdd, onImport }) {
  return (
    <div className="card" style={{ padding: "60px 32px", textAlign: "center" }}>
      <Users size={36} color={PALETTE.teal} strokeWidth={1.4} style={{ margin: "0 auto", opacity: 0.5 }} />
      <h3 className="display" style={{ fontSize: 26, color: PALETTE.teal, fontWeight: 500, marginTop: 20, marginBottom: 8 }}>
        No staff added yet
      </h3>
      <p style={{ fontSize: 14, color: PALETTE.inkSoft, maxWidth: 480, margin: "0 auto 24px", lineHeight: 1.6 }}>
        Load your whole staff directory at once with a CSV, or add people one at a time. Set each person's primary and backup incident roles, and CIMPLE will auto-suggest them when incidents open.
      </p>
      <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
        <button className="btn btn-primary" onClick={onImport}>
          <Upload size={14} /> Bulk import (CSV)
        </button>
        <button className="btn" onClick={onAdd}>
          <Plus size={14} /> Add one manually
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   BULK IMPORT
   ============================================================ */
function ImportModal({ onClose, onDone }) {
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState(null); // { staff, errors, warnings }
  const [mode, setMode] = useState("append"); // "append" | "replace"

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setText(String(reader.result || "")); setParsed(null); };
    reader.readAsText(file);
  }

  function preview() {
    setParsed(parseStaffImport(text));
  }

  function downloadTemplate() {
    triggerDownload(staffCsvTemplate(), "cimple-staff-template.csv", "text/csv");
  }

  function doImport() {
    const res = bulkImportStaff(parsed.staff, mode);
    alert(`Imported: ${res.added} added, ${res.updated} updated. Directory now has ${res.total} staff.`);
    onDone();
  }

  return (
    <Modal onClose={onClose} title="Bulk import staff">
      <p style={{ fontSize: 13, color: PALETTE.inkSoft, lineHeight: 1.6, marginTop: 0 }}>
        Load your whole staff list from a spreadsheet. Export it as <strong>CSV</strong>, or paste the rows below.
        Columns: First Name, Last Name, Email, Mobile Number, Job Title, Department, Availability Status,
        Preferred Incident Role, Backup Incident Role(s). Backup roles can be separated by <code>;</code>.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        <button className="btn" onClick={downloadTemplate}><Download size={13} /> Download template</button>
        <label className="btn" style={{ cursor: "pointer" }}>
          <Upload size={13} /> Choose CSV file
          <input type="file" accept=".csv,text/csv" onChange={handleFile} style={{ display: "none" }} />
        </label>
      </div>

      <Label>Or paste CSV</Label>
      <textarea
        rows={6}
        value={text}
        onChange={(e) => { setText(e.target.value); setParsed(null); }}
        placeholder="First Name,Last Name,Email,Mobile Number,Job Title,Department,Availability Status,Preferred Incident Role,Backup Incident Role(s)"
        style={{ resize: "vertical", fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, marginBottom: 12 }}
      />

      <button className="btn" onClick={preview} disabled={!text.trim()} style={{ marginBottom: 16, opacity: text.trim() ? 1 : 0.5 }}>
        Preview import
      </button>

      {parsed && (
        <div style={{ marginBottom: 16 }}>
          {parsed.errors.length > 0 && (
            <div style={{ padding: "8px 12px", background: "rgba(160,32,41,0.08)", borderLeft: `3px solid ${PALETTE.crimson}`, fontSize: 12, color: PALETTE.crimson, marginBottom: 8 }}>
              {parsed.errors.map((e, i) => <div key={i}>Row {e.row}: {e.message}</div>)}
            </div>
          )}
          {parsed.warnings.length > 0 && (
            <div style={{ padding: "8px 12px", background: "rgba(184,148,96,0.12)", borderLeft: `3px solid ${PALETTE.amber}`, fontSize: 12, color: PALETTE.ink, marginBottom: 8 }}>
              {parsed.warnings.slice(0, 6).map((w, i) => <div key={i}>Row {w.row}: {w.message}</div>)}
              {parsed.warnings.length > 6 && <div>…and {parsed.warnings.length - 6} more.</div>}
            </div>
          )}
          <div className="mono" style={{ fontSize: 11, color: PALETTE.teal, marginBottom: 8 }}>
            {parsed.staff.length} STAFF READY TO IMPORT
          </div>
          {parsed.staff.length > 0 && (
            <div style={{ border: `1px solid rgba(0,48,94,0.14)`, maxHeight: 180, overflowY: "auto" }} className="scroll-y">
              {parsed.staff.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "7px 12px", borderBottom: i < parsed.staff.length - 1 ? `1px solid rgba(0,48,94,0.07)` : "none", fontSize: 12.5 }}>
                  <span style={{ color: PALETTE.ink }}>{s.name}</span>
                  <span className="mono" style={{ fontSize: 10, color: PALETTE.inkSoft }}>{s.primaryRole || "no primary role"}{s.availabilityStatus !== "available" ? ` · ${s.availabilityStatus}` : ""}</span>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 14, alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: PALETTE.ink }}>
              <input type="radio" checked={mode === "append"} onChange={() => setMode("append")} /> Add to existing (update duplicates by email)
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: PALETTE.ink }}>
              <input type="radio" checked={mode === "replace"} onChange={() => setMode("replace")} /> Replace all
            </label>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 16, borderTop: `1px solid rgba(0,48,94,0.12)` }}>
        <button className="btn" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={doImport} disabled={!parsed || parsed.staff.length === 0} style={{ opacity: parsed && parsed.staff.length ? 1 : 0.5 }}>
          <Upload size={13} /> Import {parsed ? parsed.staff.length : ""} staff
        </button>
      </div>
    </Modal>
  );
}

function triggerDownload(content, filename, type) {
  const blob = new Blob([content], { type: type || "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
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
