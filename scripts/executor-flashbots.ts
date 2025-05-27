import { ethers, Wallet, BigNumber } from 'ethers'
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle'
import dotenv from 'dotenv'
import FlashloanABI from '../artifacts/contracts/FlashloanArbitrage.sol/FlashloanArbitrage.json'
dotenv.config()

// ✅ Provider vers le mainnet
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL)

// ✅ Wallet qui paie les frais de gas
const wallet = new Wallet(process.env.PRIVATE_KEY!, provider)

// ✅ Auth pour Flashbots
const flashbotsAuthSigner = new Wallet(process.env.FLASHBOTS_RELAY_SIGNING_KEY!)

async function main() {
  console.log('🚀 Executor started...')
  console.log('👤 Executor wallet:', wallet.address)

  // ✅ Connexion Flashbots
  const flashbots = await FlashbotsBundleProvider.create(
    provider,
    flashbotsAuthSigner,
    process.env.FLASHBOTS_RELAY || 'https://relay.flashbots.net',
    'mainnet'
  )

  // ✅ Chargement du contrat
  const contract = new ethers.Contract(
    process.env.FLASHLOAN_CONTRACT_ADDRESS!,
    FlashloanABI.abi,
    wallet
  )

  // ✅ Paramètres
  const gasLimit = BigNumber.from(process.env.GAS_LIMIT || '800000')
  const gasPriorityFee = ethers.utils.parseUnits(process.env.GAS_PRIORITY_FEE_GWEI || '5', 'gwei')
  const gasMaxFee = ethers.utils.parseUnits(process.env.GAS_MAX_FEE_GWEI || '120', 'gwei')

  const tokenA = process.env.FLASHLOAN_TOKEN_ADDRESS!
  const tokenB = process.env.FLASHLOAN_TARGET_TOKEN_ADDRESS!
  const amount = ethers.utils.parseUnits(process.env.FLASHLOAN_AMOUNT || '1000', 6) // USDC (6 déc)

  const blockNumber = await provider.getBlockNumber()
  console.log('📦 Preparing Flashbots bundle for block', blockNumber + 1)

  // ✅ Préparation tx de contrat
  const txRequest = await contract.populateTransaction.executeArbitrage(tokenA, tokenB, amount)

  const fullTx = {
    ...txRequest,
    gasLimit,
    maxFeePerGas: gasMaxFee,
    maxPriorityFeePerGas: gasPriorityFee,
    nonce: await provider.getTransactionCount(wallet.address),
    type: 2,
    chainId: 1
  }

  // ✅ Signature
  const signedTx = await wallet.signTransaction(fullTx)

  // ✅ Envoi du bundle
  const bundleResponse = await flashbots.sendRawBundle([signedTx], blockNumber + 1)

  if ('error' in bundleResponse) {
    const message = (typeof bundleResponse.error === 'object' && 'message' in bundleResponse.error)
      ? (bundleResponse.error as { message: string }).message
      : bundleResponse.error

    console.error('💥 Flashbots error:', message)
    return
  }

  console.log('✅ Bundle envoyé à Flashbots :', bundleResponse)
}

main().catch((err) => {
  console.error('🔥 Executor crashed:', err)
})
