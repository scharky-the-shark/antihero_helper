const checkMessage = require("../utils/checkMessage");
const sendModLog = require("../utils/sendModLog");

function sanitize(text = "") {
    return text
        .replace(/https?:\/\//gi, "hxxps://")
        .replace(/\./g, "[.]");
}

module.exports = {
    name: "messageUpdate",

    async execute(oldMessage, newMessage, client) {

        try {

            if (!newMessage.guild) return;

            if (newMessage.author?.bot) return;

            if (oldMessage.content === newMessage.content) return;

            const oldContent = oldMessage.content || "";
            const newContent = newMessage.content || "";
            const result = checkMessage(newContent);
            
            // LOG EDIT
            const suspicious = result.suspicious;

if (suspicious) {

    await sendModLog(client,
`Suspicious Message Edit

User: <@${newMessage.author.id}>
Channel: <#${newMessage.channel.id}>

OLD:
\`\`\`
${sanitize(oldContent).slice(0, 900)}
\`\`\`

NEW:
\`\`\`
${sanitize(newContent).slice(0, 900)}
\`\`\`
`);
}

            // AUTOMOD RECHECK

            if (result.blocked) {

                try {
                    await newMessage.delete();
                } catch {}

                await sendModLog(client,
`**Edited Message Deleted**
User: <@${newMessage.author.id}>
Detected:
\`\`\`
${result.word}
\`\`\`

Message:
\`\`\`
${sanitize(newContent).slice(0, 900)}
\`\`\`
`);
            }

        } catch (err) {
            console.error("[messageUpdate] Error:", err);
        }
    }
};