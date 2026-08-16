const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const permissionList = [
    PermissionFlagsBits.Administrator,
    PermissionFlagsBits.ViewAuditLog,
    PermissionFlagsBits.ManageGuild,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageWebhooks,
    PermissionFlagsBits.ManageMessages,
    PermissionFlagsBits.ModerateMembers,
    PermissionFlagsBits.KickMembers,
    PermissionFlagsBits.BanMembers,
    PermissionFlagsBits.ManageNicknames,
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.SendMessages,
    PermissionFlagsBits.EmbedLinks,
    PermissionFlagsBits.AttachFiles,
    PermissionFlagsBits.ReadMessageHistory,
    PermissionFlagsBits.UseExternalEmojis,
    PermissionFlagsBits.AddReactions
];

const permissionNames = {
    [PermissionFlagsBits.Administrator]:        "Administrator",
    [PermissionFlagsBits.ViewAuditLog]:         "View Audit Log",
    [PermissionFlagsBits.ManageGuild]:          "Manage Server",
    [PermissionFlagsBits.ManageRoles]:          "Manage Roles",
    [PermissionFlagsBits.ManageChannels]:       "Manage Channels",
    [PermissionFlagsBits.ManageWebhooks]:       "Manage Webhooks",
    [PermissionFlagsBits.ManageMessages]:       "Manage Messages",
    [PermissionFlagsBits.ModerateMembers]:      "Timeout Members",
    [PermissionFlagsBits.KickMembers]:          "Kick Members",
    [PermissionFlagsBits.BanMembers]:           "Ban Members",
    [PermissionFlagsBits.ManageNicknames]:      "Manage Nicknames",
    [PermissionFlagsBits.ViewChannel]:          "View Channels",
    [PermissionFlagsBits.SendMessages]:         "Send Messages",
    [PermissionFlagsBits.EmbedLinks]:           "Embed Links",
    [PermissionFlagsBits.AttachFiles]:          "Attach Files",
    [PermissionFlagsBits.ReadMessageHistory]:   "Read Message History",
    [PermissionFlagsBits.UseExternalEmojis]:    "Use External Emojis",
    [PermissionFlagsBits.AddReactions]:         "Add Reactions"
};
const config = require("../../Login.json")

module.exports = async (interaction) => {
const botMember = interaction.guild.members.me;
const modRole   = interaction.guild.roles.cache.get(config.modRoleId);
const botLines  = permissionList.map(permission => `${botMember.permissions.has(permission) ? "<:spray_checkx:1520804203218604062>" : "<:spray_crossx:1520804204384358420>"} ${permissionNames[permission]}`);
const roleLines = permissionList.map(permission => `${modRole.permissions.has(permission)   ? "<:spray_checkx:1520804203218604062>" : "<:spray_crossx:1520804204384358420>"} ${permissionNames[permission]}`);

const botEmbed = new EmbedBuilder()
    .setColor(0x1acdd6)
    .setTitle("<:RAM:1526924374429532230> Bot Permissions")
    .setDescription(botLines.join("\n"));

const modEmbed = new EmbedBuilder()
    .setColor(0xad1223)
    .setTitle("<:guilds:1526924370247815281> Moderator Role Permissions")
    .setDescription(roleLines.join("\n"));

return interaction.update({
    embeds: [botEmbed, modEmbed],
    ephemeral: true
})
};