// ============================================================
// CIMPLE — App root with hash-based router
// Routes:
//   #/                       → Home (incidents list)
//   #/incident/:id           → Dashboard for that incident
//   #/new                    → New incident flow
//   #/triage                 → Guided triage
//   #/sandbox                → Placeholder
//   #/admin                  → Placeholder
// ============================================================
import React, { useState, useEffect, useCallback } from "react";
import { GlobalStyles, PALETTE, TopBarShell, InstitutionalFooter } from "./shared.jsx";
import Home from "./Home.jsx";
import Dashboard from "./Dashboard.jsx";
import NewIncident from "./NewIncident.jsx";
import Triage from "./Triage.jsx";
import Admin from "./Admin.jsx";
import SignIn from "./SignIn.jsx";
import { useAuth } from "./auth.jsx";
import { startSync } from "./sync.js";
import { Construction, ArrowLeft } from "lucide-react";

function parseHash() {
  const hash = window.location.hash || "#/";
  const path = hash.startsWith("#") ? hash.slice(1) : hash;
  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return { route: "home" };
  if (segments[0] === "new") return { route: "new" };
  if (segments[0] === "triage") return { route: "triage" };
  if (segments[0] === "sandbox") return { route: "sandbox" };
  if (segments[0] === "admin") return { route: "admin" };
  if (segments[0] === "incident" && segments[1]) return { route: "incident", id: segments[1] };
  return { route: "home" };
}

export default function App() {
  const [route, setRoute] = useState(parseHash());
  const { user, ready, connected } = useAuth();
  // D2: in connected mode, wait for the first Firestore sync before rendering,
  // and bump syncTick on remote changes so the incidents list stays live.
  const [syncReady, setSyncReady] = useState(!connected);
  const [syncTick, setSyncTick] = useState(0);

  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  useEffect(() => {
    if (!connected || !user) return;
    let alive = true;
    startSync(() => alive && setSyncTick((t) => t + 1)).then(() => alive && setSyncReady(true));
    return () => { alive = false; };
  }, [connected, user]);

  const navigate = useCallback((path) => {
    window.location.hash = path;
  }, []);

  // CONNECTED MODE only: wait for the auth check, then gate on sign-in.
  // In LOCAL MODE `ready` is true and `user` is the synthetic local user,
  // so neither branch fires and the app renders exactly as before.
  if (connected && !ready) {
    return (
      <>
        <GlobalStyles />
        <TopBarShell />
        <div style={{ maxWidth: 600, margin: "140px auto", textAlign: "center", color: PALETTE.inkSoft, fontSize: 14 }}>
          Loading…
        </div>
      </>
    );
  }
  if (connected && ready && !user) {
    return (
      <>
        <GlobalStyles />
        <SignIn />
      </>
    );
  }
  if (connected && user && !syncReady) {
    return (
      <>
        <GlobalStyles />
        <TopBarShell />
        <div style={{ maxWidth: 600, margin: "140px auto", textAlign: "center", color: PALETTE.inkSoft, fontSize: 14 }}>
          Syncing incident data…
        </div>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      {route.route === "home" && (
        <Home
          key={syncTick}
          onOpenIncident={(id) => navigate(`#/incident/${id}`)}
          onNew={() => navigate("#/new")}
          onTriage={() => navigate("#/triage")}
        />
      )}
      {route.route === "incident" && (
        <Dashboard
          incidentId={route.id}
          onBack={() => navigate("#/")}
        />
      )}
      {route.route === "new" && (
        <NewIncident
          onCancel={() => navigate("#/")}
          onCreated={(id) => navigate(`#/incident/${id}`)}
        />
      )}
      {route.route === "triage" && (
        <Triage
          onCancel={() => navigate("#/")}
          onCreated={(id) => navigate(`#/incident/${id}`)}
        />
      )}
      {route.route === "sandbox" && <Placeholder title="Sandbox" subtitle="Training mode coming soon — practice scenarios with AI-generated incidents." onBack={() => navigate("#/")} />}
      {route.route === "admin" && <Admin onBack={() => navigate("#/")} />}
      <InstitutionalFooter />
    </>
  );
}

function Placeholder({ title, subtitle, onBack }) {
  return (
    <>
      <TopBarShell />
      <div style={{ maxWidth: 600, margin: "120px auto", padding: 32, textAlign: "center" }}>
        <Construction size={36} color={PALETTE.teal} strokeWidth={1.4} style={{ margin: "0 auto", opacity: 0.5 }} />
        <h2 className="display" style={{ fontSize: 36, color: PALETTE.teal, fontWeight: 500, marginTop: 24, marginBottom: 8, letterSpacing: "-0.02em" }}>
          {title}
        </h2>
        <p style={{ fontSize: 14, color: PALETTE.inkSoft, marginTop: 8, lineHeight: 1.6, maxWidth: 420, margin: "8px auto 0" }}>
          {subtitle}
        </p>
        <button onClick={onBack} className="btn btn-primary" style={{ marginTop: 32 }}>
          <ArrowLeft size={14} /> Back to incidents
        </button>
      </div>
    </>
  );
}
