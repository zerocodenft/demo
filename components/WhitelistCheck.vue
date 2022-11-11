<template>
	<b-form novalidate @submit.prevent="checkWhitelisted">
		<b-form-group label="Enter Address or ENS name">
			<b-form-input v-model="address" @input="onInput" :state="isWhitelisted"></b-form-input>
			<b-form-invalid-feedback :state="isWhitelisted">
				Address {{ resolvedAddress }} is NOT whitelisted
			</b-form-invalid-feedback>
			<b-form-valid-feedback :state="isWhitelisted">
				Address {{ resolvedAddress }} is whitelisted
			</b-form-valid-feedback>
		</b-form-group>
        <div class="text-center">
            <b-button
                type="submit"
                :disabled="!address"
                class="mint-button font-weight-bold border-0"
                >Check</b-button
            >
        </div>
	</b-form>
</template>

<script>
import { ethers } from 'ethers'
import { checkWhitelisted } from '@/utils'

export default {
    data() {
        return {
            address: null,
            isWhitelisted: null,
            resolvedAddress: ''
        }
    },
    methods: {
        onInput(){
            this.isWhitelisted = null
            this.resolvedAddress = null
        },
        async checkWhitelisted() {
            try {
                if(!this.address) return
    
                let addressToCheck = this.address
                if(addressToCheck.endsWith('.eth')){
                    addressToCheck = await this.$smartContract.provider.resolveName(this.address)
                    this.resolvedAddress = addressToCheck
                    console.info(`Address resolved to ${addressToCheck}`)
                }
                else {
                    if(!ethers.utils.isAddress(this.address)) {
                        throw new Error("Provided address format is invalid (bad checksum)")
                    }
                    addressToCheck = ethers.utils.getAddress(this.address)
                }
                
                let { id, whitelist } = this.$siteConfig.smartContract

                try { 
                    const { data } = await this.$axios.get(`/smartcontracts/${id}/whitelist`)
                    whitelist = data
                } catch {}

                const wl = whitelist.map(a => ethers.utils.getAddress(a))
                // console.log('whitelisted', checkWhitelisted(wl, '0x629149b974987fac5dcda210ddb6cc60a0ac7e1b'))
                this.isWhitelisted = checkWhitelisted(wl, addressToCheck)
            } catch (err) {
                console.error(err)
                this.$bvToast.toast(
					err.message || 'Check failed',
					{
						title: 'Whitelist',
						variant: 'danger',
					}
				)
            }
        }
    }
}
</script>