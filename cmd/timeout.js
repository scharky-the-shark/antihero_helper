const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const config = require("../Login.json");
const logger = require("../utils/logging");

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
const target = interaction.options.getMember("user");
const hours = interaction.options.getInteger("hours");
const reason = interaction.options.getString("reason");
const SucEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("User muted")
    .setDescription(
      `<:spray_checkx:1520804203218604062> ${target.tag} has been muted ${hours} hours.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const NotAlloEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("Error")
    .setDescription(
      `<:spray_denied:1520804205814878469> You are not allowed to use this command`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const sendSEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("You have receieved a strike")
    .setDescription(
      `<:support:1520804207060586516>  ${target}\n\nYou have been muted for **${hours} hours**.\nReason: ${reason}`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const sendEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("You have receieved a strike")
    .setDescription(
      `<:spray_denied:1520804205814878469> You have been muted in **${interaction.guild.name}** for ${hours} hours.\nReason: ${reason}`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrNotEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:hashtag:1520804246868463697> User not found on this server.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

  // ROLE CHECK
  const executor    = interaction.member;
  const modRoleId   = config.modRoleId;
  const adminRoleId = config.adminRoleId;

  if (interaction.user.id !== config.ownerUserId) {
    const hasModRole = executor.roles.cache.has(modRoleId);
    const hasAdminRole = executor.roles.cache.has(adminRoleId);

    if (!hasModRole && !hasAdminRole) {
    await interaction.reply({ embeds:[NotAlloEmbed], ephemeral: true });
    }
  }

  if (!target) {
  await interaction.reply({ embeds:[ErrNotEmbed], ephemeral: true });
  return;
  }

  // Timeout 
  await target.timeout(hours * 60 * 60 * 1000, reason);

  // DM versuchen
  try {
    await target.send({ embeds:[sendEmbed] });
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
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.ManageChannels

          ]
        },
        {
          id: adminRoleId,
          allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory
          ]
        },
        {
            id: guild.members.me.id,
            allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.ManageChannels,
                PermissionsBitField.Flags.ManageMessages,
                PermissionsBitField.Flags.EmbedLinks
            ]
        }
      ]
    });

  await channel.send({ embeds:[sendSEmbed] });
  }

await interaction.reply({ embeds:[SucEmbed], ephemeral: true });
await logger.timeout(
    interaction,
    target.user,
    `${hours} hour(s)`,
    reason
);
}};