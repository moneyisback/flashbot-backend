import { Wallet, providers } from 'ethers'
import dotenv from 'dotenv'
import { generateMulticallTx } from '../../utils/tx/generateMulticallTx'
import { initFlashbots, flashbots } from '../../core/flashbots'

dotenv.config()

const provider = new providers.JsonRpcProvider(process.env.MAINNET_RPC_URL!)
const execSigner = new Wallet(process.env.EXEC_SIGNER_PK!, provider)

const main = async () => {
  console.log('🧠 Initialisation Flashbots...')
  console.log('⚡ Flashbots prêt à bundler !')
await initFlashbots({ authSigner: execSigner })

  const latestBlock = await provider.getBlockNumber()
  const targetBlock = latestBlock + 1

  console.log(`📦 Génération TX multicall (target: ${targetBlock})`)
  const signedTx = await generateMulticallTx({
    wallet: execSigner,
    provider
  })

  console.log('🚀 Envoi du bundle multicall...')
  const response = await flashbots.sendBundle(
    [
      {
        signedTransaction: signedTx
      }
    ],
    targetBlock
  )

  if ('error' in response) {
    console.error('❌ Échec envoi bundle :', response.error.message)
    return
  }

  console.log('✅ Bundle multicall envoyé avec succès !')

  const sim = await response.simulate()
  if ('error' in sim) {
    console.error('⚠️ Simulation échouée :', sim.error.message)
  } else {
    console.log('📊 Résultat simulation :')
    console.dir(sim, { depth: null })
  }

  console.log('🕵️‍♂️ Mode stealth terminé sans fuite.')
}

main().catch((err) => {
  console.error('🔥 Erreur critique Flashbots:', err)
})
