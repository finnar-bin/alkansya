<script>
	import { createEventDispatcher } from 'svelte';
	import ChevronDown from '$lib/assets/ChevronDown.svelte';

	export let label;
	export let value;
	export let disabled = false;
	export let required = false;
	export let name;
	export let options = [];

	const dispatch = createEventDispatcher();

	/**
	 * Dispatches an event when value has changed.
	 * @event 'value-changed'
	 */
	const handleValueChanged = () => {
		dispatch('value-changed', {
			value
		});
	};
</script>

<section>
	<p class="text-base text-gray-400">{label}</p>
	<div class="relative">
		<select bind:value {name} {required} {disabled} on:change={handleValueChanged}>
			<option class="text-yellow-50/50" value selected disabled hidden>---</option>
			{#each options as option}
				{#if typeof option === 'object'}
					<option value={option.value}>{option.name}</option>
				{:else}
					<option value={option}>{option}</option>
				{/if}
			{/each}
		</select>
		<div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
			<ChevronDown />
		</div>
	</div>
</section>
