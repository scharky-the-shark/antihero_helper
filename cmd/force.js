const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("force")
        .setDescription("Emergency moderation actions.")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.BanMembers |
            PermissionFlagsBits.KickMembers 
        )

        // Ban
        .addSubcommand(subcommand =>
            subcommand
                .setName("ban")
                .setDescription("Force ban a user.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("User")
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName("reason")
                        .setDescription("Reason")
                        .setRequired(false))
        )

        // Kick
        .addSubcommand(subcommand =>
            subcommand
                .setName("kick")
                .setDescription("Force kick a user.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("User")
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName("reason")
                        .setDescription("Reason")
                        .setRequired(false))
        )

        // Timeout
        .addSubcommand(subcommand =>
            subcommand
                .setName("timeout")
                .setDescription("Force timeout a user.")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("User")
                        .setRequired(true))
                .addIntegerOption(option =>
                    option
                        .setName("minutes")
                        .setDescription("Timeout duration")
                        .setMinValue(1)
                        .setMaxValue(40320) // 28 Tage
                        .setRequired(true))
                .addStringOption(option =>
                    option
                        .setName("reason")
                        .setDescription("Reason")
                        .setRequired(false))
        )

        // Delete Thread
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete-thread")
                .setDescription("Force delete the current thread.")
        )

        // Delete Thread
        .addSubcommand(subcommand =>
            subcommand
                .setName("delete-ticket")
                .setDescription("Force delete a ticket.")
        ),

    async execute(interaction) {

        const subcommand = interaction.options.getSubcommand();

        try {

            switch (subcommand) {

                case "ban": {

                    const user = interaction.options.getUser("user");
                    const reason = interaction.options.getString("reason") ?? "Forced moderation action";

                    await interaction.guild.members.ban(user.id, {
                        reason,
                    });

                    return interaction.reply({
                        content: "Executed",
                        ephemeral: true,
                    });
                }

                case "kick": {

                    const member = interaction.options.getMember("user");
                    const reason = interaction.options.getString("reason") ?? "Forced moderation action";

                    await member.kick(reason);

                    return interaction.reply({
                        content: "Executed",
                        ephemeral: true,
                    });
                }

                case "timeout": {

                    const member = interaction.options.getMember("user");
                    const minutes = interaction.options.getInteger("minutes");
                    const reason = interaction.options.getString("reason") ?? "Forced moderation action";

                    await member.timeout(
                        minutes * 60 * 1000,
                        reason
                    );

                    return interaction.reply({
                        content: "Executed",
                        ephemeral: true,
                    });
                }


                case "delete-thread": {

                    if (
                        interaction.channel.type !== ChannelType.PublicThread &&
                        interaction.channel.type !== ChannelType.PrivateThread &&
                        interaction.channel.type !== ChannelType.AnnouncementThread
                    ) {
                        return interaction.reply({
                            content: "Failed",
                            ephemeral: true,
                        });
                    }

                    await interaction.reply({
                        content: "Executed",
                        ephemeral: true,
                    });

                    await interaction.channel.delete("Forced deletion");

                    return;
                }


                case "delete-ticket": {

                    const channel  = interaction.channel;
                    const category = "1473252581571825767";

                    if (channel.parentId !== category) {
                        return interaction.reply({
                            content: "Failed",
                            ephemeral: true,
                        });
                    }

                    await interaction.reply({
                        content: "Executed",
                        ephemeral: true,
                    });

                    await interaction.channel.delete("Forced deletion");

                    return;
                }
            }

        } catch (err) {

            console.error(err);

            return interaction.reply({
                content: "Failed",
                ephemeral: true,
            }).catch(() => {});
        }

    },
};