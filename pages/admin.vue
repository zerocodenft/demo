<template>
	<div
		class="
			container
			d-flex
			flex-column
			align-items-center
			justify-content-center
		">
		<div v-if="!user"><h3>Admin only area</h3></div>
		<div v-else>
			<b-form-group label="Sale Status">
				<b-form-radio-group
					v-model="saleStatus"
					:options="saleStatusOptions"
					:disabled="isBusy"></b-form-radio-group>
			</b-form-group>
			<b-form-group label="Wallet Address" class="mb-0">
				<b-form-input type="text" v-model="newOwner"></b-form-input>
			</b-form-group>
			<b-button
				variant="outline-dark"
				class="w-100 my-2"
				:disabled="isBusy"
				@click="call('transferOwnership', [newOwner])"
				>Transfer Ownership</b-button
			>
			<div class="d-flex">
				<b-form-group label="Airdrop Wallet" class="mb-0">
					<b-form-input type="text" v-model="airdropTo"></b-form-input>
				</b-form-group>
				<b-form-group label="Airdrop Quantity" class="mb-0">
					<b-form-input
						type="number"
						min="1"
						step="1"
						v-model="airdropCount"></b-form-input>
				</b-form-group>
			</div>
			<b-button
				variant="outline-dark"
				class="w-100 my-2"
				@click="call('airdrop', [airdropTo, airdropCount])"
				:disabled="isBusy || !airdropTo || !airdropCount"
				>Airdrop</b-button
			>

			<div v-if="$siteConfig.smartContract.hasDelayedReveal">
				<b-form-group label="Reveal URL">
					<b-form-input
						type="text"
						:value="revealUrl"
						:disabled="isBusy"
						@change="onRevealUrlChange"
						placeholder="ipfs://*******/"></b-form-input>
					<b-button
						variant="outline-dark"
						class="mt-2 w-100"
						@click="call('reveal', [revealUrl])"
						:disabled="isBusy || revealStatus || !revealUrl"
						>{{ revealStatus ? 'Already revealed' : 'Reveal' }}</b-button
					>
				</b-form-group>
			</div>
			<p class="mb-1">Balance: {{ balance }} ETH</p>
			<b-button
				@click="call('withdraw')"
				class="w-100"
				variant="outline-dark"
				:disabled="balance === 0 || isBusy"
				>{{ balance === 0 ? 'No Balance' : 'Withdraw' }}</b-button
			>
		</div>
	</div>
</template>

<script>
import { ethers } from 'ethers'
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'
import { SALE_STATUS } from '@/utils'

const identity = window.netlifyIdentity

export default {
	layout: 'admin',
	name: 'admin',
	data() {
		return {
			SALE_STATUS,
			user: identity.currentUser(),
			revealStatus: false,
			saleStatus: null,
			saleStatusOptions: [
				{ text: 'Paused', value: SALE_STATUS.Paused },
				{ text: 'Public', value: SALE_STATUS.Public },
			],
			alreadyCalled: false,
			balance: 0,
			isBusy: false,
			revealUrl: null,
			airdropTo: null,
			airdropCount: null,
			newOwner: null,
		}
	},
	async mounted() {
		identity.on('login', (user) => {
			this.user = user
			if (!this.alreadyCalled) {
				this.alreadyCalled = true
				this.init()
			}
		})
		identity.on('logout', () => {
			this.user = null
		})
		if (this.user) {
			this.init()
		}
		if (this.$siteConfig.hasWhitelist) {
			this.saleStatusOptions.splice(1, 0, {
				text: 'Whitelist',
				value: SALE_STATUS.Whitelist,
			})
		}
	},
	methods: {
		init() {
			this.isBusy = true

			// give some time for wallet plugin to init
			setTimeout(async () => {
				this.isBusy = false

				if (!this.$wallet.provider) return

				const { chainId: targetChainId } = this.$siteConfig.smartContract
				const isWrongNetwork = this.$wallet.chainId !== +targetChainId

				if (isWrongNetwork) {
					const config = CHAINID_CONFIG_MAP[targetChainId]
					await this.$wallet.switchNetwork(config) // will trigger page reload on success
					return
				}

				if (!this.$wallet.account) {
					await this.$wallet.connect()
				}

				await this.loadState()
			}, 2000)
		},
		async call(name, args = []) {
			try {
				if (!confirm(
						`Are you sure you want to call smart contract's '${name.toUpperCase()}' function ?`
					)
				) { return }

				this.isBusy = true

				const { address, abi } = this.$siteConfig.smartContract
				const signer = await this.$wallet.provider.getSigner()
				const signedContract = new ethers.Contract(address, abi, signer)
				const txResponse = await signedContract[name].call(null, ...args)

				console.log({ txResponse })

				txResponse.wait().then(async (res) => {
					console.log({ res })
					await this.loadState()
					this.onSuccess('Transaction confirmed!')
				})
			} catch (err) {
				this.onError(err)
			} finally {
				this.isBusy = false
			}
		},
		async loadState() {
			try {
				const { address, abi } = this.$siteConfig.smartContract
				const contract = new ethers.Contract(address, abi, this.$wallet.provider)
				// this.saleStatus = Number(await contract.saleStatus())
				// console.log('saleStatus ', saleStatus)

				// this.revealStatus = await contract.canReveal()
				this.balance = +ethers.utils.formatUnits(
					await this.$wallet.provider.getBalance(contract.address)
				)
			} catch (err) {
				console.error('loadState', err)
			}
		},
		onRevealUrlChange(val) {
			this.revealUrl = val && !val.endsWith('/') ? val + '/' : val
		},
		onError(err) {
			console.error({ err })
			const { data, reason, message, code, method, error } = err
			this.$bvToast.toast(
				error?.message || data?.message || reason || message || 'Request failed',
				{
					title: method || code || 'Error',
					variant: 'danger',
				}
			)
		},
		onSuccess(msg) {
			this.$bvToast.toast(msg || 'Request successful', {
				title: 'Success',
				variant: 'success',
			})
		},
	},
}
</script>

<style scoped lang="scss">
.container {
	min-height: calc(100vh - 178px);
}
</style>
