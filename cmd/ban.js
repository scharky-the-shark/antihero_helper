const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getUser, updateUser } = require("./utils/userStore");
const config = require("./Login.json");

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

    const modRoleId = config.modRoleId;
    const adminRoleId = config.adminRoleId;

    // Roles-Check
    if (interaction.user.id !== config.ownerUserId) {

      const hasModRole = executor.roles.cache.has(modRoleId);
      const hasAdminRole = executor.roles.cache.has(adminRoleId);

      if (!hasModRole && !hasAdminRole) {
        return interaction.reply({
          content: "❌ You are not allowed to execute this command.",
          ephemeral: true
        });
      }
    }

    const targetMember = await interaction.guild.members
      .fetch(targetUser.id)
      .catch(() => null);

    if (!targetMember) {
      return interaction.reply({
        content: "❌ User not found on this server.",
        ephemeral: true
      });
    }

    // Hierarchy-Check
    if (targetMember.roles.highest.position >= executor.roles.highest.position) {
      return interaction.reply({
        content: "❌ You cannot ban this user (role hierarchy).",
        ephemeral: true
      });
    }

    if (!targetMember.bannable) {
      return interaction.reply({
        content: "❌ I cannot ban this user (bot role too low).",
        ephemeral: true
      });
    }

    // Ban + 7 day message delete
    await interaction.guild.members.ban(targetMember, {
      reason,
      deleteMessageSeconds: 60 * 60 * 24 * 7
    });

    // Save changes
    const userData = getUser(targetUser.id);

    userData.bans.push({
      reason,
      moderator: interaction.user.id,
      date: new Date().toISOString()
    });

    updateUser(targetUser.id, userData);

    await interaction.reply({
      content: `🔨 ${targetUser.tag} has been banned and messages from last seven days has deleted too.`,
      ephemeral: true
    });
  }
};
