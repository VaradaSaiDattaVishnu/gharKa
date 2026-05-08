import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getEnv } from "./env.js";

export function getFirebaseAuth() {
  if (getApps().length === 0) {
    const env = getEnv();
    initializeApp({
      projectId: env.FIREBASE_PROJECT_ID,
    });
  }
  return getAuth();
}
