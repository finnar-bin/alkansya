import { auth } from '$lib/firebase/admin';
import { return500 } from '$lib/utils';
import { dev } from '$app/env';

const secure = dev ? '' : 'Secure;';

/**
 * API to login a user.
 * @param {Object} request Request body
 * @returns {Object} Response
 */
export async function post({ request }) {
	const data = await request.json();

	try {
		try {
			const decodedToken = await auth.verifyIdToken(data.idToken, true);
			try {
				const token = await auth.createCustomToken(decodedToken.uid);

				return {
					status: 200,
					headers: {
						'content-type': 'application/json',
						'set-cookie': `customToken=${token}; Max-Age=${60 * 55}; Path=/; HttpOnly; ${secure}`,
						'cache-control': 'no-store'
					}
				};
			} catch (error) {
				return return500(error.message);
			}
		} catch (error) {
			return return500(error.message);
		}
	} catch (error) {
		return return500(error.message);
	}
}
