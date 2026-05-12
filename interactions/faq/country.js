module.exports = async (interaction) => {

  return interaction.reply({
    ephemeral: true,
    content:
      "### The game is not available in my country**" +
      "This usually means your account is not whitelisted yet.\n" +
      "Misfitz is globally available for anyone who has registered.\n" +
      "Check the update channel for new waves."
  });
};