const MEME_CHANNEL = "1346452187965948014";

module.exports = async (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== MEME_CHANNEL) return;

    const linkRegex =
        /(https?:\/\/|www\.|discord\.gg\/|discord\.com\/invite\/)/i;

    if (!linkRegex.test(message.content)) return;

    await message.delete().catch(() => {});

    await message.author.send(
        "Links are not allowed in https://discord.com/channels/1296481397674082374/1346452187965948014"
    ).catch(() => {});
};