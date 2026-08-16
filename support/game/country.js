const { 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle, 
} = require("discord.js");

module.exports = async (interaction) => {
    const embed3 = new EmbedBuilder()
        .setTitle("Misfitz Availability")
        .setColor(0x01F9A3)
        .setDescription(`
### For users that get an issue with "not available in the country":
- the game will be available in **ALL countries** even for playtest, pre alpha, and alpha versions

How to solve this? You just need to [wait for an email with the download-link](https://discord.com/channels/1296481397674082374/1503868385128087644)
If you get an email with a download link it means you have been added to the playtest.

### If you got the 2nd email with download link and its still showing that message make sure to:
- Check that the Google playstore account that you are using is the same as the email you registered with
- if you are on the right account and still facing this issue tap the button below 

### __ONLY for Brazil__
- In the Brazilian Google Play Store you don't need any registeration 
-# installing from any other country requires registration on https://www.antiherostudios.com/en?creatorCode=SCHARKY`);

const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId("fill_nomail_android")
    .setLabel("I still face issues on Andoid")
    .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
    .setCustomId("fill_nomail_ios")
    .setLabel("I still face issues on Apple")
    .setStyle(ButtonStyle.Primary));

    await interaction.reply({
        embeds: [embed3],
        components: [row],
        ephemeral: true 
    });
};