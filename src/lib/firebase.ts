import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "biftu-beri-exam-system-b46a8",
  appId: "1:572384885491:web:b6e71172d4985a2d761586",
  apiKey: "AIzaSyCUdIrg-Mc37V2HhXDHi_9NlLJeWVRqR88",
  authDomain: "biftu-beri-exam-system-b46a8.firebaseapp.com",
  storageBucket: "biftu-beri-exam-system-b46a8.firebasestorage.app",
  messagingSenderId: "572384885491"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-esdigitalcompute-07ac3921-f36f-42e6-8cb0-60744c958ec6");
