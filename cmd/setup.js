const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder
} = require("discord.js");

const strings = require("../stringHandler");

module.exports = {
data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Configure AntiheroHelper.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

async execute(interaction) {

    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(strings.setup.title)
        .setDescription(strings.setup.description);

    const row = new ActionRowBuilder().addComponents(

new StringSelectMenuBuilder()
    .setCustomId("setup_menu")
    .setPlaceholder("Choose a topic")
    .addOptions([
/*        {
            label: "Support Channel Status",
            value: "support_channels",
            description: "View the current support channel configuration."
        },*/
        {
            label: "Existing Tickets",
            value: "existing_tickets",
            description: "List all currently open tickets."
        },
        {
            label: "Permissions",
            value: "permissions",
            description: "Check the bot's and mods permissions."
        },
        {
            label: "Channel Permissions",
            value: "channel_permissions",
            description: "Inspect channel specific permissions."
        },
        {
            label: "Automod Settings",
            value: "automod",
            description: "Review the current automod configuration."
        },
        {
            label: "Configuration",
            value: "configuration",
            description: "View the configured IDs and settings."
        }
    ])
);

    return interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
    });

}};