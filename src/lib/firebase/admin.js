import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

const project_id = process.env['PROJECT_ID'];
const private_key_id = process.env['PRIVATE_KEY_ID'];
const private_key = process.env['PRIVATE_KEY'];
const client_email = process.env['CLIENT_EMAIL'];
const client_id = process.env['CLIENT_ID'];

/* Firebase admin credentials */
export const adminCredentials = {
	type: 'service_account',
	auth_uri: 'https://accounts.google.com/o/oauth2/auth',
	token_uri: 'https://oauth2.googleapis.com/token',
	auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
	client_x509_cert_url:
		'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6ufcw%40budget-tracker-fe1c0.iam.gserviceaccount.com',
	project_id,
	private_key_id,
	private_key,
	client_email,
	client_id
};

const app = getApps().length
	? getApp('ADMIN')
	: initializeApp({ credential: cert(adminCredentials) }, 'ADMIN');

export const auth = getAuth(app);
export const db = getFirestore(app);
