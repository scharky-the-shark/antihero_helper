const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits
} = require("discord.js");

const { getConfig } = require("./utils/configManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Updates the FAQ panel"),

  async execute(interaction) {

    const config = getConfig();

    const executor = interaction.member;

    const OwnerId = config.ownerUserId;
    const adminRoleId = config.adminRoleId;

    // ─────────────────────────────
    // Permission check
    // ─────────────────────────────

    if (interaction.user.id !== config.ownerUserId) {

      const hasOwnerId = executor.roles.cache.has(OwnerId);
      const hasAdminRole = executor.roles.cache.has(adminRoleId);

      if (!hasOwnerId && !hasAdminRole) {
        return interaction.reply({
          content: "❌ You are not allowed to execute this command.",
          ephemeral: true
        });
      }
    }

    // ─────────────────────────────
    // Channel fetch
    // ─────────────────────────────

    const channel = await interaction.client.channels.fetch(
      config.startChannelId
    );

    if (!channel) {
      return interaction.reply({
        content: "❌ Start channel not found.",
        ephemeral: true
      });
    }

    // ─────────────────────────────
    // Buttons
    // ─────────────────────────────

    const rules = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("faq_rules")
        .setLabel("Codex of Rules")
        .setStyle(ButtonStyle.Secondary),

      new ButtonBuilder()
        .setCustomId("faq_roles")
        .setLabel("Roles explained")
        .setStyle(ButtonStyle.Secondary)
    );

    const row_faq = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("faq_download")
        .setLabel("How can I download the game?")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("faq_country")
        .setLabel("Not available in my country!")
        .setStyle(ButtonStyle.Primary)
    );

    const row_bug = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("faq_bugs")
        .setLabel("Report bugs / errors correctly")
        .setStyle(ButtonStyle.Primary)
    );

    const row_creator = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("faq_creator_dashboard")
        .setLabel("Creator dashboard & password")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("faq_misfitz_content")
        .setLabel("Create content")
        .setStyle(ButtonStyle.Success)
    );

    const row_mod = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("modmail_ticket")
        .setLabel("Modmail")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("faq_nomail")
        .setLabel("No download mail received!")
        .setStyle(ButtonStyle.Danger),
      
      new ButtonBuilder()
        .setCustomId("faq_chatbot")
        .setLabel("Open Chatbot")
        .setStyle(ButtonStyle.Danger)
        .setDisabled(true)
    );

    // ─────────────────────────────
    // Fetch old panel
    // ─────────────────────────────

    let message;

    try {

      message = await channel.messages.fetch(
        config.faqPanelMessageId
      );

    } catch (err) {

      return interaction.reply({
        content:
          "❌ FAQ panel message not found.",
        ephemeral: true
      });
    }

    // ─────────────────────────────
    // Update panel
    // ─────────────────────────────

    try {

      await message.edit({
        content:
          "# Antihero – Help & FAQ Panel\n\n" +
          "Click one of the buttons below to get an answer.",
        components: [
          rules,
          row_faq,
          row_bug,
          row_creator,
          row_mod
        ]
      });

      await interaction.reply({
        content: "✅ FAQ panel updated successfully.",
        ephemeral: true
      });

    } catch (err) {

      console.error(err);

      await interaction.reply({
        content:
          "❌ Failed to update FAQ panel.",
        ephemeral: true
      });
    }
  }
};