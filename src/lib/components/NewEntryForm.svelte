<script>
	import { TYPES, MONTHS, YEARS } from '$lib/config/constants';

    let newEntry = {
		amount: '',
		timestamp: new Date().toISOString(),
		description: null,
		type: '',
        year: '',
        month: '',
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

    function handleDiscardChanges() {

    }
</script>

<style>
    form {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
    }

    button {
        width: fit-content;
    }
</style>

<section>
	<h1>Add a new transaction</h1>
	<form on:submit|preventDefault={handleFormSubmit}>
        <label>
            Transaction type:
            <select bind:value={newEntry.type} on:change={checkType} name="type" required>
                <option value selected disabled hidden>Select a type...</option>
                {#each TYPES as type}
                    <option value={type.value}>{type.name}</option>
                {/each}
            </select>
        </label>
		{#if isOtherType}
            <label>
                Description:
                <input type="text" name="otherDescription" placeholder="Description..." bind:value={newEntry.description} required />
            </label>
		{/if}
        <label>
            Amount:
            <input type="number" name="amount" bind:value={newEntry.amount} placeholder="1000" required />
        </label>
        <label>
            Year:
            <select bind:value={newEntry.year} name="year" required>
                <option value selected disabled hidden>Select a year...</option>
                {#each YEARS as year}
                    <option value={year}>{year}</option>
                {/each}
            </select>
        </label>
        <label>
            Month:
            <select bind:value={newEntry.month} name="month" required>
                <option value selected disabled hidden>Select a month...</option>
                {#each MONTHS as month, index}
                    <option value={index+1}>{month}</option>
                {/each}
            </select>
        </label>
        <div>
            <button type="submit">Submit</button>
            <button on:click={handleDiscardChanges}>Discard</button>
        </div>
	</form>
</section>