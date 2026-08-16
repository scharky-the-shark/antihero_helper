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
### Install instructions for Misiftz on iOS:
1. [Install Testflight from App store](https://apps.apple.com/us/app/testflight/id899247664)
2. Open Testflight and Sign In with your Apple ID with the email you used to register for Misiftz
3. Make sure your age is setted 16+ and you don'have any restrictions like MDM or family organizations.
4. When you receive an email from Apple *"Antihero Studios invited you for Misfitz"* tap on join Beta.
5. You will be redirected to the install option, tap on **Install** to download Misfitz.`);

    const trouble = new EmbedBuilder()
        .setTitle("Troubleshooting")
        .setColor(0x0000ff)
        .setDescription(`
### Invite not valid for your account:
*Make sure you apple ID matches with the mail your registered with*

### Misfitz is not in my App Store:
*Misfitz is in Beta, to test apps you need to Install Testflight first*

### Testflight not available:
*Restart Testflight, make sure you have are connected to WIFI and your age is setted 16+*

### __Still facing issues?__
- Please be sure to complete the steps above
- We cannot change your Apple ID settings
-# Be sure you registered on [antiherostudios.com](https://www.antiherostudios.com/en?creatorCode=SCHARKY)`);

const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId("fill_nomail_android")
    .setLabel("I still face issues on Andoid")
    .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
    .setCustomId("fill_nomail_ios")
    .setLabel("I still face issues on Apple")
    .setStyle(ButtonStyle.Success));

    await interaction.reply({
        embeds: [embed3, trouble],
        components: [row],
        ephemeral: true 
    });
};