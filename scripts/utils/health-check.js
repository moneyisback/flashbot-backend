const axios = require("axios");

(async () => {
  try {
    const api = await axios.get("http://localhost:3001/api/opportunities");
    const dashboard = await axios.get("http://localhost:5173");

    if (api.data && dashboard.status === 200) {
      console.log("✅ All systems GO");
    }
  } catch (err) {
    console.error("❌ Health check failed:", err.message);
    process.exit(1);
  }
})();
