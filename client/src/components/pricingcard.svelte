<script>
	export let title = '';
	export let price = '';
	export let features = [];
	export let disableBtn = false;
</script>

<div class="bg-white text-purple shadow-lg rounded-lg p-6">
	<h2 class="text-xl font-bold mb-4">{title}</h2>
	<div class="text-4xl font-bold mb-6">{price}</div>
	<ul class="mb-6">
			{#each features as feature}
				<li>
					<span>{feature}</span>
				</li>
		{/each}
	</ul>
	{#if !disableBtn}
		<button class="bg-orange text-white hover:bg-brown font-bold py-2 px-4 rounded-full">Buy Now</button>
	{/if}
</div>
