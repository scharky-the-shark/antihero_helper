const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = async (interaction) => {

    const modal = new ModalBuilder()
        .setCustomId("report_player")
        .setTitle("Report a Player in misfitz");

    const reportedPlayer = new TextInputBuilder()
        .setCustomId("reported_user")
        .setLabel("Reported Playername")
        .setPlaceholder("Username")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(20);

    const yourPlayerID = new TextInputBuilder()
        .setCustomId("report_yourid")
        .setLabel("Your player ID")
        .setPlaceholder("Your player ID is located at the bottom left of the settings menu in the game")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(15);

    modal.addComponents(
        new ActionRowBuilder().addComponents(reportedPlayer),
        new ActionRowBuilder().addComponents(yourPlayerID)
    );

    await interaction.showModal(modal);

};