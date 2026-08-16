module.exports = async (interaction) => {
const channelId = interaction.customId.replace("ticket_delete:", "");
const channel   = interaction.guild.channels.cache.get(channelId);

const NotExist = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(`<:spray_crossx:1520804204384358420> This ticket no longer exists`);
const Failed = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Error")
    .setDescription(`<:spray_crossx:1520804204384358420> This ticket no longer exists`);
const Success = new EmbedBuilder()
    .setColor(0x07fc03)
    .setTitle("Success")
    .setDescription(`<:spray_checkx:1520804203218604062> Ticket **${channel.name}** deleted`);


    if (!channel) {        
        return interaction.reply({
            embeds: [NotExist],
            ephemeral: true
        });
    }

    await interaction.reply({
        embeds: [Success],
        ephemeral: true
    });

    try {
        await channel.delete("Deleted via Ticket Management");
    } catch (error) {
        console.error(error);
        if (!interaction.replied) {
            return interaction.reply({
                embeds: [Failed],
                ephemeral: true
            });
        }

        return interaction.followUp({
            embeds: [Failed],
            ephemeral: true
        });
    }
};