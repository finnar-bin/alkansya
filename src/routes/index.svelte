<script context="module">
	import { db } from '$lib/firebase/client';
	import { collection, getDocs, onSnapshot } from 'firebase/firestore';

	/**
	 * Fetches prior to page rendering.
	 */
	export async function load() {
		const recordsRef = collection(db, 'records');
		const docs = await getDocs(recordsRef);
		let records = {};

		docs.forEach((doc) => {
			const data = doc.data();

			records[doc.id] = data.months;
		});

		return {
			props: {
				records
			}
		};
	}
</script>

<script>
	import { onDestroy } from 'svelte';
	import NewEntryForm from '$lib/components/NewEntryForm.svelte';
	import { MONTHS } from '$lib/config/constants';

	/* Properties */
	export let records = {};

	const recordsRef = collection(db, 'records');

	// Listens for any update on the records collection.
	const unsubscribe = onSnapshot(recordsRef, (recordSnap) => {
		recordSnap.forEach((doc) => {
			records[doc.id] = doc.data().months;
		});
	});

	onDestroy(() => unsubscribe());
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
					<a href="view/{year}/{month}">{MONTHS[month - 1]}</a>
				</li>
			{/each}
		</ul>
	{/each}
</section>
