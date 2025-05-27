import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

const csvFilePath = path.join(__dirname, '../../logs/opportunities.csv');

console.log("📄 Lecture CSV...");

const data: any[] = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
    if (data.length === 0) {
      console.log("❌ Aucune donnée CSV");
    } else {
      console.log("✅ Fichier lu avec succès ✅\n");
      console.table(data);
    }

    console.log("📤 Export JSON vers CSV...");
    const exportFile = path.join(__dirname, '../../logs/export.json');
    fs.writeFileSync(exportFile, JSON.stringify(data, null, 2));
    console.log("✅ Export JSON terminé : logs/export.json");
  });
