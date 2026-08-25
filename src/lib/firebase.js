/**
 * firebase.js — Firebase init + auth + Firestore helpers
 * Uses environment variables set in .env
 */

import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

// ─── Init ───────────────────────────────────────────────────
let app, auth, db;

try {
  app  = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db   = getFirestore(app);
} catch (err) {
  console.warn("Firebase init failed — running in demo mode:", err.message);
  app = auth = db = null;
}

export { auth, db };

// ─── Auth ────────────────────────────────────────────────────
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  if (!auth) throw new Error("Firebase not configured");
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithEmail(email, password) {
  if (!auth) throw new Error("Firebase not configured");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function registerWithEmail(email, password) {
  if (!auth) throw new Error("Firebase not configured");
  return createUserWithEmailAndPassword(auth, email, password);
}

export async function logOut() {
  if (!auth) return;
  return signOut(auth);
}

export function onAuthChange(callback) {
  if (!auth) { callback(null); return () => {}; }
  return onAuthStateChanged(auth, callback);
}

// ─── Profile ─────────────────────────────────────────────────
export async function getProfile(uid) {
  if (!db) return null;
  const snap = await getDoc(doc(db, "profiles", uid));
  return snap.exists() ? snap.data() : null;
}

export async function saveProfile(uid, data) {
  if (!db) return;
  await setDoc(doc(db, "profiles", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function updateProfile(uid, data) {
  if (!db) return;
  await updateDoc(doc(db, "profiles", uid), { ...data, updatedAt: serverTimestamp() });
}

// ─── Expenses ────────────────────────────────────────────────
export async function addExpense(uid, expense) {
  if (!db) return { id: Date.now().toString(), ...expense };
  const ref = await addDoc(collection(db, "expenses"), {
    uid,
    ...expense,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id, ...expense };
}

export async function getExpenses(uid) {
  if (!db) return [];
  const q = query(
    collection(db, "expenses"),
    where("uid", "==", uid),
    orderBy("date", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function deleteExpense(id) {
  if (!db) return;
  await deleteDoc(doc(db, "expenses", id));
}

// ─── Chat History ────────────────────────────────────────────
export async function saveMessage(uid, message) {
  if (!db) return;
  await addDoc(collection(db, "chats"), { uid, ...message, createdAt: serverTimestamp() });
}

export async function getChatHistory(uid) {
  if (!db) return [];
  const q = query(
    collection(db, "chats"),
    where("uid", "==", uid),
    orderBy("createdAt", "asc")
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// ─── Budget ──────────────────────────────────────────────────
export async function saveBudget(uid, budget) {
  if (!db) return;
  await setDoc(doc(db, "budgets", uid), { ...budget, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getBudget(uid) {
  if (!db) return null;
  const snap = await getDoc(doc(db, "budgets", uid));
  return snap.exists() ? snap.data() : null;
}
