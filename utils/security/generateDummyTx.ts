import { Wallet, providers, utils } from 'ethers'

export async function generateDummyTx({
  wallet,
  provider,
}: {
  wallet: Wallet
  provider: providers.JsonRpcProvider
}) {
  const tx = {
    to: '0x000000000000000000000000000000000000dEaD',
    value: utils.parseEther('0.001'),
    gasLimit: 21000,
    maxFeePerGas: utils.parseUnits('80', 'gwei'),
    maxPriorityFeePerGas: utils.parseUnits('2', 'gwei'),
    nonce: await provider.getTransactionCount(wallet.address),
    type: 2,
    chainId: 1,
  }

  return tx
}
