import firebaseConfig from './env';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export let db = null;

/**
 * Initializes firebase.
 * @returns null
 */
export async function initFirebase() {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);

    return;
}