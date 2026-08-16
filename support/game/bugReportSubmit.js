const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChannelType,
    EmbedBuilder,
    MessageFlags
} = require("discord.js");

module.exports = async (interaction) => {

    const guild     = interaction.guild;
    const member    = interaction.member;
    const forum     = guild.channels.cache.get("1375507642138624121");

    const bugTitle      = interaction.fields.getTextInputValue("report_bug_header");
    const bugDevice     = interaction.fields.getTextInputValue("report_bug_device");
    const bugOS         = interaction.fields.getTextInputValue("report_bug_os");
    const bugProduce    = interaction.fields.getTextInputValue("report_bug_reproduce");
    const bugDes        = interaction.fields.getTextInputValue("report_bug_description");


    const ErrNoCreate = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Error")
        .setDescription(
        `<:spray_crossx:1520804204384358420> An error occurred when creating a post!.`)

    const Success = new EmbedBuilder()
        .setColor(0x26fc00)
        .setTitle("Bug report submitted")
        .setDescription(
        `<:spray_checkx:1520804203218604062> Your bug report has been published successfully.\nPlease send if possible recordings of the bug`)

    if (!forum || forum.type !== ChannelType.GuildForum) {
        return interaction.reply({
            embeds: [ErrNoCreate],
            flags: MessageFlags.Ephemeral
        });
    }

    const report = new EmbedBuilder()
        .setColor(0xF0A503)
        .setTitle(`${bugTitle}`)
        .addFields(
            {
                name: "Reporter",
                value: `${member}`,
                inline: true
            },
            {
                name: "Device",
                value: `${bugDevice}`,
                inline: true
            },
            {
                name: "OS",
                value: `${bugOS}`,
                inline: true
            },
            {
                name: "How to reproduce",
                value: `${bugProduce}\n\n${bugDes}`,
                inline: true
            }
        )
        .setFooter({
            text: `Created by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL({
                extension: "png",
                size: 256
            })
        })
        .setTimestamp();

    const thread = await forum.threads.create({
        name: bugTitle.substring(0, 100),
        message: {content: `${member}`,
            embeds: [report]
        }
    });

    const link = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setLabel("Open Bug Report")
            .setStyle(ButtonStyle.Link)
            .setURL(thread.url)
    );

    await interaction.reply({
        embeds: [Success],
        components: [link],
        flags: MessageFlags.Ephemeral
    });

};