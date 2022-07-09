<script>
	import { onMount, createEventDispatcher } from 'svelte';
	import { slide, blur } from 'svelte/transition';
	import { quartInOut } from 'svelte/easing';
	import { MONTHS, YEARS } from '$lib/config/constants';
	import user from '$lib/stores/user';
	import { expenseTypes, incomeTypes } from '$lib/stores/transaction-types';
	import Plus from '$lib/assets/Plus.svelte';
	import Loading from '$lib/assets/Loading.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import Select from '$lib/components/Select.svelte';
	import SearchList from '$lib/components/SearchList.svelte';

	const dispatch = createEventDispatcher();
	onMount(() => {
		user.useLocalStorage();

		getTransactionTypes();
	});

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
	const checkType = (type) => {
		isOtherType = type === 'OTHERS';
	};

	/**
	 * Submits the new entry to the database.
	 */
	const submitNewEntry = async () => {
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

			handleDiscardChanges(true);
			dispatch('new-entry');

			return true;
		} else {
			isLoading = false;

			throw new Error(newEntryResponse.errorMessage);
		}
	};

	/**
	 * Discards all the user entry in the new entry form.
	 * @param {boolean} all If to reset everything including the entry type or not
	 */
	const handleDiscardChanges = (all = false) => {
		newEntry = {
			amount: '',
			creator: $user.displayName,
			timestamp: new Date().toISOString(),
			description: '',
			type: '',
			year: '',
			month: ''
		};

		if (all) {
			entryType = '';
		}
	};

	/**
	 * Updates the transaction type so that
	 * it will show the correct form.
	 */
	const checkEntryType = (type) => {
		if (type === 'expense') {
			types = $expenseTypes;
		}

		if (type === 'income') {
			types = $incomeTypes;
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

	/**
	 * Sends an api call to get all the transaction types
	 */
	const getTransactionTypes = async () => {
		const response = await fetch('/api/types');
		const data = await response.json();

		if (response.ok) {
			$incomeTypes = data.incomeTypes;
			$expenseTypes = data.expenseTypes;
		}
	};
</script>

<!-- Modal -->
<Modal bind:isOpen={isModalOpen} on:close={() => handleDiscardChanges(true)}>
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
				<p class="text-base text-gray-400">Entry Type</p>
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
				<div transition:blur>
					<Notification>Select an entry type</Notification>
				</div>
			{:else}
				<form
					transition:slide={{ easing: quartInOut }}
					on:submit|preventDefault={handleSubmit}
				>
					<div class="mb-4">
						<SearchList
							label="Transaction Type"
							name="transactionType"
							source={types}
							disabled={isLoading}
							required
							bind:value={newEntry.type}
						/>
					</div>
					{#if isOtherType}
						<div class="mb-4">
							<p class="text-base text-gray-400">Description</p>
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
						<p class="text-base text-gray-400">Amount</p>
						<input
							type="number"
							name="amount"
							bind:value={newEntry.amount}
							placeholder="1000"
							required
							disabled={isLoading}
							step=".01"
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
