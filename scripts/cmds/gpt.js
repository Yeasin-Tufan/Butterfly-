const axios = require("axios");

// ❗ OpenAI API key rakhar jayga, secure vabe handle korbe
const OPENAI_API_KEY = "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";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

module.exports.config = {
  name: "gpt",
  version: "1.0.0",
  usePrefix: true,
  role: 0,
  author: "Ew'r Saim",
  description: "GPT-4o-mini AI with OpenAI API integration and conversation support",
  category: "ai",
  coolDowns: 5,
};

const conversationHistory = new Map();

function getConversationHistory(senderID) {
  if (!conversationHistory.has(senderID)) {
    conversationHistory.set(senderID, []);
  }
  return conversationHistory.get(senderID);
}

function updateConversationHistory(senderID, role, text) {
  const history = getConversationHistory(senderID);
  history.push({ role, content: text });
  if (history.length > 20) history.shift();
}

module.exports.onReply = async function ({ api, event, Reply }) {
  if (Reply.author !== event.senderID) return;

  const uid = event.senderID;
  const userMessage = event.body;

  try {
    const history = getConversationHistory(uid);
    updateConversationHistory(uid, "user", userMessage);

    const requestBody = {
      model: "gpt-4o-mini",
      messages: history,
    };

    const response = await axios.post(OPENAI_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const aiResponse = response.data.choices[0].message.content;
    updateConversationHistory(uid, "assistant", aiResponse);

    const styledMessage =
      `💬 𝙶𝙿𝚃 𝚁𝙴𝚂𝙿𝙾𝙽𝙳𝚂:\n` +
      `──────────────────────────────\n` +
      `${aiResponse}\n` +
      `──────────────────────────────\n` +
      `𝗢𝘄𝗻𝗲𝗿 𝗬𝗲𝗮𝘀𝗶𝗻 🎀 • 𝐍𝐨𝐛𝐢𝐭𝐚 𝐁𝐨𝐭 • 🎀✨`;

    await api.sendMessage(
      styledMessage,
      event.threadID,
      (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      },
      event.messageID
    );
  } catch (error) {
    console.error("GPT onReply error:", error.message);
    const errMsg = error.response?.data?.error?.message || error.message;
    api.sendMessage(`❌ GPT Error: ${errMsg}`, event.threadID, event.messageID);
  }
};

module.exports.onStart = async function ({ api, args, event }) {
  const uid = event.senderID;
  const userMessage = args.join(" ");
  if (!userMessage) {
    return api.sendMessage(
      "❗ Please ask something for GPT to respond.\n\nExample:\n`gpt What is AI?`",
      event.threadID,
      event.messageID
    );
  }

  try {
    conversationHistory.set(uid, []);
    updateConversationHistory(uid, "user", userMessage);

    const requestBody = {
      model: "gpt-4o-mini",
      messages: getConversationHistory(uid),
    };

    const response = await axios.post(OPENAI_API_URL, requestBody, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    });

    const aiResponse = response.data.choices[0].message.content;
    updateConversationHistory(uid, "assistant", aiResponse);

    const styledMessage =
      `💬 𝙶𝙿𝚃 𝚁𝙴𝚂𝙿𝙾𝙽𝙳𝚂:\n` +
      `──────────────────────────────\n` +
      `${aiResponse}\n` +
      `──────────────────────────────\n` +
      `𝗢𝘄𝗻𝗲𝗿 𝗬𝗲𝗮𝘀𝗶𝗻 🎀 • 𝐍𝐨𝐛𝐢𝐭𝐚 𝐁𝐨𝐭 • 🎀✨`;

    await api.sendMessage(
      { body: styledMessage },
      event.threadID,
      (error, info) => {
        if (!error) {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: "reply",
            messageID: info.messageID,
            author: event.senderID,
          });
        }
      },
      event.messageID
    );
  } catch (error) {
    console.error("GPT onStart error:", error.message);
    const errMsg = error.response?.data?.error?.message || error.message;
    api.sendMessage(`❌ GPT Error: ${errMsg}`, event.threadID, event.messageID);
  }
};