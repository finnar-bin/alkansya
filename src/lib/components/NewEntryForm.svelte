<script>
    import { setDoc, doc, getDoc, updateDoc, increment, collection, addDoc, arrayUnion } from 'firebase/firestore';
	import { TYPES, MONTHS, YEARS } from '$lib/config/constants';
    import { db } from '../../firebase';

    /* Properties */
    let newEntry = {
		amount: '',
		timestamp: new Date().toISOString(),
		description: '',
		type: '',
        year: '',
        month: '',
	};
	let isOtherType = false;

    /**
     * Checks if the type selected is others to show/hide
     * the description field.
     */
	function checkType() {
		isOtherType = newEntry.type === 'OTHERS';
	};

    /**
     * Submits the new entry to the database.
     */
	async function handleFormSubmit() {
        const newExpenseData = {
            amount: newEntry.amount,
            description: newEntry.description,
            timestamp: newEntry.timestamp,
            type: newEntry.type,
        };
        const year = newEntry.year.toString();
        const month = newEntry.month.toString();
        const monthRef = doc(db, year, month);
        const monthSnap = await getDoc(monthRef);

        // Only increment the total expenses when month already
        // exists. Otherwise, create a new collection & add it
        // to the `records` collection.
        if (monthSnap.exists()) {
            await updateDoc(monthRef, {
                totalExpenses: increment(newEntry.amount)
            });
        } else {
            await setDoc(monthRef, {
                totalExpenses: newEntry.amount,
            });

            const recordRef = doc(db, 'records', year);
            const recordSnap = await getDoc(recordRef);

            // If year already exists in records collection,
            // add the month. Otherwise, create the new document
            // for that year.
            if (recordSnap.exists()) {
                await updateDoc(recordRef, {
                    months: arrayUnion(month)
                })
            } else {
                await setDoc(recordRef, {
                    months: [month]
                });
            }
        }

        // Add/update the expenses for that month
        await addDoc(collection(monthRef, 'expenses'), newExpenseData);
 
		handleDiscardChanges();
	};

    /**
     * Discards all the user entry in the
     * new entry form.
     */
    function handleDiscardChanges() {
        newEntry = {
            amount: '',
            timestamp: new Date().toISOString(),
            description: '',
            type: '',
            year: '',
            month: '',
        };
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
            <button type="button" on:click={handleDiscardChanges}>Discard</button>
        </div>
	</form>
</section>