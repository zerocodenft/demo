<template>
	<div class="p-1 zc-background">
		<Mint />
		<PoweredByBrand
			v-if="!$siteConfig.smartContract.isAttributionHidden"
			class="mt-2">
			Powered by {{ $appConfig.companyName }}
		</PoweredByBrand>
	</div>
</template>

<script>
export default {
	layout: 'no-headers',
}
</script>
