module.exports = async (interaction) => {

  return interaction.reply({
    ephemeral: true,
    content:
      "**Can I create content for Misfitz?**\n\n" +
      "You can:\n" +
      "- upload videos\n" +
      "- stream\n" +
      "- post memes\n" +
      "- create artwork\n" +
      "- invite players\n\n" +
      "Help the game grow."
  });
};