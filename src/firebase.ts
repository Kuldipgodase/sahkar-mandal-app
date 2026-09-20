import { initializeApp } from 'firebase/app';
import { getAuth, ConfirmationResult } from 'firebase/auth';

// Your web app's Firebase configuration
// Extracted from google-services.json
const firebaseConfig = {
  apiKey: "AIzaSyBlDzIfYqeQ97O5G1_GTdkHeTP4Pbg5UdM",
  authDomain: "sahakar-mandal-app.firebaseapp.com",
  projectId: "sahakar-mandal-app",
  storageBucket: "sahakar-mandal-app.firebasestorage.app",
  messagingSenderId: "360821765398",
  appId: "1:360821765398:web:42977ff5fb7646854f4c37",
  measurementId: "G-Z50G9PE218"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
auth.useDeviceLanguage();

// Global mutable state to pass between RegisterScreen and OTPScreen
// without triggering local storage JSON stringify errors in Zustand.
export const authState: {
  confirmationResult: ConfirmationResult | null;
  phoneNumber: string;
} = {
  confirmationResult: null,
  phoneNumber: ''
};
