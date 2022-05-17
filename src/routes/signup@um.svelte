<script>
	import UserForm from '$lib/components/UserForm.svelte';

	// Properties
	let userForm, newUserData;
	let isLoading = false;

	/**
	 * Submits the user input for registration.
	 * @param email {string} User email address.
	 * @param password {string} User password.
	 * @param username {string} User display name.
	 * @returns {string} If successful returns registered email address,
	 * else returns error message.
	 */
	async function submitUserData(email, password, username) {
		isLoading = true;
		const signupResponse = await fetch('/api/signup', {
			method: 'POST',
			headers: new Headers({ 'content-type': 'application/json' }),
			body: JSON.stringify({ email, password, username })
		});
		const signupResponseData = await signupResponse.json();

		isLoading = false;

		if (signupResponse.ok) {
			// TODO: Login to client with customToken then redirect to /
			userForm.resetForm();

			return signupResponseData.email;
		} else {
			throw new Error(signupResponseData.errorMessage);
		}
	}

	/**
	 * Handles the event when submit is clicked.
	 * @param evt {Object} Event data object.
	 */
	function handleSubmit(evt) {
		const { email, password, username } = evt.detail;

		newUserData = submitUserData(email, password, username);
	}
</script>

<section>
	<h1>Sign up for a new account</h1>

	{#await newUserData}
		<p>Loading...</p>
	{:then user}
		{#if user}
			<p>Successfully registered {user}</p>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}

	<UserForm bind:this={userForm} on:submit-input={handleSubmit} {isLoading} />
	<a href="/login">Already have an account?</a>
</section>
