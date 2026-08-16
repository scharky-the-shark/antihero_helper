const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    ForumLayoutType,
    SortOrderType
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testchannel")
        .setDescription("Creates a private automod testing channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

    if (interaction.user.id !== "1280882903567568922") {
        return interaction.reply({
            content: "Only the developer can use this command.",
            flags: 64
        });
    }

    const guild = interaction.guild;
    const categoryId = "1473252581571825767";

    try {
        // Kanal erstellen
        const channel = await guild.channels.create({
            name: `test-antiherohelper`,
            type: ChannelType.GuildText,
            defaultForumLayout: ForumLayoutType.ListView,
            defaultSortOrder: SortOrderType.CreationDate,
            parent: categoryId,
            topic: "A test area for antiheroHelper without disturbing others to crash test and investigate errors quicker."
        });

        await channel.permissionOverwrites.edit(guild.roles.everyone, {
            ViewChannel: false
        });

        // me
        await channel.permissionOverwrites.edit("1280882903567568922", {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AttachFiles: true,
            EmbedLinks: true,
            AddReactions: true,
            ManageChannels: true,
            ManageMessages: true,
            ManageThreads: true,
            CreatePublicThreads: true,
            CreatePrivateThreads: true,
            SendMessagesInThreads: true,
            ManageRoles: true

        });

        // Bot
        await channel.permissionOverwrites.edit(guild.members.me.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true,
            AttachFiles: true,
            EmbedLinks: true,
            AddReactions: true,
            ManageMessages: true,
            ManageThreads: true,
            CreatePublicThreads: true,
            CreatePrivateThreads: true,
            SendMessagesInThreads: true,
            UseExternalEmojis: true,
            UseExternalStickers: true,
            MentionEveryone: true,
            ManageRoles: true
        });

        const adminRoles = guild.roles.cache.filter(role =>
            role.permissions.has(PermissionFlagsBits.Administrator)
        );

        for (const role of adminRoles.values()) {
            await channel.permissionOverwrites.edit(role.id, {
                ViewChannel: true
            });
        }

        await interaction.reply({
            content: `✅ Test channel created: ${channel}`,
            flags: 64
        });
    } catch (err) {
        console.error(err);
        await interaction.reply({
            content: `❌ ${err.message}`,
            flags: 64
        });
    }
}
};