const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = async (interaction) => {

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("modmail_ticket_open")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("modmail_ticket_cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger)
  );

  return interaction.reply({
    ephemeral: true,
    content: "### Are you sure that you want to create a ticket?",
    components: [row]
  });
};
