<script>
	import { onMount } from 'svelte';
	import { signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import user from '$lib/stores/user';
	import { auth } from '$lib/firebase/client';
	import Navbar from '$lib/components/Navbar.svelte';
	import '../app.css';
	import '@fontsource/montserrat';

	onMount(() => user.useLocalStorage());

	let isLoading = false;

	/**
	 * Sends an api call to logut the current user.
	 */
	async function logoutUser() {
		isLoading = true;

		const logoutResponse = await fetch('/api/logout');

		if (logoutResponse.ok) {
			$user = {};

			signOut(auth)
				.then(() => goto('/login'))
				.catch((error) => console.error(error.message));
		}
	}
</script>

<Navbar username={$user.displayName} {isLoading} on:logout-clicked={logoutUser} />

<main class="px-4 relative md:px-8 md:py-6 xl:px-36 2xl:px-40">
	<div class="container">
		<slot />
	</div>
</main>
