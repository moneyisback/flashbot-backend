import { exec } from "child_process";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function triggerExecutor() {
  console.log("⚡ Déclenchement manuel du Flashloan Executor...");

  exec("npx ts-node scripts/executor-flashbots.ts", async (err, stdout, stderr) => {
    if (err) {
      console.error("❌ Erreur de lancement:", err.message);
      await sendTelegram(`❌ Erreur lors du déclenchement : ${err.message}`);
      return;
    }

    if (stderr) {
      console.warn("⚠️ stderr:", stderr);
    }

    console.log("✅ stdout:\n", stdout);
    await sendTelegram(`⚡ Flashloan Executor lancé avec succès ! 🚀`);
  });
}

async function sendTelegram(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️ TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID manquant");
    return;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown"
    });
  } catch (err: any) {
    console.error("❌ Échec envoi Telegram:", err.message);
  }
}

triggerExecutor().catch((err) => {
  console.error("❌ Trigger script error:", err);
});
