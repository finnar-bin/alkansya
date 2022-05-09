<script>
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '../firebase';
	import UserForm from '$lib/components/UserForm.svelte';

	// Properties
	let errorMsg, userForm;
	let isSuccessful = null;
	let isLoading = false;

	/**
	 * Submits the user input for registration.
	 */
	async function handleSubmit(evt) {
		const { email, password } = evt.detail;
		isLoading = true;
		isSuccessful = null;

		signInWithEmailAndPassword(auth, email, password)
			.then((newUserCredential) => {
				isSuccessful = true;

				console.log('Success: ', newUserCredential.user);

				userForm.resetForm();
			})
			.catch((error) => {
				isSuccessful = false;
				errorMsg = error.code;
			})
			.finally(() => (isLoading = false));
	}
</script>

<section>
	<h1>Login</h1>

	{#if isLoading}
		<p>Loading...</p>
	{/if}

	{#if isSuccessful !== null}
		{#if isSuccessful}
			<p>User registered!</p>
		{:else}
			<p>Error!</p>
			<p>{errorMsg}</p>
		{/if}
	{/if}

	<UserForm bind:this={userForm} on:submit-input={handleSubmit} {isLoading} />
</section>
