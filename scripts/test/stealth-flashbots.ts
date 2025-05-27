import { Wallet, providers } from 'ethers'
import dotenv from 'dotenv'
import { generateMulticallTx } from '../../utils/tx/generateMulticallTx'
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle'

dotenv.config()

async function main() {
  const provider = new providers.JsonRpcProvider(process.env.MAINNET_RPC_URL!)
  const execSigner = new Wallet(process.env.EXEC_SIGNER_PK!, provider)

  const authSigner = Wallet.createRandom() // clé random flashbots
  const flashbots = await FlashbotsBundleProvider.create(
    provider,
    authSigner,
    process.env.FLASHBOTS_RELAY!,
    'mainnet'
  )

  console.log(`\n🔐 Envoi du bundle stealth-mode...`)

  const signedTx = await generateMulticallTx({ wallet: execSigner, provider })

  const blockNumber = await provider.getBlockNumber()
  const bundle = [
    {
      signedTransaction: signedTx
    }
  ]

  const response = await flashbots.sendBundle(bundle, blockNumber + 1)

  if ('error' in response) {
    console.error('❌ Erreur bundle :', response.error.message)
    return
  }

  const sim = await response.simulate()
  if ('error' in sim) {
    console.error('⚠️  Erreur simulation :', sim.error.message)
  } else {
    console.log('✅ Résultat de simulation :', sim)
  }
}

main().catch(err => {
  console.error('❌ Fatal flashbot fail:', err)
})
