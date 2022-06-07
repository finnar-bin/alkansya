import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import getConfig from './admin-credentials';
import { dev } from '$app/env';

const app = getApps().length
	? getApp('ADMIN')
	: initializeApp({ credential: cert(getConfig(dev)) }, 'ADMIN');

export const auth = getAuth(app);
export const db = getFirestore(app);
