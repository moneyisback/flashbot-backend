import { Wallet, JsonRpcProvider, formatEther } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

const EXEC_SIGNER_PK = process.env.EXEC_SIGNER_PK
if (!EXEC_SIGNER_PK) {
  console.error('❌ Clé EXEC_SIGNER_PK manquante dans .env')
  process.exit(1)
}

const provider = new JsonRpcProvider(
  `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`
)

const wallet = new Wallet(EXEC_SIGNER_PK, provider)

async function trackExec() {
  const address = await wallet.getAddress()

  try {
    const balance = await provider.getBalance(address)
    const txCount = await provider.getTransactionCount(address)

    console.clear()
    console.log(`\n🖥️  WALLET DASHBOARD LIVE  👁️`)
    console.log(`├ Adresse         : ${address}`)
    console.log(`├ 💰 Balance (ETH): ${formatEther(balance)}`)
    console.log(`└ 📦 TX Count     : ${txCount}`)
  } catch (err) {
    console.error('❌ Erreur de récupération :', err)
  }
}

setInterval(trackExec, 10_000)
trackExec()
