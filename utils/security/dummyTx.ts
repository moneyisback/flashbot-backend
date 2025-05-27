import { Wallet, ethers, BigNumber, providers } from 'ethers'

export async function generateDummyTx({
  wallet,
  provider
}: {
  wallet: Wallet
  provider: providers.JsonRpcProvider
}): Promise<string> {
  const nonce = await provider.getTransactionCount(wallet.address)

  const dummyTx = {
    to: wallet.address, // ou "0x000000000000000000000000000000000000dEaD"
    value: BigNumber.from(0),
    gasLimit: BigNumber.from(21000),
    maxFeePerGas: ethers.utils.parseUnits('100', 'gwei'),
    maxPriorityFeePerGas: ethers.utils.parseUnits('3', 'gwei'),
    nonce: nonce + 1, // important: doit suivre la vraie TX
    chainId: 1,
    type: 2,
    data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes('🐍mev-bait')) // 👻 tag invisible
  }

  const signedDummyTx = await wallet.signTransaction(dummyTx)

  return signedDummyTx
}
