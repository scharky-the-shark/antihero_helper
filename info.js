const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const { getUser } = require("./utils/userStore");
const { getConfig } = require("./utils/configManager"); 
module.exports = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get moderation info about a user")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user")
        .setDescription("The user to get info about")
        .setRequired(true)
    ),

  async execute(interaction) {

    const config = getConfig(); 

    const executor = interaction.member;

    const modRoleId = config.modRoleId;       
    const adminRoleId = config.adminRoleId;  

    // 🔄 BEARBEITET — Live Role Check + Owner Check
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

    const target = interaction.options.getUser("user");
    const userData = getUser(target);

    const warnList = userData.warnings.length > 0
      ? userData.warnings.map((w, i) =>
          `**${i + 1}.** ${w.reason} (<@${w.moderator}>)`
        ).join("\n")
      : "None";

    const timeoutList = userData.timeouts.length > 0
      ? userData.timeouts.map((t, i) =>
          `**${i + 1}.** ${t.reason} – ${t.durationHours}h (<@${t.moderator}>)`
        ).join("\n")
      : "None";

    const banList = userData.bans.length > 0
      ? userData.bans.map((b, i) =>
          `**${i + 1}.** ${b.reason} (<@${b.moderator}>)`
        ).join("\n")
      : "None";

    const embed = new EmbedBuilder()
      .setTitle(`Moderation actions for: ${target.tag}`)
      .addFields(
        { name: "Warnings", value: `${userData.warnings.length}`, inline: true },
        { name: "Warn-reasons", value: warnList },
        { name: "Timeouts", value: `${userData.timeouts.length}`, inline: true },
        { name: "Timeout-reasons", value: timeoutList },
        { name: "Bans", value: `${userData.bans.length}`, inline: true },
        { name: "Ban-reason", value: banList }
      )
      .setThumbnail(target.displayAvatarURL())
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};

