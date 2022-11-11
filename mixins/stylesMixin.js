export default {
	beforeMount() {
		if (!this.$siteConfig.stylesConfig) return

		const styles =
			typeof this.$siteConfig.stylesConfig === 'string'
				? JSON.parse(this.$siteConfig.stylesConfig || '{}')
				: this.$siteConfig.stylesConfig
		Object.entries(styles)
			.filter(([_, v]) => v !== null)
			.forEach(([k, v]) => {
				if (k === 'pageBackground' && this.$appConfig.mintPageBackgroundImageURL) {
					v = this.$appConfig.mintPageBackgroundImageURL
				}
				if (typeof v === 'string' && v.startsWith('http')) {
					v = `url('${v}')`
				}
				document.documentElement.style.setProperty(`--${k}`, v)
			})
	},
}
