const fs = require("fs");
const path = require("path");
const config = require("../Login.json");

const ENABLED_CHANNELS = config.logging.channelIds || [];

function sanitizeFileName(name) {
    return name
        .replace(/[<>:"/\\|?*]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();
}

module.exports = (message) => {

    try {

        if (!message.guild) return;
        if (!ENABLED_CHANNELS.includes(message.channel.id)) return;
        if (message.author.bot) return;

        const baseDir = path.join(__dirname, "../logs");

        if (!fs.existsSync(baseDir)) {
            fs.mkdirSync(baseDir);
        }

        // Kategorie
        const categoryName =
            message.channel.parent?.name || "uncategorized";

        const safeCategory = sanitizeFileName(categoryName);

        const categoryDir = path.join(baseDir, safeCategory);

        if (!fs.existsSync(categoryDir)) {
            fs.mkdirSync(categoryDir);
        }

        // Channel
        const channelName =
            sanitizeFileName(message.channel.name);

        const file = path.join(
            categoryDir,
            `${channelName}.txt`
        );

        // Attachments
        let attachments = "";

        if (message.attachments.size > 0) {

            attachments =
                "\nATTACHMENTS:\n" +
                [...message.attachments.values()]
                    .map(a => a.url)
                    .join("\n");
        }

        // Stickers
        let stickers = "";

        if (message.stickers.size > 0) {

            stickers =
                "\nSTICKERS:\n" +
                [...message.stickers.values()]
                    .map(s => s.name)
                    .join("\n");
        }

        // Embeds
        let embeds = "";

        if (message.embeds.length > 0) {

            embeds =
                `\nEMBEDS: ${message.embeds.length}`;
        }

        // Reply
        let reply = "";

        if (message.reference?.messageId) {

            reply =
                `\nREPLY TO: ${message.reference.messageId}`;
        }

        const line =
`==================================================
TIME: ${new Date().toISOString()}

USER:
${message.author.tag}
${message.author.id}

MESSAGE ID:
${message.id}

CONTENT:
${message.content || "[NO TEXT]"}

${attachments}
${stickers}
${embeds}
${reply}

`;

        fs.appendFileSync(file, line);

    } catch (err) {

        console.error("[logWriter] Error:", err);

    }
};