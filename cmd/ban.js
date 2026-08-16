const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../Login.json");
const logger = require("../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("Ban a user and delete last 7 days of messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(true)
    ),

  async execute(interaction) {
const executor = interaction.member;
const targetUser = interaction.options.getUser("user");
const reason = interaction.options.getString("reason");

const SucEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("User Banned")
    .setDescription(
      `<:support:1520804207060586516> ${targetUser.tag} has been banned and messages from last seven days has deleted too.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrLowEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_crossx:1520804204384358420> I cannot ban ${targetUser.tag} (bot role too low).`)
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
    .setTitle("Error")
    .setDescription(
      `<:hashtag:1520804246868463697> User not found on this server.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

    const modRoleId = config.modRoleId;
    const adminRoleId = config.adminRoleId;

    // Roles-Check
    if (interaction.user.id !== config.ownerUserId) {

      const hasModRole = executor.roles.cache.has(modRoleId);
      const hasAdminRole = executor.roles.cache.has(adminRoleId);

      if (!hasModRole && !hasAdminRole) {
      await interaction.reply({ embeds:[ErrAlloEmbed], ephemeral: true });
      return;
      }
    }

    const targetMember = await interaction.guild.members
      .fetch(targetUser.id)
      .catch(() => null);

    if (!targetMember) {
    await interaction.reply({ embeds:[ErrNotEmbed], ephemeral: true });
    return;
    }

    // Hierarchy-Check
    if (targetMember.roles.highest.position >= executor.roles.highest.position) {
    await interaction.reply({ embeds:[ErrAlloEmbed], ephemeral: true });
    return;
    }

    if (!targetMember.bannable) {
    await interaction.reply({ embeds:[ErrLowEmbed], ephemeral: true });
    return;
    }

    if (targetUser.id === interaction.client.user.id) {
    await interaction.reply({ embeds:[ErrLowEmbed], ephemeral: true });
    }
    
    // Ban + 7 day message delete
    await interaction.guild.members.ban(targetMember, {
      reason,
      deleteMessageSeconds: 60 * 60 * 24 * 7
    });

    await interaction.reply({ embeds:[SucEmbed], ephemeral: true });
    await logger.ban(
    interaction,
    targetUser,
    `${reason}\nDeleted Messages: Last 7 days`
);
  }
};


