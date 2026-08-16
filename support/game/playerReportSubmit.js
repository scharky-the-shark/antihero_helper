const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder
} = require("discord.js");

const config = require("../../Login.json");

module.exports = async (interaction) => {

    const guild         = interaction.guild;
    const member        = interaction.member;
    const Playername    = interaction.fields.getTextInputValue("reported_user");
    const playerID      = interaction.fields.getTextInputValue("report_yourid");

    const controls = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("delete_ticket")
            .setLabel("Delete Ticket")
            .setStyle(ButtonStyle.Danger)
    );

    const ticketChannel = await guild.channels.create({
        name: `reportplayer-${member.user.username}`,
        topic: interaction.user.id,
        type: ChannelType.GuildText,
        parent: config.ticketCategoryId,
        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: [
                    PermissionsBitField.Flags.ViewChannel
                ]
            },
            {
                id: member.id,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory
                ]
            },
            {
                id: config.modRoleId,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                    PermissionsBitField.Flags.ManageChannels,
                    PermissionsBitField.Flags.ManageMessages,
                    PermissionsBitField.Flags.MentionEveryone
                ]
            },
            {
                id: config.supportRoleId,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                    PermissionsBitField.Flags.ManageMessages
                ]
            },
            {
                id: guild.members.me.id,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                    PermissionsBitField.Flags.ManageChannels,
                    PermissionsBitField.Flags.ManageMessages,
                    PermissionsBitField.Flags.EmbedLinks
                ]
            }
        ]
    });

    const ticket = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setLabel("Open Report")
    .setStyle(ButtonStyle.Link)
    .setURL(ticketChannel.url)
    );

    const Success = new EmbedBuilder()
        .setColor(0xF0A503)
        .setTitle("User Report")
        .setDescription(`The support will review your report shortly. Missuse of the system leads to timeouts!`);

    const embed = new EmbedBuilder()
        .setColor(0xF0A503)
        .setTitle("Playername reported")
        .addFields(
            {
                name: "Reporter",
                value: `${member}`,
                inline: true
            },
            {
                name: "Reported User",
                value:
                    "```" +
                    Playername +
                    "```",
                inline: false
            },
            {
                name: "Submitted by",
                value:
                    "||```" +
                    playerID +
                    "```||",
                inline: false
            }
        )
        .setFooter({
            text: `Report ID: ${interaction.user.id}`
        })
        .setTimestamp();

    await ticketChannel.send({
        content: `${member}`,
        embeds: [embed],
        components: [controls]
    });

    await interaction.reply({
        embeds: [Success],
        components: [ticket],
        ephemeral: true
    });

};