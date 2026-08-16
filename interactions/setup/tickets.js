const {
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    ChannelType
} = require("discord.js");

// EXCLUDED
const EXCLUDED_CHANNELS = [
    "1480664417044533268",
    "1504568997868212385",
    "1527726285466632356",
    "1535012482580615289"
];

// TICKET PREFIXES
const TICKET_PREFIXES = [
    "reportplayer",
    "userreport",
    "modmail",
    "collector",
    "no-access",
    "noaccess"
];

const TICKET_CATEGORY_ID = "1473252581571825767";

function formatLastActivity(timestamp) {

    const diff = Date.now() - timestamp;

    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;

    const hours = Math.floor(minutes / 60);

    if (hours < 24) return `${hours} h ago`;

    const days = Math.floor(hours / 24);

    if (days < 30) return `${days} d ago`;

    const date = new Date(timestamp);

    return date.toLocaleDateString("de-DE");

}

module.exports = async (interaction) => {
const guild = interaction.guild;
const counts = {};

for (const type of TICKET_PREFIXES) {
    counts[type] = 0;
}

let totalTickets = 0;

const options = [];
const channels = guild.channels.cache
    .filter(channel =>
        channel.type === ChannelType.GuildText &&
        channel.parentId === TICKET_CATEGORY_ID &&
        !EXCLUDED_CHANNELS.includes(channel.id)
    )
    .sort((a, b) => a.position - b.position);

for (const channel of channels.values()) {
     const prefix = channel.name.split("-")[0];

    if (!TICKET_PREFIXES.includes(prefix))
        continue;

    counts[prefix]++;
    totalTickets++;

    let description = "No activity";

    try {
        if (channel.lastMessageId) {
            const msg   = await channel.messages.fetch(channel.lastMessageId);
            description = formatLastActivity(msg.createdTimestamp);
        }
    } catch { }

    options.push({
        label: channel.name.substring(0, 100),
        description: description.substring(0, 100),
        value: channel.id
    });
}

const totalChannels = channels.size;
const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle("<:support:1520804207060586516> Ticket Overview")
    .addFields(
        {name: "<:folder:1526924370247815281> Ticket Channels",     value: `${totalChannels}`,          inline: true},
        {name: "<:support:1520804207060586516> Recognized Tickets", value: `${totalTickets}`,           inline: true},
        {name: "reportplayer",                                      value: `${counts.reportplayer}`,    inline: true},
        {name: "userreport",                                        value: `${counts.userreport}`,      inline: true},
        {name: "modmail",                                           value: `${counts.modmail}`,         inline: true},
        {name: "collector",                                         value: `${counts.collector}`,       inline: true},
        {name: "noaccess",                                          value: `${counts.noaccess}`,        inline: true}
    );

const rows = [];

for (let i = 0; i < options.length && i < 125; i += 25) {

    const chunk = options.slice(i, i + 25);

    rows.push(
        new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`ticket_overview_${i / 25}`)
                .setPlaceholder(`Select Ticket (${i + 1}-${Math.min(i + 25, options.length)})`)
                .addOptions(chunk)
        )
    );
}

    return interaction.update({
        embeds: [embed],
        components: rows
    });
};