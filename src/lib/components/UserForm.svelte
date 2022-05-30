<script>
	import { createEventDispatcher } from 'svelte';
	import Loading from '$lib/assets/Loading.svelte';

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

<style lang="postcss">
	input {
		@apply w-full;
	}
</style>

<section>
	<form on:submit|preventDefault={submit}>
		{#if !isLogin}
			<input
				placeholder="Username"
				id="username"
				type="text"
				name="username"
				bind:value={username}
				disabled={isLoading}
			/>
		{/if}

		<input
			placeholder="Email"
			id="email"
			type="email"
			name="email"
			bind:value={email}
			disabled={isLoading}
		/>
		<input
			placeholder="Password"
			id="password"
			type="password"
			name="password"
			bind:value={password}
			disabled={isLoading}
		/>
		<button
			class="btn-primary w-full flex items-center justify-center"
			type="submit"
			disabled={isLoading}
		>
			{#if isLoading}
				Submitting
				<Loading customClass="animate-spin ml-2" />
			{:else}
				Submit
			{/if}
		</button>
	</form>
</section>
