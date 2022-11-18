import siteConfigLocal from '@/siteConfig.json'

export default async ({ route, }, inject) => {
	let siteConfig
	const siteId = route.query['siteId'] || localStorage.getItem('siteId')
	if (siteId) {
		localStorage.setItem('siteId', siteId)
	}

		siteConfig = {
			...siteConfigLocal,
			configs: JSON.stringify(siteConfigLocal.configs),
			stylesConfig: JSON.stringify(siteConfigLocal.stylesConfig),
		}

	inject('siteConfig', siteConfig)
}
