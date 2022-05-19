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
	 * @param customFetch Fetch api to use.
	 * @returns {Object} Response object.
	 */
	const getRecords = async (customFetch) => {
		const response = await customFetch('/api/records');
		const { records } = await response.json();

		return {
			status: response.status,
			data: records,
			error: response.errorMessage
		};
	};
</script>

<script>
	import NewEntryForm from '$lib/components/NewEntryForm.svelte';
	import { MONTHS } from '$lib/config/constants';

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
	<title>Budget Tracker | Home</title>
</svelte:head>

<NewEntryForm on:new-entry={handleRefreshRecords} />

<section>
	<h1>Records</h1>
	{#await records}
		<p>Refreshing records...</p>
	{:then records}
		{#each Object.keys(records) as year}
			<p>{year}</p>
			<ul>
				{#each records[year] as month}
					<li>
						<a href="view/{year}/{month}">{MONTHS[month - 1]}</a>
					</li>
				{/each}
			</ul>
		{/each}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</section>
