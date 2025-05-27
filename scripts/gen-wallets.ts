import { Wallet } from 'ethers';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(__dirname, '../.env');

function logAndAppend(name: string, wallet: Wallet) {
  const line = `${name}=${wallet.privateKey}`;
  console.log(`🔐 ${name} Wallet Address: ${wallet.address}`);
  console.log(`🔑 ${line}`);
  fs.appendFileSync(envPath, `\n${line}`);
}


function createWallets() {
  const authSigner = Wallet.createRandom();
  const execSigner = Wallet.createRandom();

  console.log('🧪 Génération des wallets MEV...');
  logAndAppend('AUTH_SIGNER_PK', authSigner);
  logAndAppend('EXEC_SIGNER_PK', execSigner);

  console.log('\n✅ Clés ajoutées à ton .env 🔐\n');
}

createWallets();
