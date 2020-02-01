import * as admin from "firebase-admin";
import key from "../assets/keys/serviceAccountkey.json";

export default function initializeFirebase() {
    if (!admin.apps.length) {
        admin.initializeApp({
            credential: admin.credential.cert(key),
            databaseURL: "https://the-notebook-fd924.firebaseio.com"
        });
    }
}
