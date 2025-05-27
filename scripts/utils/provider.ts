// utils/provider.ts
import { providers } from 'ethers';

export function getFallbackProvider(): providers.FallbackProvider {
  const rpcProviders: providers.JsonRpcProvider[] = [];

  if (process.env.INFURA_KEY) {
    rpcProviders.push(
      new providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`)
    );
  }

  if (process.env.ALCHEMY_KEY) {
    rpcProviders.push(
      new providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`)
    );
  }

  if (process.env.ANKR_KEY) {
    rpcProviders.push(
      new providers.JsonRpcProvider(`https://rpc.ankr.com/eth/${process.env.ANKR_KEY}`)
    );
  }

  return new providers.FallbackProvider(rpcProviders);
}
