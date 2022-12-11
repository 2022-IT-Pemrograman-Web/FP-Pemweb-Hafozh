import admin from "firebase-admin";
import { firebase_admin_config } from "./firebase-admin-sdk.config.js";

admin.initializeApp({
  credential: admin.credential.cert(firebase_admin_config)
});

export default admin;