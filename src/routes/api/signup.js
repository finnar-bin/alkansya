import { auth } from '$lib/firebase/admin';

/**
 * API to register a new user.
 * @param {Object} request Request body
 * @returns {Object} Response
 */
export async function post({ request }) {
	// console.log(request);
	const data = await request.json();
	const userRecord = await auth.createUser({
		email: data.email,
		password: data.password
	});

	console.log(userRecord);
}
