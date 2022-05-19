import { db } from '$lib/firebase/admin';
import { isYear } from '$lib/utils';

/**
 * API call to get all records.
 * @returns {Object} Response.
 */
export const get = async () => {
	let records = {};
	const collections = await db.listCollections();
	const yearCollections = collections.filter((collection) => isYear(collection.id));

	for (const yearRef of yearCollections) {
		const monthDocs = await yearRef.listDocuments();
		const months = monthDocs.map((monthRef) => monthRef.id);

		records[yearRef.id] = months;
	}

	return {
		status: 200,
		headers: new Headers({ 'content-type': 'application/json' }),
		body: JSON.stringify({
			records
		})
	};
};
