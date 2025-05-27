import { Wallet, providers } from 'ethers'
import dotenv from 'dotenv'
import axios from 'axios'
import Table from 'cli-table3'
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle'

import { sendTelegramAlert } from './utils/telegram'
import { sendDiscordAlert } from '../utils/discord'
import { pingWatchdog } from './utils/watchdog'
import { logToCSV } from './utils/logger'
import { isBlacklisted, blacklistPair } from '../utils/blacklist'
import { getBestOpportunity } from './utils/mev-engine'
import { retryBundleExecution } from './utils/retryBundle'
import { simulateWithProtection } from '../utils/security/simulateWithProtection'

dotenv.config()

const provider = new providers.JsonRpcProvider(process.env.MAINNET_RPC_URL!)
const wallet = new Wallet(process.env.EXEC_SIGNER_PK!, provider)
const BACKEND_API_URL = process.env.BACKEND_API_URL!
const API_SECRET = process.env.API_SECRET!
const DRY_RUN = process.env.DRY_RUN === 'true'
const COOLDOWN_MS = 10_000

let lastExecution = 0

async function main() {
  console.log('🔌 Initialisation du FlashbotsProvider...')

  const flashbotsProvider = await FlashbotsBundleProvider.create(
    provider,
    wallet,
    process.env.FLASHBOTS_RELAY || 'https://relay.flashbots.net',
    'mainnet'
  )

  console.log('✅ FlashbotsProvider prêt')
  console.log('🔎 Scanner actif...')

  provider.on('block', async (blockNumber) => {
    const now = Date.now()

    try {
      await pingWatchdog()

      const opportunity = await getBestOpportunity(blockNumber)
      if (!opportunity) return

      const { token, spread, profit, dex, pairId } = opportunity

      if (isBlacklisted(pairId)) {
        console.log(`⛔ Blacklisted pair: ${pairId}`)
        return
      }

      if (spread <= 0) {
        blacklistPair(pairId)
        console.log(`⚠️ Spread nul → Auto-blacklist : ${pairId}`)
        return
      }

      // 🔒 Check si l'opp est contestée
      const isContested = await simulateWithProtection({
        opportunity,
        provider,
        flashbotsProvider,
        execSigner: wallet,
        blockNumber
      })

      if (isContested) {
        console.log('🛑 Opportunité contestée → SKIP')
        return
      }

      const oppData = {
        timestamp: new Date().toISOString(),
        block: blockNumber,
        token,
        spread,
        profit,
        dex,
        pairId
      }

      const table = new Table({
        head: ['Bloc', 'Token', 'DEX', 'Spread (%)', 'Profit (ETH)', 'Pair ID'],
        colWidths: [10, 20, 15, 15, 18, 42]
      })

      table.push([
        blockNumber,
        token,
        dex,
        spread.toFixed(2),
        profit.toFixed(6),
        pairId.slice(0, 40) + (pairId.length > 40 ? '...' : '')
      ])

      console.log(table.toString())
      logToCSV(oppData.timestamp, blockNumber, token, spread, profit)

      await axios.post(`${BACKEND_API_URL}/api/opportunities`, oppData, {
        headers: { Authorization: `Bearer ${API_SECRET}` }
      })

      await sendTelegramAlert(
        `🚨 Opportunité MEV détectée:\n📦 Bloc: ${blockNumber}\n🪙 Token: ${token}\n📊 Spread: ${spread}\n💰 Profit: ${profit} ETH\n🌉 DEX: ${dex}`
      )

      await sendDiscordAlert(
        `🟣 *MEV détecté*\n🧱 Bloc: ${blockNumber}\n🪙 Token: ${token}\n📈 Spread: ${spread}%\n💰 Profit: ${profit} ETH\n🔁 DEX: ${dex}`
      )

      if (now - lastExecution < COOLDOWN_MS) {
        console.log('🕒 Cooldown actif, skip...')
        return
      }

      if (DRY_RUN) {
        console.log('🧪 DRY_RUN → Aucune transaction envoyée.')
        lastExecution = now
        return
      }

      console.log('🚀 Envoi bundle (retry)...')

      const txHash = await retryBundleExecution(
        opportunity,
        provider,
        flashbotsProvider,
        wallet,
        blockNumber,
        {
          maxRetries: 5,
          delayBetweenBlocks: 1000
        }
      )

      if (txHash) {
        await sendTelegramAlert(`✅ TX envoyée\n🔗 https://etherscan.io/tx/${txHash}`)
        await sendDiscordAlert(`✅ TX envoyée\n🔗 https://etherscan.io/tx/${txHash}`)
        lastExecution = now
      }
    } catch (err) {
      console.error('❌ Erreur Scanner:', err)
      console.log('🧾 Wallet utilisé:', wallet.address)
    }
  })
}

main()
