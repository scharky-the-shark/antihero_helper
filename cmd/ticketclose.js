const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  PermissionFlagsBits
} = require("discord.js");

const config = require("../Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticketclose")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Close the current ticket"),

  async execute(interaction) {
const SucEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("Ticket closed")
    .setDescription(
      `<:spray_checkx:1520804203218604062> Ticket closed. Press the button below to delete it ~~or to export it to the dashboard~~.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrCreEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Creator not found")
    .setDescription(
      `<:spray_crossx:1520804204384358420> Ticket creator not stored in topic.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrChaEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Wrong Channel")
    .setDescription(
      `<:spray_denied:1520804205814878469> This command can only be used inside ticket channels.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrNotEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Creator not found")
    .setDescription(
      `<:hashtag:1520804246868463697> Could not detect ticket creator`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

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

// ROLE CHECK
const executor    = interaction.member;
const modRoleId   = config.modRoleId;
const adminRoleId = config.supportRoleId;

// Role Check
if (interaction.user.id !== config.ownerUserId) {
  const hasModRole = executor.roles.cache.has(modRoleId);
  const hasAdminRole = executor.roles.cache.has(adminRoleId);

  if (!hasModRole && !hasAdminRole) {
  await interaction.reply({ embeds:[ErrChaEmbed], ephemeral: true });
  return;
  }
}

const channel = interaction.channel;
// Only in ticket category allowed
if (channel.parentId !== config.ticketCategoryId) {
await interaction.reply({ embeds:[ErrChaEmbed], ephemeral: true });
return;
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
await interaction.reply({ embeds:[ErrCreEmbed], components: [row], ephemeral: true });
return;
}

const creatorId = creatorOverwrite.id;
if (!creatorId) {
await interaction.reply({ embeds:[ErrCreEmbed], components: [row], ephemeral: true });
return;
}

    // remove Creator of ticket 
await channel.permissionOverwrites.delete(creatorId).catch(() => {});
    await interaction.reply({
      embeds:[SucEmbed], 
      ephemeral: false,
      components: [row]
    });

  }
};
