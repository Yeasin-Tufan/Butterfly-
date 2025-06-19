const axios = require("axios");

module.exports.config = {
 name: "nagadf",
 version: "1.0",
 role: 2,
 author: "Gok",
 description: "Create a fake Nagad screenshot",
 usePrefix: true,
 prefix: true,
 category: "Fun",
 guide: "<number> - <transaction ID> - <amount> - <charge>",
 cooldowns: 5,
};

module.exports.onStart = async function ({ api, event, args }) {
 const input = args.join(" ");
 if (!input.includes("-")) {
 return api.sendMessage(
 `❌| Wrong format!\nUse: ${global.config.PREFIX}nagadf 019xxxxxxxx - TXN12345 - 5000 - 10`,
 event.threadID,
 event.messageID
 );
 }

 const [numberRaw, transactionRaw, amountRaw, chargeRaw] = input.split("-");
 const number = numberRaw.trim();
 const transaction = transactionRaw.trim();
 const amount = chargeRaw ? amountRaw.trim() : "0";
 const charge = chargeRaw ? chargeRaw.trim() : "0";
 const total = (parseFloat(amount) + parseFloat(charge)).toFixed(2);

 const url = `https://masterapi.site/api/nagadf.php?number=${encodeURIComponent(number)}&transaction=${encodeURIComponent(transaction)}&amount=${encodeURIComponent(amount)}&charge=${encodeURIComponent(charge)}&total=${encodeURIComponent(total)}`;

 api.sendMessage(
 `📤 𝐆𝐄𝐍𝐄𝐑𝐀𝐓𝐈𝐍𝐆..... 𝐏𝐋𝐙 𝐖8_🕐`,
 event.threadID,
 (err, info) =>
 setTimeout(() => {
 api.unsendMessage(info.messageID);
 }, 4000)
 );

 try {
 const response = await axios.get(url, { responseType: "stream" });
 const attachment = response.data;

 api.sendMessage(
 {
 body: `━━━━━━━━━━━━━━━━━━━━━━━
______𝐉𝐔𝐒𝐓 𝐖8 𝐀𝐍𝐃 𝐒𝐄𝐄______
━━━━━━━━━━━━━━━━━━━━━━━

📱 𝐏𝐡𝐧 𝐍𝐮𝐦𝐛𝐞𝐫 : ${number}
🧾 𝐓𝐫𝐚𝐬𝐚𝐜𝐭𝐢𝐨𝐧 𝐈𝐃 : ${transaction}
💵 𝐀𝐦𝐨𝐮𝐧𝐭 : ৳${amount}
💸 𝐂𝐡𝐚𝐫𝐠𝐞 : ৳${charge}
💰 𝐓𝐨𝐭𝐚𝐥 : ৳${total}

📤  𝐑𝐄𝐀𝐃𝐘 𝐅𝐎𝐑 𝐍𝐀𝐆𝐀𝐃 𝐒𝐒

━━━━━━━━━━━━━━━━━━━━━━━
💥𝐏𝐎𝐖𝐄𝐑𝐄𝐃 𝐁𝐘:- 𝐆𝐎𝐊-𝐆𝐎𝐊-𝐁𝐎𝐓
━━━━━━━━━━━━━━━━━━━━━━━`,
 attachment,
 },
 event.threadID,
 event.messageID
 );
 } catch (err) {
 console.error(err);
 api.sendMessage(
 "❌ An error occurred while generating the screenshot.",
 event.threadID,
 event.messageID
 );
 }
};
