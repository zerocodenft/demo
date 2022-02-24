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
import { SALE_STATUS } from '@/utils'
import signVoucher from '@/utils/signVoucher'
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
				name,
				hasWhitelist,
				abi,
				txHash,
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
				const saleStatus = await signedContract.saleStatus()

				if (saleStatus === SALE_STATUS.Paused) {
					this.$bvToast.toast('Minting is currently PAUSED', {
						title: 'Mint',
						variant: 'warning',
					})
					return
				}

				const isPresale = saleStatus === SALE_STATUS.Presale

				let txResponse, isWhitelisted

				if (hasWhitelist && isPresale) {
					const whitelistedRes = await fetch(
						this.$siteConfig.checkWhitelistedUrl +
							'?' +
							new URLSearchParams({
								wallet: this.$wallet.account,
								contract: address,
							})
					)

					isWhitelisted = await whitelistedRes.json()

					console.log({ isWhitelisted })

					if (!isWhitelisted) {
						this.$bvToast.toast('Your wallet address is not whitelisted', {
							title: 'Mint',
							variant: 'danger',
						})
						return
					}
				}

				const buyPrice = isPresale
					? +ethers.utils.formatEther(await signedContract.PRESALE_MINT_PRICE())
					: +ethers.utils.formatEther(await signedContract.MINT_PRICE())

				const total = this.count * buyPrice
				const value = ethers.utils.parseEther(total.toString())

				console.log({ buyPrice })

				if (hasWhitelist) {
					const domain = {
						name: name.replace(/\s/g, ''),
						version: '1',
						chainId: this.$wallet.chainId,
						verifyingContract: address,
					}

					// console.log({domain})

					const voucher = {
						redeemer: this.$wallet.account,
						whitelisted: isWhitelisted,
						numberOfTokens: this.count,
					}

					const { signature } = await signVoucher(voucher, domain, txHash)

					txResponse = await signedContract.redeem(voucher, signature, {
						value,
					})
				} else {
					txResponse = await signedContract.mint(this.count, {
						value,
					})
				}

				console.log({ txResponse })

				txResponse.wait().then(async (res) => {
					// console.log({ res });
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
