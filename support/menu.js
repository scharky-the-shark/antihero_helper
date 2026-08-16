module.exports = async (interaction) => {

    const value = interaction.values[0];

    switch (value) {

        case "discord":
            return require("./discord")(interaction);

        case "game":
            return require("./game")(interaction);

        case "creator":
            return require("./creator")(interaction);

        case "other":
            return require("./other")(interaction);

        case "list":
            return require("./list")(interaction);

// GAME SUPPORT
        case "creator_rules":
            return require("./creator/c_rules")(interaction);
        case "creator_role":
            return require("./creator/c_role")(interaction);
        case "creator_login":
            return require("./creator/c_login")(interaction);
        case "creator_ask":
            return require("./creator/c_ask")(interaction);
        case "creator_apply":
            return require("./creator/c_apply")(interaction);

// GAME SUPPORT
        case "game_nomail":
            return require("./game/nomail")(interaction);
        case "game_report":
            return require("./game/report")(interaction);
        case "game_player":
            return require("./game/player")(interaction);
        case "support_category_install":
            return require("./install")(interaction);

// INSTALL SUPPORT
        case "game_apple":
            return require("./game/apple")(interaction);
        case "game_country":
            return require("./game/country")(interaction);
        case "game_update":
            return require("./game/update")(interaction);

// DISCORD SUPPORT
        case "discord_user":
            return require("./discord/user")(interaction);
        case "discord_creator":
            return require("./discord/creator")(interaction);
        case "discord_mod":
            return require("./discord/mod")(interaction);
        case "discord_roles":
            return require("./discord/roles")(interaction);

// ELSE
        case "support_else":
            return require("./other")(interaction);

        default:
            return interaction.reply({
                content: "Unknown support category.",
                ephemeral: true
            });

    }

};