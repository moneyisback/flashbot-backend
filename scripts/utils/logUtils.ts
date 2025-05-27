import fs from "fs";
import path from "path";

const CSV_PATH = path.join(__dirname, "../../logs/opportunities.csv");
const JSON_PATH = path.join(__dirname, "../../logs/opportunities.json");

export function logToCSV(token: string, spread: number, profit: number, timestamp: string) {
  const headers = "timestamp,token,spread,profit\n";
  const line = `${timestamp},${token},${spread},${profit}\n`;

  if (!fs.existsSync(CSV_PATH)) {
    fs.writeFileSync(CSV_PATH, headers);
  }

  fs.appendFileSync(CSV_PATH, line);
}

export function logToJSON(entry: {
  token: string;
  spread: number;
  profit: number;
  timestamp: string;
}) {
  const logs = fs.existsSync(JSON_PATH)
    ? JSON.parse(fs.readFileSync(JSON_PATH, "utf8"))
    : [];

  logs.push(entry);

  fs.writeFileSync(JSON_PATH, JSON.stringify(logs, null, 2));
}
