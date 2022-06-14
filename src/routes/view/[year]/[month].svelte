<script context="module">
	import { isYear, isMonth } from '$lib/utils';

	/**
	 * Sets the year and month.
	 */
	export const load = async ({ params, fetch }) => {
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
	};

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
		const {
			incomes,
			expenses,
			totalExpenses,
			totalIncome,
			currentBalance,
			updateData,
			errorMessage
		} = await response.json();

		return {
			status: response.status,
			data: {
				month,
				year,
				incomes,
				expenses,
				totalExpenses,
				totalIncome,
				currentBalance,
				updateData
			},
			error: errorMessage
		};
	};
</script>

<script>
	import { PAGE_TITLE } from '$lib/config/constants';
	import { getMonthString, currencyFormat, dateFormat, getCategoryType } from '$lib/utils';
	import Card from '$lib/components/Card.svelte';
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
	<a sveltekit:prefetch class="flex items-center" href="/">
		<ArrowLeft customClass="mr-1 inline" /> Back
	</a>
	<h1 class="text-2xl border-b-2 pb-2">{pageHeader}</h1>

	{#await monthData}
		<div class="py-6 flex items-center">
			<span>Refreshing entries...</span>
			<Loading customClass="animate-spin ml-2" />
		</div>
	{:then data}
		<!-- Totals -->
		<div class="py-6">
			<div>
				<span class="font-black">Total Income: </span>
				<span>{data.totalIncome ? currencyFormat(data.totalIncome) : '-'}</span>
			</div>
			<div>
				<span class="font-black">Total Expenses: </span>
				<span>{data.totalExpenses ? currencyFormat(data.totalExpenses) : '-'}</span>
			</div>
			<div>
				<span class="font-black">Current Balance: </span>
				<span>{data.currentBalance ? currencyFormat(data.currentBalance) : '-'}</span>
			</div>
		</div>

		<div class="grid gap-8 grid-cols-1 md:grid-cols-2">
			<!-- Income -->
			<Card noPadding>
				<div class="text-2xl font-black" slot="card-header">
					<Dollar customClass="mr-2 inline" /> Income
				</div>
				<div slot="card-body">
					{#if Object.keys(data.incomes).length}
						{#each Object.keys(data.incomes) as key, index}
							<div
								class:border-b={index + 1 < Object.keys(data.incomes).length}
								class="p-6 border-gray-500 grid grid-cols-2"
							>
								<div class="mb-3 col-span-2 lg:col-span-1">
									<p class="text-base text-gray-400">Category</p>
									<p>{getCategoryType(key, 'income')}</p>
								</div>
								<div class="mb-3 col-span-2 lg:col-span-1">
									<p class="text-base text-gray-400">Total</p>
									<p>
										{data.incomes[key].total
											? currencyFormat(data.incomes[key].total)
											: '-'}
									</p>
								</div>
								<div class="mb-3 col-span-2">
									<a
										sveltekit:prefetch
										class="text-base"
										href="/view/transaction/{year}/{month}/income/{key}"
									>
										Show all transactions
									</a>
								</div>
							</div>
						{/each}
					{:else}
						<p class="p-6">No data...</p>
					{/if}
				</div>
			</Card>

			<!-- Expenses -->
			<Card noPadding>
				<div class="text-2xl font-black" slot="card-header">
					<ShoppingCart customClass="mr-2 inline" /> Expenses
				</div>
				<div slot="card-body">
					{#if Object.keys(data.expenses).length}
						{#each Object.keys(data.expenses) as key, index}
							<div
								class:border-b={index + 1 < Object.keys(data.expenses).length}
								class="p-6 border-gray-500 grid grid-cols-2"
							>
								<div class="mb-3 col-span-2 lg:col-span-1">
									<p class="text-base text-gray-400">Category</p>
									<p>{getCategoryType(key, 'expense')}</p>
								</div>
								<div class="mb-3 col-span-2 lg:col-span-1">
									<p class="text-base text-gray-400">Total</p>
									<p>
										{data.expenses[key].total
											? currencyFormat(data.expenses[key].total)
											: '-'}
									</p>
								</div>
								<div class="mb-3 col-span-2">
									<a
										sveltekit:prefetch
										class="text-base"
										href="/view/transaction/{year}/{month}/expense/{key}"
									>
										Show all transactions
									</a>
								</div>
							</div>
						{/each}
					{:else}
						<p class="p-6">No data...</p>
					{/if}
				</div>
			</Card>
		</div>

		<!-- Updated data -->
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
