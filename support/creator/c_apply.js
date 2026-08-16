const { EmbedBuilder } = require("discord.js");
module.exports = async (interaction) => {


    const embed3 = new EmbedBuilder()
        .setTitle("Apply as a creator")
        .setColor(0x01F9A3)
        .setDescription(`Applications for creator are going through https://portal.prod.antiherostudios.net/signup`);

    await interaction.reply({
        embeds: [embed3],
        ephemeral: true
    });
};