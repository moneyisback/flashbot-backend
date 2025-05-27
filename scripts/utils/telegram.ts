import axios from 'axios';

export async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  const payload = {
    chat_id: chatId,
    text: message,
    parse_mode: undefined // ❌ ENLÈVE parse_mode pour TEST
  };

  console.log("📡 Envoi Telegram:");
  console.log("➡️ URL:", url);
  console.log("➡️ PAYLOAD:", JSON.stringify(payload, null, 2));

  try {
    const res = await axios.post(url, payload);
    console.log("✅ Message envoyé !");
    console.log(res.data);
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error("❌ ENVOI TELEGRAM FAILED");
      console.error("🔴 STATUS:", err.response?.status);
      console.error("🔴 MESSAGE:", JSON.stringify(err.response?.data, null, 2));
    } else {
      console.error("❌ Unknown error:", err);
    }
  }
}
