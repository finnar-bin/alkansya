<script context="module">
	/**
	 * Fetches prior to page rendering.
	 */
	export async function load({ fetch }) {
		// Check if there is a user logged in.
		const authResponse = await fetch('/api/auth');

		if (authResponse.ok) {
			// Get all saved records
			const records = await getRecords(fetch);

			return {
				status: records.status,
				props: {
					records: records.data
				},
				error: records.error
			};
		} else {
			return {
				status: 302,
				redirect: '/login'
			};
		}
	}

	/**
	 * Sends an api call to get all the records.
	 * @param {Function} customFetch Fetch api to use.
	 * @returns {Object} Response object.
	 */
	const getRecords = async (customFetch) => {
		const response = await customFetch('/api/records');
		const { records, errorMessage } = await response.json();

		return {
			status: response.status,
			data: records,
			error: errorMessage
		};
	};
</script>

<script>
	import NewEntryForm from '$lib/components/NewEntryForm.svelte';
	import { PAGE_TITLE } from '$lib/config/constants';
	import { getMonthString } from '$lib/utils';
	import Notification from '$lib/components/Notification.svelte';
	import Loading from '$lib/assets/Loading.svelte';
	import Card from '$lib/components/Card.svelte';
	import Calendar from '$lib/assets/Calendar.svelte';

	/* Properties */
	export let records = {};

	/**
	 * Refresh the records list.
	 * @returns {Object|Error} Records data.
	 */
	const refreshRecords = async () => {
		const records = await getRecords(fetch);

		if (records.status === 200) {
			return records.data;
		} else {
			throw new Error(records.error);
		}
	};

	/**
	 * Triggers the component to refresh the records.
	 */
	const handleRefreshRecords = () => {
		records = refreshRecords();
	};
</script>

<svelte:head>
	<title>{PAGE_TITLE} | Home</title>
</svelte:head>

<NewEntryForm on:new-entry={handleRefreshRecords} />

<section>
	<h1 class="text-2xl border-b-2 pb-2">Available Records</h1>
	<div class="pt-10 grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
		{#await records}
			<div class="flex items-center">
				<span>Refreshing records...</span>
				<Loading customClass="animate-spin ml-2" />
			</div>
		{:then records}
			{#if Object.keys(records).length}
				{#each Object.keys(records) as year}
					<Card>
						<div slot="card-header"><Calendar customClass="mr-2 inline" /> {year}</div>
						<div slot="card-body">
							<ul>
								{#each records[year] as month}
									<li>
										<a sveltekit:prefetch href="view/{year}/{month}">
											{getMonthString(month)}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					</Card>
				{/each}
			{:else}
				<p>No records...</p>
			{/if}
		{:catch error}
			<Notification type="error">{error.message}</Notification>
		{/await}
	</div>
</section>
