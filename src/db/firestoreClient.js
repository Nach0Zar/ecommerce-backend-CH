import admin from "firebase-admin";
import fs from 'fs';

const serviceAccount = JSON.parse(await fs.promises.readFile('./src/db/config/backendecommerce-ecec5-firebase-adminsdk-e05ez-f27d7fe284.json', 'utf-8'));
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "backendecommerce-ecec5.firebaseio.com"
});

export const firestoreDatabase = admin.firestore();
