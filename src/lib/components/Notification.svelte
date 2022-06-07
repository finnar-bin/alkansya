<script>
	import CheckCircle from '$lib/assets/CheckCircle.svelte';
	import ExclamationCircle from '$lib/assets/ExclamationCircle.svelte';
	import Bulb from '$lib/assets/Bulb.svelte';

	export let type = '';
</script>

<style lang="postcss">
	.success {
		@apply border-green-400;
	}

	.error {
		@apply border-red-500;
	}
</style>

<section class="rounded border-2 border-sky-400 text-xl p-3 my-2 flex items-center {type}">
	<div class="inline mr-2">
		{#if type === 'success'}
			<CheckCircle customClass="stroke-green-400" />
		{:else if type === 'error'}
			<ExclamationCircle customClass="stroke-red-500" />
		{:else}
			<Bulb customClass="stroke-sky-400" />
		{/if}
	</div>
	<slot />
</section>
