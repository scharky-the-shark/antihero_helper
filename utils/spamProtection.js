const sendModLog = require("./sendModLog");
const { EmbedBuilder,
        ActionRowBuilder,
        ButtonBuilder,
        ButtonStyle, } = require("discord.js");
        
// CONFIG
const MESSAGE_LIMIT = 5;
const TIME_WINDOW = 10_000;
const DELETE_FETCH_LIMIT = 100;
const TIMEOUT_DURATION = 12 * 60 * 60 * 1000;
const IMAGE_SCAM_MIN = 2;
const IMAGE_SCAM_MAX = 4;
const MOD_LOG_CHANNEL = "1480664417044533268";
const MONITORED_CATEGORIES = [
    "1296481397674082375",
    "1338906924984303627",
    "1473252581571825767"
];
const ENABLE_SPAM_PROTECTION = true;
const ENABLE_IMAGE_SCAM = true;
const ENABLE_MESSAGE_DELETE = true;
const ENABLE_TIMEOUT = true;
const ENABLE_DM = true;
const messageLog = new Map();
const imageScamTimers = new Map();

// HELPER
function debug(message) {
    console.log(`[Compromise] ${message}`);
}

function isModerator(member) {

    if (!member) return false;

    return member.permissions.has("ManageMessages");

}

function isImageAttachment(attachment) {

    return (
        attachment.contentType?.startsWith("image/") ||
        /\.(png|jpe?g|gif|webp)$/i.test(attachment.name ?? "")
    );

}

function detectImageScam(message) {

    if (!ENABLE_IMAGE_SCAM) {
        return {
            detected: false
        };
    }

    const text = message.content.replace(/\s+/g, "");

    const images = [...message.attachments.values()]
        .filter(isImageAttachment);

    if (text.length !== 0) {
        return {
            detected: false
        };
    }

    if (
        images.length < IMAGE_SCAM_MIN ||
        images.length > IMAGE_SCAM_MAX
    ) {
        return {
            detected: false
        };
    }

    return {

        detected: true,

        reason: `${images.length} images without text`,

        files: images

    };

}


// FETCH USER MESSAGES
async function fetchUserMessages(guild, userId) {

    const userMessages = [];

    debug(`Collecting messages for ${userId}...`);

    for (const [, channel] of guild.channels.cache) {

        if (!channel.isTextBased()) continue;
        if (!MONITORED_CATEGORIES.includes(channel.parentId)) {continue;}
        if (!channel.viewable) continue;

        const perms = channel.permissionsFor(guild.members.me);

        if (
            !perms?.has("ViewChannel") ||
            !perms.has("ReadMessageHistory")
        ) {
            continue;
        }

        try {

            const messages = await channel.messages.fetch({
                limit: DELETE_FETCH_LIMIT
            });

            const found = messages
                .filter(m => m.author.id === userId)
                .map(m => ({
                    channel,
                    message: m
                }));

            userMessages.push(...found);

        } catch (err) {

            debug(`Cannot fetch #${channel.name}: ${err.message}`);

        }

    }

    userMessages.sort(
        (a, b) =>
            a.message.createdTimestamp -
            b.message.createdTimestamp
    );

    debug(`Collected ${userMessages.length} messages.`);

    return userMessages;

}

// DELETE USER MESSAGES
async function deleteUserMessages(userMessages) {

    if (!ENABLE_MESSAGE_DELETE) return 0;

    let deleted = 0;

    debug(`Deleting ${userMessages.length} collected messages...`);

    for (const entry of userMessages) {

        try {

            await entry.message.delete();

            deleted++;

        } catch {}

    }

    debug(`Deleted ${deleted} messages.`);

    return deleted;

}

// BUILD FILE LIST
function buildAttachmentList(userMessages, scamFiles = []) {

    const files = [];

    for (const entry of userMessages) {

        files.push(...entry.message.attachments.values());

    }

    files.push(...scamFiles);

    return [
        ...new Map(
            files.map(file => [file.url, file])
        ).values()
    ];

}

// BUILD REASON LIST
function buildReasons(scam) {

    const reasons = [
        `${MESSAGE_LIMIT} messages within ${TIME_WINDOW / 1000} seconds`
    ];

    if (scam?.detected) {
        reasons.push(scam.reason);
    }

    return reasons;

}


// MAIN
module.exports = async function spamProtection(message, client) {

    if (!ENABLE_SPAM_PROTECTION) return;

    if (!message.guild) return;
    if (message.author.bot) return;

    const member = message.member;

    if (!member) return;

    if (isModerator(member)) return;

    const userId = message.author.id;
    const now = Date.now();

    debug(`${message.author.tag}: ${message.content || "<attachment>"}`);

    // MESSAGE COUNTER
    if (!messageLog.has(userId)) {
        messageLog.set(userId, []);
    }

    const timestamps = messageLog.get(userId);

    const filtered = timestamps.filter(
        t => now - t < TIME_WINDOW
    );

    filtered.push(now);

    messageLog.set(userId, filtered);

    debug(`Messages in window: ${filtered.length}`);

    // IMAGE SCAM
    const imageScam = detectImageScam(message);

    if (imageScam.detected) {
        debug(imageScam.reason);
    }

    // WAIT FOR SPAM LIMIT
    const spamTriggered = filtered.length >= MESSAGE_LIMIT;

    if (!spamTriggered) {

        if (!imageScam.detected) {
            return;
        }

        // Bereits ein Timer aktiv?
        if (imageScamTimers.has(userId)) {
            return;
        }

        debug("Image scam detected. Waiting for spam window...");

        imageScamTimers.set(userId, setTimeout(async () => {

            imageScamTimers.delete(userId);

            // Wurde inzwischen Spam erkannt?
            const current = messageLog.get(userId) ?? [];

            if (current.length >= MESSAGE_LIMIT) {
                return;
            }

            debug("Image scam confirmed.");

            const userMessages = await fetchUserMessages(
                message.guild,
                userId
            );

            const attachments = buildAttachmentList(
                userMessages,
                imageScam.files ?? []
            );

            const deletedMessages = await deleteUserMessages(userMessages);

            await sendModLog(client, {

                title: ":al: Possible image scam detected",

                color: 0xffaa00,

                user: message.author,

                channel: message.channel,

                reason: [
                    imageScam.reason
                ],

                action: `${deletedMessages} message(s) deleted`,

                messages: userMessages.map(entry => ({
                    createdTimestamp: entry.message.createdTimestamp,
                    content: entry.message.content || "<Attachment only>",
                    channel: entry.channel.name
                })),

                attachments: attachments.map(file => ({
                    name: file.name,
                    size: file.size,
                    type: file.contentType ?? "Unknown"
                }))

            });

            messageLog.delete(userId);

        }, TIME_WINDOW));

        return;

    }

    debug("Spam protection triggered.");

    // TIMEOUT
    if (ENABLE_TIMEOUT) {

        try {

            await member.timeout(
                TIMEOUT_DURATION,
                "Possible compromised account"
            );

            debug("Timeout applied.");

        } catch (err) {

            debug(`Timeout failed: ${err.message}`);

        }

    }

    // FETCH USER MESSAGES
    const userMessages = await fetchUserMessages(
        message.guild,
        userId
    );

    // BUILD REPORT DATA
    const reasons = buildReasons(imageScam);

    const attachments = buildAttachmentList(
        userMessages,
        imageScam.files ?? []
    );

    debug("Prepared report data.");
    // DELETE USER MESSAGES
    const deletedMessages = await deleteUserMessages(userMessages);


    debug(`Deleted ${deletedMessages} messages.`);

    // MOD LOG
    try {

        await sendModLog(client, {
            title: ":al: Possible compromised account detected",
            color: 0xff0000,
            user: message.author,
            channel: message.channel,
            reason: reasons,
            action: `12h Timeout • ${deletedMessages} message(s) deleted`,
            messages: userMessages.map(entry => ({
                createdTimestamp: entry.message.createdTimestamp,
                content:
                    entry.message.content ||
                    "<Attachment only>",
                channel:
                    entry.channel.name
            })),
            attachments: attachments.map(file => ({
                name: file.name,
                size: file.size,
                type: file.contentType ?? "Unknown"
            }))

        });

        debug("Mod report sent.");

    } catch (err) {
        debug(`Mod report failed: ${err.message}`);
    }

    // USER DM
    if (ENABLE_DM) {

        try {

            const request = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setCustomId("review_trigger")
                .setLabel("Request Review")
                .setStyle(ButtonStyle.Success)
            );
            
            const embed = new EmbedBuilder()
                .setColor(0xED4245)
                .setTitle("🔒 Security Alert")
                .setDescription(
                    "Our automated security system detected activity that appears like a compromised Discord account."
                )
                .addFields(
                    {
                        name: "What happened?",
                        value:
                            "As a precaution, your recent messages were removed to protect the community."
                    },
                    {
                        name: "What should you do now?",
                        value:
                            "• Change your Discord password immediately.\n" +
                            "• Enable Two-Factor Authentication (2FA).\n" +
                            "• Log out of all other sessions.\n" +
                            "• Run a malware scan if you opened suspicious files or links."
                    },
                    {
                        name: "Think this was a mistake?",
                        value:
                            "Please contact the server moderation."
                    }
                )
                .setFooter({
                    text: "AntiheroHelper - Automated Security System"
                })
                .setTimestamp();

            await message.author.send({
                embeds: [embed],
                components: [request]
            });

            debug("DM sent.");

        } catch (err) {

            debug(`DM failed: ${err.message}`);

        }

    }

    // CLEANUP
    messageLog.delete(userId);
    debug("Protection done.");
};