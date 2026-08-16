const automod = require("./automod");
const tickets = require("./tickets");
const perm    = require("./permission")
module.exports = async (interaction) => {

    switch (interaction.values[0]) {

        case "automod":
            return automod(interaction);
        case "existing_tickets":
            return tickets(interaction);
        case "permissions":
            return perm(interaction);
//        case "support_channels":
//            return channels(interaction);
        case "configuration":
            return config(interaction);
        case "channel_permissions":
            return channelPerm(interaction);
    }

};