const { message } = require("telegraf/filters");
const bot = require("./start");
const User = require("../FallahAcountSource/User");
const { Login } = require("./User");

//Global Variable
let isLogin = false;
const emailRegex = /(\w.+)@(\w+).(\w+)/g;
const courses = {
  1: "تجارت الکترونیک امنیت شبکه",
  2: "تجهیزات شبکه",
  3: "وب",
  4: "پیاده سازی و برنامه سازی",
};
const pdmns = [1, 2, 3, 4, 5];
const usr = new User();
let email;
let password;

bot.start((usr) => {
  usr.reply("use /help for Help");
});

bot.help((ctx) => {
  ctx.reply(`
  /email {fallah WebSiteEmail}
  /password {fallah WebSite Password}
  after That Use
  /course {CourseCode} {Course Pdmn}`);
});

bot.on(message("text"), async (ctx) => {
  const { text } = ctx.message;
  if (text.startsWith("/email")) {
    const Clean = text.replace("/email", "").trim();
    if (!Clean.match(emailRegex)) {
      return ctx.reply("please Enter Valid Email");
    }
    email = Clean;
    return ctx.reply(
      "email Sucsesfully Saved Now Write your password with /password *Your password*"
    );
  }
  if (text.startsWith("/password")) {
    if (!email) {
      return ctx.reply("Please Enter First Email with /email *Your email*");
    }
    password = text.replace("/password", "").trim();
    ctx.reply("Please Wait!!");
    const Result = await usr.Login(email, password);
    if (Result[0]) {
      ctx.reply(`Sucsesfully Login on ${Result[0]} account`);
      isLogin = true;
      ctx.reply(`Course List: 
      1)تجارت الکترونیک امنیت شبکه
      2)تجهیزات شبکه
      3)وب
      4)پیاده سازی و برنامه ساز
      `);
      ctx.reply(`(1): "تجارت الکترونیک امنیت شبکه",
  (2): "تجهیزات شبکه",
  (3): "وب",
  (4): "پیاده سازی و برنامه سازی",`);
      ctx.reply(`For azmon Press /course *Course Code [1,2,3,4,5]* *Podeman*`);
    }
  }
  if (text.startsWith("/course") && isLogin) {
    ctx.reply("Please Wait!!");
    const [course, Pdmn] = text.replace("/course", "").trim().split(" ");
    console.log(course, Pdmn);
    if ((+course) in courses && pdmns.indexOf(+Pdmn) !== -1) {
      console.log("injam");
      const { QuizCount, Currect_Answer, Result } = await usr.Azmon(
        course,
        Pdmn
      );
      console.log(QuizCount, Currect_Answer, Result);
      return ctx.reply(
        `Result :${Result}\n QuizCount:${QuizCount}\n CurentAnswer:${Currect_Answer}`
      );
    }
    ctx.reply("Please Enter Valid Course Name Or Podman");
    return ctx.reply(`Course List: 
      1)تجارت الکترونیک امنیت شبکه
      2)تجهیزات شبکه۲
      3)وب
      4)پیاده سازی و برنامه ساز
      `);
  } else if (!isLogin) {
    return ctx.reply("Please First Login!! ");
  }
});

bot.launch();

console.log("Bot is Run");
