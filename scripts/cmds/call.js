module.exports.config = {
 name: "call",
 version: "1.0.0",
 role: 0,
 author: "Yeasin", //don't change my credit 
 description: "কল বোম্বার, শুধুমাত্র বাংলাদেশি নাম্বারের জন্য",
 category: "Tool",
 usages: "/call 01xxxxxxxxx",
 cooldowns: 15,
 guide: { "axios": "" }
};
 
module.exports.onStart = async ({ api, event, args }) => {
 const axios = require('axios');
 const number = args[0];
 
 if (!number || !/^01[0-9]{9}$/.test(number)) {
 return api.sendMessage("🚫 𝙴𝙽𝚃𝙴𝚁 𝙱𝙰𝙽𝙶𝙻𝙰𝙳𝙴𝚂𝙷𝙸 𝙽𝚄𝙼𝙱𝙴𝚁🎀 (𝙴𝚇𝙰𝙼𝙿𝙻𝙴: /𝙲𝙰𝙻𝙻 𝟬𝟭𝚇𝚇𝚇𝚇𝚇𝚇𝚇𝚇𝚇🎀✨),\n", event.threadID, event.messageID);
 }
 
 api.sendMessage(`🕛 𝚆𝙰𝙸𝚃, 𝙸'𝙼 𝙲𝙰𝙻𝙻𝙸𝙽𝙶...🎀✨\n`, event.threadID, async (err, info) => {
 try {
 const response = await axios.get(`https://tbblab.shop/callbomber.php?mobile=${number}`);
 setTimeout(() => {
 api.unsendMessage(info.messageID);
 }, 90000);
 
 return api.sendMessage(`✅ 𝙱𝙾𝚃 𝙲𝙰𝙻𝙻𝙴𝙳...𝚃𝙷𝙸𝚂 𝙽𝚄𝙼𝙱𝙴𝚁🎀✨`, event.threadID, event.messageID);
 } catch (error) {
 return api.sendMessage(`❌ ত্রুটি: ${error.message}`, event.threadID, event.messageID);
 }
 });
};