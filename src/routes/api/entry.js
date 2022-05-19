import { db } from '$lib/firebase/admin';
import { returnHttpError } from '$lib/utils';

export const get = async ({ url }) => {
	const year = url.searchParams.get('year');
	const month = url.searchParams.get('month');
	const updatesRef = db.doc(`${year}/${month}`);
	const updatesSnap = await updatesRef.get();

	if (!updatesSnap.exists) {
		return returnHttpError(500, 'Document not found.');
	}

	let expenseData = [];
	let incomeData = [];
	const updateData = updatesSnap.data();
	const expenseDocs = await db.collection(`${year}/${month}/expense`).listDocuments();
	const incomeDocs = await db.collection(`${year}/${month}/income`).listDocuments();
	const expensePromise = expenseDocs.map(async (docRef) => {
		const docSnap = await docRef.get();

		return docSnap.data();
	});
	const incomePromise = incomeDocs.map(async (docRef) => {
		const docSnap = await docRef.get();

		return docSnap.data();
	});

	// Needed to wait for all the async calls to get the doc
	// data to resolve.
	await Promise.all([...expensePromise]).then((expenses) => (expenseData = expenses));
	await Promise.all([...incomePromise]).then((incomes) => (incomeData = incomes));

	const totalExpenses = expenseData.reduce((acc, curr) => (acc += curr.amount), 0);
	const totalIncome = incomeData.reduce((acc, curr) => (acc += curr.amount), 0);

	return {
		status: 200,
		headers: new Headers({ 'content-type': 'application/json' }),
		body: JSON.stringify({
			incomes: incomeData,
			expenses: expenseData,
			totalExpenses,
			totalIncome,
			updateData
		})
	};
};

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
