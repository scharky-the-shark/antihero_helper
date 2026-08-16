const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType
} = require("discord.js");

function formatLastActivity(timestamp) {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} h ago`;

    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} d ago`;

    return new Date(timestamp).toLocaleDateString("de-DE");
}

module.exports = async (interaction) => {

    const channelId = interaction.values[0];
    const channel = interaction.guild.channels.cache.get(channelId);
    const ErrEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Error")
        .setDescription(
        `<:spray_denied:1520804205814878469> Ticket channel not found`);
        
    if (!channel || channel.type !== ChannelType.GuildText) {
        return interaction.reply({
            embeds: [ErrEmbed],
            ephemeral: true
        });

    }

    const prefix = channel.name.split("-")[0];
    let lastActivity = "No activity";

    try {
        if (channel.lastMessageId) {
            const message = await channel.messages.fetch(channel.lastMessageId);
            lastActivity = formatLastActivity(message.createdTimestamp);
        }
    } catch {}

    const created = `<t:${Math.floor(channel.createdTimestamp / 1000)}:f>`;
    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("<:Version:1526924378204278905> Ticket Management")
        .addFields(
            {
                name: "<:guilds:1526924370247815281> Channel",
                value: `<#${channel.id}>`,
                inline: true
            },
            {
                name: "<:commands:1526924364266868796> Type",
                value: prefix,
                inline: true
            },
            {
                name: "<:RAM:1526924374429532230> Members",
                value: `${channel.members.size}`,
                inline: true
            },
            {
                name: "<:setting:1526924377206161579> Created",
                value: created,
                inline: true
            },
            {
                name: "<:history:1520803959571349535> Last Activity",
                value: lastActivity,
                inline: true
            },
            {
                name: "<:hashtag:1520804246868463697> Channel ID",
                value: channel.id,
                inline: false
            }
        );

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`ticket_delete:${channel.id}`)
            .setLabel("Delete Ticket")
            .setStyle(ButtonStyle.Danger)
    );

    return interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
    });
};