const { 
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder
} = require('discord.js');

const config = require('./Login.json');

async function handleTicketButton(interaction) {

    if (!interaction.isButton()) return;

    if (interaction.customId !== 'modmail_ticket') return;

    const guild = interaction.guild;
    const member = interaction.member;

    const categoryId = config.ticketCategoryId;
    const modRoleId = config.modRoleId;

    const channelName = `modmail-${member.user.username}`
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');

    //  Prevent double tickets
    const existing = guild.channels.cache.find(
        c => c.name === channelName
    );

    if (existing) {
        return interaction.reply({
            content: `You have already an open ticket: ${existing}`,
            ephemeral: true
        });
    }

    const ticketChannel = await guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: categoryId,
        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel]
            },
            {
                id: member.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            },
            {
                id: modRoleId,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory
                ]
            }
        ]
    });

    const embed = new EmbedBuilder()
        .setTitle("📨 New ModMail Ticket")
        .addFields(
            { name: "User", value: `${member.user.tag}`, inline: true },
            { name: "User ID", value: `${member.id}`, inline: true }
        )
        .setColor(0x2b2d31)
        .setTimestamp();

    await ticketChannel.send({
        content: `<@&${modRoleId}> ${member}`,
        embeds: [embed]
    });

    await interaction.reply({
        content: `📨 Your ticket: ${ticketChannel}`,
        ephemeral: true
    });
}

module.exports = {
    handleTicketButton
};
