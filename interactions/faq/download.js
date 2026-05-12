module.exports = async (interaction) => {

  return interaction.reply({
    ephemeral: true,
    content:
      "**How can I download the game?**\n\n" +
      "1. Register on the official website.\n" +
      "2. Wait until your registration gets confirmed.\n" +
      "3. You will receive your download mail later.\n\n" +
      "Download mails are sent in batches. **BE PATIENT** "
  });
};