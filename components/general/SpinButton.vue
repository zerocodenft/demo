<template>
    <b-form-spinbutton
        :value="value"
        @input="(val) => $emit('input', val)"
        :min="min"
        :max="max"
        :step="step">
    </b-form-spinbutton>
</template>

<script>
export default {
    props: {
        value: {
            type: Number
        },
        max: {
            type: Number,
            default: 1
        },
        min: {
            type: Number,
            default: 1
        },
        step: {
            type: Number,
            default: 1
        },
    },
}
</script>