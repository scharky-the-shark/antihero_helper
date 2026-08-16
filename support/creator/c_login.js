const { EmbedBuilder } = require("discord.js");
module.exports = async (interaction) => {


    const Login = new EmbedBuilder()
        .setTitle("Creator Login")
        .setColor(0x01F9A3)
        .setDescription(
`The official login is only https://portal.prod.antiherostudios.net/login
**__DO NOT__** login with your account on other site pretending to be the official login and report scam!`
        );

    const Issue = new EmbedBuilder()
        .setTitle("Login issue")
        .setColor(0xf5e902)
        .setDescription(
`Please open in <#1376570941672394855> a post with detailed information *[without email and passowrd]*. 
Our team will assist you.`
        );
    await interaction.reply({
        embeds: [Login, Issue],
        ephemeral: true
    });
};