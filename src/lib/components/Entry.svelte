<script>
	import { createEventDispatcher } from 'svelte';
	import { currencyFormat, dateFormat } from '$lib/utils';
	import Delete from '$lib/assets/Delete.svelte';
	import Edit from '$lib/assets/Edit.svelte';

	const dispatch = createEventDispatcher();

	export let entry = {};
	export let showBottomBorder = false;

	const handleDeleteTriggered = () => {
		dispatch('delete-entry');
	};
</script>

<div class:border-b={showBottomBorder} class="border-gray-500 p-6">
	<div class="grid grid-cols-1 lg:grid-cols-2">
		<div class="mb-3">
			<p class="text-base text-gray-400">Type</p>
			<p>{entry.type}</p>
		</div>
		<div class="mb-3">
			<p class="text-base text-gray-400">Amount</p>
			<p>{currencyFormat(entry.amount)}</p>
		</div>
		{#if entry.description}
			<div class="mb-3 lg:col-span-2">
				<p class="text-base text-gray-400">Description</p>
				<p>{entry.description}</p>
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
		<button class="btn-link text-base mr-2">
			<span class="flex items-center">
				<Edit customClass="mr-px inline" /> Edit
			</span>
		</button>
		<button class="btn-link text-base" on:click={handleDeleteTriggered}>
			<span class="flex items-center">
				<Delete customClass="mr-px inline" /> Delete
			</span>
		</button>
	</div>
</div>
