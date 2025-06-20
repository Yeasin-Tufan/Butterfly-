const axios = require('axios');
const ok = 'xyz';

module.exports = {
  config: {
    name: "prompt2",
    aliases: ["p2"],
    version: "1.0",
    author: "Modified by ChatGPT",
    countDown: 5,
    role: 0,
    longDescription: {
      vi: "",
      en: "Get Gemini prompts (optimized version)."
    },
    category: "ai"
  },

  onStart: async function ({ message, event, args }) {
    try {
      const promptText = args.join(" ").trim();
      let imageUrl = null;
      let response;

      // Handle image from message reply
      if (event.type === "message_reply") {
        const attachment = event.messageReply.attachments[0];
        if (attachment && ["photo", "sticker"].includes(attachment.type)) {
          imageUrl = attachment.url;
        } else {
          return message.reply("❌ | Please reply to a valid image.");
        }
      }

      // Handle direct image URL
      else if (args[0]?.match(/(https?:\/\/.*\.(?:png|jpg|jpeg))/i)) {
        imageUrl = args[0];
      }

      // If no image and no prompt, show error
      if (!imageUrl && !promptText) {
        return message.reply("❌ | Provide a prompt or reply to an image.");
      }

      // Handle flags
      const lowerPrompt = promptText.toLowerCase();

      if (["-r", "-random"].includes(lowerPrompt)) {
        response = await axios.get(`https://smfahim.${ok}/prompt-random`);
        return message.reply(response.data.data.prompt);
      }

      if (["-anime", "-a"].some(flag => lowerPrompt.includes(flag))) {
        response = await axios.get(`https://smfahim.${ok}/prompt2?url=${encodeURIComponent(imageUrl || promptText)}`);
        return message.reply(response.data.code === 200 ? response.data.data : "❌ | Couldn't fetch anime prompt.");
      }

      // Default image prompt
      if (imageUrl) {
        response = await axios.get(`https://smfahim.${ok}/prompt?url=${encodeURIComponent(imageUrl)}`);
        return message.reply(response.data.result || "❌ | No result found.");
      }

      // Default text prompt
      response = await axios.get(`https://smfahim.${ok}/prompt?text=${encodeURIComponent(promptText)}`);
      return message.reply(response.data.prompt || response.data.result || "❌ | No result from prompt.");

    } catch (error) {
      return message.reply(`❌ | Error: ${error.message}`);
    }
  }
};