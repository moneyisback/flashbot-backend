const { exec } = require("child_process");
const fs = require("fs");
const axios = require("axios");

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

function sendAlert(message) {
  if (TELEGRAM_TOKEN && TELEGRAM_CHAT_ID) {
    axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    }).catch(console.error);
  }

  if (DISCORD_WEBHOOK_URL) {
    axios.post(DISCORD_WEBHOOK_URL, {
      content: message
    }).catch(console.error);
  }
}

function checkContainers() {
  exec("docker ps --format '{{.Names}} {{.Status}}'", (err, stdout) => {
    if (err) return console.error("Error:", err);

    const lines = stdout.split("\n");
    lines.forEach((line) => {
      if (line.includes("Exited")) {
        const [name] = line.split(" ");
        const log = `[${new Date().toISOString()}] ❌ ${name} has stopped.\n`;
        fs.appendFileSync("logs/crash-alert.log", log);
        sendAlert(`🚨 Container "${name}" has crashed !`);
      }
    });
  });
}

setInterval(checkContainers, 30000); // every 30 sec
