<template>
	<div
		class="d-flex justify-content-center align-items-center zc-container zc-background">
		<b-jumbotron
			:header="$siteConfig.title"
			:lead="$siteConfig.description"
			class="shadow text-center jumbo py-4"
			bg-variant="dark">
			<Mint />
			<PoweredByBrand
				v-if="!$siteConfig.smartContract.isAttributionHidden"
				class="mt-2">
				Powered by {{ $appConfig.companyName }}
			</PoweredByBrand>
		</b-jumbotron>
	</div>
</template>

<style lang="scss">
:root {
	--account-center-position-top: 40px;
}
</style>
