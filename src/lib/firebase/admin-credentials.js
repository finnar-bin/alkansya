import dotenv from 'dotenv';

dotenv.config();

const vercelEnv = import.meta.env.VITE_VERCEL_ENV;
const privateKey = import.meta.env.VITE_PRIVATE_KEY;

export default (dev) => {
	if (dev) {
		return {
			type: 'service_account',
			project_id: 'budget-tracker-fe1c0',
			private_key_id: '8537bdb7c573e30692b457f3fac2f9b458a71d86',
			private_key: privateKey,
			client_email: 'firebase-adminsdk-6ufcw@budget-tracker-fe1c0.iam.gserviceaccount.com',
			client_id: '114347923315520683300',
			auth_uri: 'https://accounts.google.com/o/oauth2/auth',
			token_uri: 'https://oauth2.googleapis.com/token',
			auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
			client_x509_cert_url:
				'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6ufcw%40budget-tracker-fe1c0.iam.gserviceaccount.com'
		};
	} else {
		if (vercelEnv === 'production') {
			return {
				type: 'service_account',
				project_id: 'alkansya-777c4',
				private_key_id: 'a6d6e238ff3415e2620fdd9dec752f0bfbf89543',
				private_key: privateKey,
				client_email: 'firebase-adminsdk-stzhv@alkansya-777c4.iam.gserviceaccount.com',
				client_id: '108660280819102398504',
				auth_uri: 'https://accounts.google.com/o/oauth2/auth',
				token_uri: 'https://oauth2.googleapis.com/token',
				auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
				client_x509_cert_url:
					'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-stzhv%40alkansya-777c4.iam.gserviceaccount.com'
			};
		} else {
			return {
				type: 'service_account',
				project_id: 'budget-tracker-fe1c0',
				private_key_id: '8537bdb7c573e30692b457f3fac2f9b458a71d86',
				private_key: privateKey,
				client_email:
					'firebase-adminsdk-6ufcw@budget-tracker-fe1c0.iam.gserviceaccount.com',
				client_id: '114347923315520683300',
				auth_uri: 'https://accounts.google.com/o/oauth2/auth',
				token_uri: 'https://oauth2.googleapis.com/token',
				auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
				client_x509_cert_url:
					'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-6ufcw%40budget-tracker-fe1c0.iam.gserviceaccount.com'
			};
		}
	}
};
