<script context="module">
	import { isYear, isMonth } from '$lib/utils';

	/**
	 * Sets the year and month.
	 */
	export async function load({ params, fetch }) {
		// Check if there is a user logged in.
		const authResponse = await fetch('/api/auth');

		if (authResponse.ok) {
			const { year, month } = params;

			if (!isYear(year) || !isMonth(month)) {
				return {
					status: 400,
					error: 'Invalid url format.'
				};
			}

			const { status, data, error } = await getEntries(fetch, { year, month });
			const monthData = status === 200 ? data : {};

			return {
				status,
				props: {
					monthData,
					year,
					month
				},
				error
			};
		} else {
			return {
				status: 302,
				redirect: '/login'
			};
		}
	}

	/**
	 * Sends an api call to get all the month entries.
	 * @param {Function} customFetch Fetch api to use.
	 * @param {Object} params Parameters to use for the api call.
	 * @returns {Object} Response object.
	 */
	const getEntries = async (customFetch, params) => {
		const { year, month } = params;
		const searchParams = new URLSearchParams({ year, month });
		const response = await customFetch(`/api/entry?${searchParams}`);
		const { incomes, expenses, totalExpenses, totalIncome, updateData, errorMessage } =
			await response.json();

		return {
			status: response.status,
			data: {
				month,
				year,
				incomes,
				expenses,
				totalExpenses,
				totalIncome,
				updateData
			},
			error: errorMessage
		};
	};
</script>

<script>
	import { MONTHS, PAGE_TITLE } from '$lib/config/constants';
	import user from '$lib/stores/user';

	/** Properties */
	export let monthData = {};
	export let month, year;
	export let incomes = [];
	export let expenses = [];
	export let totalExpenses = 0;
	export let totalIncome = 0;
	export let updateData = {
		updatedBy: '',
		lastUpdated: ''
	};
	$: pageHeader = `${MONTHS[month - 1]} ${year}`;
	$: monthData, setupMonthData(monthData);

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
				user: $user.displayName,
				id,
				type,
				colRef: {
					year,
					month
				}
			})
		});

		if (delResponse.ok) {
			refreshEntries();
		}
	}

	/**
	 * Refreshes the month data.
	 * @returns {Object|Error} Month data.
	 */
	const refreshEntries = async () => {
		const monthEntriesResponse = await getEntries(fetch, { year, month });

		console.log(monthEntriesResponse);

		if (monthEntriesResponse.status === 200) {
			monthData = monthEntriesResponse.data;
		} else {
			throw new Error(monthEntriesResponse.data);
		}
	};

	/**
	 * Sets raw month data to each property accordingly.
	 * @param data
	 */
	const setupMonthData = (data) => {
		incomes = data.incomes;
		expenses = data.expenses;
		totalExpenses = data.totalExpenses;
		totalIncome = data.totalIncome;
		updateData = data.updateData;
	};
</script>

<svelte:head>
	<title>{PAGE_TITLE} | {pageHeader}</title>
</svelte:head>

<section>
	<a href="/">Back</a>
	<h1>{pageHeader}</h1>

	<div>
		<h3>Monthly overview</h3>
		<p>Total Expenses: {totalExpenses}</p>
		<p>Total Income: {totalIncome}</p>
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
								<button on:click={deleteEntry('expense', expense.id)}>Delete</button
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
								<button on:click={deleteEntry('income', income.id)}>Delete</button>
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
		<span>Last updated: {new Date(updateData.lastUpdated)}</span>
		<span>Updated by: {updateData.updatedBy}</span>
	</div>
</section>
