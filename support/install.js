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
                .setLabel("No download mail")
                .setDescription("How to download Misfitz")
                .setValue("game_nomail"),
                
            new StringSelectMenuOptionBuilder()
                .setLabel("Not available in my country!")
                .setDescription("Google Play Store Error")
                .setValue("game_country"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Misfitz on Apple devices")
                .setDescription("How to install Misfitz on iOS")
                .setValue("game_apple"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Game asks for update")
                .setDescription("Pop-up inGame to update the game")
                .setValue("game_update"),

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