// generate-key.ts
import { Wallet } from 'ethers';

const wallet = Wallet.createRandom();

console.log('✅ Nouvelle adresse générée :');
console.log(`Adresse: ${wallet.address}`);
console.log(`Private Key: ${wallet.privateKey}`);
