const {
    Client,
    Collection,
    GatewayIntentBits,
    Partials,

    SlashCommandBuilder,

    EmbedBuilder,

    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,

    StringSelectMenuBuilder,

    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,

    PermissionFlagsBits,
    PermissionsBitField,

    ChannelType,

    ActivityType,

    AuditLogEvent,

    Events
} = require("discord.js");

const LOG_CHANNEL_ID = "1504568997868212385";

const COLORS = {
    success: 0x57F287,
    info: 0x5865F2,
    warning: 0xFEE75C,
    danger: 0xED4245,
    neutral: 0x2B2D31
};

const TYPES = {
    ban: {
        title: "<:support:1520804207060586516> User Banned",
        color: COLORS.danger
    },

    unban: {
        title: "<:spray_checkx:1520804203218604062> User Unbanned",
        color: COLORS.success
    },

    timeout: {
        title: "<:spray_denied:1520804205814878469> User Timed Out",
        color: COLORS.warning
    },

    timeout_remove: {
        title: "<:spray_checkx:1520804203218604062> Timeout Removed",
        color: COLORS.success
    },

    kick: {
        title: "<:support:1520804207060586516> User Kicked",
        color: COLORS.warning
    },

    warn: {
        title: "<:support:1520804207060586516> User Warned",
        color: COLORS.warning
    },

    purge: {
        title: "<:support:1520804207060586516> Messages Purged",
        color: COLORS.info
    },

    role_add: {
        title: "<:goldenGoose:1520803955041636534> Role Added",
        color: COLORS.success
    },

    role_remove: {
        title: "<:goldenGoose:1520803955041636534> Role Removed",
        color: COLORS.danger
    },

    nickname: {
        title: "<:history:1520803959571349535> Nickname Changed",
        color: COLORS.info
    },

    custom: {
        title: "<:history:1520803959571349535> Bot Log",
        color: COLORS.neutral
    }
};

async function getLogChannel(guild) {

    if (!guild) return null;

    let channel = guild.channels.cache.get(LOG_CHANNEL_ID);

    if (!channel) {

        try {
            channel = await guild.channels.fetch(LOG_CHANNEL_ID);
        } catch {
            return null;
        }

    }

    if (!channel) return null;

    if (channel.type !== ChannelType.GuildText) return null;

    return channel;

}

function userString(user) {

    if (!user) return "Unknown";

    return `${user}\n\`${user.id}\``;

}

function trim(text, max = 1024) {

    if (!text) return null;

    text = String(text);

    if (text.length <= max) return text;

    return text.slice(0, max - 3) + "...";

}

async function sendLog({

    guild,

    type,

    target = null,

    actor = null,

    reason = null,

    duration = null,

    source = null,

    channel = null,

    fields = [],

    footer = null

}) {

    const logChannel = await getLogChannel(guild);

    if (!logChannel) return;

    const config = TYPES[type] ?? TYPES.custom;

    const embed = new EmbedBuilder()
        .setColor(config.color)
        .setTitle(config.title)
        .setTimestamp();

    if (target) {

        embed.addFields({
            name: "<:hashtag:1520804246868463697> Case-ID",
            value: `\`${target.id}\``,
            inline: false
        });

        embed.addFields({
            name: "<:hashtag:1520804246868463697> User ID",
            value: userString(target),
            inline: true
        });

    }

    if (actor) {

        embed.addFields({
            name: "<:GOO:1520803956563906710> Actor",
            value: userString(actor),
            inline: true
        });

    }

    if (channel) {

        embed.addFields({
            name: "<:history:1520803959571349535> Channel",
            value: `${channel}`,
            inline: true
        });

    }

    if (source) {

        embed.addFields({
            name: "Source",
            value: trim(source),
            inline: true
        });

    }

    if (reason) {

        embed.addFields({
            name: "Reason",
            value: trim(reason),
            inline: false
        });

    }

    if (duration) {

        embed.addFields({
            name: "Duration",
            value: trim(duration),
            inline: true
        });

    }

    if (Array.isArray(fields) && fields.length > 0) {

        embed.addFields(fields);

    }

    if (footer) {

        embed.setFooter({
            text: trim(footer, 2048)
        });

    }

    await logChannel.send({
        embeds: [embed]
    });

}

async function ban(interaction, target, reason) {

    return sendLog({
        guild: interaction.guild,
        type: "ban",
        target,
        actor: interaction.user,
        reason,
        channel: interaction.channel
    });

}

async function unban(interaction, target, reason) {

    return sendLog({
        guild: interaction.guild,
        type: "unban",
        target,
        actor: interaction.user,
        reason,
        channel: interaction.channel
    });

}

async function timeout(interaction, target, duration, reason) {

    return sendLog({
        guild: interaction.guild,
        type: "timeout",
        target,
        actor: interaction.user,
        duration,
        reason,
        channel: interaction.channel
    });

}

async function timeoutRemoved(interaction, target, reason = "Timeout removed") {

    return sendLog({
        guild: interaction.guild,
        type: "timeout_remove",
        target,
        actor: interaction.user,
        reason,
        channel: interaction.channel
    });

}

async function kick(interaction, target, reason) {

    return sendLog({
        guild: interaction.guild,
        type: "kick",
        target,
        actor: interaction.user,
        reason,
        channel: interaction.channel
    });

}

async function warn(interaction, target, reason) {

    return sendLog({
        guild: interaction.guild,
        type: "warn",
        target,
        actor: interaction.user,
        reason,
        channel: interaction.channel
    });

}

async function purge(interaction, amount) {

    return sendLog({
        guild: interaction.guild,
        type: "purge",
        actor: interaction.user,
        channel: interaction.channel,
        fields: [
            {
                name: "Deleted Messages",
                value: String(amount),
                inline: true
            }
        ]
    });

}

async function roleAdded(interaction, target, role) {

    return sendLog({
        guild: interaction.guild,
        type: "role_add",
        target,
        actor: interaction.user,
        channel: interaction.channel,
        fields: [
            {
                name: "Role",
                value: `${role}`,
                inline: true
            }
        ]
    });

}

async function roleRemoved(interaction, target, role) {

    return sendLog({
        guild: interaction.guild,
        type: "role_remove",
        target,
        actor: interaction.user,
        channel: interaction.channel,
        fields: [
            {
                name: " Role",
                value: `${role}`,
                inline: true
            }
        ]
    });

}

async function nickname(interaction, target, oldName, newName) {

    return sendLog({
        guild: interaction.guild,
        type: "nickname",
        target,
        actor: interaction.user,
        channel: interaction.channel,
        fields: [
            {
                name: "Vorher",
                value: oldName ?? "None",
                inline: true
            },
            {
                name: "Nachher",
                value: newName ?? "None",
                inline: true
            }
        ]
    });

}

async function custom(interaction, options = {}) {

    return sendLog({
        guild: interaction.guild,

        type: options.type ?? "custom",

        target: options.target,

        actor: options.actor ?? interaction.user,

        reason: options.reason,

        duration: options.duration,

        source: options.source,

        channel: options.channel ?? interaction.channel,

        fields: options.fields ?? [],

        footer: options.footer
    });

}

/*
|--------------------------------------------------------------------------
| Universeller Moderationslogger
|--------------------------------------------------------------------------
*/

async function modAction(interaction, options = {}) {

    return sendLog({

        guild: interaction.guild,

        type: options.type ?? "custom",

        target: options.target ?? null,

        actor: interaction.member ?? interaction.user,

        reason: options.reason ?? null,

        duration: options.duration ?? null,

        source: options.source ?? null,

        channel: options.channel ?? interaction.channel,

        fields: options.fields ?? [],

        footer: options.footer ?? null

    });

}

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

module.exports = {

    ban,

    unban,

    timeout,

    timeoutRemoved,

    kick,

    warn,

    purge,

    roleAdded,

    roleRemoved,

    nickname,

    custom,

    modAction

};