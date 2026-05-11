const { SlashCommandBuilder, ChannelType } = require("discord.js");
const config = require("./Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quarantine")
    .setDescription("Timeout a user for 7 days and delete recent messages")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    ),

  async execute(interaction) {

    const executor = interaction.member;
    const targetUser = interaction.options.getUser("user");

    const modRoleId = config.modRoleId;
    const adminRoleId = config.adminRoleId;

    const sevenDays = 7 * 24 * 60 * 60 * 1000;

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

    if (targetMember.roles.highest.position >= executor.roles.highest.position) {
      return interaction.reply({
        content: "❌ You cannot timeout this user (role hierarchy).",
        ephemeral: true
      });
    }

    if (!targetMember.moderatable) {
      return interaction.reply({
        content: "❌ I cannot timeout this user (bot role too low).",
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    // Timeout
    await targetMember.timeout(
      sevenDays,
      "Account may be compromised - quarantine"
    );

    // DM
    try {
      await targetUser.send(
        "⚠️ Your account has been **quarantined for 7 days** because it may be compromised. Please secure your account and contact a moderator."
      );
    } catch {}

    // Message purge
    const cutoff = Date.now() - sevenDays;

    const channels = interaction.guild.channels.cache.filter(
      c =>
        c.type === ChannelType.GuildText ||
        c.type === ChannelType.GuildAnnouncement
    );

    for (const channel of channels.values()) {

      let lastId;

      while (true) {

        const options = { limit: 100 };
        if (lastId) options.before = lastId;

        const messages = await channel.messages.fetch(options).catch(() => null);
        if (!messages || messages.size === 0) break;

        const filtered = messages.filter(
          m => m.author.id === targetUser.id && m.createdTimestamp > cutoff
        );

        for (const msg of filtered.values()) {
          await msg.delete().catch(() => {});
        }

        lastId = messages.last().id;

        if (messages.last().createdTimestamp < cutoff) break;
      }
    }

    await interaction.editReply(
      `🔒 ${targetUser.tag} has been quarantined for **7 days** and messages were removed.`
    );
  }
};