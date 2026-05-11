const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionsBitField,
  EmbedBuilder
} = require("discord.js");


const config = require("./Login.json");

module.exports = async (interaction) => {

  if (!interaction.isButton()) return;
  /* -------------------------------
     RULES
  --------------------------------*/
if (interaction.customId === "faq_rules") {

    return interaction.reply({
      ephemeral: true,
      content:
        "**Codex of Rule for all Antiheros**\n\n" +
        ">>> 1. [TOS Antihero Studios](<https://www.antiherostudios.com/terms>)\n" +
        "2. [Discord TOS](<https://discord.com/terms>)\n" +
        "3. [Serverrules](https://discord.com/channels/1296481397674082374/1338819041048924251)"
    });
  }
  /* -------------------------------
     HOW TO DOWNLOAD
  --------------------------------*/
  if (interaction.customId === "faq_download") {

    return interaction.reply({
      ephemeral: true,
      content:
        "**How can I download the game?**\n\n" +
        "1. Register on the [official website](<https://www.antiherostudios.com/?creatorCode=SCHARKY>).\n" +
        "2. Wait until your registration confirmed with an automatic email.\n" +
        "3. After confirmation, you will receive a few days later your download link by email.\n\n" +
        "### Note: The game is currently only for ctreators only."
    });
  }

  /* -------------------------------
     NOT AVAILABLE IN MY COUNTRY
  --------------------------------*/
  if (interaction.customId === "faq_country") {

    return interaction.reply({
      ephemeral: true,
      content:
        "**The game is not available in my country**\n\n" +
        "This message usually appears when your account is not whitelisted yet on the Google Play Store.\n\n" +
        "Please check in <#1338866607333834823> if new players have already been added today.\n\n" +
        "Misfitz is worldwide through sign ups on our website and in Brazil on the Play Store (Android) available"
    });
  }

  /* -------------------------------
     NO MAIL – QUESTION 1
  --------------------------------*/
  if (interaction.customId === "faq_nomail") {

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("nomail_yes")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("nomail_no")
        .setLabel("No")
        .setStyle(ButtonStyle.Danger)
    );

    return interaction.reply({
      ephemeral: true,
      content: "**The game is currently only for creators available!**",
      //components: [row]
    });
  }

  /* -------------------------------
     NO MAIL – NO
  --------------------------------*/
  if (interaction.customId === "nomail_no") {

    return interaction.update({
      components: [],
      content:
        "Please wait a little longer.\n" +
        "Emails are sent in batches and direct before playtest start."
    });
  }

    /* -------------------------------
     BUG REPORT
  --------------------------------*/
  if (interaction.customId === "faq_bugs") {

    return interaction.reply({
      ephemeral: true,
      content:
        "**How do I report bugs or errors?**\n\n" +
        "Please post your report in <#1375507642138624121> and include:\n\n" +
        "1. Your device (for example: iPhone 11, iPad 9, Samsung Galaxy S22)\n" +
        "2. Your operating system and exact version\n" +
        "3. A detailed description of the problem\n" +
        "4. What you were doing before the issue occurred and how it's reproducible\n" +
        "5. Screenshots or a screen recording can help us!"
    });
  }

  /* -------------------------------
     CREATOR DASHBOARD
  --------------------------------*/
  if (interaction.customId === "faq_creator_dashboard") {

    return interaction.reply({
      ephemeral: true,
      content:
        "**Creator dashboard and password**\n\n" +
        "Please check the following first:\n" +
        "1. Did you already apply for access?\n" +
        "2. Did you receive a confirmation email?\n" +
        "3. Did you check your spam folder?\n\n" +
        "**Can I change my password later?**\n" +
        "Yes. After your first login using the one-time  password, you must set your own password." 
    });
  }

  /* -------------------------------
     MISFITZ CONTENT
  --------------------------------*/
  if (interaction.customId === "faq_misfitz_content") {

    return interaction.reply({
      ephemeral: true,
      content:
        "** Can I create content for Misfitz?**\n\n" +
        "You can:\n" +
        "- record videos\n" +
        "- stream live\n" +
        "- upload gameplay\n" +
        "- create artwork\n" +
        "- post memes\n" +
        "- share feedback on any platform\n" +
        "- invite other players\n\n" +
        "Help us grow the game and share your point of view with your audience!"
    });
  }



/* -------------------------------
     MISFITZ ROLES
  --------------------------------*/
if (interaction.customId === "faq_roles") {

    const embed1 = new EmbedBuilder()
        .setTitle("The Team")
        .setColor(0xF0A503)
        .setDescription(
`<@&1296482531734196254>
These are the head of the server with administration rights.

<@&1319627381941600256>
Official members of *Antihero Studios*
- Impersonating them [to damage the brand in any way] is strictly forbidden.`
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
`<@&1470005111336997109> <@&1425859596282761236>
- are players who took much effort to collect all relics

<@&1350882077226303650> <@&1379404108972163173> <@&1398681785881071808>
- players compete against each other in Misfitz finishing in the top 10

<@&1379406326446297299> <@&1376157375286739014> <@&1425791750001393746> <@&1398681335089860790>
- Top 3 players in these playtest on the leaderboard`
        );

const embed5 = new EmbedBuilder()
        .setTitle("Modmail Bot")
        .setColor(0x000000)
        .setDescription(`<@1469339506942545981>
- Not a role but a bot
- will DM you if mod actions has been taking against you
- Providing answers to common questions
- modmailing tool
- powered by <@1280882903567568922>`
        );

    await interaction.reply({
        embeds: [embed1, embed2, embed3, embed4, embed5],
        ephemeral: true // kannst du entfernen, wenn es öffentlich sein soll
    });
}


  /* -------------------------------
     NO MAIL – YES -> CREATE TICKET
  --------------------------------*/
if (interaction.customId === "nomail_yes") {

    const cRoleId = "1346459828138147860"
    
    // 🔄 BEARBEITET — Live Role Check + Owner Check
    if (interaction.user.id !== adminRoleId) {

      const hascRole = executor.roles.cache.has(cRoleId);

      if (!hascRole) {
        return interaction.reply({
          content: "❌ You are not allowed to execute this command.",
          ephemeral: true
        });
      }
    }

  const guild = interaction.guild;

  const username = interaction.user.username
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, "");

  const overwrites = [
  {
    id: guild.roles.everyone.id,
    deny: [PermissionsBitField.Flags.ViewChannel]
  },
  {
    id: interaction.user.id,
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ReadMessageHistory
    ]
  },
  {
    id: config.adminRoleId,
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ReadMessageHistory
    ]
  },
  {
    id: config.supportRoleId,
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ReadMessageHistory
    ]
  },
  {
    id: guild.members.me.id, // BOT
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ReadMessageHistory,
      PermissionsBitField.Flags.ManageChannels
    ]
  }
];


  overwrites.push({
  id: config.adminRoleId,
  allow: [
    PermissionsBitField.Flags.ViewChannel,
    PermissionsBitField.Flags.SendMessages,
    PermissionsBitField.Flags.ReadMessageHistory
  ]
});




  const channel = await guild.channels.create({
    name: `no-mail-${username}`,
    type: ChannelType.GuildText,
    parent: config.ticketCategoryId,
    permissionOverwrites: overwrites
  });

await channel.send({
  content:
    `**No download mail – Ticket**\n\n` +
    `Please provide the following information <@${interaction.user.id}> :\n` +
    `- Your registration email address\n` +
    `- Your platform (iOS or Android)`,
  allowedMentions: { users: [interaction.user.id] }
});

  return interaction.update({
    components: [],
    content: `Your ticket has been created: ${channel}`
  });
}

/* -------------------------------
   MODMAIL TICKET
--------------------------------*/

  /* -------------------------------
     NO MAIL – QUESTION 1
  --------------------------------*/
  if (interaction.customId === "modmail_ticket") {

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("modmail_ticket_open")
        .setLabel("Yes")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("modmail_ticket_cancel")
        .setLabel("Cancel")
        .setStyle(ButtonStyle.Danger)
    );

    return interaction.reply({
      ephemeral: true,
      content: "**Are you sure that you want to create a ticket?**",
      components: [row]
    });
  }

  /* -------------------------------
     NO MAIL – NO
  --------------------------------*/
  if (interaction.customId === "modmail_ticket_cancel") {

    return interaction.update({
      components: [],
      content:
        "No ticket opened.\n"});
  }

if (interaction.customId === "modmail_ticket_open") {

  const guild = interaction.guild;
  const member = interaction.member;

  const categoryId = config.ticketCategoryId;
  const modRoleId = config.modRoleId;

  const channelName = `modmail-${member.user.username}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "");

  // Doppeltes Ticket verhindern
  const existing = guild.channels.cache.find(
    c => c.name === channelName
  );

  if (existing) {
    return interaction.reply({
      content: `You already have an open ticket: ${existing}`,
      ephemeral: true
    });
  }

  const ticketChannel = await guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: categoryId,
    permissionOverwrites: [
  {
    id: guild.roles.everyone.id,
    deny: [PermissionsBitField.Flags.ViewChannel]
  },
  {
    id: member.id,
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ReadMessageHistory
    ]
  },
  {
    id: modRoleId,
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ReadMessageHistory
    ]
  },
  {
    id: guild.members.me.id, // BOT
    allow: [
      PermissionsBitField.Flags.ViewChannel,
      PermissionsBitField.Flags.SendMessages,
      PermissionsBitField.Flags.ReadMessageHistory,
      PermissionsBitField.Flags.ManageChannels
    ]
  }
]

  });

  await ticketChannel.send(
    "**Modmail – Ticket**\n\n" +
    `<@&${modRoleId}>! ${member} Please enter your message, a Mod will assist you shortly`
    );


  return interaction.reply({
    content: `📨 Your ticket has been created: ${ticketChannel}`,
    ephemeral: true
  });
}

if (interaction.customId === "delete_ticket") {

  const channel = interaction.channel;

  if (channel.parentId !== config.ticketCategoryId) {
    return interaction.reply({
      content: "❌ This button can only be used in ticket channels.",
      ephemeral: true
    });
  }

  await interaction.reply({
    content: "Deleting ticket..."
  });

  setTimeout(() => {
    channel.delete().catch(console.error);
  }, 2000);
}
// MODMAIL SYSTEM END
};

