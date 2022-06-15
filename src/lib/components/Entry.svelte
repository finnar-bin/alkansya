<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { currencyFormat, dateFormat } from '$lib/utils';
	import Delete from '$lib/assets/Delete.svelte';
	import Edit from '$lib/assets/Edit.svelte';

	const dispatch = createEventDispatcher();

	onMount(() => {
		// Keep original copy of values
		originalValues = JSON.parse(JSON.stringify(entry));
	});

	export let entry = {
		amount: 0,
		creator: '',
		description: '',
		id: '',
		timestamp: '',
		type: ''
	};
	export let isEditMode = false;
	export let isLoading = false;
	let isOtherType = false;
	let originalValues = {};
	$: entry.type, checkType(entry.type);

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
		entry = originalValues;
	};

	/**
	 * Dispatches an event to trigger an entry update
	 * @event 'update-entry'
	 */
	const handleSubmit = () => {
		const payload = {
			amount: entry.amount,
			description: entry.description
		};

		dispatch('update-entry', payload);

		handleDiscard();
	};

	/**
	 * Checks if the type selected is others to show/hide
	 * the description field.
	 */
	const checkType = (type) => {
		isOtherType = type === 'OTHERS';
	};
</script>

<form on:submit|preventDefault={handleSubmit} class="border-gray-500 p-6">
	<div class="grid gap-4 grid-cols-1 lg:grid-cols-2">
		<!-- Description -->
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
					placeholder={entry.type === 'income' ? 'Bonus' : 'Extra expenses'}
					bind:value={entry.description}
					required
					disabled={isLoading}
				/>
			</div>
		{/if}

		<!-- Amount -->
		<div class="mb-3">
			<p class="text-base text-gray-400">Amount</p>
			{#if isEditMode}
				<input
					type="number"
					name="amount"
					bind:value={entry.amount}
					placeholder="1000"
					required
					disabled={isLoading}
					step=".01"
				/>
			{:else}
				<p>{currencyFormat(entry.amount)}</p>
			{/if}
		</div>

		<!-- Timestamp -->
		<div class="mb-3">
			<p class="text-base text-gray-400">Added On</p>
			<p>{dateFormat(entry.timestamp, 'date')}</p>
		</div>

		<!-- Creator -->
		<div class="mb-3">
			<p class="text-base text-gray-400">Added By</p>
			<p>{entry.creator}</p>
		</div>
	</div>
	<div>
		{#if isEditMode}
			<button
				type="button"
				class="btn-secondary btn-outline text-base mr-2"
				on:click={handleDiscard}
			>
				Discard
			</button>
			<button type="submit" class="btn-primary text-base"> Submit </button>
		{:else}
			<button type="button" class="btn-link text-base mr-2" on:click={handleEditEnabled}>
				<span class="flex items-center">
					<Edit customClass="mr-px inline" /> Edit
				</span>
			</button>
			<button type="button" class="btn-link text-base" on:click={handleDeleteTriggered}>
				<span class="flex items-center">
					<Delete customClass="mr-px inline" /> Delete
				</span>
			</button>
		{/if}
	</div>
</form>
