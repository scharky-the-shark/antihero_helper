const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = async (interaction) => {

    const os = interaction.customId === "fill_nomail_ios" ? "iOS" : "Android";

    const modal = new ModalBuilder()
        .setCustomId(`nomail_submit_${os}`)
        .setTitle(`No Access request ${os}`);

    const email = new TextInputBuilder()
        .setCustomId("email")
        .setLabel("Email Address")
        .setPlaceholder("example@email.com")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMinLength(10)
        .setMaxLength(50);

    modal.addComponents(
        new ActionRowBuilder().addComponents(email)
    );

    await interaction.showModal(modal);
};