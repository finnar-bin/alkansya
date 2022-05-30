<script>
	import { onMount } from 'svelte';
	import { signInWithCustomToken } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/client';
	import user from '$lib/stores/user';
	import UserForm from '$lib/components/UserForm.svelte';
	import Card from '$lib/components/Card.svelte';
	import Notification from '$lib/components/Notification.svelte';

	onMount(() => user.useLocalStorage());

	// Properties
	let loginData;
	let isLoading = false;

	/**
	 * Submits the user input for registration.
	 */
	async function loginUser(email, password) {
		isLoading = true;

		const loginUserResponse = await fetch('/api/auth', {
			method: 'POST',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({ email, password })
		});

		if (loginUserResponse.ok) {
			const { customToken } = await loginUserResponse.json();

			try {
				const clientSignInResponse = await signInWithCustomToken(auth, customToken);
				isLoading = false;
				$user = clientSignInResponse.user;

				goto('/');
			} catch (error) {
				throw new Error(error.message);
			}
		} else {
			isLoading = false;

			throw new Error('User not found or incorrect password.');
		}
	}

	/**
	 * Handles event when login is cliked.
	 * @param evt {Object} Event data object.
	 */
	function handleSubmit(evt) {
		const { email, password } = evt.detail;

		loginData = loginUser(email, password);
	}
</script>

<style lang="postcss">
	section {
		@apply h-screen grid place-content-center;
	}

	h1 {
		@apply text-5xl;
	}
</style>

<section>
	<Card>
		<div slot="card-header">
			<h1>Login</h1>
		</div>
		<div slot="card-body">
			{#await loginData}
				<p>Loading...</p>
			{:catch error}
				<Notification type="error">
					{error.message}
				</Notification>
			{/await}

			<UserForm on:submit-input={handleSubmit} {isLoading} isLogin />

			<p>Not registered? <a href="/signup">Sign up here!</a></p>
		</div>
	</Card>
</section>
