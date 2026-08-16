const { EmbedBuilder } = require("discord.js");
module.exports = async (interaction) => {

    const embed3 = new EmbedBuilder()
        .setTitle("Creator Ask Us")
        .setColor(0x01F9A3)
        .setDescription(
`Have a special question regarding content policy? Please reach out <@1443494769589489776>via DM
Please ask other creators in <#1397877532086370448> if you have any questions. - They will help too!`
);

    await interaction.reply({
        embeds: [embed3],
        ephemeral: true
    });
};