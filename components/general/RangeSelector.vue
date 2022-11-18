<template>
    <div class="d-flex">
        <b-form-input
            :value="value"
            @input="(val) => $emit('input', val)"
            size="lg"
            type="range"
            :min="min"
            :max="max"
            :step="step">
        </b-form-input>
        <h5 class="pl-3 font-weight-bold">{{ value }}</h5>
    </div>
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