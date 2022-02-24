<template>
	<b-navbar toggleable="lg" type="dark" variant="dark">
		<b-navbar-brand to="/">
			{{ $siteConfig.title }}
			<!-- <b-img src="logo.svg" alt="logo" width="60px" /> -->
		</b-navbar-brand>

		<b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

		<b-collapse id="nav-collapse" is-nav>
			<b-navbar-nav> </b-navbar-nav>

			<!-- Right aligned nav items -->
			<b-navbar-nav class="ml-auto">
				<b-nav-text v-if="user" class="text-white my-auto">
					Hello, {{ user.email }}
				</b-nav-text>
				<b-nav-item v-if="user">
					<b-button variant="outline-light" @click="logout">Logout</b-button>
				</b-nav-item>
				<b-nav-item v-else>
					<b-button variant="outline-light" @click="login">Login</b-button>
				</b-nav-item>
				<b-nav-item>
					<b-button
						variant="outline-light"
						:disabled="!!$wallet.account"
						@click="onWalletConnect">
						<strong>{{ $wallet.accountCompact }}</strong>
					</b-button>
				</b-nav-item>
			</b-navbar-nav>
		</b-collapse>
	</b-navbar>
</template>

<script>
const identity = window.netlifyIdentity

export default {
	data() {
		return {
			user: identity.currentUser(),
		}
	},
	methods: {
		async onWalletConnect() {
			try {
				await this.$wallet.connect()
			} catch (err) {
				console.error({ err })
				this.$bvToast.toast(err.message || 'Wallet connection failed', {
					title: 'Wallet',
					variant: 'danger',
				})
			}
		},
		login() {
			identity.open('login')
		},
		logout() {
			identity.logout()
			this.user = null
		},
	},
}
</script>
