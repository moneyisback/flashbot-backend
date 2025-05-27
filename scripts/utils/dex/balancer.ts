import { BigNumber, Contract, providers } from "ethers";
import BalancerVaultABI from "./abi/BalancerVaultABI.json";

const BALANCER_VAULT_ADDRESS = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

/**
 * 🔁 Récupère la quantité estimée de `tokenOut` qu'on recevrait pour `amountIn` de `tokenIn` sur Balancer
 */
export async function getBalancerQuote(
  provider: providers.JsonRpcProvider,
  tokenIn: string,
  tokenOut: string,
  amountIn: BigNumber
): Promise<BigNumber> {
  const vault = new Contract(BALANCER_VAULT_ADDRESS, BalancerVaultABI, provider);

  try {
    const result = await vault.queryBatchSwap(
      0, // SwapKind.GIVEN_IN
      [
        {
          poolId: "0x...", // 🔁 À remplir dynamiquement si tu veux automatiser
          assetIn: tokenIn,
          assetOut: tokenOut,
          amount: amountIn,
          userData: "0x",
        },
      ],
      [tokenIn, tokenOut],
      {
        sender: "0x0000000000000000000000000000000000000000",
        recipient: "0x0000000000000000000000000000000000000000",
        fromInternalBalance: false,
        toInternalBalance: false,
      }
    );

    const amountOut = result[1]; // Index du tokenOut
    return amountOut.abs(); // pour convertir les tokens reçus (en négatif dans leur protocole)
  } catch (err: any) {
    console.warn(`⚠️ Balancer quote failed: ${err.message}`);
    return BigNumber.from("0");
  }
}
