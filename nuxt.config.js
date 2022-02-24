import getSiteMeta from './utils/siteMeta'

const {
	API_URL,
	WEBSITE_ID,
} = process.env
const siteConfig = require('./siteConfig.json')

const { title, description, url, iconName } = siteConfig

export default {
	// Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
	ssr: false,

	// Target: https://go.nuxtjs.dev/config-target
	target: 'static',

	env: {
		WEBSITE_ID,
	},

	// Global page headers: https://go.nuxtjs.dev/config-head
	head: {
		title: title,
		htmlAttrs: {
			lang: 'en',
		},
		meta: [
			{ charset: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' }, // mobile responsive https://search.google.com/test/mobile-friendly
			{ name: 'format-detection', content: 'telephone=no' },
			...getSiteMeta({
				url: url,
				title: title,
				description: description,
				mainImage: `${url}/${iconName}`,
			}),
		],
		link: [
			{
				hid: 'canonical',
				rel: 'canonical',
				href: url,
			},
			{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
		],
		script: [
			{ src: 'https://identity.netlify.com/v1/netlify-identity-widget.js' },
		],
	},

	// Global CSS: https://go.nuxtjs.dev/config-css
	css: ['@/assets/main.scss'],

	// Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
	plugins: [
		'@/plugins/wallet',
		'@/plugins/cloudFns',
		'@/plugins/siteConfig',
	],

	// Auto import components: https://go.nuxtjs.dev/config-components
	components: true,

	// Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
	buildModules: [],

	// Modules: https://go.nuxtjs.dev/config-modules
	modules: [
		// https://go.nuxtjs.dev/bootstrap
		'bootstrap-vue/nuxt',
		'@nuxtjs/sitemap',
		'@nuxtjs/axios',
	],

	axios: {
		baseURL: API_URL,
	},

	bootstrapVue: {
		icons: false,
	},

	sitemap: {
		hostname: url,
		exclude: ['/admin/**'],
		defaults: {
			changefreq: 'daily',
			priority: 1,
			lastmod: new Date(),
		},
	},

	// Build Configuration: https://go.nuxtjs.dev/config-build
	build: {}
}
