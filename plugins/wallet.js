import Vue from 'vue'
import { ethers } from 'ethers'
import { WALLET_TYPE } from '@/constants'
import { getCurrency, CHAINID_CONFIG_MAP } from '@/utils/metamask'

export default (ctx, inject) => {
	const wallet = Vue.observable({
		account: null,
		accountCompact: 'Connect Wallet',
		network: null,
		balance: null,
		rawProvider: null,
		provider: null,
		web3Modal: null,
		type: null,
		name: null,
		canDisconnect: false,

		get hexChainId() {
			return '0x' + this.network?.chainId?.toString(16)
		},
		get networkName() {
			return this.network?.name
		},
		get chainId() {
			return this.network?.chainId
		},
		get isConnected() {
			return this.account !== null
		},

		async init(provider) {
			this.provider = new ethers.providers.Web3Provider(provider, 'any') //https://github.com/ethers-io/ethers.js/issues/866

			this.provider.on('accountsChanged', ([newAddress]) => {
				console.info('accountsChanged', newAddress)
				this.setAccount(newAddress)
			})
			this.provider.on('chainChanged', async (chainId) => {
				console.info('chainChanged', chainId)
				await this.init(provider)
			})

			this.network = await this.provider.getNetwork()
			const [account] = await this.provider.listAccounts()
			await this.setAccount(account)
		},

		async connect() {
			if (!this.web3Modal)
				throw new Error('Web3 modal is not initialized. Please contact support.')

			let instance = await this.web3Modal.connect()
			this.rawProvider = instance
			// console.log(instance)

			this.canDisconnect = typeof instance.disconnect === 'function'
			this.name = instance.walletMeta?.name

			const isMetamask =
				instance.isMetaMask || instance.walletMeta?.name === 'MetaMask'
			if (isMetamask) {
				this.type = WALLET_TYPE.Metamask
			} else if (instance.fm) {
				this.type = WALLET_TYPE.Fortmatic
				this.rawProvider = instance.fm
				instance = instance.fm.getProvider()
				console.log('fortmatic', instance)
			} else {
				this.type = WALLET_TYPE.Other
			}

			await this.init(instance)
		},

		disconnect() {
			if (this.canDisconnect) {
				this.provider.provider.disconnect()
			}
			this.web3Modal?.clearCachedProvider()
			this.account = null
			this.accountCompact = 'Connect Wallet'
			this.balance = null
		},

		async setAccount(newAccount) {
			if (newAccount) {
				this.account = newAccount
				this.accountCompact = `${newAccount.substring(
					0,
					4
				)}...${newAccount.substring(newAccount.length - 4)}`
				this.balance = await this.getBalance()
			} else {
				this.disconnect()
			}
		},

		async getBalance() {
			if (!this.isConnected) return

			const balance = (await this.provider.getBalance(this.account)).toString()
			return `${(+ethers.utils.formatEther(balance)).toFixed(3)} ${getCurrency(
				this.chainId
			)}`
		},

		async switchNetwork(chainId) {
			console.log('switchNetwork', {
				networkChainId: this.chainId,
				targetChainId: chainId,
			})

			if (!this.type === WALLET_TYPE.Metamask) {
				// console.log('Selected wallet/account is not supported on this blockchain')
				throw new Error(
					"Selected wallet/account doesn't support network switching. Please use Desktop Metamask instead."
				)
			}

			if (!chainId || this.chainId === chainId || this.hexChainId === chainId) {
				return
			}

			const config = CHAINID_CONFIG_MAP[chainId]

			try {
				await this.provider.send('wallet_switchEthereumChain', [
					{ chainId: config.chainId },
				])

				// await this.provider.ready
				// create a small delay to let the wallet reset to new network
				return new Promise((resolve) => {
					setTimeout(() => resolve(), 1000)
				})
			} catch (err) {
				console.error('switchNetwork', { err })

				if (err?.message === 'JSON RPC response format is invalid') return

				// This error code indicates that the chain has not been added to MetaMask.
				if (
					err.code === 4902 ||
					err.message.endsWith(
						'Try adding the chain using wallet_addEthereumChain first.'
					)
				) {
					await this.provider.send('wallet_addEthereumChain', [config])
				} else {
					throw err
				}
			}
		},

		async requestSignature(nonce) {
			const signer = this.provider.getSigner()
			const msg = `Hi there! Sign this unique ID to sign in: ${nonce}`
			return signer.signMessage(msg)
		},
	})

	inject('wallet', wallet)
}
