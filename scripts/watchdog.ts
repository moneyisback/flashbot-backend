import axios from "axios";
import fs from "fs";
import { config } from "dotenv";
config();

const CHECK_INTERVAL = 60 * 1000;
const TIMEOUT_LIMIT = 10 * 60 * 1000;

const WATCHDOG_WEBHOOK = process.env.DISCORD_WEBHOOK_URL || "";
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const LOG_PATH = "./logs/trigger-log.csv";

function sendDiscordAlert(content: string) {
  if (!WATCHDOG_WEBHOOK) return;
  return axios.post(WATCHDOG_WEBHOOK, {
    content,
    username: "🛡️ Watchdog",
  });
}

function sendTelegramAlert(text: string) {
  if (!TELEGRAM_TOKEN || !TELEGRAM_CHAT_ID) return;
  return axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    { chat_id: TELEGRAM_CHAT_ID, text }
  );
}

function getLastExecution(): number | null {
  if (!fs.existsSync(LOG_PATH)) return null;
  const lines = fs.readFileSync(LOG_PATH, "utf-8").trim().split("\n");
  const last = lines[lines.length - 1];
  const timestamp = new Date(last.split(",")[0]);
  return timestamp.getTime();
}

async function loop() {
  console.log("🛡️ Watchdog lancé...");

  setInterval(async () => {
    const now = Date.now();
    const last = getLastExecution();

    if (!last) {
      const msg = "❌ Aucun log dans trigger-log.csv";
      console.warn(msg);
      await sendDiscordAlert(msg);
      await sendTelegramAlert(msg);
      return;
    }

    const delta = now - last;
    const sec = Math.floor(delta / 1000);

    if (delta > TIMEOUT_LIMIT) {
      const msg = `⚠️ Aucune exécution depuis ${sec}s`;
      console.error(msg);
      await sendDiscordAlert(msg);
      await sendTelegramAlert(msg);
    } else {
      console.log(`✅ Dernière exec il y a ${sec}s`);
    }
  }, CHECK_INTERVAL);
}

loop();
