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
     HOW TO DOWNLOAD
  --------------------------------*/
  if (interaction.customId === "faq_download") {

    return interaction.reply({
      ephemeral: true,
      content:
        "**How can I download the game?**\n\n" +
        "1. Register on the [official website](https://www.antiherostudios.com/?creatorCode=SCHARKY).\n" +
        "2. Wait until your registration confirmed with an automatic email.\n" +
        "3. After confirmation, you will receive a few hours later your download link by email.\n\n" +
        "New players are added daily. Please be **PATIENT**."
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
      content: "**Did you wait at least 24 hours after signing up?**",
      components: [row]
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
        "New players are added daily and emails are sent in batches."
    });
  }

  /* -------------------------------
     NO MAIL – YES -> CREATE TICKET
  --------------------------------*/
if (interaction.customId === "nomail_yes") {

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
    }
  ];

  // Support-Rollen erlauben
  for (const roleId of config.adminRoleId || []) {
    overwrites.push({
      id: roleId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    });
  }

  const channel = await guild.channels.create({
    name: `no-mail-${username}`,
    type: ChannelType.GuildText,
    parent: config.ticketCategoryId,
    permissionOverwrites: overwrites
  });

  await channel.send(
    "**No download mail – Ticket**\n\n" +
    "Please provide the following information:\n" +
    "- Your registration email address\n" +
    "- Your platform (iOS or Android)"
  );

  return interaction.update({
    components: [],
    content: `Your ticket has been created: ${channel}`
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
        "Yes. After your first login using the one-time  password, you must set your own password.\n\n" +
        "**I received an email but there is no password**\n" +
        "This is a known issue. As soon as it is fixed, a new email containing your one-time password will be sent automatically."
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
   MODMAIL TICKET
--------------------------------*/
if (interaction.customId === "modmail_ticket") {

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
      }
    ]
  });

  const embed = new EmbedBuilder()
    .setTitle("📨 New ModMail Ticket")
    .addFields(
      { name: "User", value: `${member.user.tag}`, inline: true },
      { name: "User ID", value: `${member.id}`, inline: true },
      { name: "Please enter your mail now", inline: true }
    )
    .setColor(0x2b2d31)
    .setTimestamp();

  await ticketChannel.send({
    content: `<@&${modRoleId}> ${member}`,
    embeds: [embed]
  });

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

