const { 
  EmbedBuilder,
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle, 
} = require("discord.js");

module.exports = async (interaction) => {
const file = new AttachmentBuilder("../../images/update.png");

const embed3 = new EmbedBuilder()
    .setTitle("Pop-Up Update required")
    .setColor(0x01F9A3)
    .setDescription(`
## After maintenance 
Please open on iOS: [Tesflight]()
or open on Android: [Google Play Staore]()
to update the game

If the update does not appear restart your apps and device and check again
If you haven't received the update after 6 hours please tap the button below

## After Global Playtests
When global playtests ends the game will be only available for creators
To verify that only creator access the game, they will receive the creator update`);

const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId("start_nomail")
    .setLabel("No update received")
    .setStyle(ButtonStyle.Primary));

    await interaction.reply({
        embeds: [embed3],
        components: [row],
        ephemeral: true 
    });
};