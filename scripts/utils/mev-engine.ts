import { BigNumber, ethers, providers, Wallet } from 'ethers';
import { FlashbotsBundleProvider } from '@flashbots/ethers-provider-bundle';
import { Opportunity } from './types';

interface ExecuteBundleParams {
  opportunity: Opportunity;
  provider: providers.JsonRpcProvider;
  flashbotsProvider: FlashbotsBundleProvider;
  execSigner: Wallet;
  blockNumber: number;
}

// 🚀 Exported: simulate a best MEV opportunity (replace with your real logic)
export async function getBestOpportunity(blockNumber: number): Promise<Opportunity | null> {
  const opportunity: Opportunity = {
    token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    spread: 1.2,
    profit: 0.05,
    dex: 'Uniswap',
    pairId: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
    amount: ethers.utils.parseEther('1') // ✅ BigNumber
  };

  return opportunity;
}

// 🚛 Execution via Flashbots bundle
export async function executeBundle({
  opportunity,
  provider,
  flashbotsProvider,
  execSigner,
  blockNumber
}: ExecuteBundleParams): Promise<string | null> {
  try {
    const targetAddress = opportunity.token;
    const amount = ethers.utils.parseEther(opportunity.profit.toString());

    const tx = {
      to: targetAddress,
      value: amount,
      gasLimit: BigNumber.from(process.env.GAS_LIMIT || '800000'),
      maxFeePerGas: ethers.utils.parseUnits(process.env.GAS_MAX_FEE_GWEI || '120', 'gwei'),
      maxPriorityFeePerGas: ethers.utils.parseUnits(process.env.GAS_PRIORITY_FEE_GWEI || '5', 'gwei'),
      type: 2,
      chainId: 1,
      nonce: await provider.getTransactionCount(execSigner.address),
    };

    const signedTx = await execSigner.signTransaction(tx);

    const bundleResponse = await flashbotsProvider.sendRawBundle(
      [signedTx],
      blockNumber + 1
    );

    const simulation = await flashbotsProvider.simulate(
      [signedTx],
      blockNumber + 1
    );

    if ('error' in simulation) {
      console.error('❌ Simulation failed:', simulation.error.message);
      return null;
    }

    console.log('✅ Simulation succeeded');

    if ('wait' in bundleResponse && typeof bundleResponse.wait === 'function') {
      const bundleResult = await bundleResponse.wait();

      if (bundleResult === 0) {
        console.log('✅ Bundle included!');
        return ethers.utils.keccak256(signedTx);
      } else {
        console.log('❌ Bundle not included.');
        return null;
      }
    } else {
      console.error('❌ Error sending bundle:', (bundleResponse as any).error?.message || bundleResponse);
      return null;
    }
  } catch (err) {
    console.error('❌ Error in executeBundle():', err);
    return null;
  }
}
