import { db } from '$lib/firebase/admin';

/**
 * API call to get all transaction types.
 * @returns {Object} Response
 */
export const get = async () => {
	let incomeTypes = [];
	let expenseTypes = [];
	const incomeTypePromise = db
		.collection('income-types')
		.get()
		.then((querySnap) => {
			querySnap.forEach((doc) => {
				incomeTypes.push({
					...doc.data(),
					id: doc.id
				});
			});
		});
	const expenseTypePromise = db
		.collection('expense-types')
		.get()
		.then((querySnap) => {
			querySnap.forEach((doc) => {
				expenseTypes.push({
					...doc.data(),
					id: doc.id
				});
			});
		});

	return Promise.all([incomeTypePromise, expenseTypePromise]).then(() => {
		return {
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				incomeTypes,
				expenseTypes
			})
		};
	});
};

/**
 * API call to delete a transaction.
 * @param {Object} request Request object.
 * @returns {Object} Response.
 */
export const del = async ({ request }) => {
	const { type, id } = await request.json();
	const docRef = db.doc(`${type}-types/${id}`);

	return docRef.delete().then(() => {
		return {
			status: 200
		};
	});
};
