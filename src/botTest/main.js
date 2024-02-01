const bot = require("./start");
const functions = require("./Action/functions");

bot.onText(/\/[Hh][Ee][Ll][Pp]/, (msg, chat) => {
  bot.sendMessage(msg.chat.id, "help");
});

bot.onText(/\/[Ll][Oo][Gg][Ii][Nn]/, functions.Login);

bot.onText(/[Cc][Oo][Uu][Rr][Ss][Ee]/, functions.azmon);
