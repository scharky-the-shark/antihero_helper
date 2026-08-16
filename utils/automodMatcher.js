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

        // beliebig viele gleiche Zeichen erlauben
        pattern += `${escapeRegex(char)}*`;

        // Trenner erlauben
        pattern += "[\\s._-]*";
    }

    // optionales Plural-s
    pattern += "s?";

    return pattern;
}

function matches(content = "", word = "") {

    if (!content || !word) return false;

    if (isFragment(word)) {
        return normalize(content).includes(normalize(word));
    }

    const pattern = buildWordPattern(word);

    const regex = new RegExp(
        `(^|[^a-z0-9])${pattern}([^a-z0-9]|$)`,
        "i"
    );

    return regex.test(normalize(content));
}

module.exports = matches;