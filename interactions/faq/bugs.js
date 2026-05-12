module.exports = async (interaction) => {

  return interaction.reply({
    ephemeral: true,
    content:
      "**How do I report bugs?**\n\n" +
      "Please include:\n" +
      "- Device\n" +
      "- OS Version\n" +
      "- Steps to reproduce\n" +
      "- Screenshots or recordings"
  });
};