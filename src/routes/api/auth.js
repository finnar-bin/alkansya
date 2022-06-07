import dotenv from 'dotenv';
import * as cookie from 'cookie';
import { auth } from '$lib/firebase/admin';
import { returnHttpError } from '$lib/utils';
import { dev } from '$app/env';

dotenv.config();

const secure = dev ? '' : 'Secure;';
const webApiKey = process.env['WEB_API_KEY'];

/**
 * API to login a user.
 * @param {Object} request Request body.
 * @returns {Object} Response.
 */
export const post = async ({ request }) => {
	const { email, password } = await request.json();
	const loginResponse = await fetch(
		`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${webApiKey}`,
		{
			method: 'POST',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				email,
				password,
				returnSecureToken: true
			})
		}
	);

	if (loginResponse.ok) {
		const { localId } = await loginResponse.json();
		const customToken = await auth.createCustomToken(localId);

		return {
			status: 200,
			headers: {
				'content-type': 'application/json',
				'set-cookie': `customToken=${customToken}; Max-Age=${
					60 * 55
				}; Path=/; HttpOnly; ${secure}`,
				'cache-control': 'no-store'
			},
			body: JSON.stringify({
				customToken
			})
		};
	} else {
		const error = await loginResponse.json();

		return returnHttpError(401, error);
	}
};

/**
 * API to authenticate a user.
 * @param {Object} request Request body.
 * @returns {Object} Response.
 */
export const get = async ({ request }) => {
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

		if (idTokenResponse.ok) {
			const tokens = await idTokenResponse.json();

			// Verify if the custom token is still valid
			user = await auth.verifyIdToken(tokens.idToken);
		} else {
			throw new Error('Failed to validate custom token.');
		}
	} catch (error) {
		return returnHttpError(401, error.message);
	}

	return {
		status: 200,
		body: JSON.stringify({
			user
		})
	};
};
