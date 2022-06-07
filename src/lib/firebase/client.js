import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import config from './client-credentials';

const app = initializeApp(config, 'CLIENT');
export const db = getFirestore(app);
export const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);
