<script>
	export let noPadding = false;
</script>

<div class="shadow-lg shadow-black/20 container h-fit">
	<div class="bg-gray-600 rounded-t p-6">
		<slot name="card-header" />
	</div>
	<div class="bg-gray-700 rounded-b" class:p-6={!noPadding}>
		<slot name="card-body" />
	</div>
</div>
