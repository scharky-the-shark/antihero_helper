const messageLog = new Map();

const MESSAGE_LIMIT = 5;
const TIME_WINDOW = 10000;
const TIMEOUT_DURATION = 12 * 60 * 60 * 1000;

const MOD_ALERT_CHANNEL = "1480664417044533268";

module.exports = async function spamProtection(message, client) {

    if (!message.guild) return;
    if (message.author.bot) return;

    const member = message.member;
    if (!member) return;

    if (member.permissions.has("ManageMessages")) return;

    const userId = message.author.id;
    const now = Date.now();

    console.log(`[SpamCheck] ${message.author.tag} -> ${message.content}`);

    if (!messageLog.has(userId)) {
        messageLog.set(userId, []);
    }

    const timestamps = messageLog.get(userId);

    const filtered = timestamps.filter(t => now - t < TIME_WINDOW);
    filtered.push(now);

    messageLog.set(userId, filtered);

    console.log(`[SpamCheck] Messages in window: ${filtered.length}`);

    if (filtered.length >= MESSAGE_LIMIT) {

        console.log(`[SpamCheck] SPAM TRIGGERED for ${message.author.tag}`);

        try {

            // ===== TIMEOUT =====
            console.log("[SpamCheck] Applying timeout...");
            await member.timeout(TIMEOUT_DURATION, "Antihero spam protection");
            console.log("[SpamCheck] Timeout applied");

        } catch (err) {
            console.error("[SpamCheck] Timeout FAILED:", err);
        }

        let userMessages = [];

        try {

            // ===== FETCH MESSAGES =====
            console.log("[SpamCheck] Fetching messages...");

            const messages = await message.channel.messages.fetch({ limit: 100 });

            userMessages = messages
                .filter(m => m.author.id === userId)
                .first(10);

            console.log(`[SpamCheck] Found ${userMessages.length} user messages`);

        } catch (err) {
            console.error("[SpamCheck] Message fetch FAILED:", err);
        }

        // ===== BUILD MESSAGE LOG =====
        const messageLogText = userMessages
            .map(m => `[${new Date(m.createdTimestamp).toLocaleTimeString()}] ${m.content}`)
            .join("\n");

    // ===== CLEANER =====

        console.log("[SpamCheck] Cleaning messages across server...");

        for (const [channelId, channel] of message.guild.channels.cache) {

            if (!channel.isTextBased()) continue;

            try {

                const messages = await channel.messages.fetch({ limit: 25 });

                const userMessages = messages.filter(m => m.author.id === userId);

                for (const msg of userMessages.values()) {

                    await msg.delete().catch(() => {});

                    console.log(`[SpamCheck] Deleted message in #${channel.name}`);

                }

            } catch (err) {

                console.log(`[SpamCheck] Cannot access #${channel.name}`);

            }

        }

        // ===== MOD ALERT =====
        try {

            console.log("[SpamCheck] Fetching mod channel...");

            const modChannel = await client.channels.fetch(MOD_ALERT_CHANNEL);

            if (!modChannel) {
                console.error("[SpamCheck] Mod channel NOT FOUND");
            } else if (!modChannel.isTextBased()) {
                console.error("[SpamCheck] Mod channel not text based");
            } else {

                console.log("[SpamCheck] Sending mod alert...");

                const alertMessage =
`🚨 **Possible compromised account detected**

User: <@${userId}>
UserID: ${userId}

Reason: 5 messages within 10 seconds
Timeout: 12h

Last messages:
\`\`\`
${messageLogText || "No text content"}
\`\`\`
`;

                await modChannel.send(alertMessage);

                console.log("[SpamCheck] Mod alert sent");

            }

        } catch (err) {
            console.error("[SpamCheck] Mod alert FAILED:", err);
        }

        // ===== USER DM =====
        try {

            console.log("[SpamCheck] Sending DM to user...");

            // DM an Nutzer
            await message.author.send(
`Your account appears to have been compromised.

We recommend that you log out of all devices and change your Discord password immediately.

If you believe this filter triggered incorrectly, please DM our moderators on the server. And DM <@1280882903567568922> \`\`\`scharky_the_shark_official\`\`\``
            );

            messageLog.delete(userId);


            console.log("[SpamCheck] DM sent");

        } catch (err) {
            console.error("[SpamCheck] DM FAILED:", err.message);
        }

        messageLog.delete(userId);
        console.log("[SpamCheck] Reset message counter");

    }

};