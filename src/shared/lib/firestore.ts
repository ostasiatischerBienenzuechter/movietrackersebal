import { getFirestore, type Firestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";

let db: Firestore | null = null;

/** Lazily initializes Firebase so the app can show a setup hint while unconfigured. */
export function getDb(): Firestore {
  db ??= getFirestore(initializeApp(firebaseConfig));
  return db;
}
