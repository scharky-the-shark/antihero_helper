const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = async (interaction) => {

    const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setTitle("<:relic_icon:1526924375847211090> Game related issue");

const supportMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId("support_category_game")
        .setPlaceholder("Select a support category")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Download & Update issues")
                .setDescription("Google Play and Apple errors")
                .setValue("support_category_install"),

            new StringSelectMenuOptionBuilder()
                .setLabel("No download mail")
                .setDescription("How to download Misfitz")
                .setValue("game_nomail"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Bug report")
                .setDescription("How to report bugs")
                .setValue("game_report"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Report a player")
                .setDescription("Report an inappropiate playername in Misfitz")
                .setValue("game_player"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Else")
                .setValue("support_else")
        )
);

    await interaction.reply({
        embeds: [embed],
          components: [supportMenu],
        ephemeral: true
    });

};