const replaceHomoglyphs = require("./homoglyphs");

function normalize(text = "") {

    text = replaceHomoglyphs(text);

    return text
        .normalize("NFKD")
        .replace(/[\u200B-\u200D\uFEFF]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/5/g, "s")
        .replace(/4/g, "a")
        .replace(/3/g, "e")
        .replace(/€/g, "e")
        .replace(/1/g, "i")
        .replace(/!/g, "i")
        .replace(/0/g, "o");
}

module.exports = normalize;