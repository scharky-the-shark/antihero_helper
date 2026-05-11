function normalize(text = "") {
    return text
        .normalize("NFKD")
        .replace(/[\u200B-\u200D\uFEFF]/g, "") // zero width
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .replace(/5/g, "s")
        .replace(/4/g, "a")
        .replace(/3/g, "e")
        .replace(/1/g, "i")
        .replace(/0/g, "o");
}

module.exports = normalize;