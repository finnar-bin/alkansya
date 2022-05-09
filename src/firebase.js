import firebaseConfig from './env';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export let db = null;
export let auth = null;

/**
 * Initializes firebase.
 * @returns {null}
 */
export async function initFirebase() {
	const app = initializeApp(firebaseConfig);
	db = getFirestore(app);
	auth = getAuth(app);

	return;
}
