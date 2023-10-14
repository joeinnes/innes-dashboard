<script>
	/*import { onMount } from 'svelte';

	onMount(() => {
		window.location.href = '/';
	});*/

	import { page } from '$app/stores';
</script>

<main class="h-screen flex flex-col justify-center items-center">
	<div class="card p-8">
		<h1 class="h2 mb-4">Something went wrong</h1>
		<p>{$page.error?.message}</p>
		{#if $page.error?.code === 'BAD_CREDS'}
			<a href="/login" class="anchor">Try logging in?</a>
		{/if}
	</div>
</main>
