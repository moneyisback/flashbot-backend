import { providers } from 'ethers';

export function getFallbackProvider(): providers.FallbackProvider {
  const rpcProviders: providers.JsonRpcProvider[] = [];

  if (process.env.INFURA_KEY)
    rpcProviders.push(new providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`));

  if (process.env.ALCHEMY_KEY)
    rpcProviders.push(new providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`));

  if (process.env.ANKR_KEY)
    rpcProviders.push(new providers.JsonRpcProvider(`https://rpc.ankr.com/eth/${process.env.ANKR_KEY}`));

  if (rpcProviders.length === 0) {
    console.warn('⚠️ Aucun RPC détecté, fallback sur cloudflare-eth.com');
    rpcProviders.push(new providers.JsonRpcProvider('https://cloudflare-eth.com'));
  }

  return new providers.FallbackProvider(rpcProviders);
}
