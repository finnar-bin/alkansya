<script>
	import { slide } from 'svelte/transition';
	import { quartInOut } from 'svelte/easing';
	import Close from '$lib/assets/Close.svelte';

	/* Properties */
	export let source = [];
	export let label = 'Search';
	export let name = 'searchList';
	export let placeholder = 'Type to start';
	export let required = false;
	export let disabled = true;
	export let value;
	let valueText;
	let matches = [];
	let input = '';
	let isActive = false;
	$: input, findMatch(input);

	/**
	 * Finds the relevant match based on user input
	 * @param {string} string String to match
	 */
	const findMatch = (string) => {
		if (!isActive) {
			return;
		}

		if (string.length >= 3) {
			matches = source.filter((item) =>
				item.name.toLowerCase().includes(string.toLowerCase())
			);
		} else {
			matches = source;
		}
	};

	/**
	 * Shows or hides the matches dropdown
	 * @param {boolean} show Show or hide the dropdown
	 */
	const showDropdown = (show) => {
		if (show) {
			isActive = true;
			matches = source;
		} else {
			isActive = false;
			matches = [];
		}
	};

	/**
	 * Sets the value when an item is selected on the dropdown
	 * @param {Object} e Event data object
	 */
	const handleItemSelected = (e) => {
		value = e.currentTarget.id || '';
		valueText = e.currentTarget.textContent.trim() || '';
	};

	/**
	 * Removes the currently selected value
	 */
	const handleRemoveValue = () => {
		if (!disabled) {
			value = '';
		}
	};
</script>

<section class="relative">
	<p class="text-base text-gray-400">{label}</p>
	{#if value}
		<div class="p-3 mt-2 bg-gray-500 w-fit rounded flex items-center">
			<span class:opacity-50={disabled}>{valueText}</span>
			<span
				on:click={handleRemoveValue}
				class="ml-2 cursor-pointer inline-flex"
				class:opacity-50={disabled}
			>
				<Close customClass="inline stroke-neutral-600" />
			</span>
		</div>
	{:else}
		<input
			class="!mb-0 !mt-2 cursor-pointer"
			type="text"
			bind:value={input}
			on:focus={() => showDropdown(true)}
			on:blur={() => showDropdown(false)}
			{required}
			{name}
			{placeholder}
			{disabled}
		/>
		{#if matches.length}
			<div
				transition:slide={{ duration: 500, easing: quartInOut }}
				class="absolute z-10 inset-x-0 overflow-y-auto max-h-96 bg-gray-500 rounded-b shadow-lg shadow-black/20"
			>
				<ul>
					{#each matches as match}
						<li
							on:click={handleItemSelected}
							class="px-3 cursor-pointer hover:bg-gray-600"
							id={match.value}
						>
							{match.name}
						</li>
					{/each}
				</ul>
			</div>
		{/if}
	{/if}
</section>
