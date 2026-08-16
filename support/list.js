const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = async (interaction) => {

    const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setTitle("All support categories")
        .setDescription("Choose else if you are unsure");

const supportMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId("support_category")
        .setPlaceholder("Select a support category")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Report Discord User")
                .setDescription("Report bots, spam or inappropiate behaviour")
                .setValue("discord_user"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Antihero Creator role")
                .setDescription("Get the creator role")
                .setValue("discord_creator"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Modmail")
                .setDescription("Questions regarding moderation systems and more")
                .setValue("discord_mod"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Roles")
                .setDescription("Explained roles")
                .setValue("discord_roles"),

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
                .setLabel("Content Rules")
                .setDescription("Rules to create content")
                .setValue("creator_rules"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Antihero Creator role")
                .setDescription("Get the creator role")
                .setValue("creator_role"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Antihero creator portal")
                .setDescription("Creator Portal & Login")
                .setValue("creator_login"),

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