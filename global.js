const { REST, Routes } = require("discord.js");
const config = require("./Login.json");

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
    try {

        console.log("Deleting global commands...");

        await rest.put(
            Routes.applicationCommands(config.clientId),
            { body: [] }
        );

        console.log("Global commands deleted.");

    } catch (error) {
        console.error(error);
    }
})();