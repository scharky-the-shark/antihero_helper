const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = async (interaction) => {

    const modal = new ModalBuilder()
        .setCustomId("report_user")
        .setTitle("Report a User");

    const reportedUser = new TextInputBuilder()
        .setCustomId("reported_user")
        .setLabel("Reported User")
        .setPlaceholder("Username, @Mention or User ID")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(50);

    const reason = new TextInputBuilder()
        .setCustomId("report_reason")
        .setLabel("Reason")
        .setPlaceholder("Briefly describe the reason")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(500);

    modal.addComponents(
        new ActionRowBuilder().addComponents(reportedUser),
        new ActionRowBuilder().addComponents(reason)
    );

    await interaction.showModal(modal);

};