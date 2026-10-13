import cron from "node-cron";
import { syncNews } from "../services/rss.service.js";

// Run every 5 minutes
cron.schedule("*/5 * * * *", async () => {
    console.log("Running RSS sync...");

    try {
        await syncNews();
        console.log("RSS sync completed successfully.");
    } catch (error) {
        console.error("RSS sync failed:", error.message);
    }
});