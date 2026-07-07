const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resolve')
        .setDescription('Deletes a resolved thread.')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads),

    async execute(interaction) {

        // Rechte prüfen
        if (!interaction.member.permissions.has(PermissionFlagsBits.ManageThreads)) {
            return interaction.reply({
                content: '❌ Your not eligible to execute this command.',
                ephemeral: true
            });
        }

        const channel = interaction.channel;

        // Prüfen ob Forum-Post/Thread
        if (
            channel.type !== ChannelType.PublicThread &&
            channel.type !== ChannelType.PrivateThread
        ) {
            return interaction.reply({
                content: '❌ This command only works in a thread channel.',
                ephemeral: true
            });
        }

        try {

            await interaction.reply({
                content: '🧹 Deleting...',
                ephemeral: true
            });

            // Thread/Post löschen
            await channel.delete();

        } catch (err) {
            console.error(err);

            await interaction.followUp({
                content: '❌ An error occurred.',
                ephemeral: true
            });
        }
    }
};