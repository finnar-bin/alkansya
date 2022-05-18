import { db } from '$lib/firebase/admin';
import { returnHttpError } from '$lib/utils';

/**
 * API call to delete an entry.
 * @param {Object} param0 Request object.
 * @returns {Object} Response.
 */
export async function del({ request }) {
	const {
		id,
		type,
		colRef: { year, month }
	} = await request.json();
	const entryRef = db.doc(`${year}/${month}/${type}/${id}`);

	return entryRef
		.delete({ exists: true })
		.then(() => {
			return {
				status: 200
			};
		})
		.catch((error) => {
			return returnHttpError(500, error);
		});
}
