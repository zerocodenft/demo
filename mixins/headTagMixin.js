import Vue from 'vue'
import getSiteMeta from '@/utils/siteMeta'

export default {
	head() {
		const scripts = []
		const { title, iconURL: userIconURL, configs: userConfigs } = this.$siteConfig
		const { gtagId, iconURL } = this.$appConfig

		const { widgetBot, analytics: userAnalyticsSettings } = JSON.parse(
			userConfigs || '{}'
		)
		const isBraveBrowser = typeof navigator.brave !== 'undefined'
		console.info({ isBraveBrowser })

		// https://widgetbot.io/
		const { server, channel } = widgetBot || {}
		scripts.push({
			hid: 'widgetbot',
			src: 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3',
			async: true,
			defer: true,
			once: true,
			skip: !server || !channel,
			callback: () => {
				new Crate({
					server,
					channel,
				})
			},
		})

		// mock $gtag function in case script gets blocked
		Vue.prototype.$gtag = function () {}

		// analytics
		scripts.push({
			hid: 'gtag',
			src: `https://www.googletagmanager.com/gtag/js?id=${
				gtagId ?? userAnalyticsSettings?.gtagId
			}`,
			async: true,
			once: true,
			skip: isBraveBrowser || !gtagId || !userAnalyticsSettings?.gtagId,
			callback: () => {
				window.dataLayer = window.dataLayer || []

				function gtag() {
					dataLayer.push(arguments)
				}
				Vue.prototype.$gtag = gtag

				gtag('js', new Date())

				// add our/brand gtag
				if (gtagId) {
					gtag('config', gtagId, {
						debug_mode: this.$config.GTAG_DEBUG,
					})
				}

				// add user defined gtag
				if (userAnalyticsSettings?.gtagId) {
					gtag('config', userAnalyticsSettings?.gtagId, {
						debug_mode: this.$config.GTAG_DEBUG,
					})
				}
			},
		})

		return {
			title: title,
			meta: [
				...getSiteMeta({
					...this.$appConfig,
					...this.$siteConfig,
				}),
			],
			link: [{ rel: 'icon', type: 'image/x-icon', href: userIconURL || iconURL }],
			script: scripts,
		}
	},
}
