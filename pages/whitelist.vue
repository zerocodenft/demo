<template>
	<div
		class="d-flex justify-content-center align-items-center zc-container zc-background"
		>
		<b-jumbotron
			:header="$siteConfig.title"
			class="shadow text-center jumbo py-4"
			bg-variant="dark"
			lead="Check whitelisted status">
			<WhitelistCheck />
		</b-jumbotron>
	</div>
</template>
