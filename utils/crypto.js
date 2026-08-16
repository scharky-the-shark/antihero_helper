const crypto = require("crypto");
const config = require("../Login.json");
const KEY = Buffer.from(config.encryptionKey, "hex");

if (KEY.length !== 32) {
    throw new Error("Encryption key must be exactly 32 bytes (64 hex characters).");
}

function encrypt(text) {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final()
    ]);
    const tag = cipher.getAuthTag();

    return `v1:${Buffer.concat([iv, tag, encrypted]).toString("base64")}`;
}

function decrypt(payload) {
    if (!payload.startsWith("v1:")) {
        throw new Error("Unknown encryption version.");
    }

    const data = Buffer.from(payload.substring(3), "base64");
    const iv = data.subarray(0, 12);
    const tag = data.subarray(12, 28);
    const encrypted = data.subarray(28);
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        KEY,
        iv
    );

    decipher.setAuthTag(tag);

    return Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]).toString("utf8");
}

module.exports = {encrypt, decrypt};