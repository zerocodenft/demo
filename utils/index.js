import { MerkleTree } from 'merkletreejs'
import { ethers } from 'ethers'
import { CHAINID_CONFIG_MAP } from '@/utils/metamask'
import { CHAIN_IDS } from '../constants/index'

/**
 *
 * @param {string[]} whitelist
 * @returns {MerkleTree}
 */
const getMerkeTree = (whitelist) => {
	const leafNodes = whitelist.map((a) => ethers.utils.keccak256(a))
	return new MerkleTree(leafNodes, ethers.utils.keccak256, { sortPairs: true })
}

/**
 *
 * @param {string[]} list
 * @param {string} address
 * @returns {string[]} - hex proof
 */
const getHexProof = (list, address) => {
	const merkleTree = getMerkeTree(list)
	return merkleTree.getHexProof(ethers.utils.keccak256(address))
}

/**
 * Check whether wallet address is part of the merkle tree
 * @param {string[]} list
 * @param {string} address
 * @returns {bool}
 */
const checkWhitelisted = (list, address) => {
	const merkleTree = getMerkeTree(list)
	const hexProof = merkleTree.getHexProof(ethers.utils.keccak256(address))
	return merkleTree.verify(
		hexProof,
		ethers.utils.keccak256(address),
		merkleTree.getRoot()
	)
}

const copyToClipboard = async function (value) {
	await navigator.clipboard.writeText(value)
	this.$bvToast.toast('Copied to clipboard!', {
		title: 'Clipboard',
		variant: 'info',
	})
}

/**
 *
 * @param {(int|string)} chainId
 * @param {('nonstatic'|'batch')} [type]
 * @returns
 */
const getProvider = (chainId, type = null) => {
	const providerUrl = CHAINID_CONFIG_MAP[chainId.toString()].rpcUrls[0]
	switch (type) {
		case 'nonstatic':
			return new ethers.providers.JsonRpcProvider(providerUrl)
		case 'batch':
			return new ethers.providers.JsonRpcBatchProvider(providerUrl)
		default:
			return new ethers.providers.StaticJsonRpcProvider(providerUrl)
	}
}

/**
 *
 * @param {int} delay - delay in milliseconds
 * @returns
 */
const wait = (delay) => {
	return new Promise((resolve) => setTimeout(resolve, delay))
}

/**
 *
 * @param {int} chainId
 * @returns {bool}
 */
const isChainSupportedByOS = (chainId) => {
	return [
		CHAIN_IDS.Ethereum,
		CHAIN_IDS.Goerli,
		CHAIN_IDS.Polygon,
		CHAIN_IDS.Mumbai,
		CHAIN_IDS.Klaytn,
		CHAIN_IDS.Baobab,
	].includes(chainId)
}
const SALE_STATUS = Object.freeze({
	Paused: 0,
	Presale: 1,
	Public: 2,
})
export {
	getMerkeTree,
	getHexProof,
	checkWhitelisted,
	copyToClipboard,
	getProvider,
	wait,
	isChainSupportedByOS,
	SALE_STATUS
}