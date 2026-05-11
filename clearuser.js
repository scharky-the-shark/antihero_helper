const { SlashCommandBuilder } = require("discord.js");
const config = require("./Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearuser")
    .setDescription("Delete messages from a specific user")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("amount").setDescription("Amount of messages").setRequired(true)
    ),

  async execute(interaction) {

    const executor = interaction.member;
    const targetUser = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

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

    const filtered = messages
      .filter(m => m.author.id === targetUser.id)
      .first(amount);

    await interaction.channel.bulkDelete(filtered, true);

    await interaction.reply({
      content: `🧹 Deleted ${filtered.length} messages from ${targetUser.tag}`,
      ephemeral: true
    });
  }
};