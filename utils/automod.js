const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../logs/automod.json");
const MOD_ALERT_CHANNEL = "1480664417044533268";
const MOD = "1374674313801629727";

const normalize = require("./normalize");


module.exports = async function automod(message, client) {

    if (!message.guild) return;
    if (message.author.bot) return;

    let bannedWords = [];

    try {
        const raw = fs.readFileSync(configPath);
        const data = JSON.parse(raw);
        bannedWords = data.bannedWords || [];
    } catch (err) {
        console.error("[AutoMod] JSON load error:", err);
        return;
    }

    const original = message.content;
    const normalized = normalize(original);

    for (const word of bannedWords) {

        const normalizedWord = normalize(word);

        if (normalized.includes(normalizedWord)) {

            console.log(`[AutoMod] Match detected: ${word}`);

            // WAIT 1 SECOND
            setTimeout(async () => {

                try {
                    await message.delete();
                    console.log("[AutoMod] Message deleted");
                } catch (err) {
                    console.log("[AutoMod] Delete failed:", err.message);

                    try {
                        await message.reply({
                            content: `<@&${MOD}> AutoMod failed to delete message.`,
                            allowedMentions: {
                                roles: [MOD]
                            }
                        });
                        console.log("[AutoMod] Mod ping sent");
                    } catch (replyErr) {
                        console.log("[AutoMod] Mod ping failed:", replyErr.message);
                    }
                }

                // MOD ALERT
                try {

                    const modChannel = await client.channels.fetch(MOD_ALERT_CHANNEL);

                    if (modChannel && modChannel.isTextBased()) {

                    const safeMessage = original
                    .replace(/https?:\/\//gi, "hxxps://")
                    .replace(/\./g, "[.]");

await modChannel.send(
`**AutoMod Triggered**
User: <@${message.author.id}>
Channel: <#${message.channel.id}>
Detected word:
\`\`\`
${word}
\`\`\`
Message:
\`\`\`
${safeMessage}
\`\`\`
`);

                        console.log("[AutoMod] Mod alert sent");
                    }

                } catch (err) {
                    console.error("[AutoMod] Mod alert failed:", err);
                }

                // USER DM
                try {
                    await message.author.send(
`Your message was removed because it contained a blocked phrase.

If you believe this is an error, please contact the bot owner.`
                    );
                } catch { }

            }, 1000); // 1 second

            return;
        }

    }

};