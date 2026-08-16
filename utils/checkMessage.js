const fs = require("fs");
const path = require("path");
const normalize = require("./normalize");

const configPath = path.join(__dirname, "../logs/automod.json");
const matches = require("./automodMatcher");

function loadBlockedWords() {
    try {
        const raw = fs.readFileSync(configPath);
        const data = JSON.parse(raw);

        return data.bannedWords || [];
    } catch (err) {
        console.error("[AutoMod] Failed to load banned words:", err);
        return [];
    }
}

function checkMessage(content = "") {

    const bannedWords = loadBlockedWords();

    for (const word of bannedWords) {

    if (matches(content, word)) {
           return {
            blocked: true,
            suspicious: true,
            word
            };
        }
    }

   return {
    blocked: false,
    suspicious: false
    };
}

module.exports = checkMessage;