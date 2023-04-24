<script>
	let file;
	let pdfUploader;
	let pdfText = '';
	let pdfUrl = '';
	let textLoading = false;
	let buttonLoading = false;
	let firstLoad = true;
	let showNav = false;

	function handleFileInput() {
		file = event.target.files[0];
	}

	function handleMenu() {
		showNav = !showNav;
	}

	async function uploadFiles() {
		firstLoad = false;
		if (!file) {
			return;
		}
		textLoading = true;
		buttonLoading = true;
		pdfText = '';

		try {
			const formData = new FormData();
			formData.append('pdfFile', file);

			pdfUrl = URL.createObjectURL(file);

			file = null;
			pdfUploader.value = '';

			const response = await fetch('http://localhost:3000/summarize/pdf', {
				method: 'POST',
				body: formData,
			});

			console.log(response);

			if (response.ok) {
				const data = await response.json();
				pdfText = data.result;
			}
		} catch(error) {
			console.log(error);
		}
		textLoading = false;
		buttonLoading = false;
	}
</script>

<main>
	<nav class="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-10 w-full text-white fixed">
		<input type="checkbox" id="check" on:change={handleMenu} hidden />
		<label for="check" class="hover:cursor-pointer float-right text-3xl mr-12 lg:hidden"><i class="fas fa-bars"></i></label>
		<label for="id" class="pl-12 md:pl-12 md:text-4xl text-3xl font-mono hover:cursor-pointer">doksum.ai</label>
		<ul class={showNav ? `fixed text-gray-200 float-right mr-12 lg:flex leading-loose space-x-4 font-sans lg:relative h-[100vh] lg:h-0 w-[100%] lg:w-fit top-10 lg:top-0 left-[0px] lg:left-0 transition-all duration-300 lg:transition-none text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500` : `fixed text-gray-200 float-right mr-12 lg:flex leading-loose space-x-4 font-sans lg:relative h-[100vh] lg:h-0 w-[100%] lg:w-fit top-10 lg:top-0 left-[-100%] lg:left-0 transition-all duration-300 lg:transition-none text-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}>
			<li class="hover:cursor-pointer">Pricing</li>
			<li class="text-white hover:cursor-pointer">Login</li>
		</ul>
	</nav>
	{#if firstLoad}
		<div class="text-center lg:pl-12 pt-72 lg:pr-12 pl-2 pr-2 w-[100%]">
				<p class="text-3xl font-bold font-mono pb-2">Save time, summmarize with ease</p>
				<p class="text-xl font-bold font-mono pb-6">Let us simplify the information you need</p>
		</div>
	{/if}
	<div class={`text-center lg:pl-12 ${firstLoad ? '' : 'pt-16'} lg:pr-12 pl-2 pr-2 w-[100%]`}>
		{#if firstLoad}
			<p class="text-l font-mono pb-2">Upload your pdf!</p>
		{/if}
		<input bind:this={pdfUploader} type="file" on:change={handleFileInput} />
		<button on:click={uploadFiles} class="text-white rounded px-2 bg-emerald-400">
			summarize
			{#if buttonLoading}
				<svg aria-hidden="true" class="inline w-5 h-5 text-white animate-spin dark:text-white-600 fill-fuchsia-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
				<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
				</svg>
			{/if}
		</button>
	</div>
	<div class="text-center text-slate-200 lg:pl-12 lg:pr-12 pt-6 pl-2 pr-2 text-black font-serif w-[100%]">
		{#if !textLoading}
			<p>{pdfText}</p>
		{/if}
		{#if textLoading}
			<div class="mt-4">
				<div class="mt-2 animate-pulse w-[100%] h-4 bg-slate-700"></div>
				<div class="mt-2 animate-pulse w-[100%] h-4 bg-slate-700"></div>
				<div class="mt-2 animate-pulse w-[65%] h-4 bg-slate-700"></div>
			</div>
		{/if}
	</div>
	<div class="text-center">
		{#if pdfUrl}
			<iframe title="renderpdf" class="lg:pl-12 lg:pr-12 pt-6 pl-2 pr-2 w-[100%] h-[600px]" src={pdfUrl}></iframe>
		{/if}
	</div>
</main>

<style>
</style>
