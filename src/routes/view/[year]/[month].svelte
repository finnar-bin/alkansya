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
			const searchParams = new URLSearchParams({ year, month });

			const monthDataResponse = await fetch(`/api/entry?${searchParams}`);

			if (monthDataResponse.ok) {
				const { incomes, expenses, totalExpenses, totalIncome, updateData } =
					await monthDataResponse.json();

				return {
					status: 200,
					props: {
						month,
						year,
						incomes,
						expenses,
						totalExpenses,
						totalIncome,
						updateData
					}
				};
			} else {
				return {
					status: monthDataResponse.status,
					error: monthDataResponse.errorMessage
				};
			}
		} else {
			return {
				status: 302,
				redirect: '/login'
			};
		}
	}
</script>

<script>
	import { MONTHS } from '$lib/config/constants';

	/** Properties */
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
