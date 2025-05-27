import axios from "axios";

export async function sendDiscordAlert(message: string) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook) {
    console.warn("⚠️ No DISCORD_WEBHOOK_URL defined");
    return;
  }

  try {
    await axios.post(webhook, {
      content: message,
      username: "📡 Flashbot Scanner",
    });
  } catch (err: any) {
    console.error("❌ Discord alert failed:", err.message || err);
  }
}
