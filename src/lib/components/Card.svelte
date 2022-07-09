<script>
	export let noPadding = false;
	export let headless = false;
</script>

<div class="shadow-lg shadow-black/20 container h-fit">
	{#if headless}
		<div />
	{:else}
		<div class="bg-gray-600 rounded-t p-6">
			<slot name="card-header" />
		</div>
	{/if}
	<div class="bg-gray-700 rounded-b" class:p-6={!noPadding} class:rounded={headless}>
		<slot name="card-body" />
	</div>
</div>
