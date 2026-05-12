const {
  ChannelType,
  PermissionsBitField
} = require("discord.js");

const config = require("../../Login.json");

module.exports = async (interaction) => {

  const guild = interaction.guild;

  const existing = guild.channels.cache.find(
    c =>
      c.parentId === config.ticketCategoryId &&
      c.topic === interaction.user.id
  );

  if (existing) {
    return interaction.reply({
      content: `❌ You already have an open ticket: ${existing}`,
      ephemeral: true
    });
  }

  const username = interaction.user.username
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "");

  const channel = await guild.channels.create({
    name: `no-mail-${username}`,
    topic: interaction.user.id,
    type: ChannelType.GuildText,
    parent: config.ticketCategoryId,

    permissionOverwrites: [
    {
      id: guild.roles.everyone.id,
      deny: [
        PermissionsBitField.Flags.ViewChannel
      ]
    },

    // USER
    {
      id: interaction.user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },

    // BOT
    {
      id: guild.members.me.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.ManageMessages
      ]
    }
  ]
  });

  await channel.send({
    content:
      `### No download mail – Ticket\n` +
      `Please provide your email adress and platform.`
  });

  return interaction.update({
    components: [],
    content: `✅ Your ticket has been created: ${channel}`
  });
};
