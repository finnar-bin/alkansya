import { db } from '$lib/firebase/admin';

/**
 * API call to get all transactions per type.
 * @param {Object} url URL data object.
 * @returns {Object} Response.
 */
export const get = async ({ url }) => {
	let transactions = [];
	const year = url.searchParams.get('year');
	const month = url.searchParams.get('month');
	const type = url.searchParams.get('type');
	const transaction = url.searchParams.get('transaction');
	const query = db.collection(`${year}/${month}/${type}`);

	const transactionPromise = query
		.where('type', '==', transaction)
		.orderBy('timestamp', 'desc')
		.get()
		.then((querySnap) => {
			querySnap.forEach((doc) => {
				transactions.push({
					...doc.data(),
					id: doc.id
				});
			});
		});

	return Promise.all([transactionPromise]).then(() => {
		return {
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({ transactions })
		};
	});
};
