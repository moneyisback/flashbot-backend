// utils/checkEthBalance.ts
import { ethers } from 'ethers'

export async function checkExecSignerBalance(execSignerPK: string, provider: ethers.providers.Provider) {
  const wallet = new ethers.Wallet(execSignerPK, provider)
  const address = await wallet.getAddress()
  const balance = await provider.getBalance(address)

  const ethBalance = Number(ethers.utils.formatEther(balance))

  console.log(`💰 Balance EXEC_SIGNER: ${ethBalance} ETH`)

  if (ethBalance < 0.01) {
    throw new Error(`❌ Balance trop faible pour EXEC_SIGNER (${ethBalance} ETH). Ajoute du gaz !`)
  }
}
