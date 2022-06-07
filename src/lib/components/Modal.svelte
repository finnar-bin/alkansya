<script>
	import Card from '$lib/components/Card.svelte';
	import Close from '$lib/assets/Close.svelte';

	export let isOpen = false;

	/**
	 * Closes the modal.
	 * @param e {Object} Event object
	 */
	const handleClose = (e) => {
		const { id } = e.target;

		if (id === 'overlayBackground' || id === 'closeButton') {
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
			<div slot="card-header" class="flex justify-between items-center">
				<h1 class="text-2xl font-extrabold"><slot name="modal-header" /></h1>
				<button id="closeButton" class="btn-secondary btn-outline" on:click={handleClose}>
					<Close customClass="pointer-events-none" />
				</button>
			</div>
			<div slot="card-body">
				<slot name="modal-body" />
			</div>
		</Card>
	</section>
{/if}
