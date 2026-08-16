const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = async (interaction) => {

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("modmail_collector")
      .setLabel("Open")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("modmail_ticket_cancel")
      .setLabel("Cancel")
      .setStyle(ButtonStyle.Danger)
  );

  return interaction.reply({
    ephemeral: true,
    content: "### Open only a ticket if you collected __ALL__ relics!\n-# Pretending to have all relics is strictly forbidden and gets punished with strikes!",
    components: [row]
  });
};
