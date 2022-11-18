<template>
	<b-navbar toggleable="lg" class="zc-navbar">
		<b-navbar-brand to="/" class="zc-text">
			{{ $siteConfig.title }}
			<!-- <b-img src="logo.svg" alt="logo" width="60px" /> -->
		</b-navbar-brand>

		<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

		<b-collapse
			id="nav-collapse"
			is-nav
			@show="updatePosition({ minimal: true })"
			@hide="updatePosition({ minimal: false })">
			<b-navbar-nav>
				<b-nav-item
					v-if="$siteConfig.smartContract.hasWhitelist"
					link-classes="zc-text"
					class="text-center zc-text"
					to="/whitelist"
					>Whitelist</b-nav-item
				>
			</b-navbar-nav>

			<!-- Right aligned nav items -->
			<b-navbar-nav class="ml-auto"></b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
import { copyToClipboard } from '@/utils'

export default {
	methods: {
		copyToClipboard,
		updatePosition(settings) {
			this.$onboard.state.actions.updateAccountCenter({
				...settings,
			})
		},
	},
}
</script>
