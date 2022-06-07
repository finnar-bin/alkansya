import { auth } from '$lib/firebase/admin';
import { returnHttpError } from '$lib/utils';

/**
 * API to register a new user.
 * @param {Object} request Request body
 * @returns {Object} Response
 */
export const post = async ({ request }) => {
	const data = await request.json();

	try {
		const userRecord = await auth.createUser({
			email: data.email,
			password: data.password,
			displayName: data.displayName
		});

		return {
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				email: userRecord.email
			})
		};
	} catch (error) {
		return returnHttpError(500, error.message);
	}
};
