const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");

module.exports = async (interaction) => {

    const modal = new ModalBuilder()
        .setCustomId("report_bug")
        .setTitle("Report a bug");

    const reportBug1 = new TextInputBuilder()
        .setCustomId("report_bug_header")
        .setLabel("Headline")
        .setPlaceholder("Decribe the bug in 3-7 words")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(100);

    const reportBug2 = new TextInputBuilder()
        .setCustomId("report_bug_device")
        .setLabel("Device")
        .setPlaceholder("Your Device (iPhone 11 Pro, Samsung S22)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(50);

    const reportBug3 = new TextInputBuilder()
        .setCustomId("report_bug_os")
        .setLabel("OS")
        .setPlaceholder("Your operating system (iOS 26.5, Android 16.1)")
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setMaxLength(50);
 
    const reportBug4 = new TextInputBuilder()
        .setCustomId("report_bug_reproduce")
        .setLabel("Reproduce")
        .setPlaceholder("Step by step to reproduce the bug")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true)
        .setMaxLength(500);

    const reportBug5 = new TextInputBuilder()
        .setCustomId("report_bug_description")
        .setLabel("Anything else")
        .setPlaceholder("Leave empty if not. You can add attachments and more later")
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setMaxLength(1000);

    modal.addComponents(
        new ActionRowBuilder().addComponents(reportBug1),
        new ActionRowBuilder().addComponents(reportBug2),
        new ActionRowBuilder().addComponents(reportBug3),
        new ActionRowBuilder().addComponents(reportBug4),
        new ActionRowBuilder().addComponents(reportBug5),
    );

    await interaction.showModal(modal);

};