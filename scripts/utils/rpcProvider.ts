import { ethers } from "ethers";

export const rpcProvider = new ethers.JsonRpcProvider(process.env.MAINNET_RPC_URL!);
