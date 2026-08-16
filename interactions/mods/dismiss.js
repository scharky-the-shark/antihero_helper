const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} = require("discord.js");
const config = require("../../Login.json");

module.exports = async (interaction) => {
    const modRoleId = config.modRoleId;
    const adminRoleId = config.adminRoleId;
    const executor = interaction.member;

    const NotAllowed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("<:spray_denied:1520804205814878469> Not allowed")
    .setDescription(
      `<:spray_denied:1520804205814878469> You are not allowed to execute this command.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

    if (interaction.user.id !== config.ownerUserId) {
      const hasModRole = executor.roles.cache.has(modRoleId);
      const hasAdminRole = executor.roles.cache.has(adminRoleId);

      if (!hasModRole && !hasAdminRole) {
      await interaction.reply({ embeds:[NotAllowed], ephemeral: true });
      }
    }

const DismissE = new EmbedBuilder()
        .setColor(0xED4245)
        .setTitle("<:support:1520804207060586516> AutoMod Triggered")
        .setDescription("A mod already reacted to this message");


  return interaction.update({
    embeds: [DismissE],
    components: []
  });
};
