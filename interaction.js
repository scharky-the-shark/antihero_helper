const { EmbedBuilder } = require("discord.js");

module.exports = async (interaction) => {

  try {
    const handleMenus = require("./menuInteraction");
    if (interaction.isStringSelectMenu()) {
    await handleMenus(interaction);
    return;
    }
    
    // MODALERT
    const modAlert        = require("./interactions/mods/alert");
    const modVerify       = require("./interactions/mods/verify");
    const modDismiss      = require("./interactions/mods/dismiss");
    const modDelete       = require("./interactions/mods/delete");

    // COLLECTION
    const collection      = require("./interactions/tickets/collection");
    const collectionOpen  = require("./interactions/tickets/modmailCollectorOpen");

    // DELETE
    const deleteTicket    = require("./interactions/tickets/deleteTicket");
    const ticketDelMenu   = require("./interactions/setup/delete_ticket")
    // Support neu
    const bugReport       = require("./support/game/bugReport");
    const nomail          = require("./interactions/support/nomailRequest");
    const Reveal          = require("./interactions/support/revealMail");

    // Start
    const startNoMail     = require("./support/game/nomail");


    if (interaction.customId.startsWith("mod_alert:")) {
        return modAlert(interaction);
    }

    if (interaction.customId.startsWith("mod_verify:")) {
        return modVerify(interaction);
    }

    if (interaction.customId.startsWith("mod_dismiss:")) {
        return modDismiss(interaction);
    }
    if (interaction.customId.startsWith("ticket_delete:")) {
        return ticketDelMenu(interaction);
    }
    
    switch (interaction.customId) {
      case "mod_delete":
        return modDelete(interaction);

// Redirects
      case "fill_nomail_ios":
        return nomail(interaction);

      case "fill_nomail_ios":
        return nomail(interaction);
      
      case "fill_nomail_ios":
        return nomail(interaction);
    
      case "fill_nomail_ios":
        return nomail(interaction);

// No Mail
      case "fill_nomail_ios":
        return nomail(interaction);

      case "fill_nomail_android":
        return nomail(interaction);


// Collector
      case "modmail_collection":
        return collection(interaction);
        
      case "modmail_collector":
        return collectionOpen(interaction);

      case "delete_ticket":
        return deleteTicket(interaction);

// Support neu
      case "fill_bugreport":
        return bugReport(interaction);
 
      case "reveal_nomail_email":
        return Reveal(interaction);

// START
      case "start_nomail":
        return startNoMail(interaction);

    }
  } catch (err) {
    console.error("INTERACTION ERROR:");
    console.error(err);

    try {
    const ErrEmbed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Unknown Error")
        .setDescription(`<:hashtag:1520804246868463697> An error occurred.`)
        .setFooter({ text: "AntiheroHelper" })
        .setTimestamp();

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          embeds: [ErrEmbed],
          ephemeral: true
        });
      }
    } catch (e) {

      console.error("FAILED TO SEND ERROR REPLY:");
      console.error(e);
    }
  }
};