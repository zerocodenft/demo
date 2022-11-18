export const state = () => ({
	isBusy: false,
	isBusyMessage: null,
})

export const getters = {}

export const mutations = {
	setBusy(state, { isBusy, message }) {
		state.isBusy = isBusy
		state.isBusyMessage = message
	},
}

export const actions = {}