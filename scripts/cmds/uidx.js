module.exports = {
  config: {
    name: "uidx",
    version: "3.0",
    author: "NTKhang | Fixed by Kamu",
    countDown: 3,
    role: 0,
    shortDescription: "Show Boss UID",
    longDescription: "Bot replies with UID when someone types 'uid'",
    category: "utility",
  },

  onStart: async function(){},

  onChat: async function({ event, message }) {
    if (event.body && event.body.toLowerCase().trim() === "uid") {
      try {
        const videoStream = await global.utils.getStreamFromURL("https://i.imgur.com/ta7ciNU.mp4");
        
        await message.reply({
          body: "╔════════════════════╗\n" +
                "║  🎮 𝐅𝐑𝐄𝐄 𝐅𝐈𝐑𝐄 𝐈𝐃 🎮  ║\n" +
                "╠════════════════════╣\n" +
                "║  ➤ 𝟭𝟲𝟲𝟰𝟭𝟴𝟴𝟴𝟮𝟯      ║\n" +
                "║  ➤ 𝗠𝗬 𝗕𝗢𝗦𝗦 𝗨𝗜𝗗 ✪    ║\n" +
                "╚════════════════════╝",
          attachment: videoStream
        });
      } catch (error) {
        console.error("Error in eyes command:", error);
        message.reply("⚠️ | ভাই, কিছু একটা সমস্যা হয়েছে! পরে আবার চেষ্টা করো।");
      }
    }
  }
};
