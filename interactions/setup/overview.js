const { EmbedBuilder } = require("discord.js");
const strings = require("../../stringHandler");

module.exports = async (interaction) => {

    const embed = new EmbedBuilder()
        .setColor(0x5865F2)
        .setTitle(strings.setup.overview.title)
        .setDescription(strings.setup.overview.description);

    return interaction.update({
        embeds: [embed]
    });

};