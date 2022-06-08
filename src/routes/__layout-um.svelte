<script>
	import Footer from '$lib/components/Footer.svelte';
	import '../app.css';
	import '@fontsource/montserrat';
</script>

<div class="flex h-screen flex-col">
	<main class="grid grow place-content-center">
		<slot />
	</main>

	<Footer />
</div>
