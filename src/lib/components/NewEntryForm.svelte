<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { INCOME_TYPES, EXPENSE_TYPES, MONTHS, YEARS } from '$lib/config/constants';
	import user from '$lib/stores/user';
	import Plus from '$lib/assets/Plus.svelte';
	import Modal from '$lib/components/Modal.svelte';

	const dispatch = createEventDispatcher();
	onMount(() => user.useLocalStorage());

	/* Properties */
	let newEntry = {
		amount: '',
		creator: $user.displayName,
		timestamp: new Date().toISOString(),
		description: '',
		type: '',
		year: '',
		month: ''
	};
	let isOtherType = false;
	let transactionType = '';
	let types = [];
	let isLoading = false;
	let isModalOpen = false;

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
	async function handleFormSubmit() {
		isLoading = true;

		const data = {
			amount: newEntry.amount,
			creator: newEntry.creator,
			description: newEntry.description,
			timestamp: newEntry.timestamp,
			type: newEntry.type,
			year: newEntry.year,
			month: newEntry.month,
			transactionType
		};

		const newEntryResponse = await fetch('/api/entry', {
			method: 'POST',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify(data)
		});

		if (newEntryResponse.ok) {
			handleDiscardChanges();
			dispatch('new-entry');
			// TODO: Show success message
		} else {
			// TODO: Show error message
		}

		isLoading = false;
	}

	/**
	 * Discards all the user entry in the
	 * new entry form.
	 */
	function handleDiscardChanges() {
		newEntry = {
			amount: '',
			creator: $user.displayName,
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

	/**
	 * Opens the new entry modal.
	 */
	const handleOpenModal = () => {
		isModalOpen = true;
	};
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

<!-- TODO: Fix the styling and mobile layout -->
<Modal bind:isOpen={isModalOpen}>
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
				disabled={isLoading}
			/>
			<label for="income">Income</label>
			<input
				id="expense"
				type="radio"
				name="transactionType"
				value="expense"
				on:change={handleTransactionType}
				disabled={isLoading}
			/>
			<label for="expense">Expense</label>
		</label>

		{#if transactionType === ''}
			<p>Please select a transaction type...</p>
		{:else}
			<form on:submit|preventDefault={handleFormSubmit(transactionType)}>
				<label>
					Type:
					<select
						bind:value={newEntry.type}
						on:change={checkType}
						name="type"
						required
						disabled={isLoading}
					>
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
							disabled={isLoading}
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
						disabled={isLoading}
					/>
				</label>
				<label>
					Year:
					<select bind:value={newEntry.year} name="year" required disabled={isLoading}>
						<option value selected disabled hidden>Select a year...</option>
						{#each YEARS as year}
							<option value={year}>{year}</option>
						{/each}
					</select>
				</label>
				<label>
					Month:
					<select bind:value={newEntry.month} name="month" required disabled={isLoading}>
						<option value selected disabled hidden>Select a month...</option>
						{#each MONTHS as month, index}
							<option value={index + 1}>{month}</option>
						{/each}
					</select>
				</label>
				<div>
					<button type="submit" disabled={isLoading}>Submit</button>
					<button type="button" on:click={handleDiscardChanges} disabled={isLoading}
						>Discard</button
					>
				</div>
			</form>
		{/if}
	</section>
</Modal>

<div
	class="fixed inset-x-0 bottom-0 pointer-events-none flex justify-end p-4 md:px-8 md:py-6 xl:px-36 2xl:px-40"
>
	<!-- Button for mobile -->
	<button
		class="btn-primary flex rounded-full pointer-events-auto md:hidden"
		on:click={handleOpenModal}
	>
		<Plus />
	</button>

	<!-- Button for desktop -->
	<button
		class="btn-primary hidden items-center pointer-events-auto md:flex"
		on:click={handleOpenModal}
	>
		<Plus customClass="inline mr-2" />
		<span>Add New Entry</span>
	</button>
</div>
