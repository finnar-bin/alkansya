<script context="module">
	import { db } from '$lib/firebase/client';
	import { collection, onSnapshot } from 'firebase/firestore';

	/**
	 * Fetches prior to page rendering.
	 */
	export async function load({ fetch }) {
		// Check if there is a user logged in.
		const authResponse = await fetch('/api/auth');

		if (authResponse.ok) {
			return {
				status: 200,
				props: {}
			};
		} else {
			return {
				status: 302,
				redirect: '/login'
			};
		}
		// const recordsRef = collection(db, 'records');
		// const docs = await getDocs(recordsRef);
		// let records = {};

		// docs.forEach((doc) => {
		// 	const data = doc.data();

		// 	records[doc.id] = data.months;
		// });
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
