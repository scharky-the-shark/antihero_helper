const fs = require("fs");
const { google } = require("googleapis");

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
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

