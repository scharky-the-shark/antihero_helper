const setupMenu = require("./interactions/setup/menu");
const supportMenu = require("./support/menu");
const tickets = require("./interactions/setup/ticketMenu")

module.exports = async (interaction) => {
    if (interaction.customId.startsWith("ticket_overview_")) {
        return tickets(interaction);
    }

    switch (interaction.customId) {

        case "setup_menu":
            return setupMenu(interaction); 
        case "setup_menu_tickets":
            return tickets(interaction); 


        case "support_category":
            return supportMenu(interaction);

        case "support_category_discord":
            return supportMenu(interaction);
        case "support_category_game":
            return supportMenu(interaction);
        case "support_category_creator":
            return supportMenu(interaction);
        case "support_category_install":
            return supportMenu(interaction);
        case "support_category_mod":
            return supportMenu(interaction);
    }
};