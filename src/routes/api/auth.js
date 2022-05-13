import * as cookie from 'cookie';
import { auth } from '$lib/firebase/admin';
import { returnHttpError } from '$lib/utils';
import { dev } from '$app/env';

const secure = dev ? '' : 'Secure;';
const webApiKey = import.meta.env.VITE_WEB_API_KEY;

/**
 * API to login a user.
 * @param {Object} request Request body.
 * @returns {Object} Response.
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
				return returnHttpError(500, error.message);
			}
		} catch (error) {
			return returnHttpError(500, error.message);
		}
	} catch (error) {
		return returnHttpError(500, error.message);
	}
}

/**
 * API to authenticate a user.
 * @param {Object} request Request body.
 * @returns {Object} Response.
 */
export async function get({ request }) {
	const { customToken } = cookie.parse(request.headers.get('cookie'));
	let user = {};

	try {
		if (!customToken) {
			throw new Error('No logged in user.');
		}

		const idTokenResponse = await fetch(
			`https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${webApiKey}`,
			{
				method: 'POST',
				headers: new Headers({ 'content-type': 'application/json' }),
				body: JSON.stringify({
					token: customToken,
					returnSecureToken: true
				})
			}
		);

		if (!idTokenResponse.ok) {
			throw new Error('Failed to validate custom token.');
		}

		const tokens = await idTokenResponse.json();

		// Verify if the custom token is still valid
		user = await auth.verifyIdToken(tokens.idToken);
	} catch (error) {
		return returnHttpError(401, error.message);
	}

	return {
		status: 200,
		body: JSON.stringify({
			user
		})
	};
}
