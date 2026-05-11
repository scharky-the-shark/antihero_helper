const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("./Login.json");
const { exportAllLogs } = require("./utils/exportLogs");
const { checkCooldown, setCooldown } = require("./utils/cooldown");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("export")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Export all logs to the Dashboard"),

  async execute(interaction) {

    // Role check
    const allowedRoles = config.export.allowedRoleIds;
    if (!interaction.member.roles.cache.some(r => allowedRoles.includes(r.id))) {
      return interaction.reply({
        content: "You are not allowed to use this command.",
        ephemeral: true
      });
    }

    // Cooldown (12h aus Login.json)
    const remaining = checkCooldown("export", config.export.cooldownHours);
    if (remaining > 0) {
      return interaction.reply({
        content: `⏳ Export possible in ${remaining}h.`,
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const count = await exportAllLogs(interaction.guild);

    setCooldown("export");
    await interaction.editReply(`✅ ${count} files exported.`);
  }
};
