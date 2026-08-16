const {
  EmbedBuilder
} = require("discord.js");

module.exports = async (member) => {

  try {

    const embed = new EmbedBuilder()

      .setColor(0x5865F2)
      .setTitle(
        `Welcome ${member.user.username} to Antihero Studios`
      )
      .setDescription(
        `Please be familized with our ` +
        `[server rules](https://discord.com/channels/1296481397674082374/1338819041048924251)\n\n` +

        `Before asking questions about the playtest please ` +
        `[check this channel out](https://discord.com/channels/1296481397674082374/1423412144598155355)\n\n` +

        `If you have questions check ` +
        `https://discord.com/channels/1296481397674082374/1473267376437989386\n\n` +

        `If you aren't registered for the playtest, signup ` +
        `[here](https://www.antiherostudios.com/en?creatorCode=SCHARKY)\n\n` +

        `This bot is reserved for moderation purposes.`
      )
      .setFooter({
        text: "AntiheroHelper made by SCHARKY"
      });

    await member.send({
      embeds: [embed]
    });

    console.log(
      `[WELCOME DM] Sent to ${member.user.tag}`
    );

  } catch (err) {
    console.error(
      `[WELCOME DM ERROR] ${member.user.tag}`
    );
  }
};