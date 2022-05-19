<script context="module">
	/**
	 * Sets the year and month.
	 */
	export async function load({ params, fetch }) {
		// Check if there is a user logged in.
		const authResponse = await fetch('/api/auth');

		if (authResponse.ok) {
			const { year = '', month = '' } = params;

			return {
				props: {
					month,
					year
				}
			};
		} else {
			return {
				status: 302,
				redirect: '/login'
			};
		}
	}
</script>

<script>
	import { onDestroy } from 'svelte';
	import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
	import { db } from '$lib/firebase/client';
	import { MONTHS } from '$lib/config/constants';

	onDestroy(() => unsubscribe());

	/** Properties */
	export let month, year;
	let incomes = [];
	let expenses = [];
	let totals = {
		income: 0,
		expenses: 0
	};
	let updateStatus = {
		updatedBy: '',
		lastUpdated: ''
	};
	let isLoading = true;
	let hasData = true;
	$: pageHeader = `${MONTHS[month - 1]} ${year}`;

	// Listen for any changes in the document
	const monthRef = doc(db, year, month);
	const unsubscribe = onSnapshot(monthRef, async (monthSnap) => {
		// TODO: Move this to an api call
		if (monthSnap.exists()) {
			const { lastUpdated, updatedBy } = monthSnap.data();
			const expenseRef = collection(monthRef, 'expense');
			const incomeRef = collection(monthRef, 'income');
			const expenseSnap = await getDocs(expenseRef);
			const incomeSnap = await getDocs(incomeRef);

			if (!expenseSnap.empty) {
				expenseSnap.forEach((expense) => {
					expenses = [...expenses, { ...expense.data(), id: expense.id }];
					totals.expenses += expense.data().amount;
				});
			}

			if (!incomeSnap.empty) {
				incomeSnap.forEach((income) => {
					incomes = [...incomes, { ...income.data(), id: income.id }];
					totals.income += income.data().amount;
				});
			}

			updateStatus = {
				updatedBy,
				lastUpdated
			};
			isLoading = false;
			hasData = true;
		} else {
			isLoading = false;
			hasData = false;
		}
	});

	/**
	 * Sends an api call to delete an entry.
	 * @param type {string} Type of entry to be deleted.
	 * @param id {string} ID of entry to be deleted.
	 */
	async function deleteEntry(type, id) {
		const delResponse = await fetch('/api/entry', {
			method: 'DELETE',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				id,
				type,
				colRef: {
					year,
					month
				}
			})
		});

		if (delResponse.ok) {
			// TODO: Refetch the data
		}
	}
</script>

<svelte:head>
	<title>Budget Tracker | {pageHeader}</title>
</svelte:head>

<section>
	<a href="/">Back</a>
	<h1>{pageHeader}</h1>

	{#if isLoading}
		<p>Loading...</p>
	{:else if hasData}
		<div>
			<h3>Monthly overview</h3>
			<p>Total Expenses: {totals.expenses}</p>
			<p>Total Income: {totals.income}</p>
		</div>

		<div>
			<h3>Expenses:</h3>
			{#if expenses.length}
				<ul>
					{#each expenses as expense}
						<li>
							<ul>
								<li>Type: {expense.type}</li>
								<li>Amount: {expense.amount}</li>
								<li>Description: {expense.description}</li>
								<li>Date: {new Date(expense.timestamp)}</li>
								<li>Added by: {expense.creator}</li>
								<li>
									<button>Edit</button>
									<button on:click={deleteEntry('expense', expense.id)}
										>Delete</button
									>
								</li>
							</ul>
						</li>
					{/each}
				</ul>
			{:else}
				<p>No data...</p>
			{/if}
		</div>

		<div>
			<h3>Incomes:</h3>
			{#if incomes.length}
				<ul>
					{#each incomes as income}
						<li>
							<ul>
								<li>Type: {income.type}</li>
								<li>Amount: {income.amount}</li>
								<li>Description: {income.description}</li>
								<li>Date: {new Date(income.timestamp)}</li>
								<li>Added by: {income.creator}</li>
								<li>
									<button>Edit</button>
									<button on:click={deleteEntry('income', income.id)}
										>Delete</button
									>
								</li>
							</ul>
						</li>
					{/each}
				</ul>
			{:else}
				<p>No data...</p>
			{/if}
		</div>

		<div>
			<span>Last updated: {new Date(updateStatus.lastUpdated)}</span>
			<span>Updated by: {updateStatus.updatedBy}</span>
		</div>
	{:else}
		<p>No data...</p>
	{/if}
</section>
