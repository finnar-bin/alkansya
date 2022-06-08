<script>
	import { onMount } from 'svelte';
	import { signInWithCustomToken } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { auth } from '$lib/firebase/client';
	import user from '$lib/stores/user';
	import UserForm from '$lib/components/UserForm.svelte';
	import Card from '$lib/components/Card.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { PAGE_TITLE } from '$lib/config/constants';

	onMount(() => user.useLocalStorage());

	// Properties
	let loginData;
	let isLoading = false;

	/**
	 * Submits the user input for registration.
	 */
	const loginUser = async (email, password) => {
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

				return true;
			} catch (error) {
				throw new Error(error.message);
			}
		} else {
			isLoading = false;

			throw new Error('User not found or incorrect password.');
		}
	};

	/**
	 * Handles event when login is cliked.
	 * @param evt {Object} Event data object.
	 */
	const handleSubmit = (evt) => {
		const { email, password } = evt.detail;

		loginData = loginUser(email, password);
	};
</script>

<style lang="postcss">
	h1 {
		@apply text-5xl;
	}
</style>

<svelte:head>
	<title>{PAGE_TITLE} | Login</title>
</svelte:head>

<section>
	<Card>
		<div slot="card-header">
			<h1>Login</h1>
		</div>
		<div slot="card-body">
			{#await loginData}
				<span />
			{:then status}
				{#if status}
					<Notification type="success">
						Login successful. Redirecting to the homepage.
					</Notification>
				{/if}
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
