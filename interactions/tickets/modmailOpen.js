const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField
} = require("discord.js");

const config = require("../../Login.json");

module.exports = async (interaction) => {

  const guild = interaction.guild;
  const member = interaction.member;

  const controls = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("delete_ticket")
      .setLabel("Delete Ticket")
      .setStyle(ButtonStyle.Danger)
  );

  const ticketChannel = await guild.channels.create({
    name: `modmail-${member.user.username}`,
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
      id: member.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },

    // MOD ROLE
    {
      id: config.modRoleId,
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

  await ticketChannel.send({
    content:
      `**Modmail – Ticket**\n\n${member} Please enter your message.`,
    components: [controls]
  });

  return interaction.reply({
    content: `📨 Your ticket has been created: ${ticketChannel}`,
    ephemeral: true
  });
};
