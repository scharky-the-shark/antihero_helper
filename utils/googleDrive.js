const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const tokenPath = path.join(__dirname, "..", "token.json");

try {
  const tokenData = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
  oAuth2Client.setCredentials(tokenData);
} catch (err) {
  console.error(`[googleDrive] Failed to load token.json: ${err.message}`);
  console.error("[googleDrive] Google Drive uploads will not work until token.json is provided.");
}

const drive = google.drive({
  version: "v3",
  auth: oAuth2Client
});

async function uploadFile(filePath, folderId, fileName) {
  return drive.files.create({
    requestBody: {
      name: fileName,
      parents: [folderId]
    },
    media: {
      body: fs.createReadStream(filePath)
    }
  });
}

module.exports = { uploadFile }; // Upload chat

