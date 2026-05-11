const fs = require("fs");
const path = require("path");
const normalize = require("./normalize");

const configPath = path.join(__dirname, "../logs/automod.json");

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

    const normalizedContent = normalize(content);

    for (const word of bannedWords) {

        const normalizedWord = normalize(word);

        if (normalizedContent.includes(normalizedWord)) {
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