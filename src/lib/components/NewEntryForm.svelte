<script>
	import {
		setDoc,
		doc,
		getDoc,
		updateDoc,
		collection,
		addDoc,
		arrayUnion
	} from 'firebase/firestore';
	import { INCOME_TYPES, EXPENSE_TYPES, MONTHS, YEARS } from '$lib/config/constants';
	import { db } from '$lib/firebase/client';

	/* Properties */
	let newEntry = {
		amount: '',
		creator: 'Nar',
		timestamp: new Date().toISOString(),
		description: '',
		type: '',
		year: '',
		month: ''
	};

	let isOtherType = false;
	let transactionType = '';
	let types = [];

	/**
	 * Checks if the type selected is others to show/hide
	 * the description field.
	 */
	function checkType() {
		isOtherType = newEntry.type === 'OTHERS';
	}

	/**
	 * Submits the new entry to the database.
	 */
	async function handleFormSubmit(type) {
		console.log(newEntry);
		// TODO: Replace creator with user reference
		// TODO: Migrate to api call
		const data = {
			amount: newEntry.amount,
			creator: newEntry.creator,
			description: newEntry.description,
			timestamp: newEntry.timestamp,
			type: newEntry.type
		};

		console.log(data);
		const year = newEntry.year.toString();
		const month = newEntry.month.toString();
		const monthRef = doc(db, year, month);
		const monthSnap = await getDoc(monthRef);

		if (!monthSnap.exists()) {
			const recordRef = doc(db, 'records', year);
			const recordSnap = await getDoc(recordRef);

			// If year already exists in records collection,
			// add the month. Otherwise, create the new document
			// for that year.
			if (recordSnap.exists()) {
				await updateDoc(recordRef, {
					months: arrayUnion(month)
				});
			} else {
				await setDoc(recordRef, {
					months: [month]
				});
			}
		}

		const setUpdates = await setDoc(monthRef, {
			lastUpdated: newEntry.timestamp,
			updatedBy: newEntry.creator
		});

		const addEntry = await addDoc(collection(monthRef, type), data);

		Promise.all([setUpdates, addEntry]).then(() => {
			console.log('success!');

			handleDiscardChanges();
		});
	}

	/**
	 * Discards all the user entry in the
	 * new entry form.
	 */
	function handleDiscardChanges() {
		console.log('discard triggered');
		newEntry = {
			amount: '',
			creator: 'Nar',
			timestamp: new Date().toISOString(),
			description: '',
			type: '',
			year: '',
			month: ''
		};
	}

	/**
	 * Updates the transaction type so that
	 * it will show the correct form.
	 */
	function handleTransactionType(e) {
		transactionType = e.currentTarget.value;

		if (transactionType === 'expense') {
			types = EXPENSE_TYPES;
		}

		if (transactionType === 'income') {
			types = INCOME_TYPES;
		}

		handleDiscardChanges();
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
	<label>
		Transaction Type:
		<input
			id="income"
			type="radio"
			name="transactionType"
			value="income"
			on:change={handleTransactionType}
		/>
		<label for="income">Income</label>
		<input
			id="expense"
			type="radio"
			name="transactionType"
			value="expense"
			on:change={handleTransactionType}
		/>
		<label for="expense">Expense</label>
	</label>

	{#if transactionType === ''}
		<p>Please select a transaction type...</p>
	{:else}
		<form on:submit|preventDefault={handleFormSubmit(transactionType)}>
			<label>
				Type:
				<select bind:value={newEntry.type} on:change={checkType} name="type" required>
					<option value selected disabled hidden>Select a type...</option>
					{#each types as type}
						<option value={type.value}>{type.name}</option>
					{/each}
				</select>
			</label>
			{#if isOtherType}
				<label>
					Description:
					<input
						type="text"
						name="otherDescription"
						placeholder="Description..."
						bind:value={newEntry.description}
						required
					/>
				</label>
			{/if}
			<label>
				Amount:
				<input
					type="number"
					name="amount"
					bind:value={newEntry.amount}
					placeholder="1000"
					required
				/>
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
						<option value={index + 1}>{month}</option>
					{/each}
				</select>
			</label>
			<div>
				<button type="submit">Submit</button>
				<button type="button" on:click={handleDiscardChanges}>Discard</button>
			</div>
		</form>
	{/if}
</section>
