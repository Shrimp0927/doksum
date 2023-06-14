<script>
	let file;
	let pdfUploader;
	let pdfText = '';
	let pdfUrl = '';
	let textLoading = false;
	export let loggedIn;

	function handleFileInput() {
		file = event.target.files[0];
	}

	async function uploadFiles() {
		if (!loggedIn) {
			return;
		}
		if (!file) {
			return;
		}
		textLoading = true;
		pdfText = '';

		try {
			const formData = new FormData();
			formData.append('pdfFile', file);

			pdfUrl = URL.createObjectURL(file);

			file = null;
			pdfUploader.value = '';

			const response = await fetch('/summarize/pdf', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const reader = response.body.getReader();
				let result = '';

				while (true) {
					const { value, done } = await reader.read();

					if (done) {
						break;
					};

					const chunk = new TextDecoder('utf-8').decode(value);
					result += chunk;
				};
				pdfText = result;
			}
		} catch(error) {
			console.log(error);
		}
		textLoading = false;
	}
</script>

<div>
	{#if !loggedIn}
		<div class="text-center text-purple lg:pl-12 pt-72 lg:pr-12 pl-2 pr-2 w-[100%]">
				<p class="text-3xl font-bold font-mono pb-2">Save time, summmarize with ease</p>
				<p class="text-xl font-bold font-mono pb-6">Let us simplify the information you need</p>
				<button class="text-white rounded px-2 bg-orange hover:bg-brown"><a href="/login/google">Get Started</a></button>
		</div>
	{/if}
	{#if loggedIn}
		<div class={`text-center lg:pl-12 pt-16 lg:pr-12 pl-2 pr-2 w-[100%]`}>
			<p class="text-l text-purple font-mono pb-2">Upload your pdf!</p>
			<input bind:this={pdfUploader} type="file" on:change={handleFileInput} />
			<button on:click={uploadFiles} class="text-white rounded px-2 bg-orange hover:bg-brown">
				summarize
			</button>
		</div>
	{/if}
	<div class="text-center text-purple lg:pl-12 lg:pr-12 pt-6 pl-2 pr-2 font-serif w-[100%]">
		{#if !textLoading}
			<p>{pdfText}</p>
		{/if}
		{#if textLoading}
			<div class="mt-4">
				<div class="mt-2 animate-pulse w-[100%] h-4 bg-slate"></div>
				<div class="mt-2 animate-pulse w-[100%] h-4 bg-slate"></div>
				<div class="mt-2 animate-pulse w-[65%] h-4 bg-slate"></div>
			</div>
		{/if}
	</div>
	<div class="text-center">
		{#if pdfUrl}
			<iframe title="renderpdf" class="lg:pl-12 lg:pr-12 pt-6 pl-2 pr-2 w-[100%] h-[600px]" src={pdfUrl}></iframe>
		{/if}
	</div>
</div>

<style>
</style>
