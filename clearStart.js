const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

const { getConfig } = require("./utils/configManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearstart")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Deletes the last message in the configured start channel (Owner only)"),

  async execute(interaction) {

    const config = getConfig();

    const ownerUserId = config.ownerUserId;
    const startChannelId = config.startChannelId;


    if (interaction.user.id !== ownerUserId) {
      return interaction.reply({
        content: "❌ Only the owner can use this command.",
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

//  START CHANNEL
const channel = await interaction.client.channels.fetch(startChannelId);

if (!channel || !channel.isTextBased()) {
  return interaction.editReply({
    content: "❌ Configured start channel not found."
  });
}

const messageId = "1477337786859126901";

try {
  const message = await channel.messages.fetch(messageId);
  await message.delete();
} catch (err) {
  return interaction.editReply({
    content: "❌ Message not found or already deleted."
  });
}

return interaction.editReply({
  content: "Start message deleted."
});
  }
};
