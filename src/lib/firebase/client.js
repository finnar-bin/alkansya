import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import getConfig from './client-credentials';
import { dev } from '$app/env';

const app = initializeApp(getConfig(dev), 'CLIENT');
export const db = getFirestore(app);
export const auth = getAuth(app);

setPersistence(auth, browserSessionPersistence);
