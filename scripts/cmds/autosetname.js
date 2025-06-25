module.exports = {
  config: {
    name: "autosetname",
    version: "2.0",
    author: "Modified by Yeasin",
    description: "Auto set bot name when added to a new group",
    role: 1,
    category: "box chat"
  },

  onStart: async function () {
    // This is required by GoatBot to prevent "missing onStart" error
  },

  onEvent: async function ({ api, event }) {
    if (event.logMessageType !== "log:subscribe") return;

    const botID = api.getCurrentUserID();
    const addedParticipants = event.logMessageData.addedParticipants;

    for (const user of addedParticipants) {
      const { userFbId: uid } = user;
      if (uid == botID) {
        try {
          await api.changeNickname("𝖡𝗎𝗍𝗍𝖾𝗋𝖿𝗅𝗒🎀", event.threadID, uid);
        } catch (err) {
          console.log("❌ Couldn't change bot nickname:", err.message);
        }
      }
    }
  }
};
