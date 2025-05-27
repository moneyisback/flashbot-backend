import fs from 'fs';
import path from 'path';

const logFile = path.join(__dirname, '../../logs/opportunities.csv');

export function logToCSV(timestamp: string, block: number, token: string, spread: number, profit: number) {
  const header = 'timestamp,block,token,spread,profit\n';
  const row = `${timestamp},${block},${token},${spread},${profit}\n`;

  if (!fs.existsSync(logFile)) {
    fs.writeFileSync(logFile, header + row);
  } else {
    fs.appendFileSync(logFile, row);
  }
}
