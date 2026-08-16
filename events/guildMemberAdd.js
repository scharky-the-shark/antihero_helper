// events/guildMemberAdd.js

const {
    EmbedBuilder
} = require("discord.js");

const recentBans = new Map();

module.exports = {
name: "guildMemberAdd",

/**
 * @param {import("discord.js").GuildMember} member
 */
async execute(member) {

try {

const MOD_ALERT_CHANNEL =
    "1504568997868212385";

let score = 0;
const reasons = [];

const ageMs =
    Date.now() -
    member.user.createdTimestamp;

const ageDays =
    Math.floor(ageMs / 86400000);

if (ageDays < 1) {

    score += 7;

    reasons.push(
        "Account younger than 1 day"
    );

}
else if (ageDays < 7) {

    score += 5;

    reasons.push(
        "Account younger than 7 days"
    );

}
else if (ageDays < 30) {

    score += 2;

    reasons.push(
        "Account younger than 30 days"
    );

}

if (/\d{4,}/.test(member.user.username)) {

    score += 2;

    reasons.push(
        "Suspicious username pattern"
    );

}

const guildBanInfo =
    recentBans.get(member.guild.id);

if (guildBanInfo) {

    const diff =
        Date.now() -
        guildBanInfo.timestamp;

    // 15 minutes
    if (diff < 900000) {

        score += 3;

        reasons.push(
            "Joined shortly after a ban"
        );

    }

}

let embedColor = 0x57F287; // Green
let threatLevel = "Low";

if (score >= 3) {

    embedColor = 0xFEE75C; // Yellow
    threatLevel = "Medium";

}

if (score >= 5) {

    embedColor = 0xFAA61A; // Orange
    threatLevel = "High";

}

if (score >= 7) {

    embedColor = 0xED4245; // Red
    threatLevel = "Critical";

}

const logChannel =
member.guild.channels.cache.get(
    MOD_ALERT_CHANNEL
);

const embed =
    new EmbedBuilder()
    .setTitle(
    "Anti-Alt Detection"
    )
    .setColor(embedColor)
    .setThumbnail(
    member.user.displayAvatarURL()
    )
    .addFields(
    {
        name: "User",
        value:
            `${member.user.tag}\n(${member.user.id})`
    },
    {
        name: "Account Age",
        value:
            `${ageDays} day(s)`,
        inline: true
    },
    {
        name: "Risk Score",
        value:
            `${score}`,
        inline: true
    },
    {
        name: "Threat Level",
        value:
            threatLevel,
        inline: true
    },
    {
        name: "Detection Reasons",
        value:
            reasons.join("\n") ||
            "No suspicious activity detected"
    }
    )
    .setFooter({
    text:
        "AntiheroHelper Anti-Alt System"
    })
    .setTimestamp();


    let actionText =
        "No action taken.";

    if (score >= 8) {

        await member.kick(
            `Anti-Alt Protection | ${reasons.join(", ")}`
        );

        actionText =
            "User was automatically kicked.";

        embed.addFields({
            name: "Automatic Action",
            value: actionText
        });

    }
    else {

    embed.addFields({
        name: "Automatic Action",
        value: actionText
    });
    }

    if (score >= 4 && logChannel) {
    await logChannel.send({
        embeds: [embed]
    });
    }

        console.log(`
[ANTI-ALT]
User: ${member.user.tag}
Score: ${score}
        `);

    }
    catch (err) {
        console.error("[ANTI-ALT ERROR]", err);
    }
}};