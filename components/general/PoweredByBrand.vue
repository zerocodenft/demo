<template>
	<div class="text-center">
		<b-link
			class="text-muted zerocode-link text-monospace"
			@click.prevent="onLinkClick"
			:href="$appConfig.mainWebsiteURL"
			target="_blank">
			<slot></slot>
		</b-link>
	</div>
</template>

<script>
import { ANALYTICS_EVENTS } from '@/constants'
export default {
	methods: {
		onLinkClick() {
			const { id, name } = this.$siteConfig.smartContract
			const { gtagId, mainWebsiteURL } = this.$appConfig
			if (gtagId) {
				this.$gtag('event', ANALYTICS_EVENTS.ZeroCodeLinkClicked, {
					name,
					scId: id,
					// prefix address_ cause gtag converts hex address into digits
					walletAddress: `address_${this.$wallet.account}`,
				})
			}
			window.open(mainWebsiteURL, '_blank')
		},
	},
}
</script>
