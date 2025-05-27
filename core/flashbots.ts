import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle'
import { Wallet, providers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const authSigner = new Wallet(process.env.FLASHBOTS_RELAY_SIGNING_KEY!)
const relayURL = process.env.FLASHBOTS_RELAY || 'https://relay.flashbots.net'

export let flashbots: FlashbotsBundleProvider

export const initFlashbots = async ({
  authSigner,
}: {
  authSigner: Wallet
}) => {
  if (flashbots) return flashbots
  flashbots = await FlashbotsBundleProvider.create(
    new providers.JsonRpcProvider(process.env.MAINNET_RPC_URL!),
    authSigner,
    process.env.FLASHBOTS_RELAY || 'https://relay.flashbots.net',
    'mainnet'
  )
  return flashbots
}
