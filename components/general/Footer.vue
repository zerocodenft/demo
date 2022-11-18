<template>
	<footer class="zc-navbar py-4 footer">
		<b-container fluid>
			<b-row>
				<b-col
					sm="12"
					md="3"
					class="d-none d-md-flex justify-content-center justify-content-md-start">
					<b-img-lazy
						v-if="$siteConfig.iconURL"
						id="userLogo"
						height="60px"
						:src="$siteConfig.iconURL"
						alt="logo" />
				</b-col>
				<b-col sm="12" md="6" class="d-flex justify-content-center flex-wrap py-2">
					<b-link
						v-if="$siteConfig.twitterURL"
						:href="$siteConfig.twitterURL"
						target="_blank">
						<b-img src="@/assets/img/logos/twitter.svg" width="60px" />
					</b-link>
					<b-link
						v-if="$siteConfig.discordURL"
						:href="$siteConfig.discordURL"
						target="_blank">
						<b-img src="@/assets/img/logos/discord.svg" width="64px" />
					</b-link>
					<b-link
						v-if="$siteConfig.instagramURL"
						:href="$siteConfig.instagramURL"
						target="_blank">
						<b-img src="@/assets/img/logos/instagram.svg" width="60px" />
					</b-link>
					<b-link
						v-if="$siteConfig.facebookURL"
						:href="$siteConfig.facebookURL"
						target="_blank">
						<b-img src="@/assets/img/logos/facebook.svg" width="60px" />
					</b-link>
					<b-link
						v-if="$siteConfig.tiktokURL"
						:href="$siteConfig.tiktokURL"
						target="_blank">
						<b-img src="@/assets/img/logos/tiktok.svg" width="60px" />
					</b-link>
					<b-link
						v-if="$siteConfig.marketplaceURL"
						:href="$siteConfig.marketplaceURL"
						target="_blank"
						class="px-3 py-1">
						<b-img src="@/assets/img/logos/opensea.svg" width="30px" />
					</b-link>
					<b-link
						v-if="$siteConfig.blockExplorerUrl"
						:href="$siteConfig.blockExplorerUrl"
						target="_blank"
						class="px-3 py-1">
						<b-img src="@/assets/img/logos/etherscan.svg" width="30px" />
					</b-link>
				</b-col>
				<b-col
					v-if="$siteConfig.iconURL"
					sm="12"
					md="3"
					class="d-flex d-sm-block justify-content-around">
					<div class="d-block d-md-none">
						<b-img-lazy
							id="userLogo"
							height="60px"
							:src="$siteConfig.iconURL"
							alt="logo" />
					</div>
					<div
						v-if="!$siteConfig.smartContract.isAttributionHidden"
						class="d-flex flex-column align-items-end">
						<span class="text-light" style="font-size: small">Powered By</span>
						<PoweredByBrand>
							<b-img-lazy width="100px" :src="$appConfig.logoURL" />
						</PoweredByBrand>
					</div>
				</b-col>
				<b-col v-else sm="12" md="3">
					<div
						v-if="!$siteConfig.smartContract.isAttributionHidden"
						class="d-flex flex-column align-items-center align-items-md-end">
						<span class="text-light" style="font-size: small">Powered By</span>
						<PoweredByBrand>
							<b-img-lazy width="100px" :src="$appConfig.logoURL" />
						</PoweredByBrand>
					</div>
				</b-col>
			</b-row>
		</b-container>
	</footer>
</template>

<script>
export default {}
</script>
