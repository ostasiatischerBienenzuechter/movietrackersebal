/**
 * Firebase web config. These values are not secret and can't be hidden in a
 * browser app: access is protected by the secret list ID and `firestore.rules`.
 * Fill them in from Firebase console → Project settings → Your apps → Web app.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyAeVERJl6MnBVJE_wkc9nvPDQhHXn7aklo",
  authDomain: "movielist-34958.firebaseapp.com",
  projectId: "movielist-34958",
  appId: "1:1012774507538:web:99aa6b31427eda0e72b4cb",
};

export function isFirebaseConfigured(): boolean {
  return firebaseConfig.apiKey !== "" && firebaseConfig.projectId !== "";
}
