<template>
	<b-overlay :show="isBusy">
		<b-button
			v-if="soldOut"
			:disabled="!$siteConfig.marketplaceURL"
			:href="$siteConfig.marketplaceURL"
			target="_blank"
			>SOLD OUT</b-button
		>
		<b-button
			v-else
			class="font-weight-bold"
			block
			variant="light"
			size="lg"
			@click="mint"
			>MINT</b-button
		>
	</b-overlay>
</template>

<script>
import MintMixin from '@/mixins/mint'
import { ethers } from 'ethers'

export default {
    name: "MintButton",
    props: {
        soldOut: Boolean
    },
    mixins: [MintMixin],
    data() {
        return {
			isBusy: false
        }
    },
	methods: {
		async mint() {
			const {
				chainId: targetChainId,
				address,
				abi,
			} = this.$siteConfig.smartContract

			try {
				if (!this.$wallet.account) {
					await this.$wallet.connect()
				}

				if (this.$wallet.chainId !== +targetChainId) {
					await this.$wallet.switchNetwork(targetChainId) // will trigger page reload on success
					return
				}

				this.isBusy = true

				const signedContract = new ethers.Contract(
					address,
					abi,
					this.$wallet.provider.getSigner()
				)
				const txResponse = await signedContract.mint(this.count)

				console.log({ txResponse })

				txResponse.wait().then(async (res) => {
					console.log({ res });
					this.mintedCount = +(await signedContract.totalSupply())
					const msg = [
						this.createToastMessage(
							txResponse.hash,
							'Mint transaction confirmed!',
							targetChainId
						),
					]
					this.$bvToast.toast(msg, {
						title: 'Mint',
						variant: 'success',
					})
				})

				const msg = [
					this.createToastMessage(
						txResponse.hash,
						'Mint successful!',
						targetChainId
					),
				]
				this.$bvToast.toast(msg, {
					title: 'Mint',
					variant: 'success',
				})
			} catch (err) {
				console.error({ err })
				const { data, reason, message, code, method, error } = err
				this.$bvToast.toast(
					error?.message || data?.message || reason || message || 'Minting failed',
					{
						title: 'Mint',
						variant: 'danger',
					}
				)
			} finally {
				this.isBusy = false
			}
		},
	},
}
</script>
