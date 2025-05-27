import fs from "fs";
import path from "path";

export function logToCSV(data: {
  timestamp: string;
  block: number;
  token: string;
  spread: number;
  profit: number;
  dex: string;
}) {
  const logDir = "./logs";
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const date = new Date().toISOString().split("T")[0];
  const logPath = path.join(logDir, `arbitrage-${date}.csv`);
  const header = "timestamp,block,token,spread,profit,dex\n";

  const row = `${data.timestamp},${data.block},${data.token},${data.spread},${data.profit},${data.dex}\n`;

  if (!fs.existsSync(logPath)) {
    fs.writeFileSync(logPath, header + row);
  } else {
    fs.appendFileSync(logPath, row);
  }
}
