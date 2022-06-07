import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import * as adminCredentials from './admin-credentials.json';

const app = getApps().length
	? getApp('ADMIN')
	: initializeApp({ credential: cert(adminCredentials) }, 'ADMIN');

export const auth = getAuth(app);
export const db = getFirestore(app);
