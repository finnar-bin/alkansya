<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { INCOME_TYPES, EXPENSE_TYPES, MONTHS, YEARS } from '$lib/config/constants';
	import user from '$lib/stores/user';
	import Plus from '$lib/assets/Plus.svelte';
	import Loading from '$lib/assets/Loading.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import Select from '$lib/components/Select.svelte';

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
	let entryType = '';
	let types = [];
	let isLoading = false;
	let isModalOpen = false;
	let newEntrySubmission = {};
	$: newEntry.type, checkType(newEntry.type);
	$: entryType, checkEntryType(entryType);

	/**
	 * Checks if the type selected is others to show/hide
	 * the description field.
	 */
	function checkType(type) {
		isOtherType = type === 'OTHERS';
	}

	/**
	 * Submits the new entry to the database.
	 */
	async function submitNewEntry() {
		isLoading = true;

		const data = {
			amount: newEntry.amount,
			creator: newEntry.creator,
			description: newEntry.description,
			timestamp: newEntry.timestamp,
			type: newEntry.type,
			year: newEntry.year,
			month: newEntry.month,
			entryType
		};

		const newEntryResponse = await fetch('/api/entry', {
			method: 'POST',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify(data)
		});

		if (newEntryResponse.ok) {
			isLoading = false;
			isModalOpen = false;
			entryType = '';

			handleDiscardChanges();
			dispatch('new-entry');

			return true;
		} else {
			isLoading = false;

			throw new Error(newEntryResponse.errorMessage);
		}
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
	const checkEntryType = (type) => {
		if (type === 'expense') {
			types = EXPENSE_TYPES;
		}

		if (type === 'income') {
			types = INCOME_TYPES;
		}

		handleDiscardChanges();
	};

	/**
	 * Opens the new entry modal.
	 */
	const handleOpenModal = () => {
		isModalOpen = true;
	};

	/**
	 * Triggers a new entry submission.
	 */
	const handleSubmit = () => {
		newEntrySubmission = submitNewEntry();
	};
</script>

<style lang="postcss">
	.label {
		@apply text-base text-gray-400;
	}
</style>

<!-- Modal -->
<Modal bind:isOpen={isModalOpen}>
	<section slot="modal-header">New Transaction</section>
	<section slot="modal-body">
		<div class="w-full md:w-96">
			{#await newEntrySubmission}
				<span />
			{:catch error}
				<Notification type="error">
					{error.message}
				</Notification>
			{/await}
			<div class="mb-4">
				<p class="label">Entry Type</p>
				<label class="mr-6">
					<input
						id="income"
						type="radio"
						name="entryType"
						value="income"
						bind:group={entryType}
						disabled={isLoading}
						required
					/>
					Income
				</label>
				<label>
					<input
						id="expense"
						type="radio"
						name="entryType"
						value="expense"
						bind:group={entryType}
						disabled={isLoading}
						required
					/>
					Expense
				</label>
			</div>

			{#if entryType === ''}
				<Notification>Select an entry type</Notification>
			{:else}
				<form on:submit|preventDefault={handleSubmit}>
					<div class="mb-4">
						<Select
							label="Transaction Type"
							name="transactionType"
							required
							disabled={isLoading}
							options={types}
							bind:value={newEntry.type}
						/>
					</div>
					{#if isOtherType}
						<div class="mb-4">
							<p class="label">Description</p>
							<input
								type="text"
								name="otherDescription"
								placeholder={entryType === 'income' ? 'Bonus' : 'Extra expenses'}
								bind:value={newEntry.description}
								required
								disabled={isLoading}
							/>
						</div>
					{/if}
					<div class="mb-4">
						<p class="label">Amount</p>
						<input
							type="number"
							name="amount"
							bind:value={newEntry.amount}
							placeholder="1000"
							required
							disabled={isLoading}
						/>
					</div>
					<div class="mb-4">
						<Select
							label="Year"
							name="year"
							required
							disabled={isLoading}
							options={YEARS}
							bind:value={newEntry.year}
						/>
					</div>
					<div class="mb-4">
						<Select
							label="Month"
							name="month"
							required
							disabled={isLoading}
							options={MONTHS}
							bind:value={newEntry.month}
						/>
					</div>
					<div class="text-right">
						<button
							class="btn-secondary btn-outline mr-2"
							type="button"
							on:click={handleDiscardChanges}
							disabled={isLoading}
						>
							Discard
						</button>
						<button class="btn-primary" type="submit" disabled={isLoading}>
							<span class="flex items-center justify-center">
								{#if isLoading}
									Submitting
									<Loading customClass="animate-spin ml-2" />
								{:else}
									Submit
								{/if}
							</span>
						</button>
					</div>
				</form>
			{/if}
		</div>
	</section>
</Modal>

<!-- Floating button -->
<div
	class="fixed inset-x-0 bottom-0 pointer-events-none flex justify-end p-4 md:px-8 md:py-6 xl:px-36 2xl:px-40"
>
	<!-- Button for mobile -->
	<button
		class="btn-primary p-4 flex rounded-full pointer-events-auto md:hidden"
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
