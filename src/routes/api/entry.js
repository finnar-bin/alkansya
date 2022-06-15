import { db } from '$lib/firebase/admin';
import { returnHttpError } from '$lib/utils';

/**
 * API call to get all entries for a month.
 * @param {Object} url URL data object.
 * @returns {Object} Response.
 */
export const get = async ({ url }) => {
	const year = url.searchParams.get('year');
	const month = url.searchParams.get('month');
	const updatesRef = db.doc(`${year}/${month}`);
	const updatesSnap = await updatesRef.get();

	if (!updatesSnap.exists) {
		return returnHttpError(500, 'Document not found.');
	}

	const expenses = {};
	const incomes = {};
	let totalExpenses = 0;
	let totalIncome = 0;
	const updateData = updatesSnap.data();
	const expenseQuery = db.collection(`${year}/${month}/expense`);
	const incomeQuery = db.collection(`${year}/${month}/income`);

	const expensePromise = expenseQuery
		.orderBy('timestamp', 'desc')
		.get()
		.then((querySnap) => {
			querySnap.forEach((docSnap) => {
				const data = docSnap.data();

				if (!expenses[data.type]) {
					expenses[data.type] = {
						total: 0,
						data: []
					};
				}

				expenses[data.type] = {
					total: (expenses[data.type].total += data.amount),
					data: [
						...expenses[data.type].data,
						{
							...data,
							id: docSnap.id
						}
					]
				};
				totalExpenses += data.amount;
			});
		});

	const incomePromise = incomeQuery
		.orderBy('timestamp', 'desc')
		.get()
		.then((querySnap) => {
			querySnap.forEach((docSnap) => {
				const data = docSnap.data();

				if (!incomes[data.type]) {
					incomes[data.type] = {
						total: 0,
						data: []
					};
				}

				incomes[data.type] = {
					total: (incomes[data.type].total += data.amount),
					data: [
						...incomes[data.type].data,
						{
							...data,
							id: docSnap.id
						}
					]
				};
				totalIncome += data.amount;
			});
		});

	return Promise.all([expensePromise, incomePromise]).then(() => {
		const currentBalance = totalIncome - totalExpenses;

		return {
			status: 200,
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				incomes,
				expenses,
				totalExpenses,
				totalIncome,
				currentBalance,
				updateData
			})
		};
	});
};

/**
 * API call to add a new entry.
 * @param {Object} request Request object.
 * @returns {Object} Response.
 */
export const post = async ({ request }) => {
	const { amount, creator, description, timestamp, type, year, month, entryType } =
		await request.json();
	const _year = year.toString();
	const _month = month.toString();
	const monthRef = db.doc(`${_year}/${_month}`);
	monthRef.set({
		lastUpdated: timestamp,
		updatedBy: creator
	});

	return monthRef
		.collection(entryType)
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
export const del = async ({ request }) => {
	const {
		user,
		id,
		type,
		timestamp,
		colRef: { year, month }
	} = await request.json();
	const entryRef = db.doc(`${year}/${month}/${type}/${id}`);

	return entryRef
		.delete({ exists: true })
		.then(() => {
			// Set last update values
			const monthRef = db.doc(`${year}/${month}`);

			return monthRef
				.update({
					lastUpdated: timestamp,
					updatedBy: user
				})
				.then(() => ({ status: 200 }))
				.catch((error) => new Error(error));
		})
		.catch((error) => returnHttpError(500, error));
};

export const put = async ({ request }) => {
	const {
		amount,
		description,
		user,
		timestamp,
		type,
		id,
		colRef: { year, month }
	} = await request.json();
	const entryRef = db.doc(`${year}/${month}/${type}/${id}`);

	return entryRef
		.update({
			amount,
			creator: user,
			description,
			timestamp
		})
		.then(() => {
			// Set last update values
			const monthRef = db.doc(`${year}/${month}`);

			return monthRef
				.update({
					lastUpdated: timestamp,
					updatedBy: user
				})
				.then(() => ({ status: 200 }))
				.catch((error) => new Error(error));
		})
		.catch((error) => returnHttpError(500, error));
};
