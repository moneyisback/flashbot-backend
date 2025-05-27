import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle'
import { Wallet, ethers, providers, BigNumber } from 'ethers'

export async function simulateWithProtection({
  opportunity,
  provider,
  flashbotsProvider,
  execSigner,
  blockNumber
}: {
  opportunity: {
    token: string
    profit: number
    amount: BigNumber
  }
  provider: providers.JsonRpcProvider
  flashbotsProvider: FlashbotsBundleProvider
  execSigner: Wallet
  blockNumber: number
}): Promise<boolean> {
  try {
    const targetAddress = opportunity.token
    const value = ethers.utils.parseEther(opportunity.profit.toString())

    const tx = {
      to: targetAddress,
      value,
      gasLimit: BigNumber.from(process.env.GAS_LIMIT || '800000'),
      maxFeePerGas: ethers.utils.parseUnits(process.env.GAS_MAX_FEE_GWEI || '120', 'gwei'),
      maxPriorityFeePerGas: ethers.utils.parseUnits(process.env.GAS_PRIORITY_FEE_GWEI || '5', 'gwei'),
      type: 2,
      chainId: 1,
      nonce: await provider.getTransactionCount(execSigner.address),
    }

    const signedTx = await execSigner.signTransaction(tx)

    const simulation = await flashbotsProvider.simulate(
      [signedTx],
      blockNumber + 1
    )

    // Check for simulation error or missing results
    if (!simulation || ('firstRevert' in simulation) || !('results' in simulation) || !simulation.results || simulation.results.length === 0) {
      console.warn('⚠️ Aucune simulation retournée → possible saturation réseau ou problème Flashbots')
      return true
    }

    const suspiciousLogs = simulation.results.some(log =>
      'error' in log &&
      typeof log.error === 'string' &&
      (
        log.error.toLowerCase().includes('insufficient') ||
        log.error.toLowerCase().includes('duplicate') ||
        log.error.toLowerCase().includes('already used') ||
        log.error.toLowerCase().includes('conflict') ||
        log.error.toLowerCase().includes('bundle')
      )
    )

    if (suspiciousLogs) {
      console.warn('🚨 Présence potentielle d’un autre bot détectée sur cette paire !')
      return true
    }

    console.log('✅ Simulation propre → Pas de concurrence visible')
    return false

  } catch (err) {
    console.error('❌ Erreur dans simulateWithProtection:', err)
    return true // Mieux vaut être parano dans ce cas
  }
}
