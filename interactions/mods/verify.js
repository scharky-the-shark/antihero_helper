const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = async (interaction) => {

    const messageId = interaction.customId.split(":")[1];

    const original = await interaction.channel.messages.fetch(messageId);

    const disabledRow = new ActionRowBuilder().addComponents(
        ButtonBuilder.from(original.components[0].components[0]).setDisabled(true),
        ButtonBuilder.from(original.components[0].components[1]).setDisabled(false)
    );

    await original.edit({components: [disabledRow]});

const modAlert = new EmbedBuilder()
    .setColor(0xED4245)
    .setTitle("<:support:1520804207060586516> Moderator Assistance Requested")
    .setDescription(
`<@&1374674313801629727> A user has requested moderator assistance.

**Requested by**
${interaction.user}

Please review the reported Automod case above.`
    )
    .setFooter({text: `Requested by ${interaction.user.tag}`})
    .setTimestamp();

await original.reply({
    content: "<@&1374674313801629727>",
    embeds: [modAlert],
    allowedMentions: {
        roles: ["1374674313801629727"] 
    }
});

    const alertE = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("<:spray_checkx:1520804203218604062> Moderators alerted")
        .setDescription("The moderation team has been notified.");

    return interaction.update({
        embeds: [alertE],
        components: []
    });
};