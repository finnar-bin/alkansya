<script>
	// import { createUserWithEmailAndPassword } from 'firebase/auth';
	// import { auth } from '../firebase';
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
		// isLoading = true;
		// isSuccessful = null;

		// createUserWithEmailAndPassword(auth, email, password)
		// 	.then((newUserCredential) => {
		// 		isSuccessful = true;

		// 		console.log('Success: ', newUserCredential.user);

		// 		userForm.resetForm();
		// 	})
		// 	.catch((error) => {
		// 		isSuccessful = false;
		// 		errorMsg = error.code;
		// 	})
		// 	.finally(() => (isLoading = false));

		const signupResponse = await fetch('/api/signup', {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			body: JSON.stringify({ email, password })
		});

		console.log(signupResponse);
	}
</script>

<section>
	<h1>Sign up for a new account</h1>

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
	<a href="/login">Already have an account?</a>
</section>
