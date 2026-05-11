const MOD_LOG_CHANNEL = "1480664417044533268";

async function sendModLog(client, content) {

    try {

        const channel = await client.channels.fetch(MOD_LOG_CHANNEL);

        if (!channel || !channel.isTextBased()) return;

        await channel.send(content);

    } catch (err) {
        console.error("[ModLog] Failed:", err);
    }
}

module.exports = sendModLog;