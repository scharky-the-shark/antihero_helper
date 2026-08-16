const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

const { getConfig } = require("../utils/configManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearstart")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Deletes the last message in the configured support channel (Owner only)"),

async execute(interaction) {

const SucEmbed = new EmbedBuilder()
    .setColor(0xF1C40F)
    .setTitle("Support channel Cleared")
    .setDescription(
      `<:support:1520804207060586516> Cleared <#1473267376437989386>`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrAllEmbed = new EmbedBuilder()
    .setColor(0xF1C40F)
    .setTitle("Error")
    .setDescription(
      `<:spray_crossx:1520804204384358420> Only the owner can use this command.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrNotEmbed = new EmbedBuilder()
    .setColor(0xF1C40F)
    .setTitle("Error")
    .setDescription(
      `<:spray_denied:1520804205814878469> Configured start channel not found.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrNotFEmbed = new EmbedBuilder()
    .setColor(0xF1C40F)
    .setTitle("Error")
    .setDescription(
      `<:hashtag:1520804246868463697> Message not found or already deleted.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

    const config = getConfig();

    const ownerUserId = config.ownerUserId;
    const startChannelId = config.startChannelId;


    if (interaction.user.id !== ownerUserId) {
    await interaction.reply({ embeds:[ErrAllEmbed], ephemeral: true });
    return;
    }

await interaction.deferReply({ ephemeral: true });

//  START CHANNEL
const channel = await interaction.client.channels.fetch(startChannelId);

if (!channel || !channel.isTextBased()) {
await interaction.editReply({ embeds:[ErrNotEmbed], ephemeral: true });
}

const messageId = "1477337786859126901";

try {
  const message = await channel.messages.fetch(messageId);
  await message.delete();
} catch (err) {
  await interaction.editReply({ embeds:[ErrNotFEmbed], ephemeral: true });

}

  await interaction.editReply({ embeds:[SucEmbed], ephemeral: true });
}};