import { initializeApp, getApps, App, cert, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Singleton — only initialize once across hot-reloads in Next.js dev
function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    return existingApps[0];
  }

  // Option 1: Full service account JSON as a single env var (recommended)
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson && serviceAccountJson.trim().length > 5) {
    try {
      const serviceAccount = JSON.parse(serviceAccountJson) as ServiceAccount;
      return initializeApp({ credential: cert(serviceAccount) });
    } catch (e) {
      console.error("[firebase-admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
    }
  }

  // Option 2: Individual env vars
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;
  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "mia-ngo";

  if (clientEmail && rawPrivateKey) {
    const privateKey = rawPrivateKey.replace(/\\n/g, "\n");
    return initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
      projectId,
    });
  }

  // Option 3: Fallback — no credentials, will fail Firestore writes in production mode
  console.warn(
    "[firebase-admin] No admin credentials found. " +
      "Add FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env.local."
  );
  return initializeApp({ projectId });
}

export const adminApp = getAdminApp();
export const adminDb = getFirestore(adminApp);
