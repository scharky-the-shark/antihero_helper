const { 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle, 
} = require("discord.js");
const config = require("../../Login.json");

module.exports = async (interaction) => {

    const creator       = config.creatorRoleId;
    const executor      = interaction.member;
    const creatorRole   = executor.roles.cache.has(creator);

    const ErrAlloEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Not Qualified")
        .setDescription(`<:spray_denied:1520804205814878469> You are not a verified <@&${creator}>`);

    // Roles-Check
    if (!creatorRole) {
    await interaction.reply({ embeds:[ErrAlloEmbed], ephemeral: true });
    return;
    }
    

    const sure = new EmbedBuilder()
        .setTitle("Are you sure you want to request a *No Access* ticket?")
        .setColor(0x10e009)
        .setDescription(`
## Before submitting a request be sure 
- You already signed up at antiherostudios.com
- You received a welcome mail *You are now an Antihero* or similar
- You waited at least 24 hours after signing up
- Followed all steps in https://discord.com/channels/1296481397674082374/1503868385128087644`);

    const disclaimer = new EmbedBuilder()
        .setTitle("When submitting a request you will be asked for:")
        .setColor(0x0848a8)
        .setDescription(`
- Your operating system
- Your email address
- Your email address will be encrypted before it is stored in the support ticket. 
Only authorized Antihero Studios support team can reveal it.`)
.setFooter({text: `Missuse of this system is against server rule 8`})

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setCustomId("cancel_nomail")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
        .setCustomId("fill_nomail_ios")
        .setLabel("iOS")
        .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
        .setCustomId("fill_nomail_android")
        .setLabel("Android")
        .setStyle(ButtonStyle.Primary),

    );

    await interaction.reply({
        embeds: [sure, disclaimer],
        components: [row],
        ephemeral: true 
    });
};