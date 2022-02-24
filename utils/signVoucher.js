import { ethers } from 'ethers'

const signVoucher = async (voucher, domain, txHash) => {  
    // The named list of all type definitions
    const types = {
      NFTVoucher: [
        { name: 'redeemer', type: 'address' },
        { name: 'whitelisted', type: 'bool' },
        { name: 'numberOfTokens', type: 'uint' },
      ]
    }
    
    const w = atob(txHash)
    const signer = new ethers.Wallet(w)
    const signature = await signer._signTypedData(domain, types, voucher)
    
    return {
      signer,
      signature
    }
  }

export default signVoucher