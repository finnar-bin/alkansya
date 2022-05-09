import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import * as credentials from './admin-credentials.json';

const app = initializeApp(
	{
		credential: cert(credentials)
	},
	'ADMIN'
);

export const auth = getAuth(app);
