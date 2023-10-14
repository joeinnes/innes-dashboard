<script>
	import { enhance } from '$app/forms';
	let credentials = {
		email: '',
		password: ''
	};
</script>

<main class="flex flex-col h-screen items-center justify-center">
	<div class="card p-8">
		<h1 class="h2 mb-2">Log In</h1>
		<form method="post" use:enhance>
			<label class="label" for="email"> Email </label>
			<input type="text" name="email" bind:value={credentials.email} class="input" />

			<label class="label" for="password">Password</label>
			<input type="password" name="password" bind:value={credentials.password} class="input mb-2" />
			<button type="submit" class="btn variant-filled">Save</button>
		</form>
	</div>
</main>

<style lang="postcss">
	.input {
		@apply px-2 py-1;
	}
</style>
