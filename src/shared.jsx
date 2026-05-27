// ============================================================
// CIMPLE — Shared UI atoms, palette, global styles
// Brand: Trinity Anglican College
//   Navy   #00305E  (primary)
//   Crimson #A02029 (accent — used sparingly per TAC mark)
// ============================================================
import React from "react";
import { AlertCircle } from "lucide-react";

export const PALETTE = {
  // Primary brand (renamed keys kept as `teal*` for backwards compatibility
  // with existing JSX — values are now TAC Navy)
  teal: "#00305E",
  tealDeep: "#001E3D",
  tealMist: "#E5EAF1",
  // Positive / safe / confirmed (tuned to sit comfortably next to navy)
  sage: "#5B8C7C",
  sageMist: "#D7E3DE",
  // TAC accent — use sparingly (logo region, live indicator)
  crimson: "#A02029",
  crimsonDeep: "#7A1820",
  // Surfaces
  bone: "#F3F1EC",
  paper: "#FFFFFF",
  // Type
  ink: "#1A2024",
  inkSoft: "#5A6670",
  // Severity / status (functional, not brand)
  rust: "#B85C3C",
  amber: "#C9A961",
  rose: "#8B2E1A",
};

export function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'Inter', system-ui, sans-serif; color: ${PALETTE.ink}; background: ${PALETTE.bone}; }
      .display { font-family: 'Fraunces', Georgia, serif; letter-spacing: -0.01em; }
      .mono { font-family: 'JetBrains Mono', monospace; }

      .card {
        background: ${PALETTE.paper};
        border: 1px solid rgba(0, 48, 94, 0.14);
      }

      .panel-h {
        display: flex; justify-content: space-between; align-items: center;
        padding: 14px 18px;
        border-bottom: 1px solid rgba(0, 48, 94, 0.12);
      }
      .panel-h-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; color: ${PALETTE.teal}; opacity: 0.7; }
      .panel-h-meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; color: ${PALETTE.teal}; opacity: 0.5; }

      .chip {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 4px 10px; font-size: 11px; font-weight: 500;
        border: 1px solid rgba(0, 48, 94, 0.2);
        background: ${PALETTE.paper};
        color: ${PALETTE.teal};
      }

      button { font-family: inherit; cursor: pointer; }
      .btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 9px 14px; font-size: 13px; font-weight: 500;
        border: 1px solid rgba(0, 48, 94, 0.2);
        background: ${PALETTE.paper}; color: ${PALETTE.teal};
        transition: all 160ms ease;
      }
      .btn:hover { background: ${PALETTE.tealMist}; border-color: ${PALETTE.teal}; }
      .btn-primary { background: ${PALETTE.teal}; color: ${PALETTE.paper}; border-color: ${PALETTE.teal}; }
      .btn-primary:hover { background: ${PALETTE.tealDeep}; }
      .btn-ghost { background: transparent; border-color: transparent; color: ${PALETTE.teal}; }
      .btn-ghost:hover { background: rgba(0, 48, 94, 0.06); }
      .btn-danger { background: ${PALETTE.crimson}; color: ${PALETTE.paper}; border-color: ${PALETTE.crimson}; }
      .btn-danger:hover { background: ${PALETTE.crimsonDeep}; }

      input[type="text"], input[type="search"], textarea, select {
        font-family: inherit; font-size: 14px;
        border: 1px solid rgba(0, 48, 94, 0.2);
        background: ${PALETTE.paper};
        color: ${PALETTE.ink};
        padding: 10px 12px;
        outline: none;
        width: 100%;
      }
      input:focus, textarea:focus, select:focus { border-color: ${PALETTE.teal}; }

      a { color: ${PALETTE.teal}; }

      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      .fade-in { animation: fadeIn 280ms ease both; }
      @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
      .slide-in { animation: slideIn 320ms cubic-bezier(0.4, 0, 0.2, 1) both; }
      @keyframes pulseSoft { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      .live-dot { animation: pulseSoft 1.6s ease-in-out infinite; }

      .scroll-y { overflow-y: auto; }
      .scroll-y::-webkit-scrollbar { width: 6px; }
      .scroll-y::-webkit-scrollbar-thumb { background: rgba(0, 48, 94, 0.2); }
      .scroll-y::-webkit-scrollbar-track { background: transparent; }

      .row-hover:hover { background: ${PALETTE.tealMist}; cursor: pointer; }
    `}</style>
  );
}

export function Logo({ size = 36 }) {
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
      <AlertCircle size={13} color={PALETTE.crimson} strokeWidth={2.5} />
      <span
        className="mono"
        style={{ fontSize: 10, letterSpacing: "0.22em", fontWeight: 600, textAlign: "center" }}
      >
        PROTOTYPE · DEMO USE ONLY · DO NOT ENTER REAL STUDENT OR STAFF DATA
      </span>
      <AlertCircle size={13} color={PALETTE.crimson} strokeWidth={2.5} />
    </div>
  );
}

export function TopBarShell({ children, current }) {
  return (
    <>
    <PrototypeNotice />
    <div
      style={{
        background: PALETTE.paper,
        borderBottom: `1px solid rgba(0, 48, 94, 0.14)`,
        padding: "10px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <a href="#/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 14 }}>
          <Logo size={40} />
          <div style={{ borderLeft: `1px solid rgba(0, 48, 94, 0.18)`, paddingLeft: 14 }}>
            <div className="display" style={{ fontSize: 18, fontWeight: 500, color: PALETTE.teal, lineHeight: 1, letterSpacing: "-0.01em" }}>
              CIMPLE
            </div>
            <div className="mono" style={{ fontSize: 8, letterSpacing: "0.16em", color: PALETTE.teal, opacity: 0.6, marginTop: 3 }}>
              CRITICAL INCIDENT · TRINITY ANGLICAN COLLEGE
            </div>
          </div>
        </a>
        <div style={{ width: 1, height: 28, background: "rgba(0, 48, 94, 0.15)" }} />
        <nav style={{ display: "flex", gap: 4 }}>
          {[
            { l: "Incidents", href: "#/", key: "home" },
            { l: "Triage", href: "#/triage", key: "triage" },
            { l: "Sandbox", href: "#/sandbox", key: "sandbox" },
            { l: "Admin", href: "#/admin", key: "admin" },
          ].map((item) => (
            <a
              key={item.key}
              href={item.href}
              style={{
                padding: "6px 12px",
                fontSize: 13,
                color: current === item.key ? PALETTE.paper : PALETTE.ink,
                background: current === item.key ? PALETTE.teal : "transparent",
                textDecoration: "none",
                fontWeight: current === item.key ? 500 : 400,
              }}
            >
              {item.l}
            </a>
          ))}
        </nav>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {children}
        <div
          title="K. Patel — Principal"
          style={{
            width: 32,
            height: 32,
            background: PALETTE.teal,
            color: PALETTE.paper,
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
          }}
        >
          KP
        </div>
      </div>
    </div>
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
