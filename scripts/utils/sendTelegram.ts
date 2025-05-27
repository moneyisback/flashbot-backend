import axios from "axios";

export async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: "Markdown"
  };

  console.log("📡 Envoi Telegram:");
  console.log("➡️ URL:", url);
  console.log("➡️ PAYLOAD:", payload);

  try {
    const res = await axios.post(url, payload);
    console.log("✅ Telegram message sent!", res.data);
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("❌ TELEGRAM SEND FAILED:");
      console.error("🔴 Status:", err.response?.status);
      console.error("🔴 Message:", err.response?.data);
      console.error("➡️ URL:", url);
      console.error("➡️ PAYLOAD:", payload);
    } else {
      console.error("❌ Unknown error:", err);
    }
  }
}
