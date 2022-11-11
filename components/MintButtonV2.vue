<template>
	<div>
		<div class="text-center mb-2">
			<b-overlay :show="isBusy" z-index="2">
				<b-button
					v-if="soldOut"
					class="mint-button font-weight-bold border-0"
					:disabled="!$siteConfig.marketplaceURL"
					:href="$siteConfig.marketplaceURL"
					target="_blank"
					>SOLD OUT</b-button
				>
				<b-button v-else class="mint-button font-weight-bold border-0" @click="mint"
					>Mint [{{ mintCount }}]</b-button
				>
				<b-button
					variant="link"
					class="text-light mt-1"
					:disabled="isBusy"
					v-show="$wallet.isConnected && $wallet.canDisconnect"
					@click="() => $wallet.disconnect()"
					>Disconnect Wallet</b-button
				>
			</b-overlay>
		</div>
		<b-alert
			:show="message.show || !!message.text"
			:variant="message.variant"
			dismissible
			class="text-center">
			{{ message.text }}
		</b-alert>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import { getHexProof } from '@/utils'
import { SALE_STATUS, ANALYTICS_EVENTS } from '@/constants'

export default {
	props: {
		soldOut: Boolean,
		mintCount: {
			type: Number,
			default: 1,
		},
	},
	data() {
		return {
			isBusy: false,
			message: {},
		}
	},
	methods: {
		async getWL() {
			const { id, whitelist } = this.$siteConfig.smartContract
			let wlData = []
			try {
				const { data } = await this.$axios.get(
					`/smartcontracts/${id}/whitelist`
				)
				wlData = data
			} catch {
				wlData = whitelist
			}

			// return wlData.map((a) => ethers.utils.getAddress(a))
			return wlData
		},
		async mint() {
			const {
				chainId: targetChainId,
				hasWhitelist,
				name
			} = this.$siteConfig.smartContract

			this.message = {}

			try {
				if (!this.$wallet.isConnected) {
					await this.$wallet.connect()
				}

				if (this.$wallet.chainId !== +targetChainId) {
					await this.$wallet.switchNetwork(targetChainId)
				}

				this.isBusy = true
				
				const saleStatus = await this.$smartContract.saleStatus()

				this.$gtag('event', ANALYTICS_EVENTS.WalletConnected, {
					name,
					walletAddress: `address_${this.$wallet.account}` // prefix address_ cause gtag converts hex address into digits
				})

				this.$gtag('event', ANALYTICS_EVENTS.CheckoutBegin, {
					name,
					walletAddress: `address_${this.$wallet.account}`, // prefix address_ cause gtag converts hex address into digits
					saleStatus: SALE_STATUS[saleStatus],
					quantity: this.mintCount
				})

				let txResponse

				const total = await this.calcTotal(this.mintCount, saleStatus)
				const value = ethers.utils.parseEther(total)
				const gasPrice = await this.$wallet.provider.getGasPrice()

				console.log({
					total,
					gasPrice: `${ethers.utils.formatUnits(gasPrice, 'gwei')} gwei`,
				})

				const signedContract = this.$smartContract.connect(
					this.$wallet.provider.getSigner()
				)

				if (hasWhitelist) {
					let hexProof
					if(saleStatus === SALE_STATUS.Presale) {
						const whitelist = await this.getWL()
						hexProof = getHexProof(whitelist, this.$wallet.account)
					}
					else {
						hexProof = []
					}
					// console.log(merkleTree.verify(hexProof, this.$wallet.account, merkleTree.getRoot()))
					txResponse = await signedContract.redeem(hexProof, this.mintCount, {
						value,
						gasPrice,
					})
				} else {
					txResponse = await signedContract.mint(this.mintCount, {
						value,
						gasPrice,
					})
				}

				console.log({ txResponse })

				this.$gtag('event', ANALYTICS_EVENTS.CheckoutComplete, {
					name,
					walletAddress: `address_${this.$wallet.account}`, // prefix address_ cause gtag converts hex address into digits
					saleStatus: SALE_STATUS[saleStatus],
					quantity: this.mintCount,
					total
				})

				this.message = {
					variant: 'success',
					text: 'Mint successful!',
					show: 5,
				}

				txResponse.wait().then(async (res) => {
					// console.log({ res });
					this.message = {
						variant: 'success',
						text: 'Mint confirmed! 🎉',
					}
				})
			} catch (err) {
				console.error(err)

				if (!err || err.message === 'JSON RPC response format is invalid') {
					return
				}

				const { data, reason, message, code, method, error } = err
				const text =
					error?.message || data?.message || reason || message || 'Minting failed'
				this.message = {
					variant: 'danger',
					text,
				}

				this.$gtag('event', ANALYTICS_EVENTS.CheckoutError, {
					name,
					walletAddress: `address_${this.$wallet.account}`, // prefix address_ cause gtag converts hex address into digits
					message: text
				})

				// this.$wallet.rawProvider.user?.deposit()
			} finally {
				this.isBusy = false
			}
		},
		async calcTotal(mintCount, saleStatus) {
			const buyPrice =
					saleStatus === SALE_STATUS.Presale
						? await this.$smartContract.PRESALE_MINT_PRICE()
						: await this.$smartContract.MINT_PRICE()

			const calcTotalFunc = this.$smartContract.interface.fragments.find(f => f.name === 'calcTotal')

			if(calcTotalFunc) {
				// calc total needs msg.sender so call has to be signed
				const signedContract = this.$smartContract.connect(
					this.$wallet.provider.getSigner()
				)
				const needsBuyPrice = calcTotalFunc.inputs.length > 1 //for backwards compatibility

				const total = needsBuyPrice 
					? await signedContract.calcTotal(mintCount, buyPrice)
					: await signedContract.calcTotal(mintCount)

				return ethers.utils.formatEther(total)
			} else {
				// backwards compatibility
				const firstXFree = this.$siteConfig.smartContract.firstXFree
				const priceInEth = +ethers.utils.formatEther(buyPrice)
				let total = mintCount * priceInEth

				if (firstXFree > 0) {
					const mintedCount = +(await this.$smartContract.totalSupply())
					if (firstXFree > mintedCount) {
						const freeLeft = firstXFree - mintedCount
						const difference = freeLeft - mintCount
						if (difference < 0) {
							total = Math.abs(difference) * priceInEth
						} else {
							total = 0
						}
						console.log('FIRSTXFREE >> ', { mintedCount, difference, mintCount })
					}
				}

				return total.toString()
			}
		},
	},
}
</script>
