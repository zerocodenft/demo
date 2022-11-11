<template>
	<div class="d-flex flex-column">
		<Countdown v-if="showCountdown" :date="dropDate" />
		<div v-if="!showCountdown">
			<h5 v-if="!$siteConfig.isCounterHidden" class="pt-2 text-center">
				Minted: {{ mintedCount }}/{{ collectionSize }}
			</h5>
			<div v-if="mintMax > 1" class="mb-2">
				<component
					:is="mintCountSelector"
					v-model.number="mintCount"
					:max="mintMax"
				></component>
			</div>
			<component
				:is="mintBtnComponent"
				:mintCount="mintCount"
				:soldOut="soldOut"
			/>
			<b-modal
				v-model="$store.state.isBusy"
				body-class="text-center"
				title="Loading..."
				size="lg"
				centered
				no-close-on-backdrop
				no-close-on-esc
				hide-footer
				hide-header-close
			>
				<h4
					v-if="$store.state.isBusyMessage"
					v-html="$store.state.isBusyMessage"
					class="break-word"
				></h4>
				<b-spinner
					style="width: 3rem; height: 3rem;"
					class="m-3"
					label="Loading..."
					type="grow"
				></b-spinner>
			</b-modal>
		</div>
	</div>
</template>

<script>
import { MINT_SELECTOR_TYPE, SALE_STATUS } from '@/constants'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
dayjs.extend(utc)
dayjs.extend(timezone)

export default {
	data() {
		return {
			mintCount: 1,
			mintedCount: 0,
			collectionSize: this.$siteConfig.smartContract.collectionSize,
			intervalId: null,
			saleStatus: SALE_STATUS.Paused,
		}
	},
	created() {
		this.refreshStats()

		if (!this.$nuxt.context.isDev) {
			this.intervalId = setInterval(this.refreshStats, 10000)
		}
	},
	beforeDestroy() {
		clearInterval(this.intervalId)
	},
	computed: {
		mintBtnComponent() {
			switch (this.$siteConfig.mintBtnVersion) {
				case 'V2':
					return 'MintButtonV2'
				case 'V3':
					return 'MintButtonV3'
				default:
					return 'MintButtonV2'
				// default: return 'MintButtonV3'
			}
		},
		mintCountSelector() {
			return this.$siteConfig.mintCountSelectorType === MINT_SELECTOR_TYPE.Range
				? 'RangeSelector'
				: 'SpinButton'
		},
		dropDate() {
			const { dropDate, dropTimeZone } = this.$siteConfig
			return dayjs.utc(dropDate).tz(dropTimeZone).format()
		},
		showCountdown() {
			// console.log(this.dropDate, new Date(this.dropDate) > new Date())
			return new Date(this.dropDate) > new Date()
		},
		soldOut() {
			return this.mintedCount >= this.collectionSize
		},
		mintMax() {
			const {
				maxTokensPerTransaction,
				maxTokensPerPersonOnWhitelist,
				collectionSize,
			} = this.$siteConfig.smartContract

			return this.saleStatus === SALE_STATUS.Presale
				? maxTokensPerPersonOnWhitelist
				: maxTokensPerTransaction || collectionSize
		},
	},
	methods: {
		async refreshStats() {
			try {
				this.saleStatus = await this.$smartContract.saleStatus()

				if (!this.$siteConfig.isCounterHidden) {
					this.mintedCount = +(await this.$smartContract.totalSupply())
				}

				if (this.soldOut) {
					clearInterval(this.intervalId)
				}

				console.group('Updates')
				console.info('Sale status', SALE_STATUS[this.saleStatus])
				console.info('Minted count:', this.mintedCount)
				console.groupEnd()
			} catch (err) {
				console.error({ err })
			}
		},
	},
}
</script>
