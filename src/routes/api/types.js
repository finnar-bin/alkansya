import { db } from '$lib/firebase/admin';
import { returnHttpError } from '$lib/utils';

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

/**
 * API call to add a new transaction.
 * @param {Object} request Request object.
 * @returns {Object} Response.
 */
export const post = async ({ request }) => {
	const { type, value, name } = await request.json();
	const colRef = db.collection(`${type}-types`);

	if (/\W/.test(value)) {
		return returnHttpError(
			500,
			'Invalid Code format. Use only alphanumeric characters and underscores'
		);
	}

	// Check if the code already exists
	return colRef
		.where('value', '==', value)
		.get()
		.then((querySnap) => {
			if (querySnap._size) {
				return returnHttpError(500, 'Code already exists');
			} else {
				return colRef
					.add({ value: value.toUpperCase(), name })
					.then(() => ({ status: 200 }));
			}
		});
};
