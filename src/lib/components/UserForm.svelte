<script>
	import { createEventDispatcher } from 'svelte';
	import Loading from '$lib/assets/Loading.svelte';

	const dispatch = createEventDispatcher();

	// Properties
	export let isLoading = false;
	export let isLogin = false;
	let email, password, displayName;

	/**
	 * Dispatches an event to submit the user input.
	 * @event 'submit-input'
	 */
	function submit() {
		dispatch('submit-input', {
			email,
			password,
			displayName
		});
	}

	/**
	 * Resets the form data.
	 */
	export function resetForm() {
		email = '';
		password = '';
		displayName = '';
	}
</script>

<section>
	<form on:submit|preventDefault={submit}>
		{#if !isLogin}
			<input
				placeholder="Display Name"
				id="displayName"
				type="text"
				name="displayName"
				bind:value={displayName}
				disabled={isLoading}
				required
			/>
		{/if}

		<input
			placeholder="Email"
			id="email"
			type="email"
			name="email"
			bind:value={email}
			disabled={isLoading}
			required
		/>
		<input
			placeholder="Password"
			id="password"
			type="password"
			name="password"
			bind:value={password}
			disabled={isLoading}
			required
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
