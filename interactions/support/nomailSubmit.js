const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    PermissionsBitField,
    EmbedBuilder
} = require("discord.js");

const config = require("../../Login.json");
const { encrypt } = require("../../utils/crypto");

module.exports = async (interaction) => {

    const guild = interaction.guild;
    const member = interaction.member;
    const os = interaction.customId.replace("nomail_submit_", "");
    const email = interaction.fields.getTextInputValue("email").trim();

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const NotAll = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("Not a valid email")
        .setDescription("Please enter a valid email")

    if (!emailRegex.test(email)) {
        return interaction.reply({
            embeds: [NotAll],
            ephemeral: true
        });
    }

    const encryptedEmail = encrypt(email);

    const controls = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId("reveal_nomail_email")
            .setLabel("Reveal Email")
            .setEmoji("🔓")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId("delete_ticket")
            .setLabel("Delete Ticket")
            .setStyle(ButtonStyle.Danger)
    );

    const ticketChannel = await guild.channels.create({
        name: `noaccess-${member.user.username.toLowerCase()}`,
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
                    PermissionsBitField.Flags.ReadMessageHistory,
                ]
            },
            {
                id: config.modRoleId,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                    PermissionsBitField.Flags.ManageMessages
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

    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle("No Access Request")
        .setDescription("The user is unable to access the game although they signed up.")
        .addFields(
            {
                name: "Requested by",
                value: `${member}`,
                inline: true
            },
            {
                name: "Operating System",
                value: os,
                inline: true
            },
            {
                name: "Encrypted Email",
                value: "```" + encryptedEmail + "```",
                inline: false
            }
        )
        .setFooter({ text: `Request ID: ${interaction.user.id}`})
        .setTimestamp();

    await ticketChannel.send({
        content: `<@&${config.supportRoleId}> ${member}`,
        embeds: [embed],
        components: [controls]
    });

    const successEmbed = new EmbedBuilder()
        .setColor(0x10e009)
        .setTitle("Request submitted")
        .setDescription("Your request has been submitted successfully.\nOur support team will review it shortly.");

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("Open Ticket")
            .setStyle(ButtonStyle.Link)
            .setURL(ticketChannel.url)
    );

    await interaction.reply({
        embeds: [successEmbed],
        components: [row],
        ephemeral: true
    });

};