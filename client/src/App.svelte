<script>
	import { onMount } from 'svelte';
	import { Router, Route } from 'svelte-routing';
	import MainPage from './pages/main.svelte';
	import Pricing from './pages/pricing.svelte';
	import NavBar from './components/navbar.svelte';

	let userLoggedIn = false;

	async function isUserLoggedIn() {
		try {
			let response = await fetch('/api/current_user');
			if (response.ok) {
				userLoggedIn = await response.json();
				userLoggedIn = userLoggedIn.loggedIn;
				console.log(userLoggedIn);
			}
		} catch(error) {
			console.log(error);
		}
	};
	onMount(isUserLoggedIn);
</script>

<main class={`bg-white w-[100%]`}>
	<Router>
		<NavBar showLoggedIn={userLoggedIn} />
		<Route path="/" exact>
			<MainPage loggedIn={userLoggedIn} />
		</Route>
		<Route path="/pricing">
			<div class="flex items-center justify-center min-h-screen">
				<Pricing />
			</div>
		</Route>
	</Router>
</main>

<style>
</style>
