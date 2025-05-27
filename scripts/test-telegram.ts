import * as dotenv from "dotenv";
dotenv.config(); // 👈 DOIT ÊTRE EN TÊTE ABSOLUE

import { sendTelegramAlert } from "./utils/sendTelegram";

// 🔍 Ajoute un DEBUG ENV pour vérifier qu’il lit bien le .env
console.log("🔍 ENV DEBUG", {
  TG_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  TG_CHAT_ID: process.env.TELEGRAM_CHAT_ID
});

sendTelegramAlert("✅ *Test alert from Sancho the Bot*")
  .then(() => {
    console.log("📲 Message envoyé !");
  })
  .catch(console.error);
