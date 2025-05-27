import { main as scanner } from "./scanner-arbitrage";
import { main as executor } from "./executor-flashbots";

async function launchBot() {
  console.log("🚀 Initialisation du SCAN + EXECUTION...");

  try {
    await scanner(); // Lance le scanner pour détecter les arbitrages
    await executor(); // Lance l'executor pour envoyer les transactions Flashbots
  } catch (error) {
    console.error("❌ Erreur dans le launcher:", error);
  }
}

// Lancement automatique
launchBot();
