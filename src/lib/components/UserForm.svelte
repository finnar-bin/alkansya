<script>
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	// Properties
	export let isLoading = false;
	export let isLogin = false;
	let email, password, username;

	/**
	 * Dispatches an event to submit the user input.
	 * @event 'submit-input'
	 */
	function submit() {
		dispatch('submit-input', {
			email,
			password,
			username
		});
	}

	/**
	 * Resets the form data.
	 */
	export function resetForm() {
		email = '';
		password = '';
		username = '';
	}
</script>

<section>
	<form on:submit|preventDefault={submit}>
		{#if !isLogin}
			<label>
				Username:
				<input type="text" name="username" bind:value={username} disabled={isLoading} />
			</label>
		{/if}
		<label>
			Email:
			<input type="email" name="email" bind:value={email} disabled={isLoading} />
		</label>
		<label>
			Password:
			<input type="password" name="password" bind:value={password} disabled={isLoading} />
		</label>
		<button type="submit" disabled={isLoading}> Submit </button>
	</form>
</section>
