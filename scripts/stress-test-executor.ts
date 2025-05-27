import { runFlashloanExecutor } from "./executor-flashbots";

const TOTAL_RUNS = parseInt(process.env.STRESS_TEST_RUNS || "5", 10);
const DELAY_MS = parseInt(process.env.STRESS_TEST_DELAY || "1000", 10);

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
  console.log(`🚀 Lancement du stress test : ${TOTAL_RUNS} exécutions avec ${DELAY_MS}ms entre chaque.`);

  for (let i = 0; i < TOTAL_RUNS; i++) {
    console.log(`\n⚡ Run #${i + 1}...`);
    try {
      await runFlashloanExecutor();
    } catch (err) {
      console.error(`❌ Erreur sur le run #${i + 1}:`, err);
    }
    await delay(DELAY_MS);
  }

  console.log("\n✅ Stress test terminé.");
})();
