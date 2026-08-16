const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
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

  const ticket = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setLabel("Open Ticket")
    .setStyle(ButtonStyle.Link)
    .setURL(ticketChannel.url)
    );

  const embed = new EmbedBuilder()
    .setColor(0xF0A503)
    .setTitle(`Modmail – Ticket`)
    .setDescription(`Please enter your message below, a mod will assist you when a member got time`)
  
    const supportMenu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
          .setCustomId("support_category_discord")
          .setPlaceholder("Report a user instead")
          .addOptions(
      new StringSelectMenuOptionBuilder()
          .setLabel("Report discord member")
          .setDescription("Scam, bot or inappropiate messages")
          .setValue("discord_user")))
  
    const created = new EmbedBuilder()
        .setColor(0x0dff00)
        .setTitle("Ticket created")
        .setDescription(`<:spray_checkx:1523351958344306878> Ticket created in: ${ticketChannel}`);

  await ticketChannel.send({
    content: `${member}`,
    embeds: [embed],
    components: [supportMenu, controls]
  });

  return interaction.reply({
    embeds: [created],
    components: [ticket],
    ephemeral: true
  });
};
