const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require("discord.js");

const config = require("./Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticketclose")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Close the current ticket"),

  async execute(interaction) {
// ROLE CHECK
const executor = interaction.member;

const modRoleId = config.modRoleId;
const adminRoleId = config.supportRoleId;

// Role Check
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


    const channel = interaction.channel;

    // Only in ticket category allowed
    if (channel.parentId !== config.ticketCategoryId) {
      return interaction.reply({
        content: "❌ This command can only be used inside ticket channels.",
        ephemeral: true
      });
    }

 const guild = interaction.guild;

const creatorOverwrite = channel.permissionOverwrites.cache.find(overwrite => {
  return (
    overwrite.type === 1 && // Member
    overwrite.id !== guild.roles.everyone.id &&
    overwrite.id !== modRoleId
  );
});

if (!creatorOverwrite) {
  return interaction.reply({
    content: "⚠️ Could not detect ticket creator.",
    ephemeral: true
  });
}

const creatorId = creatorOverwrite.id;


    if (!creatorId) {
      return interaction.reply({
        content: "⚠️ Ticket creator not stored in topic.",
        ephemeral: true
      });
    }

    // remove Creator of ticket 
await channel.permissionOverwrites.delete(creatorId).catch(() => {});

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("delete_ticket")
        .setLabel("Delete Ticket")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("export_ticket")
        .setLabel("Export Ticket")
        .setStyle(ButtonStyle.Success)
        .setDisabled(true)
    );

    await interaction.reply({
      content: "🔒 Ticket closed. Press the button below to delete it ~~or to export it to the dashboard~~.",
      components: [row]
    });

  }
};
