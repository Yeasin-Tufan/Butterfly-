module.exports = {
  config: {
    name: "autosetname",
    version: "2.2-debug",
    author: "Yeasin AutoFix Debug",
    description: "Always set bot's nickname to 𝖡𝗎𝗍𝗍𝖾𝗋𝖿𝗅𝗒🎀 with debug logs",
    role: 1,
    category: "box chat"
  },

  onStart: async function () {
    // required to prevent GoatBot install error
  },

  onEvent: async function ({ api, event }) {
    const botID = api.getCurrentUserID();
    const threadID = event.threadID;

    // ✅ When bot is added to group
    if (event.logMessageType === "log:subscribe") {
      const addedParticipants = event.logMessageData.addedParticipants;
      for (const user of addedParticipants) {
        if (user.userFbId == botID) {
          try {
            await api.changeNickname("𝖡𝗎𝗍𝗍𝖾𝗋𝖿𝗅𝗒🎀", threadID, botID);
            api.sendMessage("✅ Bot nickname set to 𝖡𝗎𝗍𝗍𝖾𝗋𝖿𝗅𝗒🎀 successfully.", threadID);
          } catch (err) {
            api.sendMessage("❌ Failed to set nickname:\n" + err.message, threadID);
          }
        }
      }
    }

    // ✅ When nickname manually changed (bot nick updated by someone)
    if (event.logMessageType === "log:thread-nickname") {
      const changedFor = event.logMessageData.participant_id;
      if (changedFor == botID) {
        try {
          await api.changeNickname("𝖡𝗎𝗍𝗍𝖾𝗋𝖿𝗅𝗒🎀", threadID, botID);
          api.sendMessage("🔁 Nickname was changed. Bot has reset its name to 𝖡𝗎𝗍𝗍𝖾𝗋𝖿𝗅𝗒🎀", threadID);
        } catch (err) {
          api.sendMessage("⚠️ Bot tried to reset its nickname but failed:\n" + err.message, threadID);
        }
      }
    }
  }
};
