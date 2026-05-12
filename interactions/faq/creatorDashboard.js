module.exports = async (interaction) => {

  return interaction.reply({
    ephemeral: true,
    content:
      "### Creator dashboard and password\n" +
      "Check:\n" +
      "1. Did you apply?\n" +
      "2. Did you receive a confirmation mail?\n" +
      "3. Did you check your spam folder?\n\n" +
      "You can change your password later."
  });
};