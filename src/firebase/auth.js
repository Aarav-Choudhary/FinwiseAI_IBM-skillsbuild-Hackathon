import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./config";

// Google Login
export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);

  return result.user;
};

// Email Signup
export const signupWithEmail = async (email, password) => {
  const result = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};

// Email Login
export const loginWithEmail = async (email, password) => {
  const result = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return result.user;
};

// Logout
export const logout = async () => {
  await signOut(auth);
};