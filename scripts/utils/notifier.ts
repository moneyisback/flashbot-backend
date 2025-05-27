import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export async function sendDiscordMessage(message: string): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    await axios.post(webhookUrl, { content: message });
  } catch (err: any) {
    console.warn("❌ Erreur Discord:", err.message);
  }
}

export async function sendTelegramMessage(message: string): Promise<void> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) return;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        await axios.post(url, {
            chat_id: chatId,
            text: message,
        });
    } catch (err: any) {
        console.warn("❌ Erreur Telegram:", err.message);
    }

}    

export async function notify(message: string): Promise<void> {
        await sendDiscordMessage(message);
        await sendTelegramMessage(message);
      }
      

