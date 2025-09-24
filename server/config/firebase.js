const admin = require("firebase-admin");

const initializeFirebase = () => {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      : require("../firebase-service-account.json");

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });

    console.log("✅ Firebase initialized successfully");
  } catch (error) {
    console.error("❌ Firebase initialization error:", error);
    process.exit(1);
  }
};

const db = () => admin.firestore();
const auth = () => admin.auth();

module.exports = {
  initializeFirebase,
  db,
  auth,
  admin,
};
