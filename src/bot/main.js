const { message } = require("telegraf/filters");
const bot = require("./start");
const { Login } = require("./User");
const { azmon } = require("./User");

bot.start((usr) => {
  usr.reply(`سلام به ربات خوش امدید
  برای نحوه کار ربات از
  /help استفاده کنید`);
});

bot.help((ctx) => {
  ctx.reply(`برای دادن ازمون ابتدا باید با 
  /login
  وارد سایت شوید و سپس ازمون بدید`);
});

bot.command("Login", Login);
bot.command("azmon", azmon);
bot.launch();

console.log("Bot is Run");
