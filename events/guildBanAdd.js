// events/guildBanAdd.js

const guildMemberAddEvent =
    require("./guildMemberAdd");

module.exports = {
    name: "guildBanAdd",

    /**
     * @param {import("discord.js").GuildBan} ban
     */
    async execute(ban) {

        guildMemberAddEvent.recentBans.set(
            ban.guild.id,
            {
                userId: ban.user.id,
                timestamp: Date.now()
            }
        );

        console.log(`
[ANTI-ALT]
Recent ban stored:
${ban.user.tag}
        `);

    }
};