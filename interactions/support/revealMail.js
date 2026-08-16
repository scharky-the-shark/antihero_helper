const { EmbedBuilder } = require("discord.js");
const config = require("../../Login.json");
const { decrypt } = require("../../utils/crypto");

module.exports = async (interaction) => {
const noAll = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Not Allowed")
    .setDescription("<:spray_crossx:1520804204384358420> You are not allowed to reveal this email.")
    
const ERR = new EmbedBuilder()
    .setColor(0xff0000)
    .setTitle("Decryption failed")
    .setDescription("<:spray_crossx:1520804204384358420> Encryption failed")


    // Nur Support darf entschlüsseln
    if (!interaction.member.roles.cache.has(config.supportRoleId)) {
        return interaction.reply({
            embeds: [noAll],
            flags: 64
        });
    }

    const embed = interaction.message.embeds[0];
    if (!embed) {
        return interaction.reply({
            embeds: [ERR],
            flags: 64
        });
    }

    const emailField = embed.fields.find(
        f => f.name === "Encrypted Email"
    );

    if (!emailField) {
        return interaction.reply({
            embeds: [ERR],
            flags: 64
        });
    }

    const encrypted = emailField.value.replace(/```/g, "").trim();
    try {
        const email = decrypt(encrypted);
        const response = new EmbedBuilder()
            .setColor(0x57F287)
            .setTitle("Decrypted Email")
            .setDescription(`\`${email}\``)
            .setFooter({text: `Requested by ${interaction.user.tag}`})
            .setTimestamp();

        await interaction.reply({
            embeds: [response],
            flags: 64
        });
    } catch (err) {
        console.error(err);
        await interaction.reply({
            embeds: [ERR],
            flags: 64
        });
    }
};