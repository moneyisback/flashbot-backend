import { ethers } from 'ethers'
import dotenv from 'dotenv'

dotenv.config()

export async function testRpcLeak(rpcToTest: string): Promise<void> {
  console.log(`🔍 Test de fuite RPC sur ${rpcToTest}`)

  const provider = new ethers.providers.JsonRpcProvider(rpcToTest)
  const wallet = process.env.LEAK_TEST_PK
    ? new ethers.Wallet(process.env.LEAK_TEST_PK, provider)
    : ethers.Wallet.createRandom()

  const isDryRun = !process.env.LEAK_TEST_PK
  const nonce = await provider.getTransactionCount(wallet.address, 'latest')

  const tx = {
    to: '0x000000000000000000000000000000000000dEaD',
    value: ethers.utils.parseEther('0.00001'),
    gasLimit: 21000,
    maxFeePerGas: ethers.utils.parseUnits('80', 'gwei'),
    maxPriorityFeePerGas: ethers.utils.parseUnits('2', 'gwei'),
    nonce,
    chainId: 1,
    type: 2
  }

  const signedTx = await wallet.signTransaction(tx)
  const txHash = ethers.utils.keccak256(signedTx)

  if (isDryRun) {
    console.log('🧪 Mode DRY-RUN activé : la transaction ne sera PAS envoyée.')
    console.log('💡 Pour un test réel, définis LEAK_TEST_PK dans ton .env avec une clé contenant un peu d’ETH.')
    console.log(`📝 Hash pré-calculé pour check manuellement : ${txHash}`)
    return
  }

  try {
    await provider.sendTransaction(signedTx)
    console.log('🚀 TX envoyée via ton RPC')
    console.log('🕵️‍♂️ Attente 6s pour vérifier les mempools publics...')
    await new Promise(res => setTimeout(res, 6000))

    const checkViaPublicNode = async (label: string, url: string) => {
      const publicProvider = new ethers.providers.JsonRpcProvider(url)
      const tx = await publicProvider.getTransaction(txHash)
      if (tx) {
        console.log(`🚨 TX détectée sur ${label} ! → Ton RPC est PUBLIC ou fuit !`)
      } else {
        console.log(`✅ ${label} : pas de trace → OK`)
      }
    }

    await checkViaPublicNode('INFURA', `https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`)
    await checkViaPublicNode('ALCHEMY', `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_KEY}`)

    await checkViaPublicNode('FLASHBOTS RELAY', 'https://relay.flashbots.net')

    console.log(`🔁 Test terminé pour ${rpcToTest}`)

  } catch (err) {
    console.error('❌ Erreur d’envoi ou de détection :', err)
  }
}
