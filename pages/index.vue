<template>
	<b-container id="container" fluid>
		<b-row id="landing">
			<b-col
				class="d-flex align-items-center justify-content-center backdrop-blur">
				<b-jumbotron
					:header="$siteConfig.title"
					class="shadow text-center"
					:lead="$siteConfig.description"
					bg-variant="dark"
					text-variant="white">
					<div v-if="showCountdown">
						<Countdown :date="$siteConfig.dropDate" />
					</div>
					<div v-else>
						<h4 class="pt-2 text-light">
							Minted: {{ mintedCount }}/{{ collectionSize }}
						</h4>
						<b-form-spinbutton
							class="mx-auto my-3"
							v-model="count"
							min="1"
							:max="$siteConfig.smartContract.maxTokensPerTransaction || $siteConfig.smartContract.collectionSize"
						>
						</b-form-spinbutton>
						<MintButton :soldOut="mintedCount === collectionSize" @minted="updateMintedCount" />
					</div>
				</b-jumbotron>
			</b-col>
		</b-row>
	</b-container>
</template>

<script>
console.group('Powered by www.zerocodenft.com')
console.info(
	'%cDrop Your NFT collection with ZERO coding skills!',
	`background: linear-gradient(100.07deg, #DB6F3D -28.71%, #9534DE 36.75%, #5FB9E6 103.59%);
  color:white;
  font-weight:bold;`
)
console.groupEnd()

import MintMixin from '@/mixins/mint'
import { ethers } from 'ethers'

export default {
	mixins: [MintMixin],
	data() {
		return {
			count: 1,
			mintedCount: 0,
			collectionSize: 0,
		}
	},
	mounted() {
		const {
			chainId: targetChainId,
			abi,
			address,
			collectionSize,
			maxTokensPerTransaction
		} = this.$siteConfig.smartContract

		this.collectionSize = collectionSize
		this.count = maxTokensPerTransaction || 1

		try {
			// give some time for wallet plugin to init
			setTimeout(async () => {
				if (!this.$wallet.provider) return

				if (this.$wallet.chainId !== +targetChainId) {
					await this.$wallet.switchNetwork(targetChainId) // will trigger page reload on success
					return
				}

				const nftContract = new ethers.Contract(address, abi, this.$wallet.provider)
				this.mintedCount = +(await nftContract.totalSupply())
			}, 2000)
		} catch (err) {
			console.error({ err })
		}
	},
	methods: {
		updateMintedCount(val) {
			this.mintedCount = val
		}
	}
}
</script>

<style lang="scss" scoped>
#container {
	overflow: hidden;
	min-height: calc(100vh - 164px);
}

#landing {
	min-height: inherit;
	background: url('@/assets/img/background.jpg');
}

.backdrop-blur {
	backdrop-filter: blur(2px);
}
</style>
