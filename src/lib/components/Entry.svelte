<script>
	import { createEventDispatcher } from 'svelte';
	import { currencyFormat, dateFormat } from '$lib/utils';
	import Delete from '$lib/assets/Delete.svelte';
	import Edit from '$lib/assets/Edit.svelte';
	import { EXPENSE_TYPES, INCOME_TYPES } from '$lib/config/constants';
	import Select from '$lib/components/Select.svelte';

	const dispatch = createEventDispatcher();

	export let entry = {};
	export let showBottomBorder = false;
	export let isEditMode = false;
	export let isLoading = false;
	export let type;
	let transactionTypes = [];
	let updatedValues = {
		type: '',
		amount: 0,
		description: ''
	};
	let isOtherType = false;
	$: type, setTransactionTypes(type);
	$: updatedValues.type, checkType(updatedValues.type);

	/**
	 * Sends an event to trigger the parent to delete the entry
	 * @event 'delete-entry'
	 */
	const handleDeleteTriggered = () => {
		dispatch('delete-entry');
	};

	/**
	 * Sets the edit flag to enable editing of the entry
	 */
	const handleEditEnabled = () => {
		isEditMode = true;
	};

	/**
	 * Discards the changes and closes the edit form
	 */
	const handleDiscard = () => {
		isEditMode = false;
		updatedValues = {
			type: '',
			amount: 0,
			description: ''
		};
	};

	/**
	 * Sets the transaction types for the dropdown
	 * @param type {string} Type of entry
	 */
	const setTransactionTypes = (type) => {
		if (type === 'income') {
			transactionTypes = INCOME_TYPES;
		} else if (type === 'expense') {
			transactionTypes = EXPENSE_TYPES;
		} else {
			transactionTypes = [];
		}
	};

	/**
	 * Checks if the type selected is others to show/hide
	 * the description field.
	 */
	const checkType = (type) => {
		isOtherType = type === 'OTHERS';
	};
</script>

<div class:border-b={showBottomBorder} class="border-gray-500 p-6">
	<div class="grid gap-2 grid-cols-1 lg:grid-cols-2">
		<div class="mb-3">
			{#if isEditMode}
				<Select
					label="Type"
					name="transactionType"
					required
					disabled={isLoading}
					options={transactionTypes}
					bind:value={updatedValues.type}
				/>
			{:else}
				<p class="text-base text-gray-400">Type</p>
				<p>{entry.type}</p>
			{/if}
		</div>
		<div class="mb-3">
			<p class="text-base text-gray-400">Amount</p>
			{#if isEditMode}
				<input
					type="number"
					name="amount"
					bind:value={updatedValues.amount}
					placeholder="1000"
					required
					disabled={isLoading}
				/>
			{:else}
				<p>{currencyFormat(entry.amount)}</p>
			{/if}
		</div>
		{#if entry.description && !isEditMode}
			<div class="mb-3 lg:col-span-2">
				<p class="text-base text-gray-400">Description</p>
				<p>{entry.description}</p>
			</div>
		{/if}
		{#if isOtherType && isEditMode}
			<div class="mb-3 lg:col-span-2">
				<p class="text-base text-gray-400">Description</p>
				<input
					type="text"
					name="otherDescription"
					placeholder={type === 'income' ? 'Bonus' : 'Extra expenses'}
					bind:value={updatedValues.description}
					required
					disabled={isLoading}
				/>
			</div>
		{/if}
	</div>
	<div class="grid grid-cols-1 lg:grid-cols-2">
		<div class="mb-3">
			<p class="text-base text-gray-400">Added On</p>
			<p>{dateFormat(entry.timestamp, 'date')}</p>
		</div>
		<div class="mb-3">
			<p class="text-base text-gray-400">Added By</p>
			<p>{entry.creator}</p>
		</div>
	</div>
	<div>
		{#if isEditMode}
			<button class="btn-secondary btn-outline text-base mr-2" on:click={handleDiscard}>
				Discard
			</button>
			<button class="btn-primary text-base"> Submit </button>
		{:else}
			<button class="btn-link text-base mr-2" on:click={handleEditEnabled}>
				<span class="flex items-center">
					<Edit customClass="mr-px inline" /> Edit
				</span>
			</button>
			<button class="btn-link text-base" on:click={handleDeleteTriggered}>
				<span class="flex items-center">
					<Delete customClass="mr-px inline" /> Delete
				</span>
			</button>
		{/if}
	</div>
</div>
