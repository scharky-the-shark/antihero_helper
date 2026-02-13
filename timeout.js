const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getUser, updateUser } = require("./utils/userStore");
const config = require("./Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a user in hours")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("hours").setDescription("Hours").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
//ROLE CHECK
const executor = interaction.member;

const modRoleId = config.modRoleId;
const adminRoleId = config.adminRoleId;

// Seperate Check (for Test server needed)
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

    const target = interaction.options.getMember("user");
    const hours = interaction.options.getInteger("hours");
    const reason = interaction.options.getString("reason");

    await target.timeout(hours * 60 * 60 * 1000, reason);

    const userData = getUser(target.id);

    userData.timeouts.push({
      reason,
      moderator: interaction.user.id,
      durationHours: hours,
      date: new Date().toISOString()
    });

    updateUser(target.id, userData);

    await interaction.reply({
      content: `🔇 ${target.user.tag} got muted for ${hours}h .`,
      ephemeral: true
    });
  }
};
