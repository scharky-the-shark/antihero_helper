const {
    EmbedBuilder
} = require("discord.js");

const MOD_LOG_CHANNEL = "1480664417044533268";

async function sendModLog(client, data) {

try {

    const channel = await client.channels.fetch(MOD_LOG_CHANNEL);

    if (!channel || !channel.isTextBased()) return;

    if (typeof data === "string") {
        return channel.send({ content: data });
    }

    const embed = new EmbedBuilder()
        .setColor(data.color ?? 0xff8800)
        .setTitle(data.title ?? "Moderation Event")
        .setTimestamp();

    if (data.user) {
        embed.addFields({
            name: "User",
            value: `<@${data.user.id}> (${data.user.id})`
        });
    }

    if (data.channel) {
        embed.addFields({
            name: "Channel",
            value: `<#${data.channel.id}>`,
            inline: true
        });
    }

    if (data.reason) {
        embed.addFields({
            name: "Reason",
            value: Array.isArray(data.reason)
                ? data.reason.map(r => `• ${r}`).join("\n")
                : data.reason
        });
    }

    if (data.action) {
        embed.addFields({
            name: "Action",
            value: data.action,
            inline: true
        });
    }

    if (data.messages?.length) {

        const text = data.messages
            .map(m => {

                const time = new Date(m.createdTimestamp).toLocaleTimeString();

                const content =
                    m.content?.trim()
                        ? m.content
                        : ":At: Attachment only";

                return `[${time}]\n${content}`;

            })
            .join("\n\n")
            .slice(0, 1024);

        embed.addFields({
            name: "Recent Messages",
            value: `\`\`\`\n${text}\n\`\`\``
        });
    }

    if (data.messages?.length) {
        embed.addFields({
            name: "Messages",
            value: `${data.messages.length}`,
            inline: true
        });
    }

    if (data.attachments?.length) {
        embed.addFields({
            name: "Attachments",
            value: data.attachments
                .map(a =>
                    `• ${a.name}`
                )
                .join("\n\n")
                .slice(0, 1024)
        });

    }

    embed.setFooter({
        text: "AntiheroHelper Moderation"
    });

    await channel.send({
        embeds: [embed],
    });

} catch (err) {console.error("[ModLog] Failed:", err)}
}

module.exports = sendModLog;