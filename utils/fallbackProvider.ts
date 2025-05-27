import { providers } from 'ethers'

export const getFallbackProvider = () => {
  return new providers.FallbackProvider([
    new providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`),
    new providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
    new providers.JsonRpcProvider('https://rpc.ankr.com/eth')
  ])
}
