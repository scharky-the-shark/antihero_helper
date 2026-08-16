const { 
SlashCommandBuilder, 
ChannelType, 
EmbedBuilder, 
PermissionFlagsBits 
} = require("discord.js");
const config = require("../Login.json");
const logger = require("../utils/logging");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("quarantine")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Timeout a user for 7 days and delete recent messages")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    ),

  async execute(interaction) {

const NotAllowed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("Not allowed")
    .setDescription(
      `<:spray_denied:1520804205814878469> You are not allowed to execute this command.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const NotFound = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("User not found")
    .setDescription(
      `<:spray_crossx:1520804204384358420> User not found on this server.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrAlloEmbedRole = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_denied:1520804205814878469> You cannot timeout this user (role hierarchy).`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrEmbedRole = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_crossx:1520804204384358420> I cannot quarantine this user (bot role too low).`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const DM = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Suspicious activity detected")
    .setDescription(
      `<:support:1520804207060586516> Your account has been **quarantined for 7 days** because it may be compromised.\nPlease secure your account and contact a moderator.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const SucEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Success")
    .setDescription(
      `<:spray_checkx:1520804203218604062> ${targetUser.tag} has been quarantined for **7 days** and messages were removed.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

    const executor = interaction.member;
    const targetUser = interaction.options.getUser("user");

    const modRoleId = config.modRoleId;
    const adminRoleId = config.adminRoleId;

    const sevenDays = 7 * 24 * 60 * 60 * 1000;

    if (interaction.user.id !== config.ownerUserId) {
      const hasModRole = executor.roles.cache.has(modRoleId);
      const hasAdminRole = executor.roles.cache.has(adminRoleId);

      if (!hasModRole && !hasAdminRole) {
      await interaction.reply({ embeds:[NotAllowed], ephemeral: true });
      }
    }

    const targetMember = await interaction.guild.members
      .fetch(targetUser.id)
      .catch(() => null);

    if (!targetMember) {
    await interaction.reply({ embeds:[NotFound], ephemeral: true });
    }

    if (targetMember.roles.highest.position >= executor.roles.highest.position) {
    await interaction.reply({ embeds:[ErrAlloEmbedRole], ephemeral: true });
    return;
    }

    if (!targetMember.moderatable) {
    await interaction.reply({ embeds:[ErrEmbedRole], ephemeral: true });
    return;
    }

    await interaction.deferReply({ ephemeral: true });

    // Timeout
    await targetMember.timeout(
      sevenDays,
      "Account may be compromised - quarantine"
    );

    // DM
    try {
    await targetUser.send({ embeds:[DM] });
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

    await interaction.editReply({ embeds:[SucEmbed], ephemeral: true });
    await logger.timeout(
    interaction,
    targetUser,
    "7 days",
    "Account may be compromised - quarantine"
);
}};