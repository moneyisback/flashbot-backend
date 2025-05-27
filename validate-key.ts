import { Wallet } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

try {
  const pk = process.env.PRIVATE_KEY!;
  const wallet = new Wallet(pk.startsWith("0x") ? pk : `0x${pk}`);
  console.log("✅ Valid private key:", wallet.address);
} catch (err) {
  console.error("❌ Invalid key:", (err as Error).message);
}
