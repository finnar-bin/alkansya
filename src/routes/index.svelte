<script context="module">
	export async function load({ fetch }) {
		const response = await fetch('/endpoints/months');
		const parsedData = await response.json();

		if (response.ok) {
			return {
				status: response.status,
				props: {
					records: parsedData.data,
				}
			}
		}

		return {
			status: response.status,
			error: parsedData.error,
			props: {
				records: {},
			}
		}
	}
</script>

<script>
	import { TYPES } from '$lib/config/constants';

	export let records = {};

	let newEntry = {
		amount: '',
		date: new Date().toISOString(),
		description: null,
		type: '',
	};
	let isOtherType = false;

	function checkType() {
		isOtherType = newEntry.type === 'OTHERS';
	};

	function handleFormSubmit() {
		fetch('/endpoints/month', {
			method: 'POST',
			body: JSON.stringify(newEntry),
			headers: {
				'Content-Type': 'application/json',
			}
		});

		newEntry.type = '';
		newEntry.amount = '';
		newEntry.description = null;
	};
</script>

<svelte:head>
	<title>Budget Tracker | Home</title>
</svelte:head>

<section>
	<h1>Add a new transaction</h1>
	<form on:submit|preventDefault={handleFormSubmit}>
		<select bind:value={newEntry.type} on:change={checkType}>
			<option value selected disabled hidden>Select a type...</option>
			{#each TYPES as type}
				<option value={type.value}>{type.name}</option>
			{/each}
		</select>
		{#if isOtherType}
			<input type="text" name="otherDescription" placeholder="Description..." bind:value={newEntry.description} />
		{/if}
		<input type="number" name="amount" bind:value={newEntry.amount} placeholder="Enter an amount..." />
		<button type="submit">Submit</button>
	</form>
</section>

<section>
	<h1>Records</h1>
	{#each Object.keys(records) as year}
		<p>{year}</p>
		{#each records[year] as month}
			<a href='view/{year}/{month}'>{month}</a>
		{/each}
	{/each}
</section>