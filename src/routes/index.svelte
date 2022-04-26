<script context="module">
	import { db } from '../firebase';
	import { collection, getDocs } from 'firebase/firestore';

	/**
	 * Fetches prior to page rendering.
	 */
	export async function load() {
		const recordsRef = collection(db, 'records');
		const docs = await getDocs(recordsRef);
		let records = {};

		docs.forEach(doc => {
			const data = doc.data();

			records[doc.id] = data.months;
		});

		return {
			props: {
				records
			}
		}
	}
</script>

<script>
	import NewEntryForm from '$lib/components/NewEntryForm.svelte';

	/* Properties */
	export let records = {};
</script>

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
					<a href='view/{year}/{month}'>{month}</a>
				</li>
			{/each}
		</ul>
	{/each}
</section>