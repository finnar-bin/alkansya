<script>
	import user from '$lib/stores/user';
</script>

<header>
	<span>Hello {$user.displayName}</span>
	<button>Log out</button>
</header>

<slot />
