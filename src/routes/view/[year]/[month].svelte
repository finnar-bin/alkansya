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
	import { PAGE_TITLE } from '$lib/config/constants';
	import user from '$lib/stores/user';
	import { getMonthString, currencyFormat, dateFormat } from '$lib/utils';
	import Card from '$lib/components/Card.svelte';
	import Entry from '$lib/components/Entry.svelte';
	import Dollar from '$lib/assets/Dollar.svelte';
	import ShoppingCart from '$lib/assets/ShoppingCart.svelte';

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
	$: pageHeader = `${getMonthString(month)} ${year}`;
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
				timestamp: new Date().toISOString(),
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
	 * Sends an api call to update an entry
	 * @param e {Object} Event data object
	 */
	const updateEntry = async (e, type, id) => {
		const updateResponse = await fetch('/api/entry', {
			method: 'PUT',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({
				...e.detail,
				user: $user.displayName,
				timestamp: new Date().toISOString(),
				type,
				id,
				colRef: {
					year,
					month
				}
			})
		});

		if (updateResponse.ok) {
			refreshEntries();
		}
	};

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
	<h1 class="text-2xl border-b-2 pb-2">{pageHeader}</h1>

	<div class="py-6">
		<div>
			<span class="font-black">Total Expenses: </span>
			<span>{totalExpenses ? currencyFormat(totalExpenses) : '-'}</span>
		</div>
		<div>
			<span class="font-black">Total Income: </span>
			<span>{totalIncome ? currencyFormat(totalIncome) : '-'}</span>
		</div>
	</div>

	<div class="grid gap-8 grid-cols-1 md:grid-cols-2">
		<Card noPadding>
			<div class="text-2xl font-black" slot="card-header">
				<Dollar customClass="mr-2 inline" /> Incomes
			</div>
			<div slot="card-body">
				{#if incomes.length}
					{#each incomes as income, index}
						<Entry
							type="income"
							entry={income}
							showBottomBorder={index + 1 < incomes.length}
							on:delete-entry={deleteEntry('income', income.id)}
							on:update-entry={(e) => updateEntry(e, 'income', income.id)}
						/>
					{/each}
				{:else}
					<p class="p-6">No data...</p>
				{/if}
			</div>
		</Card>

		<Card noPadding>
			<div class="text-2xl font-black" slot="card-header">
				<ShoppingCart customClass="mr-2 inline" /> Expenses
			</div>
			<div slot="card-body">
				{#if expenses.length}
					{#each expenses as expense, index}
						<Entry
							type="expense"
							entry={expense}
							showBottomBorder={index + 1 < expenses.length}
							on:delete-entry={deleteEntry('expense', expense.id)}
							on:update-entry={(e) => updateEntry(e, 'expense', expense.id)}
						/>
					{/each}
				{:else}
					<p class="p-6">No data...</p>
				{/if}
			</div>
		</Card>
	</div>

	<div class="my-8 border-t-2 text-base text-zinc-400">
		<p class="mt-4">
			<span class="font-black">Last updated:</span>
			{dateFormat(updateData.lastUpdated, 'datetime')}
		</p>
		<p><span class="font-black">Updated by:</span> {updateData.updatedBy}</p>
	</div>
</section>
