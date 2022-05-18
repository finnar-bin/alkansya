import { db } from '$lib/firebase/admin';

export const get = async () => {
	const collections = await db.listCollections();
	const records = collections.reduce(async (acc, curr) => {
		if (!isNaN(curr.id)) {
			acc[curr.id] = [];

			const docsRef = await curr.listDocuments();

			docsRef.forEach((doc) => {
				acc[curr.id].push(doc.id);
			});
		}

		return acc;
	}, {});

	return records.then((records) => {
		return {
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				records
			})
		};
	});
};
