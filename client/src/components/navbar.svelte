<script>
	let showNav = false;
	export let showLoggedIn = false;

	function handleMenu() {
		showNav = !showNav;
	}
</script>

<nav class="bg-purple h-10 w-full text-white no-underline fixed">
		<input type="checkbox" id="check" on:change={handleMenu} hidden />
		<label for="check" class="hover:cursor-pointer float-right text-3xl mr-12 lg:hidden"><i class="fas fa-bars"></i></label>
		<label for="id" class="pl-12 md:pl-12 md:text-4xl text-3xl font-mono hover:cursor-pointer"><a href="/">doksum.ai</a></label>
		<ul class={showNav ? `fixed float-right mr-12 lg:flex leading-loose space-x-4 font-sans lg:relative h-[100vh] lg:h-0 w-[100%] lg:w-fit top-10 lg:top-0 left-[0px] lg:left-0 transition-all duration-300 lg:transition-none text-center bg-yellow` : `fixed float-right mr-12 lg:flex leading-loose space-x-4 font-sans lg:relative h-[100vh] lg:h-0 w-[100%] lg:w-fit top-10 lg:top-0 left-[-100%] lg:left-0 transition-all duration-300 lg:transition-none text-center bg-yellow`}>
			<li class="hover:cursor-pointer"><a href="/pricing">Pricing</a></li>
			<li class="hover:cursor-pointer"><a href={showLoggedIn ? "/logout" : "/login/google"}>{showLoggedIn ? "Logout" : "Login"}</a></li>
	</ul>
</nav>
