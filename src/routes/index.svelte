<script>
	import { TYPES } from '../config/constants';

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
		console.log(newEntry);

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
	<title>Home</title>
</svelte:head>

<section>
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