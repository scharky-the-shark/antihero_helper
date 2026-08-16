const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../logs/automod.json");

let config = null;

function load() {
    try {
        config = JSON.parse(fs.readFileSync(configPath, "utf8"));

        if (!config.bannedWords) {
            config.bannedWords = [];
        }

        return config;

    } catch (err) {
        console.error("[AutoMod] Failed to load config:", err);

        config = {
            bannedWords: []
        };

        return config;
    }
}

function get() {

    if (!config) {
        load();
    }

    return config;
}

function reload() {
    return load();
}

function save() {

    fs.writeFileSync(
        configPath,
        JSON.stringify(config, null, 4)
    );
}

module.exports = {
    get,
    load,
    reload,
    save
};