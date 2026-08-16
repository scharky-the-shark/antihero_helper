const { EmbedBuilder } = require("discord.js");
module.exports = async (interaction) => {

    const embed1 = new EmbedBuilder()
        .setTitle("The Team")
        .setColor(0xF0A503)
        .setDescription(
`<@&1296482531734196254>
These are the head of the server with administration rights.

<@&1319627381941600256>
Official members of *Antihero Studios*
- Impersonating them [to damage the brand in any way] is strictly forbidden.

<@&1472392473874665552>
Antihero Studios Player Support
- Assist you for game issues in <#1473267376437989386>`
        );

    const embed2 = new EmbedBuilder()
        .setTitle("Moderators")
        .setColor(0x9D1727)
        .setDescription(
`<@&1374674313801629727>
- moderators of the server to keep chats clean and assist you solve common issues
- Ping them if you see something rule breaking
- **DO NOT PING THEM FOR ROLES**`
        );

    const embed3 = new EmbedBuilder()
        .setTitle("Creators")
        .setColor(0x01F9A3)
        .setDescription(
`<@&1397876586136604783>
- Exclusive Creators of the brand who get early access to updates
- Requires regular uploads & being accepted in the Creator Program

<@&1346459828138147860>
- Trusted Antihero Creators
- doing content for Antihero Studios
- being accepted in the program won't give you the role automatically
- given to approved creators`
        );

    const embed4 = new EmbedBuilder()
        .setTitle("Special Roles")
        .setColor(0xFFFF00)
        .setDescription(
`<@&1504438313195671632> <@&1470005111336997109> <@&1425859596282761236> 
- are players who took much effort to collect all relics in this season

<@&1350882077226303650> <@&1379404108972163173> <@&1398681785881071808> <@&1504438841795149998>
- players compete against each other in Misfitz finishing in the top 10

<@&1379406326446297299> <@&1376157375286739014> <@&1398681335089860790> <@&1425791750001393746> <@&1504438558990274680>
- Top 3 players in these playtest on the leaderboard`
        );

const embed5 = new EmbedBuilder()
        .setTitle("Modmail Bot")
        .setColor(0x000000)
        .setDescription(`<@1469339506942545981>
- Not a role but a bot
- will DM you if mod actions has been taken against you
- Providing answers to common questions
- modmailing tool
- Responsiblity and powered by <@1280882903567568922>`
        );

    await interaction.reply({
        embeds: [embed1, embed2, embed3, embed4, embed5],
        ephemeral: true 
    });
};