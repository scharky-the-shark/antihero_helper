const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { getUser, updateUser } = require("./utils/userStore");
const config = require("./Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a user")
    .addUserOption(option =>
      option.setName("user").setDescription("User").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("reason").setDescription("Reason").setRequired(true)
    ),
    
  async execute(interaction) {
//ROLE CHECK
const executor = interaction.member;

const modRoleId = config.modRoleId;
const adminRoleId = config.adminRoleId;

// Role Check for test serevr
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
    const reason = interaction.options.getString("reason");

    const userData = getUser(target);

    userData.warnings.push({
      reason,
      moderator: interaction.user.id,
      date: new Date().toISOString()
    });

    updateUser(target.id, userData);

    // Try DM 
    try {
      await target.send(
        `⚠️ You have been warned in **${interaction.guild.name}**.\nReason: ${reason}`
      );
    } catch {
      // Fallback: make ModMail Ticket 
      const guild = interaction.guild;
      const categoryId = require("./Login.json").ticketCategoryId;

      const channel = await guild.channels.create({
  name: `warnstrike-${target.username.toLowerCase().replace(/[^a-z0-9]/gi, "")}`,
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
      id: config.modRoleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory
      ]
    },
    {
      id: config.adminRoleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory
      ]
    }
  ]
});


      await channel.send(
        `<@${target.id}> ⚠️ You have been warned.\nReason: ${reason}`
      );
    }

    await interaction.reply({
      content: `⚠️ ${target.tag} has been warned.`,
      ephemeral: true
    });
  }
};
