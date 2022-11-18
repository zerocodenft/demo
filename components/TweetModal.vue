<template>
	<b-modal
		id="TwitterNftShareModal"
		title="Congratulations 🎉"
		centered
		@hidden="$emit('hidden')"
		hide-footer
		no-close-on-backdrop
		no-close-on-esc>
		<div class="text-center">
			You've successfully minted {{ mintCount }} NFT{{
				mintCount > 1 ? 's' : ''
			}}
			from {{ $siteConfig.smartContract.name }} NFT collection.
			<br />
			<ShareNetwork
				ref="twitterShare"
				network="twitter"
				:url="compUrl"
				:title="compTitle"
				:hashtags="compHashTags.toString()">
				<b-img src="@/assets/img/logos/twitter.svg" width="32px" />
				<span> Share on Twitter! </span>
			</ShareNetwork>
		</div>
		<div class="row d-flex justify-content-center">
			<div class="col-md-6 my-2 text-center" v-for="(data, i) in images" :key="i">
				<b-img-lazy
					class="rounded nft-image"
					width="200px"
					blank-color="black"
					blank-width="200px"
					:src="data.imageSrc" />
				<h6 class="text-muted">{{ data.name }}</h6>
			</div>
		</div>
	</b-modal>
</template>

<script>
import { CHAIN_IDS } from '@/constants'
import { isChainSupportedByOS } from '@/utils/index'

export default {
	props: {
		images: Array,
		mintCount: {
			type: Number,
			default: 1,
		},
	},
	setup(_, { root }) {
		const {
			marketplaceURL,
			smartContract: {
				address,
				chainId,
				isAttributionHidden,
				name: smartContractName,
			},
		} = root.$siteConfig

		const { companyName, twitterTag } = root.$appConfig

		return {
			address,
			chainId,
			isAttributionHidden,
			marketplaceURL,
			smartContractName,
			companyName,
			twitterTag,
		}
	},
	async mounted() {
		if (!this.marketplaceURL) {
			try {
				if (!isChainSupportedByOS(this.chainId)) {
					return
				}
				let marketplaceLink = 'https://opensea.io/collection/'
				let url = `https://api.opensea.io/api/v1/asset_contract/${this.address}`
				let options = {
					headers: {
						'X-API-KEY': this.$config.OPENSEA_API_KEY,
					},
				}
				if (
					[CHAIN_IDS.Goerli, CHAIN_IDS.Mumbai, CHAIN_IDS.Baobab].includes(
						this.chainId
					)
				) {
					url = `https://testnets-api.opensea.io/api/v1/asset_contract/${this.address}`
					marketplaceLink = 'https://testnets.opensea.io/collection/'
					delete options['headers']
				}
				const { data } = await this.$axios.get(url, options)
				if (data.collection) {
					this.marketplaceURL = `${marketplaceLink}${data.collection.slug}`
				} else if (this.chainId === CHAIN_IDS.Goerli) {
					this.marketplaceURL = `https://goerli.pixxiti.com/collections/${this.address.toLowerCase()}`
				}
			} catch (err) {
				console.error(err)
			}
		}
	},
	computed: {
		compTitle() {
			let title = `I've just minted ${this.mintCount} NFTs from ${this.smartContractName} NFT Collection.`
			if (!this.isAttributionHidden && this.twitterTag) {
				title += ` Powered by ${this.twitterTag}!`
			}
			return title
		},
		compHashTags() {
			let tags = [this.smartContractName, 'nocode', 'nft', 'mint']
			if (!this.isAttributionHidden && this.companyName) {
				const name = this.companyName.toLowerCase().replace(/\s/g, '')
				tags.unshift(name)
			}
			return tags
		},
		compUrl() {
			return this.marketplaceURL ? this.marketplaceURL + '\n' : '\n'
		},
	},
}
</script>

<style>
.nft-image {
	border: 2px solid var(--mintBtnBgColor);
}
</style>
