import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier | null;
  }
}

// For local dev: add test phone numbers in Firebase Console → Authentication →
// Sign-in method → Phone → Phone numbers for testing (e.g. +919999999999 / 123456)
// This skips reCAPTCHA and real SMS entirely.

let confirmationResult: ConfirmationResult | null = null;

export function setupRecaptcha(buttonId: string) {
  if (typeof window === "undefined") return;

  // Clear previous verifier if it exists to avoid stale state
  if (window.recaptchaVerifier) {
    try {
      window.recaptchaVerifier.clear();
    } catch {
      // ignore
    }
    window.recaptchaVerifier = null;
  }

  window.recaptchaVerifier = new RecaptchaVerifier(auth, buttonId, {
    size: "invisible",
    callback: () => {},
    "expired-callback": () => {
      // Reset on expiry so user can retry
      window.recaptchaVerifier = null;
    },
  });
}

export async function sendOtp(phone: string): Promise<void> {
  const recaptchaVerifier = window.recaptchaVerifier;
  if (!recaptchaVerifier) {
    throw new Error("Recaptcha not initialized. Please refresh the page.");
  }
  try {
    confirmationResult = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
  } catch (error) {
    // Reset recaptcha on failure so it can be re-created on retry
    try {
      recaptchaVerifier.clear();
    } catch {
      // ignore
    }
    window.recaptchaVerifier = null;
    throw error;
  }
}

export async function verifyOtp(code: string): Promise<string> {
  if (!confirmationResult) {
    throw new Error("No OTP was sent. Please request a new code.");
  }
  const result = await confirmationResult.confirm(code);
  const idToken = await result.user.getIdToken();
  return idToken;
}

export { auth };
