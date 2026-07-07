const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const api = require("./utils/misfitzApi");

function formatNumber(number) {

    return Number(number).toLocaleString("de-DE");

}

function formatPlaytime(minutes) {

    const totalMinutes = Math.floor(minutes / 60);

    const days = Math.floor(totalMinutes / 1440);
    const hours = Math.floor((totalMinutes % 1440) / 60);
    const mins = totalMinutes % 60;

    if (days > 0)
        return `${days}d ${hours}h`;

    if (hours > 0)
        return `${hours}h ${mins}min`;

    return `${mins}min`;

}

module.exports = {

    data: new SlashCommandBuilder()

        .setName("stats")
        .setDescription("Shows Misfitz player statistics")

        .addStringOption(option =>
            option
                .setName("playerid")
                .setDescription("Player ID")
                .setRequired(true)
        ),

    async execute(interaction) {

        await interaction.deferReply();

        try {

            const playerId =
                interaction.options.getString("playerid");

            const response =
                await api.player(playerId);

            const player = response.data;
            const stats = player.stats;

            const embed = new EmbedBuilder()

                .setColor(0xf39c12)

                .setTitle(`${player.playerName}`)

                .setDescription(
                    "General player statistics from the creator playtest."
                )

                .addFields(
                    {
                        name: "<:history:1520803959571349535> Heroes",
                        value: formatNumber(player.heroes.length),
                        inline: true
                    },

                    {
                        name: "<:record:1520803962356502691> Played Games",
                        value: formatNumber(stats.gamesPlayed),
                        inline: true
                    },

                    {
                        name: "<:GOO:1520803956563906710> Extractions",
                        value: formatNumber(stats.extractions),
                        inline: true
                    },

                    {
                        name: "<:Tutle:1520804017192570880> Deaths",
                        value: formatNumber(stats.deaths),
                        inline: true
                    },

                    {
                        name: "<:goldenGoose:1520803955041636534> Playtime",
                        value: formatPlaytime(stats.playtime),
                        inline: true
                    },

                    {
                        name: "<:relic_glow:1520803964910833745> Relics",
                        value: formatNumber(player.relics.totalCollected),
                        inline: true
                    },

                    {
                        name: "<:hashtag:1520804246868463697> Player ID",
                        value: player.playerId.replace("Player:", ""),
                        inline: true
                    },
                    {
                        name: "More",
                        value:
                            "[View more stats](https://misfitz-stats.pages.dev)\n" +
                            "[Misfitz Statz Bot](https://misfitz-stats.pages.dev/discord)"
                    }

                )

            await interaction.editReply({
                embeds: [embed]
            });

        }

        catch (error) {

            let message =
                "<:support:1520804207060586516> An error occurred!\nCheck if the PlayerID is from the Creator Playtest!\n-# Global support coming with PA6";

            if (
                error.apiData?.error ===
                "Profile is private"
            ) {
                message =
                    "<:Tutle:1520804017192570880> This player's profile is private.";
            }

            else if (
                error.apiData?.error
            ) {
                message =
                    error.apiData.error;
            }

            const embed = new EmbedBuilder()

                .setColor(0xe74c3c)

                .setTitle("Player Statistics")

                .setDescription(message);

            await interaction.editReply({
                embeds: [embed]
            });

        }

    }

};