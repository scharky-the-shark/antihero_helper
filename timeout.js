const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getUser, updateUser } = require("./utils/userStore");
const config = require("./Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Timeout a user in hours")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName("hours").setDescription("Hours").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(true)
    ),
    
async execute(interaction) {

  // ROLE CHECK
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

  const target = interaction.options.getMember("user");
  const hours = interaction.options.getInteger("hours");
  const reason = interaction.options.getString("reason");

  if (!target) {
    return interaction.reply({
      content: "❌ User not found.",
      ephemeral: true
    });
  }

  // Timeout ausführen
  await target.timeout(hours * 60 * 60 * 1000, reason);

  // JSON speichern
  const userData = getUser(target);

  userData.timeouts.push({
    reason,
    moderator: interaction.user.id,
    durationHours: hours,
    date: new Date().toISOString()
  });

  updateUser(target.id, userData);

  // DM versuchen
  try {
    await target.send(
      `🔇 You have been muted in **${interaction.guild.name}** for ${hours} hours.\nReason: ${reason}`
    );
  } catch {

    // Fallback: privater Channel
    const guild = interaction.guild;
    const categoryId = config.ticketCategoryId;

    const channel = await guild.channels.create({
      name: `mute-${target.user.username.toLowerCase().replace(/[^a-z0-9]/gi, "")}`,
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
          id: modRoleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        },
        {
          id: adminRoleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        }
      ]
    });

    await channel.send(
      `🔇 ${target}\n\nYou have been muted for **${hours} hours**.\nReason: ${reason}`
    );
  }

  await interaction.reply({
    content: `🔇 ${target.user.tag} got muted for ${hours}h.`,
    ephemeral: true
  });
}
};