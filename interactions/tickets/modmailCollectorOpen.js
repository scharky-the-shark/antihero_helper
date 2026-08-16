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
    name: `collector-${member.user.username}`,
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
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.ManageMessages
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
            PermissionsBitField.Flags.ManageMessages,
            PermissionsBitField.Flags.EmbedLinks
        ]
    }
  ]
  });

  await ticketChannel.send({
    content:
      `**Collector – Ticket**\n\n${member} please send a video that contains the following to verify that you are eligible for the <@&1504438313195671632>:\n- sound\n- showcase of each relic rarity\n- going to settings`,
    components: [controls]
  });

  return interaction.reply({
    content: `📨 Your ticket has been created: ${ticketChannel}`,
    ephemeral: true
  });
};
