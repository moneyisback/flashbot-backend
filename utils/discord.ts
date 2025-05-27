import axios from 'axios';

export async function sendDiscordAlert(message: string) {
  const url = process.env.DISCORD_WEBHOOK_URL;

  if (!url) {
    console.warn('⚠️ DISCORD_WEBHOOK_URL non défini');
    return;
  }

  try {
    await axios.post(url, {
      content: message,
    });
    console.log('📣 Alerte Discord envoyée');
  } catch (err) {
    console.error('❌ Erreur Discord:', err instanceof Error ? err.message : err);
  }
}
