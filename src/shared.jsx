// ============================================================
// CIMPLE — Shared UI atoms, palette, global styles
// Brand: Trinity Anglican College
//   Navy    #00305E  (primary — used dominantly)
//   Crimson #A02029  (accent — used sparingly, heraldically)
// Aesthetic: editorial / institutional. Quiet authority.
// ============================================================
import React, { useState } from "react";
import { AlertCircle, X, Layers } from "lucide-react";
import { ESCALATION_MATRIX, SEVERITY } from "./data.js";

export const PALETTE = {
  // Primary brand
  teal: "#00305E",         // (kept key name `teal` for back-compat; value is TAC Navy)
  tealDeep: "#001E3D",
  tealMist: "#E5EAF1",
  // Positive / safe / confirmed
  sage: "#5B8C7C",
  sageMist: "#DEE9E4",
  // TAC accent — used sparingly
  crimson: "#A02029",
  crimsonDeep: "#7A1820",
  // Surfaces — pale institutional blue, on-brand
  bone: "#EBF0F6",         // pale navy wash — the page
  paper: "#FFFFFF",        // crisp white — interactive surfaces
  parchment: "#F4F7FB",    // very subtle inset / quiet areas
  // Type
  ink: "#0B1620",          // near-black with cool cast
  inkSoft: "#4A5664",      // cool slate for secondary text
  // Severity / status — desaturated, sober
  rust: "#A85535",
  amber: "#B89460",
  rose: "#7A1820",
};

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=IBM+Plex+Serif:ital,wght@0,400;0,500;0,600;0,700;1,500;1,600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

      * { box-sizing: border-box; }
      html { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      body {
        margin: 0;
        font-family: 'IBM Plex Sans', system-ui, sans-serif;
        font-size: 14px;
        line-height: 1.55;
        color: ${PALETTE.ink};
        background: ${PALETTE.bone};
        font-feature-settings: "kern", "liga";
      }
      .display { font-family: 'IBM Plex Serif', Georgia, serif; letter-spacing: -0.012em; font-feature-settings: "kern", "liga"; }
      .display-italic { font-family: 'IBM Plex Serif', Georgia, serif; font-style: italic; letter-spacing: -0.008em; }
      .mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; font-feature-settings: "tnum", "zero"; }

      /* ---------- Surfaces ---------- */
      .card {
        background: ${PALETTE.paper};
        border: 1px solid rgba(0, 48, 94, 0.12);
        box-shadow: 0 1px 0 rgba(0, 48, 94, 0.03), 0 8px 24px -16px rgba(0, 48, 94, 0.18);
      }

      .panel-h {
        display: flex; justify-content: space-between; align-items: center;
        padding: 14px 20px 12px;
        border-bottom: 1px solid rgba(0, 48, 94, 0.1);
        position: relative;
      }
      .panel-h::after {
        content: "";
        position: absolute; left: 20px; right: 20px; bottom: -1px;
        height: 1px; background: ${PALETTE.crimson};
        width: 24px;
      }
      .panel-h-label {
        font-family: 'IBM Plex Mono', ui-monospace, monospace;
        font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
        color: ${PALETTE.teal}; font-weight: 600;
      }
      .panel-h-meta {
        font-family: 'IBM Plex Mono', ui-monospace, monospace;
        font-size: 9px; letter-spacing: 0.16em; text-transform: uppercase;
        color: ${PALETTE.inkSoft};
      }

      /* ---------- Chips & labels ---------- */
      .chip {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 4px 10px;
        font-family: 'IBM Plex Mono', ui-monospace, monospace;
        font-size: 10px; letter-spacing: 0.1em; font-weight: 600;
        text-transform: uppercase;
        border: 1px solid ${PALETTE.teal};
        background: transparent;
        color: ${PALETTE.teal};
      }

      /* ---------- Buttons ---------- */
      button { font-family: inherit; cursor: pointer; }
      .btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 10px 16px;
        font-family: 'IBM Plex Sans', system-ui, sans-serif;
        font-size: 14px; font-weight: 500;
        letter-spacing: 0.005em;
        border: 1px solid rgba(0, 48, 94, 0.28);
        background: ${PALETTE.paper};
        color: ${PALETTE.teal};
        transition: background 140ms ease, border-color 140ms ease, transform 80ms ease;
      }
      .btn:hover { background: ${PALETTE.tealMist}; border-color: ${PALETTE.teal}; }
      .btn:active { transform: translateY(1px); }
      .btn-primary {
        background: ${PALETTE.teal};
        color: ${PALETTE.paper};
        border-color: ${PALETTE.teal};
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 1px 0 rgba(0,48,94,0.15);
      }
      .btn-primary:hover { background: ${PALETTE.tealDeep}; border-color: ${PALETTE.tealDeep}; }
      .btn-ghost { background: transparent; border-color: transparent; color: ${PALETTE.teal}; box-shadow: none; }
      .btn-ghost:hover { background: rgba(0, 48, 94, 0.06); }
      .btn-danger { background: ${PALETTE.crimson}; color: ${PALETTE.paper}; border-color: ${PALETTE.crimson}; box-shadow: inset 0 1px 0 rgba(255,255,255,0.1); }
      .btn-danger:hover { background: ${PALETTE.crimsonDeep}; border-color: ${PALETTE.crimsonDeep}; }

      /* ---------- Form controls ---------- */
      input[type="text"], input[type="search"], textarea, select {
        font-family: 'IBM Plex Sans', system-ui, sans-serif;
        font-size: 14px;
        border: 1px solid rgba(0, 48, 94, 0.22);
        background: ${PALETTE.paper};
        color: ${PALETTE.ink};
        padding: 10px 12px;
        outline: none;
        width: 100%;
        transition: border-color 140ms ease, box-shadow 140ms ease;
      }
      input:focus, textarea:focus, select:focus {
        border-color: ${PALETTE.teal};
        box-shadow: 0 0 0 3px rgba(0, 48, 94, 0.08);
      }

      a { color: ${PALETTE.teal}; text-decoration-color: rgba(0,48,94,0.3); text-underline-offset: 2px; }
      a:hover { text-decoration-color: ${PALETTE.crimson}; }

      /* ---------- Section heading helper ---------- */
      .section-label {
        display: inline-flex; align-items: center; gap: 10px;
        font-family: 'IBM Plex Mono', ui-monospace, monospace;
        font-size: 10px; letter-spacing: 0.24em; text-transform: uppercase;
        color: ${PALETTE.teal}; font-weight: 600;
      }
      .section-label::before {
        content: ""; display: inline-block;
        width: 24px; height: 1px;
        background: ${PALETTE.crimson};
      }

      /* ---------- Motion ---------- */
      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      .fade-in { animation: fadeIn 320ms ease both; }
      @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      .slide-in { animation: slideIn 360ms cubic-bezier(0.4, 0, 0.2, 1) both; }
      @keyframes pulseSoft { 0%, 100% { opacity: 1; } 50% { opacity: 0.45; } }
      .live-dot { animation: pulseSoft 1.6s ease-in-out infinite; }

      /* ---------- Scrollbar ---------- */
      .scroll-y { overflow-y: auto; }
      .scroll-y::-webkit-scrollbar { width: 6px; }
      .scroll-y::-webkit-scrollbar-thumb { background: rgba(0, 48, 94, 0.22); }
      .scroll-y::-webkit-scrollbar-track { background: transparent; }

      .row-hover:hover { background: ${PALETTE.parchment}; cursor: pointer; }
    `}</style>
  );
}

export function Logo({ size = 40 }) {
  return (
    <img
      src="/trinity-logo.svg"
      alt="Trinity Anglican College"
      width={size}
      height={size}
      style={{ display: "block", objectFit: "contain" }}
    />
  );
}

/* ---------- Prototype classification stamp ---------- */
export function PrototypeNotice() {
  return (
    <div
      role="note"
      style={{
        background: PALETTE.tealDeep,
        color: PALETTE.paper,
        padding: "6px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        borderBottom: `1px solid ${PALETTE.crimson}`,
      }}
    >
      <AlertCircle size={12} color={PALETTE.crimson} strokeWidth={2.5} />
      <span
        className="mono"
        style={{
          fontSize: 10,
          letterSpacing: "0.26em",
          fontWeight: 600,
          textAlign: "center",
          textTransform: "uppercase",
        }}
      >
        Prototype · Demo Use Only · Do Not Enter Real Student or Staff Data
      </span>
      <AlertCircle size={12} color={PALETTE.crimson} strokeWidth={2.5} />
    </div>
  );
}

/* ---------- Institutional masthead (heraldic navy ribbon) ---------- */
export function TopBarShell({ children, current }) {
  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <PrototypeNotice />

      {/* Heraldic colophon — tiny line above the navy ribbon */}
      <div
        style={{
          background: PALETTE.tealDeep,
          padding: "5px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: 9,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "rgba(255, 255, 255, 0.55)",
        }}
      >
        <span>Trinity Anglican College · Office of the Principal</span>
        <span>{today}</span>
      </div>

      {/* Main masthead — solid navy ribbon with heraldic crimson under-rule */}
      <div
        style={{
          background: PALETTE.teal,
          padding: "16px 32px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 30,
          boxShadow: `inset 0 -4px 0 ${PALETTE.crimson}`,
          color: PALETTE.paper,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <a href="#/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 18, color: "inherit" }}>
            {/* Logo medallion — white badge for the navy-coloured logo */}
            <div
              style={{
                width: 52,
                height: 52,
                background: PALETTE.paper,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                boxShadow: `0 0 0 2px ${PALETTE.crimson}, 0 0 0 4px ${PALETTE.paper}, 0 0 0 5px rgba(255,255,255,0.18)`,
                flexShrink: 0,
              }}
            >
              <Logo size={38} />
            </div>

            <div style={{ borderLeft: `1px solid rgba(255, 255, 255, 0.22)`, paddingLeft: 18 }}>
              <div
                style={{
                  fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                  fontSize: 24,
                  fontWeight: 600,
                  color: PALETTE.paper,
                  lineHeight: 1,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                CIMPLE
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 9,
                  letterSpacing: "0.24em",
                  color: "rgba(255, 255, 255, 0.7)",
                  marginTop: 6,
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                Critical Incident Platform
              </div>
            </div>
          </a>

          <div style={{ width: 1, height: 38, background: "rgba(255, 255, 255, 0.2)" }} />

          <nav style={{ display: "flex", gap: 4 }}>
            {[
              { l: "Incidents", href: "#/", key: "home" },
              { l: "Triage", href: "#/triage", key: "triage" },
              { l: "Sandbox", href: "#/sandbox", key: "sandbox" },
              { l: "Admin", href: "#/admin", key: "admin" },
            ].map((item) => {
              const active = current === item.key;
              return (
                <a
                  key={item.key}
                  href={item.href}
                  style={{
                    padding: "8px 14px",
                    fontFamily: "'IBM Plex Sans', system-ui, sans-serif",
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: PALETTE.paper,
                    opacity: active ? 1 : 0.78,
                    background: "transparent",
                    textDecoration: "none",
                    borderBottom: active ? `2px solid ${PALETTE.crimson}` : `2px solid transparent`,
                    marginBottom: -16,
                    paddingBottom: 14,
                    transition: "opacity 140ms ease",
                  }}
                >
                  {item.l}
                </a>
              );
            })}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {children}
          <div
            title="K. Patel — Principal"
            style={{
              width: 38,
              height: 38,
              background: PALETTE.paper,
              color: PALETTE.teal,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              boxShadow: `0 0 0 2px ${PALETTE.crimson}`,
            }}
          >
            KP
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Institutional footer (colophon) ---------- */
export function InstitutionalFooter() {
  const year = new Date().getFullYear();
  return (
    <footer
      style={{
        marginTop: 64,
        background: PALETTE.bone,
        borderTop: `1px solid rgba(0, 48, 94, 0.12)`,
        boxShadow: `inset 0 3px 0 ${PALETTE.crimson}, inset 0 4px 0 ${PALETTE.teal}`,
        padding: "32px 32px 28px",
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: 32,
          alignItems: "center",
        }}
      >
        <Logo size={36} />

        <div>
          <div
            className="display"
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: PALETTE.teal,
              letterSpacing: "-0.01em",
              lineHeight: 1.2,
            }}
          >
            CIMPLE · <span style={{ fontStyle: "italic", fontWeight: 500 }}>Critical Incident Platform</span>
          </div>
          <div
            className="mono"
            style={{
              fontSize: 9.5,
              letterSpacing: "0.18em",
              color: PALETTE.inkSoft,
              marginTop: 6,
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Issued by the Office of the Principal · Internal Use Only
          </div>
        </div>

        <div
          className="mono"
          style={{
            fontSize: 9,
            letterSpacing: "0.16em",
            color: PALETTE.inkSoft,
            textAlign: "right",
            textTransform: "uppercase",
            lineHeight: 1.7,
          }}
        >
          <div>Trinity Anglican College</div>
          <div>MMXXVI · Prototype Build</div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Reusable centred modal ---------- */
export function ReferenceModal({ title, subtitle, onClose, children, maxWidth = 960 }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(11,22,32,0.5)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "48px 20px", overflowY: "auto" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card fade-in"
        style={{ maxWidth, width: "100%", background: PALETTE.paper }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, padding: "20px 24px 16px", borderBottom: `1px solid rgba(0,48,94,0.12)` }}>
          <div>
            <div className="display" style={{ fontSize: 22, fontWeight: 600, color: PALETTE.teal, letterSpacing: "-0.01em" }}>{title}</div>
            {subtitle && <p style={{ fontSize: 12.5, color: PALETTE.inkSoft, margin: "4px 0 0", lineHeight: 1.5 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} className="btn-ghost" style={{ padding: 6, flexShrink: 0 }} aria-label="Close"><X size={18} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
}

/* ---------- The plan's Level 0–3 Escalation Matrix (quick reference) ---------- */
export function EscalationMatrix() {
  const cols = [
    { k: "criteria", label: "Criteria / description", w: "30%" },
    { k: "impacts", label: "Impacts", w: "14%" },
    { k: "examples", label: "Examples", w: "24%" },
    { k: "who", label: "Who activates", w: "14%" },
    { k: "plan", label: "Plan to activate", w: "18%" },
  ];
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 720, fontSize: 12 }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px 10px", background: PALETTE.tealDeep, color: PALETTE.paper, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" }}>Level</th>
            {cols.map((c) => (
              <th key={c.k} style={{ textAlign: "left", padding: "8px 10px", background: PALETTE.tealDeep, color: PALETTE.paper, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", width: c.w }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ESCALATION_MATRIX.map((row) => {
            const sev = SEVERITY[row.level] || {};
            return (
              <tr key={row.level} style={{ borderBottom: `1px solid rgba(0,48,94,0.12)`, verticalAlign: "top" }}>
                <td style={{ padding: "10px", background: sev.bg || PALETTE.parchment, minWidth: 96 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 26, height: 26, borderRadius: "50%", background: sev.color, color: PALETTE.paper, fontWeight: 700, fontSize: 12 }}>L{row.level}</div>
                  <div style={{ fontWeight: 600, color: PALETTE.ink, marginTop: 6, lineHeight: 1.2 }}>{row.label}</div>
                  {row.tactical && <div className="mono" style={{ fontSize: 9.5, color: PALETTE.inkSoft, marginTop: 2 }}>{row.tactical}</div>}
                </td>
                <td style={{ padding: "10px" }}>
                  <ul style={{ margin: 0, paddingLeft: 16, lineHeight: 1.5 }}>
                    {row.criteria.map((c, i) => <li key={i} style={{ marginBottom: 3, color: PALETTE.ink }}>{c}</li>)}
                  </ul>
                </td>
                <td style={{ padding: "10px", color: PALETTE.inkSoft }}>{row.impacts}</td>
                <td style={{ padding: "10px", color: PALETTE.inkSoft, lineHeight: 1.6 }}>{row.examples.join(" · ")}</td>
                <td style={{ padding: "10px", color: PALETTE.ink, fontWeight: 500 }}>{row.who}</td>
                <td style={{ padding: "10px", color: PALETTE.inkSoft }}>{row.plan}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p style={{ fontSize: 11, color: PALETTE.inkSoft, margin: "12px 2px 0", lineHeight: 1.5 }}>
        Source: TAC Critical Incident &amp; Business Continuity Management Plan — Level 0–3 escalation matrix. The CIMT engages at Level 2 and above; Levels 0–1 are handled under Standard Operating Procedures and the Emergency Response Plan (Warden Team / ECO).
      </p>
    </div>
  );
}

// A small button that opens the escalation matrix in a modal. Drop anywhere a
// user might ask "which level is this?" — creation, triage, the incident.
export function EscalationMatrixButton({ compact = false, label = "Escalation matrix" }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={compact ? "btn-ghost" : "btn"}
        style={compact
          ? { background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 12, display: "inline-flex", alignItems: "center", gap: 6, fontWeight: 500 }
          : undefined}
      >
        <Layers size={compact ? 13 : 14} /> {label}
      </button>
      {open && (
        <ReferenceModal
          title="Incident Escalation Matrix"
          subtitle="Match the situation to a level (0–3). This is the plan's reference table, in full."
          onClose={() => setOpen(false)}
        >
          <EscalationMatrix />
        </ReferenceModal>
      )}
    </>
  );
}

// ---------- helpers ----------
export function formatTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatRelative(ts, now) {
  const delta = Math.floor((now - ts) / 1000);
  if (delta < 60) return "just now";
  const min = Math.floor(delta / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

export function formatElapsed(ms) {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function formatDateShort(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}
