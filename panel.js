const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const config = require("./Login.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDescription("Send the FAQ panel"),

  async execute(interaction) {

    // Only owner can use this command
    if (interaction.user.id !== config.ownerUserId) {
      return interaction.reply({
        content: "You are not allowed to execute this command.",
        ephemeral: true
      });
    }

    const channel = await interaction.client.channels.fetch(
      config.startChannelId
    );

    if (!channel) {
      return interaction.reply({
        content: "Configured start channel not found!",
        ephemeral: true
      });
    }

    // ─────────────────────────────
    // Buttons
    // ─────────────────────────────

    // FAQ
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

    // DISABLED
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("faq_bugs")
        .setLabel("Report bugs / errors correctly")
        .setStyle(ButtonStyle.Primary),
    );

    // Creator
    const row_creator = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("faq_creator_dashboard")
        .setLabel("Creator dashboard & password")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("faq_misfitz_content")
        .setLabel("Create content for Misfitz")
        .setStyle(ButtonStyle.Success)
    );

    // Register
    const row_apple = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("faq_testflight")
        .setLabel("Testflight unavailable")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("faq_register")
        .setLabel("I've registered and now?")
        .setStyle(ButtonStyle.Primary),

    );

    // Modmailing
    const row_mod = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("modmail_ticket")
        .setLabel("Modmail")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("faq_nomail")
        .setLabel("No download mail received!")
        .setStyle(ButtonStyle.Danger),

    );

    // ─────────────────────────────
    // Send panel ALWAYS into startChannel
    // ─────────────────────────────

    await channel.send({
      content:
        "# Antihero – Help & FAQ Panel\n\n" +
        "Click one of the buttons below to get an answer.\n",
      components: [row_faq, row_apple, row_creator, row_mod]
    });

    // ─────────────────────────────
    // Acknowledge command in the channel
    // where /panel was executed
    // ─────────────────────────────

    await interaction.reply({
      content: `FAQ panel has been sent to <#${config.startChannelId}>.`,
      ephemeral: true
    });

  }
};
