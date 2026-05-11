const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("./Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Delete last 100 messages in this channel"),

  async execute(interaction) {

    const executor = interaction.member;

    const modRoleId = config.modRoleId;
    const adminRoleId = config.adminRoleId;

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

    const messages = await interaction.channel.messages.fetch({ limit: 100 });

    await interaction.channel.bulkDelete(messages, true);

    await interaction.reply({
      content: `🧹 100 messages deleted.`,
      ephemeral: true
    });
  }
};