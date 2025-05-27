import { Telegraf } from "telegraf";
import { config } from "dotenv";
config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);


bot.on("message", (ctx) => {
  console.log("👤 Ton ID Telegram est :", ctx.from.id);
  ctx.reply(`Ton ID est : ${ctx.from.id}`);
});

bot.launch();
console.log("📡 Envoie un message à ton bot Telegram pour récupérer ton ID.");
