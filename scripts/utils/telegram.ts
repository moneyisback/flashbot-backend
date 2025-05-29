import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID!;
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

export async function sendTelegramMessage(message: string) {
  try {
    const res = await fetch(TELEGRAM_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!res.ok) {
      console.error('❌ Telegram error:', await res.text());
    }
  } catch (err) {
    console.error('🔥 Failed to send Telegram message:', err);
  }
}
