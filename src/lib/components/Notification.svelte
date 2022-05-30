<script>
	import CheckCircle from '$lib/assets/CheckCircle.svelte';
	import ExclamationCircle from '$lib/assets/ExclamationCircle.svelte';
	export let type = '';
</script>

<style lang="postcss">
	section {
		@apply rounded border-2 text-xl p-3 my-2 flex items-center;
	}

	.success {
		@apply border-green-400;
	}

	.error {
		@apply border-red-500;
	}

	.icon {
		@apply inline mr-2;
	}
</style>

<section class={type}>
	<div class="icon">
		{#if type === 'success'}
			<CheckCircle customClass="stroke-green-400" />
		{:else if type === 'error'}
			<ExclamationCircle customClass="stroke-red-500" />
		{/if}
	</div>
	<slot />
</section>
