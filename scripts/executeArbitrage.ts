// scripts/executeArbitrage.ts
import { ethers, parseUnits, Interface, JsonRpcProvider, Wallet } from 'ethers'
const { BigNumber } = ethers
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle'
import dotenv from 'dotenv'
dotenv.config()

const provider = new JsonRpcProvider(process.env.RPC_URL)
const wallet = new Wallet(process.env.PRIVATE_KEY!, provider)
const flashbotsAuthSigner = new Wallet(process.env.FLASHBOTS_RELAY_SIGNING_KEY!)

const EXECUTOR_CONTRACT = process.env.FLASHBOT_EXECUTOR_ADDRESS!

export async function executeArbitrage(params: {
  token: string;
  fromDex: string;
  toDex: string;
  amount: BigNumber;
}) {
  const flashbots = await FlashbotsBundleProvider.create(
    provider,
    flashbotsAuthSigner,
    process.env.FLASHBOTS_RELAY || 'https://relay.flashbots.net',
    
  )

  const nonce = await provider.getTransactionCount(wallet.address)

  const calldata = new Interface([
    'function executeArbitrage(address token, address weth, uint256 amount, string fromDex, string toDex)'
  ]).encodeFunctionData('executeArbitrage', [
    params.token,
    process.env.FLASHLOAN_TARGET_TOKEN_ADDRESS, // WETH
    params.amount,
    params.fromDex,
    params.toDex
  ])

  const tx = {
    to: EXECUTOR_CONTRACT,
    data: calldata,
    type: 2,
    gasLimit: parseUnits(process.env.GAS_LIMIT || '800000', 0),
    maxFeePerGas: parseUnits(process.env.GAS_MAX_FEE_GWEI || '120', 'gwei'),
    maxPriorityFeePerGas: parseUnits(process.env.GAS_PRIORITY_FEE_GWEI || '5', 'gwei'),
    chainId: 1,
    nonce
  }

  const signedTx = await wallet.signTransaction(tx)
  const block = await provider.getBlockNumber()

  const bundleResponse = await flashbots.sendRawBundle([signedTx], block + 1)

  if ('error' in bundleResponse) {
    console.error('💥 Flashbots error:', bundleResponse.error)
    return
  }

  console.log('✅ Bundle envoyé ! Attente d’inclusion...')
}
