<script>
	import { goto } from '$app/navigation';
	import UserForm from '$lib/components/UserForm.svelte';

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

		isLoading = false;

		if (loginUserResponse.ok) {
			// TODO: Login the user to firebase client
			goto('/');
		} else {
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

<section>
	<h1>Login</h1>

	{#await loginData}
		<p>Loading...</p>
	{:catch error}
		<p>{error.message}</p>
	{/await}

	<UserForm on:submit-input={handleSubmit} {isLoading} isLogin />

	<p>Not registered? <a href="/signup">Sign up here!</a></p>
</section>
