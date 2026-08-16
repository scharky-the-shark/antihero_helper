const { EmbedBuilder } = require("discord.js");
module.exports = async (interaction) => {

    const embed3 = new EmbedBuilder()
        .setTitle("Creator Role")
        .setColor(0x01F9A3)
        .setDescription(
`**<@&1346459828138147860>**
- Trusted Antihero Creators
- doing content for Antihero Studios
- being accepted in the program won't give you the role automatically
- given to approved creators
- this role cannot be assigned by <@&1374674313801629727>
- given after review, please do not ask for a review`
        );

    await interaction.reply({
        embeds: [embed3],
        ephemeral: true
    });
};