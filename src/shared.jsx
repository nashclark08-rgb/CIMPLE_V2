// ============================================================
// CIMPLE — Shared UI atoms, palette, global styles
// ============================================================
import React from "react";

export const PALETTE = {
  teal: "#0F4C5C",
  tealDeep: "#0A3642",
  tealMist: "#E8F0F2",
  sage: "#7FB3A6",
  sageMist: "#D9E8E3",
  bone: "#F4EFE6",
  paper: "#FBF8F2",
  ink: "#1A2024",
  inkSoft: "#5A6670",
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
        border: 1px solid rgba(15, 76, 92, 0.14);
      }

      .panel-h {
        display: flex; justify-content: space-between; align-items: center;
        padding: 14px 18px;
        border-bottom: 1px solid rgba(15, 76, 92, 0.12);
      }
      .panel-h-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.16em; color: ${PALETTE.teal}; opacity: 0.7; }
      .panel-h-meta { font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 0.12em; color: ${PALETTE.teal}; opacity: 0.5; }

      .chip {
        display: inline-flex; align-items: center; gap: 6px;
        padding: 4px 10px; font-size: 11px; font-weight: 500;
        border: 1px solid rgba(15, 76, 92, 0.2);
        background: ${PALETTE.paper};
        color: ${PALETTE.teal};
      }

      button { font-family: inherit; cursor: pointer; }
      .btn {
        display: inline-flex; align-items: center; gap: 8px;
        padding: 9px 14px; font-size: 13px; font-weight: 500;
        border: 1px solid rgba(15, 76, 92, 0.2);
        background: ${PALETTE.paper}; color: ${PALETTE.teal};
        transition: all 160ms ease;
      }
      .btn:hover { background: ${PALETTE.tealMist}; border-color: ${PALETTE.teal}; }
      .btn-primary { background: ${PALETTE.teal}; color: ${PALETTE.paper}; border-color: ${PALETTE.teal}; }
      .btn-primary:hover { background: ${PALETTE.tealDeep}; }
      .btn-ghost { background: transparent; border-color: transparent; color: ${PALETTE.teal}; }
      .btn-ghost:hover { background: rgba(15, 76, 92, 0.06); }
      .btn-danger { background: ${PALETTE.rose}; color: ${PALETTE.paper}; border-color: ${PALETTE.rose}; }
      .btn-danger:hover { background: #6e2415; }

      input[type="text"], input[type="search"], textarea, select {
        font-family: inherit; font-size: 14px;
        border: 1px solid rgba(15, 76, 92, 0.2);
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
      .scroll-y::-webkit-scrollbar-thumb { background: rgba(15, 76, 92, 0.2); }
      .scroll-y::-webkit-scrollbar-track { background: transparent; }

      .row-hover:hover { background: ${PALETTE.tealMist}; cursor: pointer; }
    `}</style>
  );
}

export function Logo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
      <rect width="36" height="36" fill={PALETTE.teal} />
      <path d="M10 18 L16 24 L26 12" stroke={PALETTE.sage} strokeWidth="2" fill="none" strokeLinecap="square" />
      <rect x="2" y="2" width="32" height="32" stroke={PALETTE.bone} strokeWidth="0.5" fill="none" />
    </svg>
  );
}

export function TopBarShell({ children, current }) {
  return (
    <div
      style={{
        background: PALETTE.paper,
        borderBottom: `1px solid rgba(15, 76, 92, 0.14)`,
        padding: "10px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <a href="#/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo />
            <div>
              <div className="display" style={{ fontSize: 16, fontWeight: 500, color: PALETTE.teal, lineHeight: 1 }}>
                CIMPLE
              </div>
              <div className="mono" style={{ fontSize: 8, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.55, marginTop: 2 }}>
                INCIDENT MANAGEMENT
              </div>
            </div>
          </div>
        </a>
        <div style={{ width: 1, height: 28, background: "rgba(15, 76, 92, 0.15)" }} />
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
