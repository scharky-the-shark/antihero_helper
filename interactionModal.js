const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {
  try {
    // MODALERT
    const reportUser  =  require("./support/discord/report")(interaction);
    const fillBug     =  require("./support/game/bugreport")(interaction);

    switch (interaction.customId) {
      case "report_user": return reportUser(interaction);
      case "fill_bug": return fillBug(interaction);
    }

  } catch (err) {
    console.error("INTERACTION ERROR:");
    console.error(err);

    try {

const ErrEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Unknown Error")
    .setDescription(`<:hashtag:1520804246868463697> An error occurred.`)
    .setFooter({text: "AntiheroHelper"})
    .setTimestamp();

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          embeds: [ErrEmbed],
          ephemeral: true
        });
      }

    } catch (e) {
      console.error("FAILED TO SEND ERROR REPLY:");
      console.error(e);
    }
  }
};