<script context="module">
	/**
	 * Fetches prior to page rendering.
	 */
	export async function load({ fetch }) {
		// Check if there is a user logged in.
		const authResponse = await fetch('/api/auth');

		if (authResponse.ok) {
			// Get all saved records
			const recordsResponse = await fetch('/api/records');

			if (recordsResponse.ok) {
				const { records } = await recordsResponse.json();

				return {
					status: 200,
					props: {
						records
					}
				};
			} else {
				return {
					status: recordsResponse.status,
					error: recordsResponse.errorMessage
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
	import NewEntryForm from '$lib/components/NewEntryForm.svelte';
	import { MONTHS } from '$lib/config/constants';

	/* Properties */
	export let records = {};
</script>

// TODO: Refetch data when new entry submitted
<svelte:head>
	<title>Budget Tracker | Home</title>
</svelte:head>

<NewEntryForm />

<section>
	<h1>Records</h1>
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
</section>
