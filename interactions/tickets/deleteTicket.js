const config = require("../../Login.json");

module.exports = async (interaction) => {

  const channel = interaction.channel;

  if (channel.parentId !== config.ticketCategoryId) {
    return interaction.reply({
      content: "❌ This button can only be used in ticket channels.",
      ephemeral: true
    });
  }

  await interaction.reply({
    content: "Deleting ticket in 5 seconds..."
  });

  setTimeout(() => {
    channel.delete().catch(console.error);
  }, 5000);
};
