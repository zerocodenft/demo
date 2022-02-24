<template>
	<footer class="bg-dark py-4">
		<b-container fluid>
			<b-row>
				<b-col sm="12" md="3">
					<b-nav class="justify-content-center justify-content-md-start">
						<b-img-lazy :src="$siteConfig.icon || '/logo.svg'" width="60px" alt="logo" />
						<!-- <b-nav-item href="#about" class="align-self-center" link-classes="text-light">About</b-nav-item>
                    <b-nav-item href="#team" class="align-self-center" link-classes="text-light">Team</b-nav-item> -->
					</b-nav>
				</b-col>
				<b-col sm="12" md="6" class="text-center py-2">
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
						<b-img src="@/assets/img/logos/discord.svg" width="60px" />
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
						v-if="$siteConfig.blockExplorerUrl"
						:href="$siteConfig.blockExplorerUrl"
						target="_blank"
						class="ml-1">
						<b-img src="@/assets/img/logos/etherscan.svg" width="30px" />
					</b-link>
				</b-col>
				<b-col sm="12" md="3">
					<div class="d-flex flex-column align-items-center align-items-md-end">
						<span class="text-light" style="font-size: small">Powered By</span>
						<b-link href="https://zerocodenft.com" target="_blank">
							<b-img-lazy width="100px" src="@/assets/img/zerocodenftlogo_white.svg" />
						</b-link>
					</div>
				</b-col>
			</b-row>
		</b-container>
	</footer>
</template>

<script>
export default {
	name: 'Footer',
}
</script>

<style lang="scss" scoped></style>
