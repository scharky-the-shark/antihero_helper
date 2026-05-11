const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("block")
    .setDescription("Add a forbidden word to automod")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addStringOption(option =>
      option
        .setName("word")
        .setDescription("Forbidden word")
        .setRequired(true)
    ),

  async execute(interaction) {

    const word = interaction.options
      .getString("word")
      .toLowerCase()
      .trim();

    const filePath = path.join(__dirname, "./logs/automod.json");

    let data = {};

    try {
      data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
      data = { bannedWords: [] };
    }

    if (!Array.isArray(data.bannedWords)) {
      data.bannedWords = [];
    }

    if (data.bannedWords.includes(word)) {
      return interaction.reply({
        content: `⚠️ "${word}" already exists.`,
        ephemeral: true
      });
    }

    data.bannedWords.push(word);

    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 2)
    );

    await interaction.reply({
      content: `🚫 Word "${word}" added.`,
      ephemeral: true
    });
  }
};