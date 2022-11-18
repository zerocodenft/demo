// load tenant configuration

export default async function ({ redirect, $cloudFns, $axios }, inject) {
	// let appConfigs = null

	// const appConfig = {
	// 	configs: appConfigs,
	// 	get: function (key) {
	// 		return this.configs.find((x) => x.key === key)
	// 	},
	// }
	// if(appConfigs.length){
	// 	appConfigs.reduce((acc, val) => {
	// 		acc[val.key] = val.value
	// 		return acc
	// 	}, appConfig)
		
	// 	inject('appConfig', Object.freeze(appConfig))
	// }
	inject('appConfig',{iconURL:''})
}
