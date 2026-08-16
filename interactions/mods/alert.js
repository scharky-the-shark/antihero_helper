const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");

module.exports = async (interaction) => {

const alertE = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle("<:setting:1526924377206161579> Confirm")
        .setDescription("Are you sure you want to alert our mods?\n-# Missuse of this system breaches *Rule 5 - @mention abuse* and earns strikes");

const messageId = interaction.customId.split(":")[1];

const alertB = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId(`mod_verify:${messageId}`)
        .setLabel("Alert Mods")
        .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
        .setCustomId("mod_delete")
        .setLabel("Dismiss alert")
        .setStyle(ButtonStyle.Danger),
);

  return interaction.reply({
    embeds: [alertE],
    components: [alertB],
    ephemeral: true
  });
};
