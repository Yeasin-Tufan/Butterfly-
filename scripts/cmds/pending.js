module.exports = {
  config: {
    name: "pending",
    version: "1.0",
    author: "MIKI",
    countDown: 5,
    role: 2,
    shortDescription: {
      vi: "",
      en: ""
    },
    longDescription: {
      vi: "",
      en: ""
    },
    category: "Goat-alAuthor"
  },
 
langs: {
    en: {
        invaildNumber: "%1 is not an invalid number",
        cancelSuccess: "Refused %1 thread!",
        approveSuccess: "-𝙰𝚙𝚙𝚛𝚘𝚟𝚎𝚍 𝚜𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 %1 𝚝𝚑𝚛𝚎𝚊𝚍𝚜!🎀",
 
        cantGetPendingList: "Can't get the pending list!",
        returnListPending: "»「PENDING」«❮ 𝚃𝚑𝚎 𝚠𝚑𝚘𝚕𝚎 𝚗𝚞𝚖𝚋𝚎𝚛 𝚘𝚏 𝚝𝚑𝚛𝚎𝚊𝚍𝚜 𝚝𝚘 𝚊𝚙𝚙𝚛𝚘𝚟𝚎 is: %1 𝚝𝚑𝚛𝚎𝚊𝚍 ❯\n\n%2",
        returnListClean: "「𝙿𝙴𝙽𝙳𝙸𝙽𝙶」𝚃𝚑𝚎𝚛𝚎 𝚒𝚜 𝚗𝚘 𝚝𝚑𝚛𝚎𝚊𝚍 𝚒𝚗 𝚝𝚑𝚎 𝚙𝚎𝚗𝚍𝚒𝚗𝚐 𝚕𝚒𝚜𝚝"
    }
  },
 
onReply: async function({ api, event, Reply, getLang, commandName, prefix }) {
    if (String(event.senderID) !== String(Reply.author)) return;
    const { body, threadID, messageID } = event;
    var count = 0;
 
    if (isNaN(body) && body.indexOf("c") == 0 || body.indexOf("cancel") == 0) {
        const index = (body.slice(1, body.length)).split(/\s+/);
        for (const singleIndex of index) {
            console.log(singleIndex);
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > Reply.pending.length) return api.sendMessage(getLang("invaildNumber", singleIndex), threadID, messageID);
            api.removeUserFromGroup(api.getCurrentUserID(), Reply.pending[singleIndex - 1].threadID);
            count+=1;
        }
        return api.sendMessage(getLang("cancelSuccess", count), threadID, messageID);
    }
    else {
        const index = body.split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > Reply.pending.length) return api.sendMessage(getLang("invaildNumber", singleIndex), threadID, messageID);
            api.sendMessage(`𝐀𝐒𝐒𝐀𝐋𝐀𝐌𝐔𝐀𝐋𝐀𝐈𝐊𝐔𝐌 ☔︎ \n𝚃𝙷𝙸𝚂 𝙸𝚂 𝙔𝙚𝙖𝙨𝙞𝙣 𝗯𝗼𝘁 ❤︎ 𝙼𝚈 𝙾𝚆𝙽𝙴𝚁 𝙸𝙳:- https://www.facebook.com/61552257412748\n\n 𝗧𝗵𝗶𝘀 𝗯𝗼𝘅 𝗽𝗿𝗲𝗺𝗶𝘀𝘀𝗶𝗼𝗻 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹 💋\n\n•𝗕𝗼𝘁 ${prefix}𝗵𝗲𝗹𝗽 𝘀𝗲𝗲 𝘆𝗼𝘂 𝗮𝗹𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀\n\n•𝗛𝗮𝘃𝗲 𝗮 𝗻𝗶𝗰𝗲 𝐘𝐎𝐔𝐑 𝐆𝐑𝐎𝐔𝐏`, Reply.pending[singleIndex - 1].threadID);
            count+=1;
        }
        return api.sendMessage(getLang("approveSuccess", count), threadID, messageID);
    }
},
 
onStart: async function({ api, event, getLang, commandName }) {
  const { threadID, messageID } = event;
 
    var msg = "", index = 1;
 
    try {
    var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
    var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
  } catch (e) { return api.sendMessage(getLang("cantGetPendingList"), threadID, messageID) }
 
  const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);
 
    for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;
 
    if (list.length != 0) return api.sendMessage(getLang("returnListPending", list.length, msg), threadID, (err, info) => {
    global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            pending: list
        })
  }, messageID);
    else return api.sendMessage(getLang("returnListClean"), threadID, messageID);
}
};
