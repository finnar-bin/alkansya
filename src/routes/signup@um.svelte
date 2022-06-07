<script>
	import UserForm from '$lib/components/UserForm.svelte';
	import Card from '$lib/components/Card.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import { PAGE_TITLE } from '$lib/config/constants';

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

<style lang="postcss">
	section {
		@apply h-screen grid place-content-center;
	}

	h1 {
		@apply text-5xl;
	}
</style>

<svelte:head>
	<title>{PAGE_TITLE} | Signup</title>
</svelte:head>

<section>
	<Card>
		<div slot="card-header">
			<h1>Sign Up</h1>
		</div>
		<div slot="card-body">
			{#await newUserData}
				<span />
			{:then user}
				{#if user}
					<Notification type="success">
						Successfully registered {user}
					</Notification>
				{/if}
			{:catch error}
				<Notification type="error">
					{error.message}
				</Notification>
			{/await}

			<UserForm bind:this={userForm} on:submit-input={handleSubmit} {isLoading} />
			<a href="/login">Already have an account?</a>
		</div>
	</Card>
</section>
