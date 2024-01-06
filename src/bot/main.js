const Admin = require("./Admin");
const User = require("./User");
const { message } = require("telegraf/filters");
const bot = require("./start");

const emailRegex = /(\w.+)@(\w+).(\w+)/g;

let email = null;
let password = null;
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

bot.hears("/login", (ctx) => {
  ctx.reply(" :لطفا ایمیل خود برای ورود به سایت را وارد کنید ");
  bot.hears(emailRegex, (usrEmail) => {
    email = usrEmail.message.text;
    usrEmail.reply("لطفا پسورد برای ورود به سایت را وارد کنید");
    bot.on(message("text"), (usrPass) => {
      password = usrPass.message.text;
      console.log(email, password);
      usrPass.reply("ایمیل و پسورد شما با موفقیت ثبت شده");
    });
  });
});

bot.launch();

console.log("Bot is Run");
