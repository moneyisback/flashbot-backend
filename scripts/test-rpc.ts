// scripts/test-rpc.ts
import { providers } from 'ethers';
const provider = new providers.FallbackProvider([
  new providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`),
  new providers.JsonRpcProvider(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`)
]);

async function main() {
  const block = await provider.getBlockNumber();
  console.log('✅ Block:', block);
}
main().catch(console.error);
