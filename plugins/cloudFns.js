export default function ({ $axios, $config }, inject) {
    // Create a custom axios instance
    const cloudFns = $axios.create({})
  
    cloudFns.setBaseURL('https://zerocodenft-functions.azurewebsites.net/api')
  
    inject('cloudFns', cloudFns)
  }