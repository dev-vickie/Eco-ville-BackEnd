import admin from "firebase-admin";
import serviceAccount from "../src/ecoville-1b1d1-firebase-adminsdk-ikred-ee7fbeb1d9.json" assert { type: "json" };

export const adminz = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecoville-1b1d1-default-rtdb.firebaseio.com/",
});


