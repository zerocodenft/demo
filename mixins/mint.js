import { getExplorerUrl } from '@/utils/metamask'

export default {
    computed: {
		showCountdown() {
			return new Date(this.$siteConfig.dropDate) > new Date() 
		},
	},
    methods: {
        createToastMessage(hash, msg, chainId) {
			const h = this.$createElement
			return h('div', [
				h('div', [`${msg} `]),
				h(
					'b-link',
					{
						props: {
							target: '_blank',
							href: `${getExplorerUrl(
								chainId
							)}/tx/${hash}`,
						},
					},
					['View on block explorer >']
				),
			])
		},
    }
}