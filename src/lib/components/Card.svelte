<style lang="postcss">
	.card {
		@apply rounded shadow-lg shadow-black/20 max-w-xs overflow-auto sm:max-w-sm md:max-w-2xl;
	}

	.card .header {
		@apply bg-gray-600 p-6;
	}

	.card .body {
		@apply bg-gray-700 p-6;
	}
</style>

<div class="card">
	<div class="header">
		<slot name="card-header" />
	</div>
	<div class="body">
		<slot name="card-body" />
	</div>
</div>
