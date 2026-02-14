# Antihero Helper Bot - Code Review & Task List

**Reviewed:** 2026-02-14

---

## Must Fix

- [ ] **Add missing utility files** - `utils/userStore.js`, `utils/cooldown.js`, `utils/exportLogs.js`, `utils/logWriter.js` are all imported but don't exist. Most commands will crash on startup without them.
- [x] **Move secrets out of source code** - Bot token in `Login.json` and Google OAuth `CLIENT_ID`/`CLIENT_SECRET` hardcoded in `utils/googleDrive.js` must be moved to environment variables or a `.env` file (and added to `.gitignore`). Anyone with repo access currently gets full control of the bot and linked Google account.
- [x] **Fix broken role check in `ticketclose.js:22-24`** - References `modRoleId` before it is declared (line 46), causing a `ReferenceError`. Also compares `interaction.user.id` to `config.modRoleId` (user ID vs role ID), which is logically wrong. The `/ticketclose` command is completely broken.
- [x] **Fix `adminRoleId` string iteration in `interaction.js:111`** - `config.adminRoleId` is a single string, but `for (const roleId of config.adminRoleId)` iterates over each character. Permission overwrites for the "no-mail" ticket will be created for IDs like `"1"`, `"2"`, `"9"` etc. Either make `adminRoleId` an array in `Login.json` or change the loop logic.

---

## Should Fix

- [x] **Add input validation on timeout hours** (`timeout.js:45`) - No upper bound on the `hours` parameter. Discord's max timeout is 28 days; add a check (e.g. max 672 hours) to give a friendly error instead of an API failure.
- [ ] **Remove dead `ticket.js` file** - It's imported in `index.js` but never actually called. The modmail button logic already lives in `interaction.js`. This is confusing dead code.
- [x] **Add error handling for Google Drive token read** (`utils/googleDrive.js:15`) - `fs.readFileSync("token.json")` will crash the entire bot if the file is missing or malformed. Wrap in try/catch and use an absolute path.
- [x] **Add `setDefaultMemberPermissions` to ban command** (`ban.js`) - Unlike `warn.js` and `timeout.js`, the ban command doesn't set default member permissions on the slash command builder. The command will be visible to everyone in the command picker (cosmetic issue; the role check still prevents unauthorized use).
- [x] **Add `token.json` to `.gitignore`** - The Google OAuth refresh token file should not be committed to version control.

