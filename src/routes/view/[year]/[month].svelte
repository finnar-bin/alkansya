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
	import Loading from '$lib/assets/Loading.svelte';
	import ArrowLeft from '$lib/assets/ArrowLeft.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import NewEntryForm from '$lib/components/NewEntryForm.svelte';

	/** Properties */
	export let monthData = {};
	export let month, year;
	$: pageHeader = `${getMonthString(month)} ${year}`;

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
			handleRefreshEntries();
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
			handleRefreshEntries();
		}
	};

	/**
	 * Refreshes the month data.
	 * @returns {Object|Error} Month data.
	 */
	const refreshEntries = async () => {
		const monthEntriesResponse = await getEntries(fetch, { year, month });

		if (monthEntriesResponse.status === 200) {
			return monthEntriesResponse.data;
		} else {
			throw new Error(monthEntriesResponse.data);
		}
	};

	/**
	 * Triggers a data refresh
	 */
	const handleRefreshEntries = () => {
		monthData = refreshEntries();
	};
</script>

<svelte:head>
	<title>{PAGE_TITLE} | {pageHeader}</title>
</svelte:head>

<NewEntryForm on:new-entry={handleRefreshEntries} />

<section>
	<a class="flex items-center" href="/"><ArrowLeft customClass="mr-1 inline" /> Back</a>
	<h1 class="text-2xl border-b-2 pb-2">{pageHeader}</h1>

	{#await monthData}
		<div class="py-6 flex items-center">
			<span>Refreshing entries...</span>
			<Loading customClass="animate-spin ml-2" />
		</div>
	{:then data}
		<div class="py-6">
			<div>
				<span class="font-black">Total Expenses: </span>
				<span>{data.totalExpenses ? currencyFormat(data.totalExpenses) : '-'}</span>
			</div>
			<div>
				<span class="font-black">Total Income: </span>
				<span>{data.totalIncome ? currencyFormat(data.totalIncome) : '-'}</span>
			</div>
		</div>

		<div class="grid gap-8 grid-cols-1 md:grid-cols-2">
			<Card noPadding>
				<div class="text-2xl font-black" slot="card-header">
					<Dollar customClass="mr-2 inline" /> Incomes
				</div>
				<div slot="card-body">
					{#if data.incomes.length}
						{#each data.incomes as income, index}
							<Entry
								type="income"
								entry={income}
								showBottomBorder={index + 1 < data.incomes.length}
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
					{#if data.expenses.length}
						{#each data.expenses as expense, index}
							<Entry
								type="expense"
								entry={expense}
								showBottomBorder={index + 1 < data.expenses.length}
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
				{dateFormat(data.updateData.lastUpdated, 'datetime')}
			</p>
			<p><span class="font-black">Updated by:</span> {data.updateData.updatedBy}</p>
		</div>
	{:catch error}
		<Notification type="error">{error.message}</Notification>
	{/await}
</section>
