<script>
	import Card from '$lib/components/Card.svelte';

	export let isOpen = false;

	/**
	 * Closes the modal.
	 * @param e {Object} Event object
	 */
	const handleClose = (e) => {
		const { id } = e.target;

		if (id === 'overlayBackground') {
			isOpen = false;
		}
	};
</script>

{#if isOpen}
	<section
		id="overlayBackground"
		class="fixed 
		inset-0 
		bg-black/90 
		z-20 
		grid 
		place-content-center"
		on:click={handleClose}
	>
		<Card>
			<h1 slot="card-header">test</h1>
			<div slot="card-body">
				<slot />
			</div>
		</Card>
	</section>
{/if}
