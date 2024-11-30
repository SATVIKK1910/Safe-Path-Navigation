
// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAIg26Cn4n2QLVsC90UBwJLyT27KcLnTmk",
  authDomain: "safemaps-a3a55.firebaseapp.com",
  projectId: "safemaps-a3a55",
  storageBucket: "safemaps-a3a55.appspot.com",
  messagingSenderId: "651369739698",
  appId: "1:651369739698:web:5f63c2da951ae465c1e0ab",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
