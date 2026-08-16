const {
  EmbedBuilder
} = require("discord.js");

module.exports = async (interaction) => {

const alertE = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle("<:spray_crossx:1520804204384358420> Cancelled")
        .setDescription("No action has been taken");


  return interaction.update({
    embeds: [alertE],
    components: []
  });
};
