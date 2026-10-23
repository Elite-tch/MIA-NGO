/**
 * db.ts — Server-side Firestore database helper using Firebase Admin SDK.
 * Uses Admin SDK which bypasses Firestore security rules entirely.
 * Falls back to local JSON storage if Firebase Admin credentials are missing.
 */
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import fs from "fs/promises";
import path from "path";
import { ResourceItem, resourcesData as fallbackResources } from "../data/resourcesData";
import { CareerItem, careersData as fallbackCareers } from "../data/careersData";
import { sortByLatest } from "./utils";

const RESOURCES_FILE = path.join(process.cwd(), "app", "data", "storage", "resources.json");
const CAREERS_FILE = path.join(process.cwd(), "app", "data", "storage", "careers.json");

// ── LOCAL DISK HELPER ─────────────────────────────────────────────────────────

async function saveToLocalDisk(filePath: string, data: unknown): Promise<void> {
  try {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.warn("Local disk write failed:", e);
  }
}

async function readFromLocalDisk<T>(filePath: string, fallback: T[]): Promise<T[]> {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data) as T[];
  } catch {
    return fallback;
  }
}

// ── ADMIN FIRESTORE CHECK ─────────────────────────────────────────────────────

function hasAdminCredentials(): boolean {
  return (
    !!process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    !!(process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
  );
}

// ── RESOURCES ─────────────────────────────────────────────────────────────────

export async function getStoredResources(): Promise<ResourceItem[]> {
  if (!hasAdminCredentials()) {
    console.warn("[db] No admin credentials — using local JSON storage for resources.");
    const diskItems = await readFromLocalDisk<ResourceItem>(RESOURCES_FILE, fallbackResources);
    return sortByLatest(diskItems);
  }

  try {
    const snap = await adminDb.collection("resources").get();
    if (!snap.empty) {
      const items: ResourceItem[] = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as ResourceItem);
      // Keep local backup in sync
      await saveToLocalDisk(RESOURCES_FILE, items);
      return sortByLatest(items);
    }

    // Auto-seed Firestore with default data on first connect
    console.info("[db] Seeding Firestore 'resources' collection with default data...");
    const batch = adminDb.batch();
    for (const item of fallbackResources) {
      const ref = adminDb.collection("resources").doc(item.id);
      batch.set(ref, { ...item, _seeded: true });
    }
    await batch.commit();
    return sortByLatest(fallbackResources);
  } catch (err) {
    console.error("[db] Firestore getStoredResources error:", err);
    const diskItems = await readFromLocalDisk<ResourceItem>(RESOURCES_FILE, fallbackResources);
    return sortByLatest(diskItems);
  }
}

export async function saveSingleResource(item: ResourceItem): Promise<void> {
  // Always keep local backup
  const current = await readFromLocalDisk<ResourceItem>(RESOURCES_FILE, fallbackResources);
  const index = current.findIndex((r) => r.id === item.id);
  if (index >= 0) current[index] = item;
  else current.unshift(item);
  await saveToLocalDisk(RESOURCES_FILE, current);

  if (!hasAdminCredentials()) return;

  try {
    await adminDb
      .collection("resources")
      .doc(item.id)
      .set({ ...item, _updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    console.info(`[db] Resource '${item.id}' saved to Firestore.`);
  } catch (err) {
    console.error("[db] Firestore saveSingleResource error:", err);
  }
}

export async function deleteStoredResource(id: string): Promise<void> {
  // Update local backup
  const current = await readFromLocalDisk<ResourceItem>(RESOURCES_FILE, fallbackResources);
  await saveToLocalDisk(RESOURCES_FILE, current.filter((r) => r.id !== id));

  if (!hasAdminCredentials()) return;

  try {
    await adminDb.collection("resources").doc(id).delete();
    console.info(`[db] Resource '${id}' deleted from Firestore.`);
  } catch (err) {
    console.error("[db] Firestore deleteStoredResource error:", err);
  }
}

// Keep legacy batch-save for compatibility
export async function saveStoredResources(items: ResourceItem[]): Promise<void> {
  await saveToLocalDisk(RESOURCES_FILE, items);
  if (!hasAdminCredentials()) return;
  try {
    const batch = adminDb.batch();
    for (const item of items) {
      batch.set(adminDb.collection("resources").doc(item.id), item, { merge: true });
    }
    await batch.commit();
  } catch (err) {
    console.error("[db] Firestore saveStoredResources batch error:", err);
  }
}

// ── CAREERS ───────────────────────────────────────────────────────────────────

export async function getStoredCareers(): Promise<CareerItem[]> {
  if (!hasAdminCredentials()) {
    console.warn("[db] No admin credentials — using local JSON storage for careers.");
    const diskItems = await readFromLocalDisk<CareerItem>(CAREERS_FILE, fallbackCareers);
    return sortByLatest(diskItems);
  }

  try {
    const snap = await adminDb.collection("careers").get();
    if (!snap.empty) {
      const items: CareerItem[] = snap.docs.map((d: FirebaseFirestore.QueryDocumentSnapshot) => d.data() as CareerItem);
      await saveToLocalDisk(CAREERS_FILE, items);
      return sortByLatest(items);
    }

    // Auto-seed
    console.info("[db] Seeding Firestore 'careers' collection with default data...");
    const batch = adminDb.batch();
    for (const item of fallbackCareers) {
      const ref = adminDb.collection("careers").doc(item.id);
      batch.set(ref, { ...item, _seeded: true });
    }
    await batch.commit();
    return sortByLatest(fallbackCareers);
  } catch (err) {
    console.error("[db] Firestore getStoredCareers error:", err);
    const diskItems = await readFromLocalDisk<CareerItem>(CAREERS_FILE, fallbackCareers);
    return sortByLatest(diskItems);
  }
}

export async function saveSingleCareer(item: CareerItem): Promise<void> {
  // Always keep local backup
  const current = await readFromLocalDisk<CareerItem>(CAREERS_FILE, fallbackCareers);
  const index = current.findIndex((c) => c.id === item.id);
  if (index >= 0) current[index] = item;
  else current.unshift(item);
  await saveToLocalDisk(CAREERS_FILE, current);

  if (!hasAdminCredentials()) return;

  try {
    await adminDb
      .collection("careers")
      .doc(item.id)
      .set({ ...item, _updatedAt: FieldValue.serverTimestamp() }, { merge: true });
    console.info(`[db] Career '${item.id}' saved to Firestore.`);
  } catch (err) {
    console.error("[db] Firestore saveSingleCareer error:", err);
  }
}

export async function deleteStoredCareer(id: string): Promise<void> {
  const current = await readFromLocalDisk<CareerItem>(CAREERS_FILE, fallbackCareers);
  await saveToLocalDisk(CAREERS_FILE, current.filter((c) => c.id !== id));

  if (!hasAdminCredentials()) return;

  try {
    await adminDb.collection("careers").doc(id).delete();
    console.info(`[db] Career '${id}' deleted from Firestore.`);
  } catch (err) {
    console.error("[db] Firestore deleteStoredCareer error:", err);
  }
}

export async function saveStoredCareers(items: CareerItem[]): Promise<void> {
  await saveToLocalDisk(CAREERS_FILE, items);
  if (!hasAdminCredentials()) return;
  try {
    const batch = adminDb.batch();
    for (const item of items) {
      batch.set(adminDb.collection("careers").doc(item.id), item, { merge: true });
    }
    await batch.commit();
  } catch (err) {
    console.error("[db] Firestore saveStoredCareers batch error:", err);
  }
}
