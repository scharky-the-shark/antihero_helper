const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

module.exports = async (interaction) => {

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("nomail_yes")
      .setLabel("Yes")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("nomail_no")
      .setLabel("No")
      .setStyle(ButtonStyle.Danger)
  );

  return interaction.reply({
    ephemeral: true,
    content: "### Did you wait atleast 24h after registration?",
    components: [row]
  });
};
