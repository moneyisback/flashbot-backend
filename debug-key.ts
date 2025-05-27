import * as dotenv from "dotenv";
dotenv.config();

console.log("🔎 RAW:", JSON.stringify(process.env.PRIVATE_KEY));
console.log("📏 Length:", process.env.PRIVATE_KEY?.length);
