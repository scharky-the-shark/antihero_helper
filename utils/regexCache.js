const configStore = require("./configStore");
const normalize = require("./normalize");

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isFragment(word) {
    return word.includes(".") ||
           word.includes("/") ||
           word.includes(":");
}

function buildWordPattern(word) {

    word = normalize(word);

    let pattern = "";

    for (const char of word) {

        pattern += escapeRegex(char);
        pattern += `${escapeRegex(char)}*`;
        pattern += "[\\s._-]*";
    }

    pattern += "s?";

    return pattern;
}

let cache = [];

function rebuild() {

    cache = [];

    const { bannedWords = [] } = configStore.get();

    for (const word of bannedWords) {

        if (!word) continue;

        if (isFragment(word)) {

            cache.push({
                word,
                fragment: true,
                normalized: normalize(word)
            });

        } else {

            cache.push({
                word,
                fragment: false,
                regex: new RegExp(
                    `(^|[^a-z0-9])${buildWordPattern(word)}([^a-z0-9]|$)`,
                    "i"
                )
            });

        }

    }

}

function match(content = "") {

    const normalized = normalize(content);

    for (const entry of cache) {

        if (entry.fragment) {

            if (normalized.includes(entry.normalized)) {
                return entry.word;
            }

        } else {

            if (entry.regex.test(normalized)) {
                return entry.word;
            }

        }

    }

    return null;

}

module.exports = {
    rebuild,
    match
};