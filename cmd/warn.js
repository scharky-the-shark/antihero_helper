const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../Login.json");
const logger = require("../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(true)
    ),
    
  async execute(interaction) {
const target = interaction.options.getUser("user");
const reason = interaction.options.getString("reason");
const SucEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("User warned")
    .setDescription(
      `<:spray_checkx:1520804203218604062> ${target.tag} has been warned.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const sendEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("You have receieved a strike")
    .setDescription(
      `<:support:1520804207060586516> You have been warned in **${interaction.guild.name}**.\n**Reason:** ${reason}`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const sendSEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("You have receieved a strike")
    .setDescription(
      `<:support:1520804207060586516> <@${target.id}> You have been warned.\nReason: ${reason}`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrAlloEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_denied:1520804205814878469> You are not allowed to execute this command.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

//ROLE CHECK
const executor    = interaction.member;
const modRoleId   = config.modRoleId;
const adminRoleId = config.adminRoleId;

// Role Check for test serevr
if (interaction.user.id !== config.ownerUserId) {
  const hasModRole = executor.roles.cache.has(modRoleId);
  const hasAdminRole = executor.roles.cache.has(adminRoleId);

  if (!hasModRole && !hasAdminRole) {
  await interaction.reply({ embeds:[ErrAlloEmbed], ephemeral: true });
  return;
  }
}

    // Try DM 
    try {
      await target.send({ embeds:[sendEmbed]});

    } catch {
      // Fallback: make ModMail Ticket 
      const guild = interaction.guild;
      const categoryId = require("../Login.json").ticketCategoryId;

      const channel = await guild.channels.create({
  name: `warnstrike-${target.username.toLowerCase().replace(/[^a-z0-9]/gi, "")}`,
  parent: categoryId,
  permissionOverwrites: [
    {
      id: guild.roles.everyone.id,
      deny: [PermissionFlagsBits.ViewChannel]
    },
    {
      id: target.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ReadMessageHistory
      ],
      deny: [
        PermissionFlagsBits.SendMessages
      ]
    },
    {
      id: config.modRoleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ManageChannels
      ]
    },
    {
      id: config.adminRoleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory
      ]
    },
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
  await channel.send({ embeds:[sendSEmbed]});
}

await interaction.reply({ embeds:[SucEmbed], ephemeral: true });
await logger.warn(
    interaction,
    target,
    reason
);
}};