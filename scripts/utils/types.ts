import { BigNumber } from 'ethers';

export interface Opportunity {
  token: string;
  tokenB?: string;
  spread: number;
  profit: number;
  dex: string;
  pairId: string;
  amount: BigNumber; // ✅ BigNumber pour cohérence avec executeBundle
}
