import { Wallet, providers, utils } from 'ethers'

interface GenerateTxParams {
  wallet: Wallet
  provider: providers.JsonRpcProvider
}

export const generateMulticallTx = async ({
  wallet,
  provider
}: GenerateTxParams): Promise<string> => {
  const nonce = await provider.getTransactionCount(wallet.address)
  const gasLimit = 21000
  const maxFeePerGas = utils.parseUnits('80', 'gwei')
  const maxPriorityFeePerGas = utils.parseUnits('2', 'gwei')

  const tx = {
    to: '0x000000000000000000000000000000000000dead',
    value: utils.parseEther('0.001'),
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    type: 2,
    chainId: 1
  }

  return await wallet.signTransaction(tx)
}
