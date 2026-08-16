const {
  ActionRowBuilder,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = async (interaction) => {

const embed = new EmbedBuilder()
    .setColor(0xF1C40F)
    .setTitle("<:goldenGoose:1520803955041636534> Creator support");

const embed1 = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("<:support:1520804207060586516> Currently disabled");

const supportMenu = new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
        .setCustomId("support_category_creator")
        .setPlaceholder("Select a support category")
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel("Content Rules")
                .setDescription("Rules to create content")
                .setValue("creator_rules"),
            
            new StringSelectMenuOptionBuilder()
                .setLabel("Apply")
                .setDescription("Apply as a cretor")
                .setValue("creator_apply"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Antihero Creator role")
                .setDescription("Get the creator role")
                .setValue("creator_role"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Antihero creator portal")
                .setDescription("Creator Portal & Login")
                .setValue("creator_login"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Question")
                .setDescription("Questions regarding content")
                .setValue("creator_ask"),

            new StringSelectMenuOptionBuilder()
                .setLabel("Else")
                .setValue("support_else")
        )
);

    await interaction.reply({
        embeds: [embed1],
        components: [],
        ephemeral: true
    });

};