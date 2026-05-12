client.on("messageCreate", async (message) => {

  if (message.author.bot) return;

  // USER CHECK
  if (message.author.id !== "XXX") return;

  try {

    await message.react("🧊");

  } catch (err) {

    console.error("ICE REACTION ERROR:");
    console.error(err);
  }
});