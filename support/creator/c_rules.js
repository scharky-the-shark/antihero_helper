const { EmbedBuilder } = require("discord.js");
module.exports = async (interaction) => {

    const embed3 = new EmbedBuilder()
        .setTitle("Creator Rules")
        .setColor(0x01F9A3)
        .setDescription(`<:support:1520804207060586516> Coming soon!`);

    await interaction.reply({
        embeds: [embed3],
        ephemeral: true
    });
};