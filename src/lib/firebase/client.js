import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';

const apiKey = import.meta.env.VITE_API_KEY;
const authDomain = import.meta.env.VITE_AUTH_DOMAIN;
const projectId = import.meta.env.VITE_WEB_API_KEY;
const storageBucket = import.meta.env.VITE_STORAGE_BUCKET_ID;
const messagingSenderId = import.meta.env.VITE_MESSAGING_SENDER_ID;
const appId = import.meta.env.VITE_APP_ID;
const measurementId = import.meta.env.VITE_MEASUREMENT_ID;

/* Firebase client credentials */
export const config = {
	apiKey,
	authDomain,
	projectId,
	storageBucket,
	messagingSenderId,
	appId,
	measurementId
};

const app = initializeApp(config, 'CLIENT');
export const db = getFirestore(app);
export const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);
