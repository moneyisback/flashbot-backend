// utils/telegram.js
const axios = require("axios");

const token = process.env.TELEGRAM_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramMessage(message) {
  try {
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: "Markdown",
    });
  } catch (err) {
    console.error("❌ Erreur Telegram:", err.message);
  }
}

module.exports = { sendTelegramMessage };
