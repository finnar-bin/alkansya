import { db } from '$lib/firebase/admin';
import { returnHttpError } from '$lib/utils';

/**
 * API call to add a new entry.
 * @param {Object} request Request object.
 * @returns {Object} Response.
 */
export const post = async ({ request }) => {
	const { amount, creator, description, timestamp, type, year, month, transactionType } =
		await request.json();
	const _year = year.toString();
	const _month = month.toString();
	const monthRef = db.doc(`${_year}/${_month}`);
	monthRef.set({
		lastUpdated: timestamp,
		updatedBy: creator
	});

	return monthRef
		.collection(transactionType)
		.add({
			amount,
			creator,
			description,
			timestamp,
			type
		})
		.then(() => {
			return {
				status: 200
			};
		})
		.catch((error) => returnHttpError(500, error));
};

/**
 * API call to delete an entry.
 * @param {Object} request Request object.
 * @returns {Object} Response.
 */
export async function del({ request }) {
	const {
		id,
		type,
		colRef: { year, month }
	} = await request.json();
	const entryRef = db.doc(`${year}/${month}/${type}/${id}`);

	// TODO: Update last update in the document

	return entryRef
		.delete({ exists: true })
		.then(() => {
			return {
				status: 200
			};
		})
		.catch((error) => returnHttpError(500, error));
}
