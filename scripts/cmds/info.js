module.exports = {
  config: {
    name: "info",
    author: "Tokodori",
    role: 0,
    shortDescription: "Displays admin info",
    longDescription: "Shows info about the bot owner/admin",
    category: "admin",
    guide: "{pn}"
  },

  onStart: async function ({ api, event }) {
    try {
      const message = `
╭─━━━❖🫧❖━━━─╮
    👑  OWNER INFO  👑
╰─━━━❖🫧❖━━━─╯

🧑‍💼 Name         : Yeasin  
🚹 Gender       : Male  
💘 Relationship : Single 😞  
🎂 Age          : 19  
🕌 Religion     : Islam  
🏡 Address      : Comilla/Dhaka, Bangladesh  

📱 Tiktok       : its_me_tufan01  
📵 Whatsapp     : What's the point of giving number? 😒  
🌐 Facebook     : facebook.com/profile.php?id=61577232734216
───────────────────────────`;

      await api.sendMessage({
        body: message
      }, event.threadID, event.messageID);

      if (event.body.toLowerCase().includes('ownerinfo')) {
        api.setMessageReaction('🖤', event.messageID, (err) => {}, true);
      }

    } catch (error) {
      console.error('Error in ownerinfo command:', error);
      return api.sendMessage('Something went wrong while processing the command.', event.threadID);
    }
  },
};
