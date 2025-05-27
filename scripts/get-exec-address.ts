// scripts/get-exec-address.ts
import { Wallet } from "ethers";
import dotenv from "dotenv";

dotenv.config();

const wallet = new Wallet(process.env.EXEC_SIGNER_PK!);
console.log("💡 Adresse publique EXEC_SIGNER:", wallet.address);
