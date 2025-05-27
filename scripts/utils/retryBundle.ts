import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle'
import { providers, Wallet, ethers, BigNumber } from 'ethers'
import { Opportunity } from './types'
import { generateDummyTx } from './../../utils/security/dummyTx' // chemin correct selon ton arbre
import { getPaddedGasOptions } from './../../utils/security/gasPad'

interface RetryOptions {
  maxRetries: number
  delayBetweenBlocks: number
}

export async function retryBundleExecution(
  opportunity: Opportunity,
  provider: providers.JsonRpcProvider,
  flashbots: FlashbotsBundleProvider,
  execSigner: Wallet,
  blockNumber: number,
  options: RetryOptions
): Promise<string | null> {
  for (let i = 0; i < options.maxRetries; i++) {
    const targetBlock = blockNumber + i
    console.log(`📦 Retry attempt ${i + 1}/${options.maxRetries} → block ${targetBlock}`)

    try {
      const value = ethers.utils.parseEther(opportunity.profit.toString())
      const gas = getPaddedGasOptions() // ⛽ Aléatoire sécurisé

      const tx = {
        to: opportunity.token,
        value,
        gasLimit: gas.gasLimit,
        maxFeePerGas: gas.maxFeePerGas,
        maxPriorityFeePerGas: gas.maxPriorityFeePerGas,
        nonce: await provider.getTransactionCount(execSigner.address),
        type: 2,
        chainId: 1
      }

      const signedMainTx = await execSigner.signTransaction(tx)
      const signedDummyTx = await generateDummyTx({ wallet: execSigner, provider }) // 🎭 Cloaking

      const bundleResponse = await flashbots.sendRawBundle(
        [signedMainTx, signedDummyTx],
        targetBlock
      )

      const simulation = await flashbots.simulate(
        [signedMainTx, signedDummyTx],
        targetBlock
      )

      if ('error' in simulation) {
        console.warn('⚠️ Simulation failed:', simulation.error.message)
        continue
      }

      if ('wait' in bundleResponse && typeof bundleResponse.wait === 'function') {
        const bundleResult = await bundleResponse.wait()
        if (bundleResult === 0) {
          console.log('✅ Bundle included in block', targetBlock)
          return ethers.utils.keccak256(signedMainTx)
        }
      } else {
        console.warn('⚠️ Unexpected bundle response:', bundleResponse)
      }

    } catch (err) {
      console.error('❌ Retry error:', err)
    }

    await new Promise(res => setTimeout(res, options.delayBetweenBlocks))
  }

  console.warn('❌ Retry failed: bundle not included after all attempts')
  return null
}
