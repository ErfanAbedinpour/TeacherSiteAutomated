const bot = require("./start");
const functions = require("./Action/functions");

bot.onText(/[Ss][Tt][Aa][Rr][tT]/,functions.start)
bot.onText(/\/[Hh][Ee][Ll][Pp]/, functions.help);

bot.onText(/\/[Ll][Oo][Gg][Ii][Nn]/, functions.Login);
bot.onText(/\/[Ll][Oo][Gg][Oo][Uu][Tt]/, functions.Logout);

bot.onText(/[Aa][Zz][Mm][Oo][Nn]/, functions.azmon);
