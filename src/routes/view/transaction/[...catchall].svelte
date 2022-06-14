<script context="module">
	import { isYear, isMonth, isString } from '$lib/utils';

	/**
	 * Load data SSR
	 * @param {string} params URL string parameter
	 * @param {Function} fetch Fetch function
	 */
	export const load = async ({ params, fetch }) => {
		// Check if there is a user logged in.
		const authResponse = await fetch('/api/auth');

		if (authResponse.ok) {
			const [year, month, type, transaction] = params.catchall.split('/');
			const isMissingParams = !year || !month || !type || !transaction;
			const isInvalidParamFormat =
				!isYear(year) || !isMonth(month) || !isString(type) || !isString(transaction);

			if (isMissingParams || isInvalidParamFormat) {
				return {
					status: 400,
					error: 'Invalid URL format'
				};
			}

			const { status, data } = await getTransactions(fetch, {
				year,
				month,
				type,
				transaction
			});

			return {
				status,
				props: {
					transactions: data,
					type,
					year,
					month,
					transaction
				}
			};
		} else {
			return {
				status: 302,
				redirect: '/login'
			};
		}
	};

	/**
	 * Sends an api call to get all the transactions for a specific type.
	 * @param {Function} customFetch Fetch api to use.
	 * @param {Object} params Parameters to use for the api call.
	 * @returns {Object} Response object.
	 */
	const getTransactions = async (customFetch, params) => {
		const searchParams = new URLSearchParams(params);
		const response = await customFetch(`/api/transaction?${searchParams}`);
		const { transactions } = await response.json();

		return {
			status: response.status,
			data: transactions
		};
	};
</script>

<script>
	import user from '$lib/stores/user';
	import { EXPENSE_TYPES, INCOME_TYPES, PAGE_TITLE } from '$lib/config/constants';
	import { getMonthString } from '$lib/utils';
	import Entry from '$lib/components/Entry.svelte';
	import Card from '$lib/components/Card.svelte';

	/* Properties */
	export let transactions = [];
	export let type;
	export let month;
	export let year;
	export let transaction;

	/**
	 * Sends an api call to delete an entry.
	 * @param type {string} Type of entry to be deleted.
	 * @param id {string} ID of entry to be deleted.
	 */
	const deleteEntry = async (type, id) => {
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
			handleRefreshTransactions();
		}
	};

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
			handleRefreshTransactions();
		}
	};

	/**
	 * Get the human readable transaction type
	 * @param transactionType Transaction type code
	 */
	const getHeaderTitle = (code, type) => {
		let array = [];

		if (type === 'income') {
			array = INCOME_TYPES;
		}

		if (type === 'expense') {
			array = EXPENSE_TYPES;
		}

		const match = array.find((type) => type.value === code);

		return match.name || '-';
	};

	/**
	 * Refreshes the transactions
	 * @returns {Array} Transactions
	 */
	const refreshTransactions = async () => {
		const response = await getTransactions(fetch, { year, month, type, transaction });

		return response.data;
	};

	/**
	 * Triggers a data refresh
	 */
	const handleRefreshTransactions = () => {
		transactions = refreshTransactions();
	};
</script>

<svelte:head>
	<title>{PAGE_TITLE} | {getHeaderTitle(transaction, type)} Transactions</title>
</svelte:head>

<section>
	<h1 class="text-2xl">{getHeaderTitle(transaction, type)} Transactions</h1>
	<h2 class="text-base text-gray-400 border-b pb-2">{getMonthString(month)} {year}</h2>

	<div class="pt-6">
		{#await transactions}
			<p>Loading</p>
		{:then data}
			{#if data}
				<div class="grid gap-8 grid-cols-1 md:grid-cols-2">
					{#each data as transaction, index}
						<Card headless>
							<div slot="card-body">
								<Entry
									{type}
									entry={transaction}
									on:delete-entry={deleteEntry('income', transaction.id)}
									on:update-entry={(e) =>
										updateEntry(e, 'income', transaction.id)}
								/>
							</div>
						</Card>
					{/each}
				</div>
			{:else}
				<p>No data</p>
			{/if}
		{/await}
	</div>
</section>
