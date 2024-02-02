const bot = require("./start");
const functions = require("./Action/functions");

bot.onText(/\/[Hh][Ee][Ll][Pp]/, (msg, chat) => {
  bot.sendMessage(msg.chat.id, `برای شروع ربات ایتدا لاگین کنید با درستور 
  /login
  بد از لاگین با دستور
  /azmon
  میتونید ازمون بدید`);
});

bot.onText(/\/[Ll][Oo][Gg][Ii][Nn]/, functions.Login);
bot.onText(/\/[Ll][Oo][Gg][Oo][Uu][Tt]/, functions.Logout);

bot.onText(/[Cc][Oo][Uu][Rr][Ss][Ee]/, functions.azmon);