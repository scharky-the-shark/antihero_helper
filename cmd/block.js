const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require("fs");
const path = require("path");
const configStore = require("../utils/configStore");
const regexCache = require("../utils/regexCache");

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

const SucEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle("Success")
    .setDescription(
      `<:spray_checkx:1520804203218604062> *${word}* added to blacklist.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

const ErrEmbed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(
      `<:spray_denied:1520804205814878469> *${word}* already exists in blacklist.`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();
  

    const data = configStore.get();

    if (!Array.isArray(data.bannedWords)) {
    data.bannedWords = [];
    }

    if (data.bannedWords.includes(word)) {
    await interaction.reply({ embeds:[ErrEmbed], ephemeral: true });
    return;
    }

    data.bannedWords.push(word);

    configStore.save();
    regexCache.rebuild();

    await interaction.reply({ embeds:[SucEmbed], ephemeral: true });
  }
};