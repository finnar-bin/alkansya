import { auth } from '$lib/firebase/admin';
import { return500 } from '$lib/utils';
import { dev } from '$app/env';

const secure = dev ? '' : 'Secure;';

/**
 * API to register a new user.
 * @param {Object} request Request body
 * @returns {Object} Response
 */
export async function post({ request }) {
	const data = await request.json();

	try {
		const userRecord = await auth.createUser({
			email: data.email,
			password: data.password,
			displayName: data.username
		});

		try {
			const token = await auth.createCustomToken(userRecord.uid);

			return {
				status: 200,
				headers: {
					'content-type': 'application/json',
					'set-cookie': `customToken=${token}; Path=/; HttpOnly; ${secure}`
				},
				body: JSON.stringify({
					email: userRecord.email,
					token
				})
			};
		} catch (err) {
			return return500(err.message);
		}
	} catch (err) {
		return return500(err.message);
	}
}
