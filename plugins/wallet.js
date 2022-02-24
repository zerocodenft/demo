import Vue from 'vue'
import { ethers } from 'ethers'
import MetaMaskOnboarding from '@metamask/onboarding'
import { getCurrency, CHAINID_CONFIG_MAP } from '@/utils/metamask'

export default ({store}, inject) => {

    const wallet = Vue.observable({
        account: null,
        accountCompact: null,
        network: null,
        balance: null,
        provider: null,

        get hexChainId() {
            return '0x' + this.network?.chainId?.toString(16)
        },
        get networkName() {
            return this.network?.name
        },
        get chainId() {
            return this.network?.chainId
        },

        async init() {
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
                this.disconnect()
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
            console.info('wallet connected', {account})

            if(account) {
                await wallet.setAccount(account)
            }
        },

        disconnect() {
            wallet.account = null
            wallet.accountCompact = null
            wallet.balance = null
        },

        async switchNetwork(chainId) {

            if(!chainId || this.chainId === chainId || this.hexChainId === chainId) {
                return
            }

            const config = CHAINID_CONFIG_MAP[chainId]

			try {
				await this.provider.send('wallet_switchEthereumChain', [
					{ chainId: config.chainId },
				])

                await this.init()

                // create a small delay to let the wallet reset to new network
                return new Promise((resolve) => {
                    setTimeout(() => resolve(), 1000)
                })
			} catch (err) {
				// This error code indicates that the chain has not been added to MetaMask.
				if (err.code === 4902) {
                    await this.provider.send('wallet_addEthereumChain', [config])
                } else {
                    throw err
                }
			}
		},

        async requestSignature(nonce) {
            const signer = this.provider.getSigner()
            const msg = `Hi there from the Zero Code NFT! Sign this unique ID to sign in: ${nonce}`
            return signer.signMessage(msg)
        }
    })

    if(window.ethereum) {
    
        window.ethereum.on('accountsChanged', ([newAddress]) => {
            console.info('accountsChanged', newAddress)
            wallet.setAccount(newAddress)
        })
    
        window.ethereum.on('chainChanged', async (chainId) => {
            console.info('chainChanged', chainId)
            wallet.init()
        })

        wallet.init()
    }

    inject('wallet', wallet)
}