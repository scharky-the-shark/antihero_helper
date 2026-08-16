const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("softban")
        .setDescription("Kick a user, deletes up to 7 days of messages.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to softban")
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the softban")
                .setRequired(false)),

    async execute(interaction) {
        const user      = interaction.options.getUser("user");
        const reason    =interaction.options.getString("reason") || "No reason provided.";
        const member    = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Softban failed")
            .setDescription("That user is not a member of this server.");

        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
        }

        if (user.id === interaction.user.id) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Softban failed")
            .setDescription("You cannot softban yourself.");

        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
        }

        if (!member.bannable) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Softban failed")
            .setDescription("Bot role too low to execute this action.");

        return interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
        }

        try {
        await interaction.guild.members.ban(user.id, {
            deleteMessageSeconds: 7 * 24 * 60 * 60,
            reason,
        });

        await interaction.guild.members.unban(
            user.id,
            `Softban completed by ${interaction.user.tag}`
        );

        const embed = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("Softban completed")
            .addFields(
                {
                    name: "User",
                    value: `${user.tag} (${user.id})`,
                },
                {
                    name: "Moderator",
                    value: `${interaction.user.tag} (${interaction.user.id})`,
                },
                {
                    name: "Messages Deleted",
                    value: "Last 7 days",
                },
                {
                    name: "Reason",
                    value: reason,
                }
            )
            .setTimestamp();

        // Log-Channel
        const logChannel = interaction.guild.channels.cache.get("1504568997868212385");

        if (logChannel) {
            await logChannel.send({
                embeds: [embed],
            });
        }

        await interaction.reply({
            embeds: [embed], ephemeral: false
        });

    }  catch (err) {
            console.error(err);

        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle("Softban failed")
            .setDescription("An error occurred.");

        await interaction.reply({
            embeds: [embed],
            ephemeral: true,
        });
        }
    },
};