<script context="module">
	import { initFirebase } from '../firebase';

	/**
	 * Initializes firebase on web app start up.
	 */
	export async function load() {
		await initFirebase();

		return {
			props: {}
		};
	}
</script>

<slot />
