const { message } = require("telegraf/filters");
const bot = require("./start");
const User = require("../FallahAcountSource/User");
// const { Login } = require("./User");
// const { azmon } = require("./User");

let isLogin = false;
const courses = {
  1: "تجارت الکترونیک امنیت شبکه",
  2: "تجهیزات شبکه",
  3: "وب",
  4: "پیاده سازی و برنامه سازی",
};
const pdmns = [1, 2, 3, 4, 5];

const usr = new User();

let GoOnLoginAction = false;

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

bot.command("Login", (ctx) => {
  let email = null;
  let Password = null;
  const emailRegex = /(\w.+)@(\w+).(\w+)/g;
  ctx.reply("Please Enter Your FallahWebSite Email: ");
  GoOnLoginAction = true;
  while (GoOnLoginAction) {
    bot.use(async (usrReply) => {
      if (usrReply.message.text.match(emailRegex)) {
        email = usrReply.message.text;
        usrReply.reply("Thanks!!Please Enter Password: ");
      } else if (email) {
        Password = usrReply.message.text;
        console.log(email, Password);
        usrReply.reply("Please Wait...");
        const Name = await usr.Login(email, Password);
        if (Name[0]) {
          isLogin = true;
          usrReply.reply(`Succsesfully Login on ${Name[0]} account!!!`);
          GoOnLoginAction = false;
        } else {
          usrReply.reply("faild to Login!! Email Or Password are Incorrect");
          GoOnLoginAction = false;
        }
      }
    });
  }
});

bot.command("azmon", (ctx) => {
  GoOnLoginAction = false;
  let isCourseEmpty = true;
  if (!isLogin) {
    return ctx.reply("Please First login with /Login");
  }
  ctx.reply(`لطفان کد درس مورد نظر خود را وارد کنید:
  1)تجارت الکترونیک امنیت شبکه
  2)تجهیزات شبکه
  3)وب
  4)پیاده سازی و برنامه سازی`);

  bot.on(message("text"), async (usrInput) => {
    bot.remove;
    let course;
    let pdmn;
    const { text } = usrInput.message;
    if ((!+text) in courses) {
      return usrInput.reply(`Please Eneter Valid Coded\n ${courses}`);
    } else {
      course = text;
      isCourseEmpty = false;
      usrInput.reply("Please Enter Podman: ");
      bot.removeListener("message");
    }
    if (!isCourseEmpty) {
      if (!pdmns.includes(+text)) {
        return usrInput.reply("Please Enter Valid Pdmn!! 1,2,3,4,5");
      }
      pdmn = text;
      try {
        const result = await usr.Azmon(course, pdmn);
        return usrInput.reply(result);
      } catch (err) {
        return usrInput.reply(err);
      }
    }
  });
});
bot.launch();

console.log("Bot is Run");
