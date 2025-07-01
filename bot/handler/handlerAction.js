const createFuncMessage = global.utils.message;
const handlerCheckDB = require("./handlerCheckData.js");
const request = require("request");
const axios = require("axios");
const fs = require("fs-extra");

module.exports = (
  api,
  threadModel,
  userModel,
  dashBoardModel,
  globalModel,
  usersData,
  threadsData,
  dashBoardData,
  globalData
) => {
  const handlerEvents = require(
    process.env.NODE_ENV == "development"
      ? "./handlerEvents.dev.js"
      : "./handlerEvents.js"
  )(
    api,
    threadModel,
    userModel,
    dashBoardModel,
    globalModel,
    usersData,
    threadsData,
    dashBoardData,
    globalData
  );

  return async function (event) {
    const message = createFuncMessage(api, event);

    await handlerCheckDB(usersData, threadsData, event);

    const handlerChat = await handlerEvents(event, message);
    if (!handlerChat) return;

    const {
      onStart,
      onChat,
      onReply,
      onEvent,
      handlerEvent,
      onReaction,
      typ,
      presence,
      read_receipt,
    } = handlerChat;

    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        onChat();
        onStart();
        onReply();

        if (event.type === "message_unsend") {
          let resend = await threadsData.get(event.threadID, "settings.reSend") ?? false;

          if (resend === true && event.senderID !== api.getCurrentUserID()) {
            if (!global.reSend?.[event.threadID]) return;

            let umid = global.reSend[event.threadID].findIndex(
              (e) => e.messageID === event.messageID
            );

            if (umid > -1) {
              let nname = await usersData.getName(event.senderID);
              let attch = [];
              const unsentData = global.reSend[event.threadID][umid];

              if (unsentData.attachments.length > 0) {
                let cn = 0;
                for (const abc of unsentData.attachments) {
                  if (abc.type === "audio") {
                    cn += 1;
                    let pts = `scripts/cmds/tmp/${cn}.mp3`;
                    let res2 = (
                      await axios.get(abc.url, {
                        responseType: "arraybuffer",
                      })
                    ).data;
                    fs.writeFileSync(pts, Buffer.from(res2, "utf-8"));
                    attch.push(fs.createReadStream(pts));

                    // Clean up after sending (optional: async cleanup after message sent)
                    setTimeout(() => {
                      if (fs.existsSync(pts)) fs.unlinkSync(pts);
                    }, 10 * 1000);
                  } else {
                    attch.push(await global.utils.getStreamFromURL(abc.url));
                  }
                }
              }

              api.sendMessage(
                {
                  body: `${nname} removed:\n\n${unsentData.body}`,
                  mentions: [{ id: event.senderID, tag: nname }],
                  attachment: attch,
                },
                event.threadID
              );
            }
          }
        }
        break;

      case "event":
        handlerEvent();
        onEvent();
        break;

      case "message_reaction":
        onReaction();

        if (event.reaction === "🔪") {
          if (event.userID === "61577232734216") {
            api.removeUserFromGroup(event.senderID, event.threadID, (err) => {
              if (err) return console.log(err);
            });
          }
        }

        if (event.reaction === "😠") {
          if (
            event.senderID === api.getCurrentUserID() &&
            event.userID === "61577232734216"
          ) {
            message.unsend(event.messageID);
          }
        }
        break;

      case "typ":
        typ();
        break;

      case "presence":
        presence();
        break;

      case "read_receipt":
        read_receipt();
        break;

      default:
        break;
    }
  };
};
