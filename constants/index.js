const SALE_STATUS = Object.freeze({
	Paused: 0,
	Presale: 1,
	Public: 2,
	0: 'Paused',
	1: 'Presale',
	2: 'Public',
})

const MINT_SELECTOR_TYPE = Object.freeze({
	SpinButton: 0,
	Range: 1,
})

const WALLET_TYPE = Object.freeze({
	Other: 0,
	Metamask: 1,
	Fortmatic: 2,
})

const ANALYTICS_EVENTS = Object.freeze({
	WalletConected: 'zerocodenft_wallet_connected',
	CheckoutBegin: 'zerocodenft_checkout_begin',
	CheckoutComplete: 'zerocodenft_checkout_complete',
	CheckoutError: 'zerocodenft_checkout_failed',
	ZeroCodeLinkClicked: 'zerocodenft_link_clicked',
})

const CHAIN_IDS = Object.freeze({
	Ethereum: 1,
	Goerli: 5,
	Polygon: 137,
	Mumbai: 80001,
	Klaytn: 8217,
	Baobab: 1001,
})
export {
	SALE_STATUS,
	MINT_SELECTOR_TYPE,
	WALLET_TYPE,
	ANALYTICS_EVENTS,
	CHAIN_IDS,
}
