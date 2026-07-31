// ============================================================
// CIMPLE — Guided Triage (creates a real incident)
// ============================================================
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Lock, Sparkles } from "lucide-react";
import { PALETTE, TopBarShell, EscalationMatrixButton } from "./shared.jsx";
import AllocationReview from "./AllocationReview.jsx";
import {
  SEVERITY, INCIDENT_TYPES, createIncident, saveIncident,
  autoAllocate, availableQualifiedStaff, PREF_LABEL,
} from "./data.js";

const QUESTIONS = [
  {
    id: "category",
    prompt: "What is the nature of the incident?",
    helper: "Choose the closest category.",
    options: [
      { v: "medical", label: "Medical / injury" },
      { v: "mental_health", label: "Student mental health / self-harm" },
      { v: "behavioural", label: "Behavioural or violent incident" },
      { v: "lockdown", label: "Lockdown / fire / evacuation" },
      { v: "external_threat", label: "External threat / parent or community" },
      { v: "missing", label: "Missing student" },
      { v: "death_oncampus", label: "Death of a student or staff member" },
      { v: "behavioural", label: "Other / not sure yet" },
    ],
  },
  {
    id: "harm",
    prompt: "Is anyone currently harmed or at immediate risk of harm?",
    options: [
      { v: 0, label: "No — no current harm or immediate risk" },
      { v: 1, label: "Minor — first aid level, no hospital" },
      { v: 2, label: "Serious — injury or active crisis requires attention" },
      { v: 3, label: "Critical — life-threatening, fatality, or major threat" },
    ],
  },
  {
    id: "scope",
    prompt: "How many people are affected or at risk?",
    options: [
      { v: 0, label: "One student or staff member" },
      { v: 1, label: "A small group (2–10)" },
      { v: 2, label: "A class or year group" },
      { v: 3, label: "The whole school site" },
    ],
  },
  {
    id: "external",
    prompt: "Are emergency services likely required?",
    options: [
      { v: 0, label: "No external agency needed" },
      { v: 1, label: "Possibly — situation still developing" },
      { v: 2, label: "Yes — they have been or will be called" },
      { v: 3, label: "Yes — they are already on site" },
    ],
  },
  {
    id: "media",
    prompt: "Risk of media or wider community impact?",
    options: [
      { v: 0, label: "No — internal matter" },
      { v: 1, label: "Low — community awareness only" },
      { v: 2, label: "Likely — parents and community will hear quickly" },
      { v: 3, label: "High — media or social media interest expected" },
    ],
  },
];

function calculateSeverity(answers) {
  // Simple weighted heuristic, biased to escalate (matches PRD)
  const harm = answers.harm ?? 0;
  const scope = answers.scope ?? 0;
  const external = answers.external ?? 0;
  const media = answers.media ?? 0;

  // harm dominates. Levels map to the plan's escalation matrix:
  // 3 Critical Incident · 2 Incident · 1 Emergency · 0 Business as Usual.
  if (harm >= 3) return 3;
  if (harm >= 2 || external >= 2 || scope >= 3) return 2;
  if (harm >= 1 || scope >= 1 || external >= 1 || media >= 2) return 1;
  return 0;
}

// Plain-English account of which answers drove the level — so the number is
// never a black box (Annika: "how is the initial severity determined?").
function triageDrivers(answers) {
  const drivers = [];
  const HARM = ["no current harm", "first-aid-level harm", "a serious injury or active crisis", "a life-threatening or fatal situation"];
  const SCOPE = ["one person", "a small group", "a class or year group", "the whole school site"];
  if (answers.harm != null) drivers.push(HARM[answers.harm]);
  if (answers.scope >= 2) drivers.push(`it affects ${SCOPE[answers.scope]}`);
  if (answers.external >= 2) drivers.push("emergency services are involved");
  if (answers.media >= 2) drivers.push("there is real media / community exposure");
  if (!drivers.length) return "Your answers indicate a contained, low-impact situation.";
  return `You indicated ${drivers.join(", ")}.`;
}

export default function Triage({ onCancel, onCreated }) {
  const [step, setStep] = useState(0); // 0..4 questions, 5 result, 6 review team
  const [answers, setAnswers] = useState({});
  const [details, setDetails] = useState("");
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [allocation, setAllocation] = useState([]);

  const total = QUESTIONS.length;
  const progress = step >= total ? 100 : (step / total) * 100;

  function goToReview() {
    const type = answers.category || "behavioural";
    setAllocation(autoAllocate(type, calculateSeverity(answers)));
    setStep(total + 1);
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

  function pick(qid, value) {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    setTimeout(() => {
      if (step < total - 1) setStep(step + 1);
      else setStep(total); // result
    }, 180);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  const recommendedSeverity = step >= total ? calculateSeverity(answers) : null;
  const recommendedType = answers.category || "behavioural";

  function createFromTriage() {
    const incident = createIncident({
      type: recommendedType,
      severity: recommendedSeverity,
      title: title.trim() || "Triage-initiated incident",
      location: location.trim() || "Location not specified",
      roles: allocation.length ? allocation : null,
    });
    // Add a system note about triage
    incident.timeline.push({
      id: `t${Date.now() + 1}`,
      ts: Date.now(),
      actor: "K. Patel",
      actorInitials: "KP",
      type: "system",
      text: `Severity recommended via guided triage. ${details ? "Notes: " + details : ""}`,
    });
    saveIncident(incident);
    onCreated(incident.id);
  }

  return (
    <>
      <TopBarShell current="triage" />
      <div style={{ background: PALETTE.bone, minHeight: "calc(100vh - 60px)", padding: "32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <button className="btn-ghost" onClick={onCancel} style={{ background: "none", border: "none", padding: 0, color: PALETTE.teal, fontSize: 13, display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
            <ArrowLeft size={14} /> Back to incidents
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: PALETTE.teal, opacity: 0.7 }}>
              §01 · GUIDED TRIAGE
            </div>
            <div className="mono" style={{ fontSize: 11, letterSpacing: "0.18em", color: PALETTE.teal, opacity: 0.5 }}>
              {step >= total ? "COMPLETE" : `${step + 1} / ${total}`}
            </div>
          </div>
          <div style={{ height: 2, background: "rgba(0, 48, 94, 0.15)", marginBottom: 32, position: "relative" }}>
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${progress}%`, background: PALETTE.teal, transition: "width 400ms ease" }} />
          </div>

          <div className="card" style={{ padding: 40, minHeight: 480 }}>
            {step < total && <Question key={step} q={QUESTIONS[step]} index={step} total={total} value={answers[QUESTIONS[step].id]} onPick={pick} onBack={back} canBack={step > 0} />}
            {step === total && (
              <Result
                severity={recommendedSeverity}
                answers={answers}
                title={title}
                setTitle={setTitle}
                location={location}
                setLocation={setLocation}
                details={details}
                setDetails={setDetails}
                onBack={() => setStep(total - 1)}
                onCreate={goToReview}
                recommendedType={recommendedType}
              />
            )}
            {step === total + 1 && (
              <TeamReview
                allocation={allocation}
                onChange={setRoleStaff}
                onBack={() => setStep(total)}
                onCreate={createFromTriage}
              />
            )}
          </div>

          <div className="card" style={{ padding: 14, marginTop: 16, display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Lock size={14} style={{ color: PALETTE.teal, marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 12, lineHeight: 1.5, color: PALETTE.inkSoft, margin: 0 }}>
              Triage is a recommendation only. The Principal or Deputy retains override authority on the severity at every step.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Question({ q, index, total, value, onPick, onBack, canBack }) {
  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: PALETTE.sage }}>
          QUESTION {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {canBack && (
          <button onClick={onBack} className="btn-ghost" style={{ background: "none", border: "none", color: PALETTE.teal, fontSize: 13, display: "flex", alignItems: "center", gap: 6, opacity: 0.7 }}>
            <ArrowLeft size={14} /> Back
          </button>
        )}
      </div>

      <h3 className="display" style={{ fontSize: 30, lineHeight: 1.2, color: PALETTE.teal, fontWeight: 500, margin: 0, letterSpacing: "-0.015em" }}>
        {q.prompt}
      </h3>
      {q.helper && <p style={{ fontSize: 14, color: PALETTE.inkSoft, marginTop: 10, lineHeight: 1.55 }}>{q.helper}</p>}

      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 24 }}>
        {q.options.map((o, i) => (
          <button
            key={i}
            onClick={() => onPick(q.id, o.v)}
            style={{
              textAlign: "left",
              width: "100%",
              background: value === o.v ? PALETTE.teal : PALETTE.paper,
              color: value === o.v ? PALETTE.paper : PALETTE.ink,
              border: `1px solid ${value === o.v ? PALETTE.teal : "rgba(0, 48, 94, 0.18)"}`,
              padding: "14px 18px",
              fontSize: 14,
              fontWeight: 400,
              transition: "all 160ms ease",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: value === o.v ? PALETTE.paper : "transparent", border: `1.5px solid ${value === o.v ? PALETTE.paper : PALETTE.teal}`, flexShrink: 0 }} />
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Result({ severity, answers, title, setTitle, location, setLocation, details, setDetails, onBack, onCreate, recommendedType }) {
  const sev = SEVERITY[severity];
  const typeMeta = INCIDENT_TYPES.find((t) => t.id === recommendedType);

  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: PALETTE.sage, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={13} /> RECOMMENDATION READY
        </span>
        <button onClick={onBack} className="btn-ghost" style={{ background: "none", border: "none", color: PALETTE.teal, fontSize: 13, display: "flex", alignItems: "center", gap: 6, opacity: 0.7 }}>
          <ArrowLeft size={14} /> Adjust answers
        </button>
      </div>

      <div style={{ height: 6, background: "rgba(0, 48, 94, 0.1)", position: "relative", marginBottom: 8 }}>
        <div style={{ height: "100%", width: `${(severity + 1) * 25}%`, background: sev.color }} />
      </div>
      <div className="mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: PALETTE.teal, opacity: 0.5, marginBottom: 24, letterSpacing: "0.1em" }}>
        <span>L0 BAU</span><span>L1 EMERGENCY</span><span>L2 INCIDENT</span><span>L3 CRITICAL</span>
      </div>

      <h2 className="display" style={{ fontSize: 38, lineHeight: 1.05, color: sev.color, fontWeight: 500, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
        {sev.label}
      </h2>
      <p style={{ fontSize: 14, color: PALETTE.inkSoft, margin: 0 }}>{sev.tone}</p>

      <div style={{ marginTop: 28, padding: 20, background: PALETTE.bone, borderLeft: `3px solid ${sev.color}` }}>
        <div className="mono" style={{ fontSize: 10, color: PALETTE.teal, letterSpacing: "0.14em", opacity: 0.6, marginBottom: 8 }}>
          WHY THIS LEVEL
        </div>
        <p style={{ fontSize: 13, lineHeight: 1.6, color: PALETTE.ink, margin: 0 }}>
          Recommended type: <strong>{typeMeta?.label || "Other"}</strong>. {triageDrivers(answers)} On the plan's matrix that maps to <strong>{sev.label}</strong>.
        </p>
        <p style={{ fontSize: 12.5, lineHeight: 1.55, color: PALETTE.inkSoft, margin: "8px 0 0" }}>{sev.tone}. Activated by: {sev.who}.</p>
        <div style={{ marginTop: 10 }}>
          <EscalationMatrixButton compact label="Check against the Level 0–3 escalation matrix" />
        </div>
        <p style={{ fontSize: 11.5, color: PALETTE.inkSoft, margin: "10px 0 0" }}>You can override severity once the incident is open.</p>
      </div>

      <div style={{ marginTop: 28, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8 }}>
            INCIDENT TITLE
          </div>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={typeMeta?.label || ""} />
        </div>
        <div>
          <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8 }}>
            LOCATION
          </div>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. D-Block bathroom" />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="mono" style={{ fontSize: 10, letterSpacing: "0.14em", color: PALETTE.teal, opacity: 0.7, marginBottom: 8 }}>
          ADDITIONAL CONTEXT (OPTIONAL)
        </div>
        <textarea rows={2} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="A few words to log alongside the triage. No identifying student details." style={{ resize: "vertical", lineHeight: 1.5 }} />
      </div>

      <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid rgba(0, 48, 94, 0.12)`, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onCreate} className="btn btn-primary">
          Review team <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

function TeamReview({ allocation, onChange, onBack, onCreate }) {
  return (
    <div className="fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: "0.16em", color: PALETTE.sage, display: "flex", alignItems: "center", gap: 8 }}>
          <CheckCircle2 size={13} /> TEAM ALLOCATION
        </span>
        <button onClick={onBack} className="btn-ghost" style={{ background: "none", border: "none", color: PALETTE.teal, fontSize: 13, display: "flex", alignItems: "center", gap: 6, opacity: 0.7 }}>
          <ArrowLeft size={14} /> Back to recommendation
        </button>
      </div>

      <h2 className="display" style={{ fontSize: 32, lineHeight: 1.1, color: PALETTE.teal, fontWeight: 500, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
        Review the team
      </h2>
      <p style={{ fontSize: 14, color: PALETTE.inkSoft, margin: "0 0 24px", lineHeight: 1.6 }}>
        CIMPLE auto-allocated available staff to the roles this incident needs — filling the most critical roles first, and preferring each person's primary role. Override anyone below, then open the incident.
      </p>

      <AllocationReview allocation={allocation} onChange={onChange} />

      <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid rgba(0, 48, 94, 0.12)`, display: "flex", justifyContent: "flex-end" }}>
        <button onClick={onCreate} className="btn btn-primary">
          <Sparkles size={14} /> Open incident with this team
        </button>
      </div>
    </div>
  );
}
