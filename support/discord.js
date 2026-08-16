const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = async (interaction) => {

    const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setTitle("<:guilds:1526924370247815281> Discord related");

const supportMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId("support_category_discord")
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