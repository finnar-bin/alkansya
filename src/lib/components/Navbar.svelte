<script>
	import { createEventDispatcher } from 'svelte';
	import BurgerMenu from '$lib/assets/BurgerMenu.svelte';
	import Close from '$lib/assets/Close.svelte';
	import Cash from '$lib/assets/Cash.svelte';
	import { PAGE_TITLE } from '$lib/config/constants';

	export let username;
	export let isLoading = false;
	let hideMenu = true;

	const dispatch = createEventDispatcher();

	/**
	 * Dispatches an event to logout the user.
	 * @event 'logout-clicked'
	 */
	const handleLogout = () => {
		dispatch('logout-clicked');
	};

	/**
	 * Show/hides the mobile menu.
	 */
	const handleTriggerMenu = () => (hideMenu = !hideMenu);
</script>

<!-- Regular navbar -->
<header class="bg-slate-700 shadow-lg shadow-black/20 hidden px-8 py-4 md:block xl:px-36 2xl:px-40">
	<div class="flex justify-between items-center">
		<h1 class="text-5xl">{PAGE_TITLE} <Cash customClass="inline w-12 h-12" /></h1>
		<div>
			<span>👋 Hello, {username || '- '}!</span>
			<button
				class="ml-4 btn-secondary btn-outline"
				on:click={handleLogout}
				disabled={isLoading}>Log out</button
			>
		</div>
	</div>
</header>

<!-- Burger menu navbar -->
<div
	class="
	absolute 
	transition-all 
	duration-500 
	bg-slate-700 
	w-screen
	h-screen
	z-10
	{hideMenu ? 'right-full' : 'right-0'}
	md:hidden"
>
	<div class="px-2">
		<button on:click={handleTriggerMenu}><Close /></button>
	</div>
	<div class="px-4 flex flex-col">
		<div class="text-4xl mt-6 mb-12">
			{PAGE_TITLE}
			<Cash customClass="inline w-8 h-8" />
		</div>
		<div class="mb-3">👋 Hello, {username || '- '}!</div>
		<div>
			<button class="btn-secondary btn-outline" on:click={handleLogout} disabled={isLoading}>
				Logout
			</button>
		</div>
	</div>
</div>
<header class="block px-2 md:hidden">
	<button on:click={handleTriggerMenu}><BurgerMenu /></button>
</header>
