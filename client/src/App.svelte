<script>
	let files = [];
	let pdfUploader;
	let pdfText = '';
	let navPos = '-100%';

	function handleFileInput() {
		files = [...event.target.files];
	}

	async function uploadFiles() {
		const formData = new FormData();

		files.forEach((file) => {
			formData.append('pdfFile', file);
		});

		files = [];
		pdfUploader.value = '';
		pdfText = '';

		try {
			const response = await fetch('http://localhost:3000/summarize/pdf', {
				method: 'POST',
				body: formData,
			});

			if (response.ok) {
				const data = await response.json();
				pdfText = data.result;
			}
		} catch(error) {
			console.log(error);
		}
	}

	function toggleMenu() {
		if (navPos == '-100%') {
			navPos = '0';
		} else {
			navPos = '-100%';
		}
	}
</script>

<main>
	<nav class="bg-indigo-800 h-10 w-full text-white fixed">
		<input type="checkbox" id="check" on:change={toggleMenu} hidden>
		<label for="check" class="float-right text-3xl mr-12 lg:hidden"><i class="fas fa-bars"></i></label>
		<label class="pl-12 md:pl-12 md:text-4xl text-3xl font-mono">doksum.ai</label>
		<ul class={`fixed text-gray-200 float-right mr-12 lg:flex leading-loose space-x-4 font-sans lg:relative h-[100vh] lg:h-0 w-[100%] lg:w-fit top-10 lg:top-0 left-[${navPos}] lg:left-0 transition-all duration-300 lg:transition-none text-center bg-indigo-600`}>
			<li class="hover:cursor-pointer">Pricing</li>
			<li class="text-white rounded-full hover:cursor-pointer bg-emerald-400">Login</li>
		</ul>
	</nav>
	<div class="pt-10">
		<p>Upload your doc!</p>
		<input bind:this={pdfUploader} type="file" on:change={handleFileInput} />
		<button on:click={uploadFiles} class="text-white rounded-full px-3 bg-gray-600">upload</button>
	</div>
	<div>
		
	</div>
	<div class="text-white">
		<p>{pdfText}</p>
	</div>
</main>

<style>
</style>
