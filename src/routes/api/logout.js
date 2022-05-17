import { dev } from '$app/env';

/**
 * API to logout a user.
 * @returns {Object} Response.
 */
export async function get() {
	const secure = dev ? '' : 'Secure; ';

	return {
		status: 200,
		headers: {
			'content-type': 'application/json',
			'set-cookie': `customToken=_; Max-Age=0; Path=/; HttpOnly; ${secure}`,
			'cache-control': 'no-store'
		}
	};
}
