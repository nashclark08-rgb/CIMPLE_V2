// ============================================================
// CIMPLE — Sign-in gate (Increment D foundation)
// Only rendered in CONNECTED MODE (Firebase configured) when there
// is no authenticated user. In LOCAL MODE this is never shown.
// ============================================================
import React, { useState } from "react";
import { PALETTE, TopBarShell } from "./shared.jsx";
import { useAuth } from "./auth.jsx";
import { ShieldCheck, LogIn } from "lucide-react";

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signIn(email.trim(), password);
      // onAuthStateChanged in AuthProvider will flip the gate.
    } catch (err) {
      setError(friendlyAuthError(err));
      setBusy(false);
    }
  }

  return (
    <>
      <TopBarShell />
      <div style={{ maxWidth: 420, margin: "96px auto", padding: 32 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <ShieldCheck size={34} color={PALETTE.teal} strokeWidth={1.4} style={{ opacity: 0.6 }} />
          <h2
            className="display"
            style={{
              fontSize: 30,
              color: PALETTE.teal,
              fontWeight: 500,
              marginTop: 18,
              marginBottom: 6,
              letterSpacing: "-0.02em",
            }}
          >
            Sign in to CIMPLE
          </h2>
          <p style={{ fontSize: 13, color: PALETTE.inkSoft, lineHeight: 1.6 }}>
            Incident-management access is restricted to authorised College staff.
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            required
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="you@trinityac.nsw.edu.au"
          />
          <label style={{ ...labelStyle, marginTop: 16 }}>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && (
            <p style={{ color: PALETTE.crimson || "#b23", fontSize: 13, marginTop: 14 }}>{error}</p>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy}
            style={{ width: "100%", marginTop: 24, justifyContent: "center" }}
          >
            <LogIn size={14} /> {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </>
  );
}

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: PALETTE.inkSoft,
  marginBottom: 6,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  fontSize: 14,
  border: `1px solid ${PALETTE.line || "#d8d8d8"}`,
  borderRadius: 6,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

function friendlyAuthError(err) {
  const code = err?.code || "";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found"))
    return "Email or password not recognised.";
  if (code.includes("too-many-requests")) return "Too many attempts. Please wait a moment and try again.";
  if (code.includes("network")) return "Network problem — check your connection and try again.";
  return "Could not sign in. Please try again.";
}
