import express from "express";
import * as admin from "firebase-admin";

import key from "./assets/keys/serviceAccountkey.json";

const app = express();
const PORT = process.env.PORT || 8080;

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(key),
        databaseURL: "https://the-notebook-fd924.firebaseio.com"
      });
}

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
