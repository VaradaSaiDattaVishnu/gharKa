import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getEnv } from "./env.js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export function getFirebaseAuth() {
  if (getApps().length === 0) {
    const env = getEnv();

    // Option 1: Full service account JSON in an env var (recommended for cloud
    // hosts like Render where there is no file on disk). Paste the entire
    // service-account JSON as the value of FIREBASE_SERVICE_ACCOUNT_JSON.
    const serviceAccountJson = env.FIREBASE_SERVICE_ACCOUNT_JSON;
    const serviceAccountPath = env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      initializeApp({ credential: cert(serviceAccount) });
    } else if (serviceAccountPath && existsSync(serviceAccountPath)) {
      // Option 2: Service account JSON file (recommended for local dev)
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
      initializeApp({ credential: cert(serviceAccount) });
    } else {
      // Option 3: Just projectId (works on Google Cloud with auto-credentials)
      initializeApp({ projectId: env.FIREBASE_PROJECT_ID });
    }
  }
  return getAuth();
}
