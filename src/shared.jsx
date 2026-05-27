// ============================================================
// CIMPLE — Shared UI atoms, palette, global styles
// Brand: Trinity Anglican College
//   Navy    #00305E  (primary — used dominantly)
//   Crimson #A02029  (accent — used sparingly, heraldically)
// Aesthetic: editorial / institutional. Quiet authority.
// ============================================================
import React from "react";
import { AlertCircle } from "lucide-react";

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

/* ---------- Two-row institutional masthead ---------- */
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

      {/* Row 1: Colophon — quiet, document-like */}
      <div
        style={{
          background: PALETTE.bone,
          padding: "6px 32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid rgba(0, 48, 94, 0.08)`,
          fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: PALETTE.inkSoft,
        }}
      >
        <span>Trinity Anglican College · Office of the Principal</span>
        <span>{today}</span>
      </div>

      {/* Row 2: Main masthead — logo, wordmark, navigation */}
      <div
        style={{
          background: PALETTE.paper,
          padding: "18px 32px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 30,
          borderBottom: `2px solid ${PALETTE.teal}`,
          boxShadow: `inset 0 -3px 0 ${PALETTE.crimson}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <a href="#/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 18 }}>
            <Logo size={46} />
            <div style={{ borderLeft: `1px solid rgba(0, 48, 94, 0.2)`, paddingLeft: 18 }}>
              <div
                className="display"
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  color: PALETTE.teal,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}
              >
                CIMPLE
              </div>
              <div
                className="mono"
                style={{
                  fontSize: 8.5,
                  letterSpacing: "0.22em",
                  color: PALETTE.inkSoft,
                  marginTop: 5,
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                Critical Incident Platform
              </div>
            </div>
          </a>
          <div style={{ width: 1, height: 36, background: "rgba(0, 48, 94, 0.18)" }} />
          <nav style={{ display: "flex", gap: 2 }}>
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
                  className="display"
                  style={{
                    padding: "8px 16px",
                    fontSize: 15,
                    fontWeight: active ? 600 : 500,
                    fontStyle: active ? "italic" : "normal",
                    color: active ? PALETTE.crimson : PALETTE.teal,
                    background: "transparent",
                    textDecoration: "none",
                    borderBottom: active ? `2px solid ${PALETTE.crimson}` : `2px solid transparent`,
                    marginBottom: -2,
                    transition: "color 140ms ease",
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
              background: PALETTE.teal,
              color: PALETTE.paper,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              letterSpacing: "0.04em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              boxShadow: `0 0 0 3px ${PALETTE.paper}, 0 0 0 4px ${PALETTE.crimson}`,
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
