// utils/crash-watcher.js
const { exec } = require("child_process");
const { sendTelegramMessage } = require("./telegram");

const containers = ["flashbot-api", "flashbot-dashboard"];

function checkContainers() {
  containers.forEach((name) => {
    exec(`docker inspect -f "{{.State.Health.Status}}" ${name}`, async (err, stdout) => {
      const status = stdout.trim();
      if (status !== "healthy") {
        const alert = `🚨 *ALERTE FlashBot* — ${name} est *${status.toUpperCase()}* 🔥`;
        console.warn(alert);
        await sendTelegramMessage(alert);
      }
    });
  });
}

setInterval(checkContainers, 60 * 1000); // toutes les 60s
