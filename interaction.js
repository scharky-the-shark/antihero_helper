module.exports = async (interaction) => {

  try {

    if (!interaction.isButton()) return;

    // FAQ
    // NO MAIL
    const noMail = require("./interactions/tickets/noMail");
    const noMailYes = require("./interactions/tickets/noMailYes");
    const noMailNo = require("./interactions/tickets/noMailNo");

    // MODMAIL
    const modmail = require("./interactions/tickets/modmail");
    const modmailOpen = require("./interactions/tickets/modmailOpen");
    const modmailCancel = require("./interactions/tickets/modmailCancel");

    // COLLECTION
    const collection = require("./interactions/tickets/collection");
    const collectionOpen = require("./interactions/tickets/modmailCollectorOpen");

    // DELETE
    const deleteTicket = require("./interactions/tickets/deleteTicket");

    const faqRules = require("./interactions/faq/rules");
    const faqRoles = require("./interactions/faq/roles");
    
    const faqDownload = require("./interactions/faq/download");
    const faqCountry = require("./interactions/faq/country");
    const faqBugs = require("./interactions/faq/bugs");
    const faqCreator = require("./interactions/faq/creatorDashboard");
    const faqContent = require("./interactions/faq/createContent");

    switch (interaction.customId) {

      case "faq_rules":
        return faqRules(interaction);

      case "faq_download":
        return faqDownload(interaction);

      case "faq_country":
        return faqCountry(interaction);

      case "faq_bugs":
        return faqBugs(interaction);

      case "faq_creator_dashboard":
        return faqCreator(interaction);

      case "faq_misfitz_content":
        return faqContent(interaction);

      case "faq_roles":
        return faqRoles(interaction);

      case "faq_nomail":
        return noMail(interaction);

      case "nomail_yes":
        return noMailYes(interaction);

      case "nomail_no":
        return noMailNo(interaction);

      case "modmail_ticket":
        return modmail(interaction);

      case "modmail_collection":
        return collection(interaction);
        
      case "modmail_collector":
        return collectionOpen(interaction);

      case "modmail_ticket_open":
        return modmailOpen(interaction);

      case "modmail_ticket_cancel":
        return modmailCancel(interaction);

      case "delete_ticket":
        return deleteTicket(interaction);
    }

  } catch (err) {

    console.error("INTERACTION ERROR:");
    console.error(err);

    try {

      if (!interaction.replied && !interaction.deferred) {

        await interaction.reply({
          content: "âŒ Interaction failed.",
          ephemeral: true
        });
      }

    } catch (e) {

      console.error("FAILED TO SEND ERROR REPLY:");
      console.error(e);
    }
  }
};