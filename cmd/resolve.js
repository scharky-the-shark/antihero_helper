const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder
} = require('discord.js');

module.exports = {
data: new SlashCommandBuilder()
    .setName('resolve')
    .setDescription('Deletes a resolved thread.')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads),

async execute(interaction) {
const SucEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("Deleting")
    .setDescription(
      `<:support:1520804207060586516> Deleting thread...`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrNot2Embed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_crossx:1520804204384358420> This command only works in a thread channel.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrAlloEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_denied:1520804205814878469> You are not allowed to execute this command.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrNotEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Unknown Error")
    .setDescription(
      `<:hashtag:1520804246868463697> An error occurred.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

// Rechte prüfen
if (!interaction.member.permissions.has(PermissionFlagsBits.ManageThreads)) {
await interaction.reply({ embeds:[ErrAlloEmbed], ephemeral: true });
return;
}

const channel = interaction.channel;

// Check thread
if (
    channel.type !== ChannelType.PublicThread &&
    channel.type !== ChannelType.PrivateThread
) {
await interaction.reply({ embeds:[ErrNot2Embed], ephemeral: true });
return;
}

try {
    await interaction.reply({ embeds:[SucEmbed], ephemeral: true });

    // Thread delete
    await channel.delete();

} catch (err) {
    console.error(err);
    await interaction.reply({ embeds:[ErrNotEmbed], ephemeral: true });
}}
};