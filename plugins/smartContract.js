import { ethers } from 'ethers'
import { getProvider } from '@/utils'

export default function ({ $siteConfig }, inject) {

    if(!$siteConfig.smartContract){
        inject('smartContract', {})
        return
    }
    
	const {
        abi,
        address,
        chainId
    } = $siteConfig.smartContract

    const jsonRpcProvider = getProvider(chainId)
    const smartContract = new ethers.Contract(address, abi, jsonRpcProvider)

    // console.log(smartContract)

    inject('smartContract', smartContract)
}
