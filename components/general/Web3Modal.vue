<template>
	<web3-modal-vue
		ref="web3modal"
		:theme="theme"
		:provider-options="providerOptions" />
</template>

<script>
import Web3ModalVue from 'web3modal-vue'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Fortmatic from "fortmatic";
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'


export default {
	components: {
		Web3ModalVue,
	},
	data() {
		return {
			theme: 'light',
			providerOptions: {
				walletconnect: null,
				fortmatic: null
			},
		}
	},
	created() {
		const chainId = this.$siteConfig.smartContract.chainId
		const supportsFortmatic = [4,1,80001,137,97,56].includes(+chainId) //supported chains

		const wcConfig = {
			package: WalletConnectProvider,
			options: {
				// network: CHAINID_CONFIG_MAP[chainId.toString()],
				rpc: Object.entries(CHAINID_CONFIG_MAP)
					.filter(([k, _]) => !isNaN(k))
					.reduce((acc, val) => {
						const [key, value] = val
						const rpcUrl = value.rpcUrls[0]
						acc[key] = rpcUrl
						return acc
					}, {})
			}
		}
		this.providerOptions.walletconnect = wcConfig

		if(supportsFortmatic) {
			const rpcUrlMap = {
				'80001': 'https://rpc-mumbai.maticvigil.com/v1/00cd3c7b0d85f810ab36316f2732d0810a2a1e50',
				'137': 'https://rpc-mainnet.maticvigil.com/v1/00cd3c7b0d85f810ab36316f2732d0810a2a1e50',
				'4': 'https://rinkeby.infura.io/v3/98302611de2949f1bd81e48d0b52d279',
				'1': 'https://mainnet.infura.io/v3/98302611de2949f1bd81e48d0b52d279'
			}

			this.providerOptions.fortmatic = {
				package: Fortmatic,
				options: {
					key: this.$config.FORTMATIC_KEY,
					network: {
						chainId: chainId,
						rpcUrl: rpcUrlMap[chainId]
					}
				}
			}
		}
		if (
			window.matchMedia &&
			window.matchMedia('(prefers-color-scheme: dark)').matches
		) {
			this.theme = 'dark'
		}
	},
	mounted() {
		this.$nextTick(async () => {
			const web3modal = this.$refs.web3modal
			// console.log(web3modal)
			// web3modal.onClose(console.log('onClose'))
			// web3modal.onConnect(() => console.log('on connect'))
			this.$wallet.web3Modal = web3modal
			if (web3modal.cachedProvider) {
				await this.$wallet.connect()
			}
		})
	}
}
</script>
