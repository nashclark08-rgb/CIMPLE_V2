// ============================================================
// CIMPLE — Firestore sync (Increment D2)
//
// CONNECTED MODE only. Keeps the app's existing synchronous
// localStorage data layer working unchanged, while making the
// data SHARED across users/devices:
//
//   • A background subscription mirrors Firestore → localStorage,
//     so every existing loadAll()/getIncident() read is fresh.
//   • Writes (saveAll → write hook) push through to Firestore.
//   • The home list re-renders on remote change; an open incident
//     picks up others' edits on next open (live per-field sync is
//     a later refinement).
//
// In LOCAL MODE this module never runs (isFirebaseConfigured is
// false) and the app behaves exactly as the localStorage prototype.
// ============================================================
import {
  collection, doc, onSnapshot, setDoc, deleteDoc, getDocs, writeBatch,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase.js";
import {
  defaultState, writeLocalOnly, registerWriteHook,
} from "./data.js";

const INCIDENTS = "incidents";
const ROSTER_DOC = ["meta", "roster"];
const SETTINGS_DOC = ["meta", "settings"];

let started = false;
let lastLocal = null; // signature of the last state we pushed, to skip echoes
let knownIncidentIds = new Set(); // ids currently in Firestore (from the listener)

// --- Push (write-through): called by data.js after every saveAll ---
async function pushState(state) {
  if (!isFirebaseConfigured || !db) return;
  const ids = new Set((state.incidents || []).map((i) => i.id));
  lastLocal = JSON.stringify({ i: state.incidents, s: state.staff, se: state.settings });
  try {
    const batch = writeBatch(db);
    for (const inc of state.incidents || []) {
      batch.set(doc(db, INCIDENTS, inc.id), inc);
    }
    // Delete any incident that used to exist in Firestore but was removed locally.
    for (const oldId of knownIncidentIds) {
      if (!ids.has(oldId)) batch.delete(doc(db, INCIDENTS, oldId));
    }
    batch.set(doc(db, ...ROSTER_DOC), { staff: state.staff || [] });
    batch.set(doc(db, ...SETTINGS_DOC), { settings: state.settings || {}, version: state.version || 0 });
    await batch.commit();
  } catch (e) {
    // Offline writes queue via persistentLocalCache and flush on reconnect.
    console.warn("Firestore push failed (queued if offline):", e?.message || e);
  }
}

// --- Pull: subscribe and mirror Firestore → localStorage ---
// Returns a promise that resolves once the first full snapshot has landed.
export function startSync(onChange) {
  if (started || !isFirebaseConfigured || !db) return Promise.resolve();
  started = true;
  registerWriteHook(pushState);

  const cache = { incidents: null, staff: null, settings: null, version: 0 };
  let firstResolved = false;
  let resolveFirst;
  const firstReady = new Promise((r) => (resolveFirst = r));
  const have = () => cache.incidents != null && cache.staff != null && cache.settings != null;

  function applyToMirror() {
    if (!have()) return;
    const base = defaultState();
    const state = {
      ...base,
      incidents: cache.incidents,
      staff: cache.staff.length ? cache.staff : base.staff,
      settings: Object.keys(cache.settings || {}).length ? cache.settings : base.settings,
      version: cache.version || base.version,
    };
    // Skip if this is the echo of our own push.
    const sig = JSON.stringify({ i: state.incidents, s: state.staff, se: state.settings });
    writeLocalOnly(state);
    if (!firstResolved) { firstResolved = true; resolveFirst(); }
    if (sig !== lastLocal) onChange && onChange();
  }

  onSnapshot(collection(db, INCIDENTS), (snap) => {
    cache.incidents = snap.docs.map((d) => d.data());
    knownIncidentIds = new Set(snap.docs.map((d) => d.id));
    applyToMirror();
  });
  onSnapshot(doc(db, ...ROSTER_DOC), (d) => {
    cache.staff = d.exists() ? (d.data().staff || []) : [];
    applyToMirror();
  });
  onSnapshot(doc(db, ...SETTINGS_DOC), (d) => {
    cache.settings = d.exists() ? (d.data().settings || {}) : {};
    cache.version = d.exists() ? (d.data().version || 0) : 0;
    applyToMirror();
  });

  // First-run seed: if Firestore has no roster yet, push the local default
  // roster + settings up so a fresh project isn't empty.
  seedIfEmpty();

  return firstReady;
}

// A remote reset of the mirror could go here later; deletes are handled in pushState.
async function seedIfEmpty() {
  try {
    const rosterSnap = await getDocs(collection(db, "meta"));
    const hasRoster = rosterSnap.docs.some((d) => d.id === "roster");
    if (!hasRoster) {
      const base = defaultState();
      await setDoc(doc(db, ...ROSTER_DOC), { staff: base.staff || [] });
      await setDoc(doc(db, ...SETTINGS_DOC), { settings: base.settings || {}, version: base.version || 0 });
    }
  } catch (e) {
    console.warn("Seed check failed:", e?.message || e);
  }
}
