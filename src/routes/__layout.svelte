<script>
	import { onMount } from 'svelte';
	import { signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import user from '$lib/stores/user';
	import { auth } from '$lib/firebase/client';
	import '../app.css';

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

<header>
	<span>Hello, {$user.displayName}!</span>
	<button on:click={logoutUser} disabled={isLoading}>Log out</button>
</header>

<slot />
