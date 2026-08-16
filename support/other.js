const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

module.exports = async (interaction) => {

    const embed = new EmbedBuilder()
        .setColor(0xF1C40F)
        .setTitle("<:Tutle:1520804017192570880> Something Else")
        .setDescription(
`Not sure which support category fits your issue?

Before opening a ticket, please make sure your question isn't already answered in our <#1423412144598155355> or <#1376570941672394855>.`
        )
        .setFooter({
            text: "Antihero Helper • Support Assistant"
        });

    const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId("modmail_ticket_open")
                .setLabel("Open Support Ticket")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
            .setCustomId("modmail_ticket_cancel")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
        );

    await interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true
    });

};