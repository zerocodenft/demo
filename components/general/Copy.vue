<template>
    <b-button size="sm" variant="link" @click="copyToClipboard(value)"></b-button>   
</template>

<script>
import { copyToClipboard } from '@/utils'

export default {
    props: ['value'],
    methods: {
        copyToClipboard
    }
}
</script>