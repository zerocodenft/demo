import Vue from 'vue'
import { ethers } from 'ethers'
import MetaMaskOnboarding from '@metamask/onboarding'
import { getCurrency, CHAINID_CONFIG_MAP } from '@/utils/metamask'

export default async ({env}, inject) => {

    const wallet = Vue.observable({
        account: null,
        accountCompact: 'Connect Wallet',
        network: null,
        balance: null,
        provider: null,

        get hexChainId() {
            return this.network ? '0x' + this.network.chainId?.toString(16) : null
        },

        get chainId() {
            return this.network?.chainId
        },

        async init() {
            if(!window.ethereum) return
            
            this.provider = new ethers.providers.Web3Provider(window.ethereum) //prefably diff node like Infura, Alchemy or Moralis
            this.network = await this.provider.getNetwork()
            const [account] = await this.provider.listAccounts()

            !!account && this.setAccount(account)
        },

        async setAccount(newAccount) {
            if(newAccount) {
                this.account = newAccount
                this.accountCompact = `${newAccount.substring(0, 4)}...${newAccount.substring(newAccount.length - 4)}`

                const balance = (await this.provider.getBalance(newAccount)).toString()
                this.balance = `${(+ethers.utils.formatEther(balance)).toFixed(3)} ${getCurrency(this.network.chainId)}`
            }
            else {
                this.account = null
                this.accountCompact = 'Connect Wallet'
                this.balance = null
            }
        },

        async connect() {
            if(!MetaMaskOnboarding.isMetaMaskInstalled()) {
                const onboarding = new MetaMaskOnboarding()
                onboarding.startOnboarding()
                return
            }
        
            wallet.network = await wallet.provider.getNetwork()

            const [account] = await wallet.provider.send('eth_requestAccounts')
            console.log('wallet connect', {account})

            if(account) {
                await wallet.setAccount(account)
            }
        },
        
        async switchNetwork(chainId) {
            if(!chainId || this.chainId === chainId || this.hexChainId === chainId) {
                return //since we are on correct network
            }

            const config = CHAINID_CONFIG_MAP[chainId]

			try {
				await this.provider.send('wallet_switchEthereumChain', [
					{ chainId: config.chainId },
				])
			} catch (err) {
				// This error code indicates that the chain has not been added to MetaMask.
				if (err.code === 4902) {
                    await this.provider.send('wallet_addEthereumChain', [config])
                } else {
                    throw err
                }
			}
		},
    })

    if(window.ethereum) {
    
        window.ethereum.on('accountsChanged', ([newAddress]) => {
            console.info('accountsChanged', newAddress)
            wallet.setAccount(newAddress)
        })
    
        window.ethereum.on('chainChanged', (chainId) => {
            console.info('chainChanged', chainId)
            window.location.reload()
        })

        wallet.init()
    }

    inject('wallet', wallet)
}