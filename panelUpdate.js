const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  PermissionFlagsBits
} = require("discord.js");

const { getConfig } = require("./utils/configManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("panel")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDescription("Updates the FAQ panel"),

  async execute(interaction) {
    const config = getConfig();
    const executor = interaction.member;
    const OwnerId = config.ownerUserId;

    // Permission check
    if (interaction.user.id !== config.ownerUserId) {
      const hasOwnerId = executor.roles.cache.has(OwnerId);

      if (!hasOwnerId && !hasAdminRole) {
        return interaction.reply({
          content: "You are not allowed to execute this command.",
          ephemeral: true
        });
      }
    }

    // Channel fetch
    const channel = await interaction.client.channels.fetch(
      config.startChannelId
    );

    if (!channel) {
      return interaction.reply({
        content: "Start channel not found.",
        ephemeral: true
      });
    }

    // Buttons

    //NEW PANEL
const supportEmbed = new EmbedBuilder()
    .setColor(0x00A86B)
    .setTitle("<:support:1520804207060586516> Antihero Support Center")
    .setDescription(
`### <:guilds:1526924370247815281> Discord Support
• Rules and Roles
• Reports & moderation
• Server questions
• Discord related issues

### <:relic_icon:1526924375847211090> Game Support
• Playtest access
• Download & Update issues
• Bugs & technical issues
• Rewards & progression

### <:goldenGoose:1520803955041636534> Creator support
• Creator & Upload Rules
• Requirements & Advantages
• Creator Support

### <:Tutle:1520804017192570880> Something Else
Not sure where your issue belongs? - Select this option`
    )
    .setFooter({text: "Antihero Helper • Support Assistant"});

const supportMenu = new ActionRowBuilder().addComponents(
  new StringSelectMenuBuilder()
    .setCustomId("support_category")
    .setPlaceholder("Select a support category")
    .addOptions(
      new StringSelectMenuOptionBuilder()
          .setLabel("Discord Support")
          .setDescription("Moderation, reports and server questions")
          .setEmoji("<:guilds:1526924370247815281>")
          .setValue("discord"),

      new StringSelectMenuOptionBuilder()
          .setLabel("Game Support")
          .setDescription("Playtest, bugs, progress and gameplay")
          .setEmoji("<:relic_icon:1526924375847211090>")
          .setValue("game"),

      new StringSelectMenuOptionBuilder()
          .setLabel("Download & Update issues")
          .setDescription("Google Play and Apple errors")
          .setEmoji("<:RAM:1526924374429532230>")
          .setValue("support_category_install"),

      new StringSelectMenuOptionBuilder()
          .setLabel("Creator Support")
          .setDescription("Content policy, creator role and more")
          .setEmoji("<:goldenGoose:1520803955041636534>")
          .setValue("creator"),

      new StringSelectMenuOptionBuilder()
          .setLabel("Something Else")
          .setDescription("I'm not sure where my issue belongs")
          .setEmoji("<:Tutle:1520804017192570880>")
          .setValue("other"),

      new StringSelectMenuOptionBuilder()
          .setLabel("List all categories")
          .setValue("list")
  )
);

    // Fetch old panel
    let message;
    try {
      message = await channel.messages.fetch(
        config.faqPanelMessageId
      );

    } catch (err) {

    await channel.send({
        content: 
`## <:support:1520804207060586516> Antihero Support Center
>>> ### <:guilds:1526924370247815281> Discord Support
• Rules and Roles
• Reports & moderation
• Server questions
• Discord related issues

### <:relic_icon:1526924375847211090> Game Support
• Playtest access
• Download & Update issues
• Bugs & technical issues
• Rewards & progression

### <:goldenGoose:1520803955041636534> Creator support
• Creator & Upload Rules
• Requirements & Advantages
• Creator Support

### <:Tutle:1520804017192570880> Something Else
Not sure where your issue belongs? - Select this option`,
        embeds: [],
        components: [supportMenu]
    });
    }

    // Update panel
    try {
      await message.edit({
          content: null,
          embeds: [supportEmbed],
          components: [supportMenu]
      });

      await interaction.reply({
        content: "FAQ panel updated successfully.",
        ephemeral: true
      });

    } catch (err) {
      console.error(err);

      await interaction.reply({
        content: "Failed to update FAQ panel.",
        ephemeral: true
      });
    }
  }
};