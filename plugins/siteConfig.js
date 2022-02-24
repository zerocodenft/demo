import siteConfigLocal from '@/siteConfig.json'

export default async ({env, $cloudFns, $axios}, inject) => {

    let siteConfig = {}
    
    try {
        // const { data: websiteConfig } = await $cloudFns.get('/siteconfig', { params: { websiteId: env.WEBSITE_ID }} )
        const { data: websiteConfig } = await $axios.get(`/websites/${env.WEBSITE_ID}/config`)
        // console.log({websiteConfig})
        siteConfig = websiteConfig
    } catch (err) {
        console.log(err)
        siteConfig = siteConfigLocal
    }

    inject('siteConfig', siteConfig)
}
