import dotenv from 'dotenv'
import { testRpcLeak } from '../../utils/security/rpcLeakDetector'

dotenv.config()

async function main() {
  const rpcUrl = process.env.MAINNET_RPC_URL

  if (!rpcUrl) {
    console.error('❌ MAINNET_RPC_URL introuvable dans .env')
    process.exit(1)
  }

  console.log('🛰️ Détection de fuite RPC...')
  await testRpcLeak(rpcUrl)
}

main()
