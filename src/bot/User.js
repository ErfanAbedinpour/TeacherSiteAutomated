//Mpdules
const { message } = require("telegraf/filters");
const User = require("../FallahAcountSource/User");
const bot = require("./start");

//Global Variables
const emailRegex = /(\w.+)@(\w+).(\w+)/g; // Fallah Site email Regex Pattern
const user = new User();
let isLogin = false;
let isGetCourse = false;

const Login = async (ctx) => {
  //Local Variable
  let isEmailEmpty = true;
  let email = null; // UserEmail
  let password = null; // User Password

  ctx.reply(" :لطفا ایمیل خود برای ورود به سایت را وارد کنید ");
  bot.hears(emailRegex, async (usrEmail) => {
    email = usrEmail.message.text;
    isEmailEmpty = false;
    return usrEmail.reply("لطفا پسورد برای ورود به سایت را وارد کنید");
  });

  bot.on(message("text"), async (u) => {
    if (isEmailEmpty) {
      return u.reply("ابتدا ایمیل را وارد کنید");
    }
    if (!isLogin) {
      password = u.message.text;
      console.log(email, password);
      // const Name = await user.Login(email, password);
      // if (Name) {
      //   isLogin = true;
      //   await u.reply(`با موفقیت به اکانت ${Name[0]}وارد شدید
      //       برای خروج از اکانت از /logout استفاده کنید`);
      //   bot.on(message("text"), azmon);
      // } else {
      //   return u.reply("ایمیل یا رمز ورود اشتباه است");
      // }
    }
  });
};

const azmon = (ctx) => {
  let CoursChoise;
  let PdmnChoise;
  const course = {
    1: "تجارت الکترونیک امنیت شبکه",
    2: "تجهیزات شبکه",
    3: "وب",
    4: "پیاده سازی و برنامه سازی",
  };

  if (!isLogin) {
    return ctx.reply("/login \n لطفان ابتدا لاگین کنید");
  } else {
    ctx.reply(`لطفان کد درس مورد نظر خود را وارد کنید:
  1)تجارت الکترونیک امنیت شبکه
  2)تجهیزات شبکه
  3)وب
  4)پیاده سازی و برنامه سازی`);
    console.log("Azmon Injam");
    bot.on("text", async (c) => {
      console.log("raftam Here Azmon");
      if ((+c.message.text) in course) {
        if (!isGetCourse) {
          ChoicesCourse = c.message.text;
          isGetCourse = true;
          c.reply("لطفان پودمان مورد نظر خود را وارد کنید");
        } else {
          PdmnChoise = c.message.text;
          try {
            const result = await user.Azmon(CoursChoise, PdmnChoise);
            c.reply(result);
          } catch (err) {
            c.reply(err);
          }
        }
      } else {
        return c.reply(`لطفان کد معتبر وارد کنید
      1)تجارت الکترونیک امنیت شبکه
      2)تجهیزات شبکه
      3)وب
      4)پیاده سازی و برنامه سازی`);
      }
    });
  }
};

module.exports = {
  Login,
  azmon,
};
