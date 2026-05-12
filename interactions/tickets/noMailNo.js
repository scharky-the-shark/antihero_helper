module.exports = async (interaction) => {

  return interaction.update({
    components: [],
    content:
      "Please wait a little longer.\n" +
      "Emails are sent in batches and direct before playtest start."
  });
};
