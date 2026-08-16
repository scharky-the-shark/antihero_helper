const MEME_CHANNEL = "1346452187965948014";
const {EmbedBuilder} = require("discord.js");

module.exports = async (message) => {
const DM = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Moderation System")
    .setDescription(
      `<:spray_denied:1520804205814878469> Links are not allowed in https://discord.com/channels/1296481397674082374/1346452187965948014`)
    .setFooter({ text: "AntiheroHelper" })
    .setTimestamp();

    if (message.author.bot) return;
    if (message.channel.id !== MEME_CHANNEL) return;

    const linkRegex =
        /(https?:\/\/|www\.|discord\.gg\/|discord\.com\/invite\/)/i;

    if (!linkRegex.test(message.content)) return;

    await message.delete().catch(() => {});
    await message.author.send({ embeds:[DM] }).catch(() => {});
};