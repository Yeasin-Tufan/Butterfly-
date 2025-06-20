const axios = require("axios");
const fs = require("fs");

module.exports = {
  config: {
    name: "emojimix",
    aliases: ["mix"],
    version: "1.3",
    author: "Nyx",
    description: "Mix two emojis into one image",
    category: "fun",
    usages: "[emoji1] - [emoji2]",
    cooldowns: 5
  },

  onStart: async function ({ message, args }) {
    try {
      if (!args) return message.reply("Example: 💔 - 🐢");
      const [emoji1, emoji2] = args.join(" ").split("-").map(e => e.trim());

      if (!emoji1 || !emoji2)
        return message.reply("Invalid format! Use: [emoji1] - [emoji2]");
      const { data: base } = await axios.get("https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json");
      const response = await axios.get(`${base.api}/emojimix`, {
        params: { emoji1, emoji2 },
        responseType: "arraybuffer"
      });
      const path = __dirname + "/cache/mixnx_" + Date.now() + ".png";
      fs.writeFileSync(path, response.data);
      message.reply({
        body: `Here’s your mix of ${emoji1} and ${emoji2}!`,
        attachment: fs.createReadStream(path)
      }, () => fs.unlinkSync(path));
    } catch (err) {
      message.reply("error");
    }
  }
};