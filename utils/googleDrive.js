const fs = require("fs");
const { google } = require("googleapis");

const CLIENT_ID = "***.apps.googleusercontent.com";
const CLIENT_SECRET = "***";
const REDIRECT_URI = "http://localhost:3000/oauth2callback";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials(
  JSON.parse(fs.readFileSync("token.json", "utf8"))
);

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

