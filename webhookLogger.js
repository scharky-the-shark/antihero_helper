const axios = require("axios");
const config = require("./Login.json");

async function sendLog(message) {
    try {
        await axios.post(config.LOG_WEBHOOK, {
            content: message
        });
    } catch (error) {
        console.error("Webhook Fehler:", error);
    }
}

module.exports = { sendLog };