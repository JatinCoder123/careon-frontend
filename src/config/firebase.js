import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDtzoAHlaEqS31uSEFLJP_b_1lIdDVvRrM",
  authDomain: "careon-6d051.firebaseapp.com", // MUST add manually
  projectId: "careon-6d051",
  storageBucket: "careon-6d051.firebasestorage.app",
  messagingSenderId: "210267455863",
  appId: "1:210267455863:android:f6d57dcd8c73b083de6172"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
