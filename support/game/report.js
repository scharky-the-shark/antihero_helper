const { 
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle, 
} = require("discord.js");

module.exports = async (interaction) => {
    const howto = new EmbedBuilder()
        .setTitle("How to report a bug")
        .setColor(0x10e009)
        .setDescription(`
## Check if someone else has reported the same bug in the last 7 days - if yes, reply in this thread
- **Headline**: Describe the bug in 2-7 words
- **Device**: Name and OS version
- **Reproduce**: Give steps to reproduce the bug *(if possible)*
- **Recording**: Screenshots or recording helps us to investigate bugs quicker
- **Further description**: *(optional text)*`
        );

    const example = new EmbedBuilder()
        .setTitle("Example")
        .setColor(0x0848a8)
        .setDescription(`
## No Misfit unlocked after tutorial
- **Device**: iPad 9th Gen, iOS 27.0 Beta 4
- **Reproduce**: 
1.) Try to extract in tutorial
2.) Disconnect and reconnect to internet
3.) Spawn in lobby without a Misfit 
- **Recording**: [e.g.Record of the bug.mp4]`
        );
    
    const help = new EmbedBuilder()
        .setTitle("Need help to report a bug?")
        .setColor(0xe0a709)
        .setDescription(`Tap the button below and submit a form`);

    const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setURL("https://discord.com/channels/1296481397674082374/1375507642138624121")
        .setLabel("Open Report Channel")
        .setStyle(ButtonStyle.Link),

        new ButtonBuilder()
        .setCustomId("fill_bugreport")
        .setLabel("Submit a form")
        .setStyle(ButtonStyle.Success)
    );

    await interaction.reply({
        embeds: [howto, example, help],
        components: [row],
        ephemeral: true 
    });
};