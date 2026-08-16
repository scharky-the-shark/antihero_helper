const { 
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
 } = require("discord.js");

const regexCache = require("./regexCache");

const sendModLog = require("./sendModLog");

module.exports = async function automod(message, client) {
if (!message.guild) return;
if (message.author.bot) return;
let deleted = false;
const original = message.content;
const word = regexCache.match(original);

if (word) {
console.log(`[AutoMod] Match detected: ${word}`);

const alertE = new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle("<:spray_crossx:1520804204384358420> AutoMod Triggered")
    .setDescription("AutoMod failed to delete message.\n**Mod needed?**");

    // WAIT 1 SECOND
    setTimeout(async () => {

        try {
            await message.delete();
            deleted = true;
            console.log("[AutoMod] Message deleted");
        }  catch (err) {
    console.log("[AutoMod] Delete failed:", err.message);

    try {

        const sent = await message.reply({
            embeds: [alertE]
        });

        const alertB = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`mod_alert:${sent.id}`)
                .setLabel("Alert Mods")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId(`mod_dismiss:${sent.id}`)
                .setLabel("Not rule breaking")
                .setStyle(ButtonStyle.Danger)
        );

        await sent.edit({
            embeds: [alertE],
            components: [alertB]
        });

        console.log("[AutoMod] Mod ping sent");

    } catch (replyErr) {
        console.log("[AutoMod] Mod ping failed:", replyErr.message);
    }
}

    const safeMessage = original
        .replace(/https?:\/\//gi, "hxxps://")
        .replace(/\./g, "[.]");

        try {


            await sendModLog(client, {
                title: "<:support:1520804207060586516> AutoMod Triggered",
                color: 0xffaa00,

                user: message.author,
                channel: message.channel,

                reason: [
                    `Blocked phrase: "${word}"`
                ],

                action: deleted ? "Message deleted":"Failed to delete message",

                messages: [{
                    createdTimestamp: message.createdTimestamp,
                    content: safeMessage,
                    attachments: message.attachments
                }],

                files: [...message.attachments.values()]
            });

            console.log("[AutoMod] Mod alert sent");

        } catch (err) {
            console.error("[AutoMod] Mod alert failed:", err);
        }

        // USER DM
        try {
    const DM = new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle("AutoMod Triggered")
    .setDescription(
`<:support:1520804207060586516> Your message was removed because it contained a blocked phrase.

If you believe this was a mistake, please contact a moderator.

<:spray_denied:1520804205814878469> **Blocked phrase**
"${word}"

**Your message**
\`\`\`text
${safeMessage}
\`\`\``
)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

await message.author.send({ embeds: [DM] });
        } catch { }

    }, 1000); // 1 second

    return;
}};