import injectedModule from '@web3-onboard/injected-wallets'
import walletConnectModule from '@web3-onboard/walletconnect'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import ledgerModule from '@web3-onboard/ledger'
import { init } from '@web3-onboard/vue'
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'

export default ({ $siteConfig, $appConfig, route }, inject) => {
	const walletConnect = walletConnectModule({
		qrcodeModalOptions: {
			mobileLinks: ['metamask', 'rainbow', 'argent', 'trust', 'imtoken', 'pillar'],
		},
		connectFirstChainId: true,
	})

	const injected = injectedModule()
	const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true })
	const ledger = ledgerModule()

	const { smartContract, title, description, iconURL } = $siteConfig
	const chainConfig = CHAINID_CONFIG_MAP[smartContract.chainId.toString()]
	const { chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls } =
		chainConfig

	const initResult = init({
		wallets: [injected, walletConnect, coinbaseWalletSdk, ledger],
		chains: [
			{
				id: chainId,
				label: chainName,
				rpcUrl: rpcUrls[0],
				blockExplorerUrl: blockExplorerUrls[0],
				token: nativeCurrency.symbol,
				//icon: @TODO
			},
		],
		appMetadata: {
			name: title,
			// icon: smartContract.isAttributionHidden
			// 	? iconURL || require('assets/img/wallet.svg')
			// 	: $appConfig.iconURL,
			icon:  iconURL || require('assets/img/wallet.svg'),
			description: description || `${title} Mint Page`,
			recommendedInjectedWallets: [
				{ name: 'Metamask', url: 'https://metamask.io/download' },
				{ name: 'Coinbase', url: 'https://wallet.coinbase.com' },
			],
		},
		accountCenter: {
			desktop: {
				enabled: route.name !== 'button',
				minimal: route.name === 'tabs',
			},
			mobile: {
				enabled: route.name !== 'button',
				minimal: route.name === 'tabs',
			},
		},
	})

	// console.log(web3Onboard, useOnboard())

	inject('onboard', initResult)
}
